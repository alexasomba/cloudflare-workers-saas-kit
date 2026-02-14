import { chat } from '@tanstack/ai';
import { openaiText } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

// Schema for structured recipe output
const RecipeSchema = z.object({
  name: z.string().describe('The name of the recipe'),
  description: z.string().describe('A brief description of the dish'),
  prepTime: z.string().describe('Preparation time (e.g., "15 minutes")'),
  cookTime: z.string().describe('Cooking time (e.g., "30 minutes")'),
  servings: z.number().describe('Number of servings'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('Difficulty level'),
  ingredients: z
    .array(
      z.object({
        item: z.string().describe('Ingredient name'),
        amount: z.string().describe('Amount needed (e.g., "2 cups")'),
        notes: z.string().optional().describe('Optional preparation notes'),
      })
    )
    .describe('List of ingredients'),
  instructions: z.array(z.string()).describe('Step-by-step cooking instructions'),
  tips: z.array(z.string()).optional().describe('Optional cooking tips'),
  nutritionPerServing: z
    .object({
      calories: z.number().optional(),
      protein: z.string().optional(),
      carbs: z.string().optional(),
      fat: z.string().optional(),
    })
    .optional()
    .describe('Nutritional information per serving'),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export const Route = createFileRoute('/api/ai/structured')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const StructuredRequestSchema = z.object({
          recipeName: z.string(),
          mode: z.enum(['structured', 'oneshot']).optional().default('structured'),
        });

        const body = await request.json();
        const { recipeName, mode } = await StructuredRequestSchema.parseAsync(body);

        if (!recipeName || recipeName.trim().length === 0) {
          return new Response(
            JSON.stringify({
              error: 'Recipe name is required',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        // Access API key from context environment
        const apiKey = (context as { cloudflare?: { env?: Record<string, string> } }).cloudflare
          ?.env?.OPENAI_API_KEY;

        if (!apiKey) {
          return new Response(
            JSON.stringify({
              error: 'OPENAI_API_KEY is not configured',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        try {
          if (mode === 'structured') {
            // Structured output mode - returns validated object
            const resultValue = await chat({
              adapter: openaiText({
                model: 'gpt-4o',
                apiKey,
              } as any),
              messages: [
                {
                  role: 'user',
                  content: `Generate a complete recipe for: ${recipeName}. Include all ingredients with amounts, step-by-step instructions, prep/cook times, and difficulty level.`,
                },
              ],
              outputSchema: RecipeSchema,
            });

            return new Response(
              JSON.stringify({
                mode: 'structured',
                recipe: resultValue,
                provider: 'openai',
                model: 'gpt-4o',
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          } else {
            // One-shot markdown mode - returns text
            const markdownResult = await chat({
              adapter: openaiText({
                model: 'gpt-4o',
                apiKey,
              } as any),
              stream: false,
              messages: [
                {
                  role: 'user',
                  content: `Generate a complete recipe for: ${recipeName}.

Format the recipe in beautiful markdown with:
- A title with the recipe name
- A brief description
- Prep time, cook time, and servings
- Ingredients list with amounts
- Numbered step-by-step instructions
- Optional tips section
- Nutritional info if applicable

Make it detailed and easy to follow.`,
                },
              ],
            });

            return new Response(
              JSON.stringify({
                mode: 'oneshot',
                markdown: markdownResult,
                provider: 'openai',
                model: 'gpt-4o',
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          }
        } catch (error: unknown) {
          return new Response(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'An error occurred',
            }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      },
    },
  },
});
