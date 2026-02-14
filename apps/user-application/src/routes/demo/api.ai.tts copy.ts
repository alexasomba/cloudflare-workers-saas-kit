import { generateSpeech } from '@tanstack/ai';
import { openaiSpeech } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/demo/api/ai/tts copy')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json();
        const {
          text,
          voice = 'alloy',
          model = 'tts-1',
          format = 'mp3',
          speed = 1.0,
        } = z
          .object({
            text: z.string(),
            voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).optional(),
            model: z.enum(['tts-1', 'tts-1-hd', 'gpt-4o-audio-preview']).optional(),
            format: z.enum(['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm']).optional(),
            speed: z.number().optional(),
          })
          .parse(body);

        if (!text || text.trim().length === 0) {
          return new Response(
            JSON.stringify({
              error: 'Text is required',
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
          const adapter = openaiSpeech(model);

          const result = await generateSpeech({
            adapter,
            text,
            voice,
            format,
            speed,
          });

          return new Response(
            JSON.stringify({
              id: result.id,
              model: result.model,
              audio: result.audio,
              format: result.format,
              contentType: result.contentType,
              duration: result.duration,
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
