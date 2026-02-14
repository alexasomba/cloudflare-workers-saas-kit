import { generateImage } from '@tanstack/ai';
import { openaiImage } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/api/ai/image')({
  server: {
    handlers: {
      POST: async ({ request }) => {
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
          return new Response(
            JSON.stringify({
              error: 'Prompt is required',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }

        if (!process.env.OPENAI_API_KEY) {
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
          const result = await generateImage({
            adapter: openaiImage('gpt-image-1'),
            prompt,
            numberOfImages,
            size,
          });

          return new Response(
            JSON.stringify({
              images: result.images,
              model: 'gpt-image-1',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        } catch (error) {
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
