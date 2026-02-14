import { createWorkersAiChat } from '@cloudflare/tanstack-ai';
import { chat } from '@tanstack/ai';
import { openaiText } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const RecipeSchema = z.object({
  name: z.string().describe('The name of the recipe'),
  description: z.string().describe('A brief, appetizing description of the dish'),
  prepTime: z.string().describe('Preparation time (e.g., "15 mins")'),
  cookTime: z.string().describe('Cooking time (e.g., "45 mins")'),
  servings: z.number().describe('Number of servings'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('Difficulty level'),
  ingredients: z
    .array(
      z.object({
        item: z.string(),
        amount: z.string(),
        notes: z.string().optional(),
      })
    )
    .describe('List of ingredients'),
  instructions: z.array(z.string()).describe('Step-by-step cooking instructions'),
  tips: z.array(z.string()).optional().describe('Optional cooking tips and tricks'),
  nutritionPerServing: z
    .object({
      calories: z.number().optional(),
      protein: z.string().optional(),
      carbs: z.string().optional(),
      fat: z.string().optional(),
    })
    .optional()
    .describe('Estimated nutritional information per serving'),
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
          return new Response(JSON.stringify({ error: 'Recipe name is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ai = (context as { cloudflare?: { env?: { AI: any } } }).cloudflare?.env?.AI;
        const apiKey = (context as { cloudflare?: { env?: Record<string, string> } }).cloudflare
          ?.env?.OPENAI_API_KEY;

        // 1. Try Cloudflare Workers AI (GLM-4 for structured/tool calling)
        if (ai) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const adapter = createWorkersAiChat('@cf/meta/llama-3.2-1b-instruct' as any, {
              binding: ai,
            });

            if (mode === 'structured') {
              const resultValue = await chat({
                adapter,
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
                  provider: 'workers-ai',
                  model: '@cf/meta/llama-3.2-1b-instruct',
                }),
                {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
                }
              );
            } else {
              const markdownResult = await chat({
                adapter,
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
                  provider: 'workers-ai',
                  model: '@cf/meta/llama-3.2-1b-instruct',
                }),
                {
                  status: 200,
                  headers: { 'Content-Type': 'application/json' },
                }
              );
            }
          } catch (workersAiError) {
            console.warn('Workers AI failed, trying OpenAI fallback:', workersAiError);
          }
        }

        // 2. Fallback to OpenAI (GPT-4o)
        if (apiKey) {
          try {
            const openAiAdapter = openaiText({
              model: 'gpt-4o',
              apiKey,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);

            if (mode === 'structured') {
              // Structured output mode - returns validated object
              const resultValue = await chat({
                adapter: openAiAdapter,
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
                adapter: openAiAdapter,
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
          } catch (openAiError) {
            console.error('OpenAI fallback failed:', openAiError);
          }
        }

        return new Response(
          JSON.stringify({
            error: 'Failed to generate recipe. Providers exhausted or not configured.',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      },
    },
  },
});
