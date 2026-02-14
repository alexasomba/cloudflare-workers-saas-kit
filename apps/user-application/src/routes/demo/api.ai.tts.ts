/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateSpeech } from '@tanstack/ai';
import { openaiSpeech } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/demo/api/ai/tts')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const TTSSchema = z.object({
          text: z.string(),
          voice: z.string().optional().default('alloy'),
          model: z.string().optional().default('tts-1'),
          format: z.string().optional().default('mp3'),
          speed: z.number().optional().default(1.0),
        });

        const body = await request.json();
        const { text, voice, model, format, speed } = await TTSSchema.parseAsync(body);

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
          const adapter = openaiSpeech({
            model: model,
            apiKey,
          } as any);

          const result = await generateSpeech({
            adapter,
            input: text,
            voice,
            responseFormat: format,
            speed,
          } as any);

          // result.audio is expected to be a buffer or compatible type
          const audioBuffer = (result as any).audio as Buffer;
          const audioBase64 = Buffer.isBuffer(audioBuffer)
            ? audioBuffer.toString('base64')
            : Buffer.from(audioBuffer).toString('base64');

          return new Response(
            JSON.stringify({
              id: '',
              model: model,
              audio: audioBase64,
              format,
              contentType: `audio/${format}`,
              duration: 0,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
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
