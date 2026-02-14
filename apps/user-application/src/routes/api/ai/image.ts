import { generateImage } from '@tanstack/ai';
import { openaiImage } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/api/ai/image')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const body = await request.json();
        const {
          prompt,
          numberOfImages = 1,
          size = '1024x1024',
        } = z
          .object({
            prompt: z.string(),
            numberOfImages: z.number().optional(),
            size: z.enum(['1024x1024', '1536x1024', '1024x1536', 'auto']).optional(),
          })
          .parse(body);

        if (!prompt || prompt.trim().length === 0) {
          return new Response(JSON.stringify({ error: 'Prompt is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const ai = (context as { cloudflare?: { env?: { AI: any } } }).cloudflare?.env?.AI; // eslint-disable-line @typescript-eslint/no-explicit-any

        // 1. Try Cloudflare Workers AI (Stable Diffusion)
        if (ai) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const inputs: any = { prompt, num_steps: 4 }; // Flux Schnell works well with 4 steps
            if (size !== 'auto') {
              // Flux inputs are usually flexible, but we'll keep simple prompt for now
            }

            const response = await ai.run('@cf/black-forest-labs/flux-1-schnell', inputs);

            return new Response(response, {
              headers: {
                'Content-Type': 'image/png',
              },
            });
          } catch (workersAiError) {
            console.warn('Workers AI failed, trying OpenAI fallback:', workersAiError);
          }
        }

        // 2. Fallback to OpenAI (DALL-E 3)
        if (process.env.OPENAI_API_KEY) {
          try {
            const options = {
              model: 'dall-e-3',
              apiKey: process.env.OPENAI_API_KEY,
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const adapter = openaiImage(options as any);

            const result = await generateImage({
              adapter,
              prompt,
              numberOfImages,
              size: size as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            });

            return new Response(
              JSON.stringify({
                images: result.images,
                model: 'dall-e-3',
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          } catch (openAiError) {
            console.error('OpenAI fallback failed:', openAiError);
          }
        }

        return new Response(
          JSON.stringify({
            error: 'Failed to generate image. Providers exhausted or not configured.',
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
