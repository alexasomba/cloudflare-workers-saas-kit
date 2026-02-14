import { generateSpeech } from '@tanstack/ai';
import { openaiSpeech } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/api/ai/tts')({
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ai = (context as { cloudflare?: { env?: { AI: any } } }).cloudflare?.env?.AI;
        const apiKey = (context as { cloudflare?: { env?: Record<string, string> } }).cloudflare
          ?.env?.OPENAI_API_KEY;

        // 1. Try Cloudflare Workers AI (Text-to-Speech)
        // Using @cf/suno/bark is common, or generic text-to-speech if available.
        // We will assume @cf/suno/bark prevents simple usage or might need specific inputs.
        // Actually, let's try a standard fast-speech model if available, but Bark is distinct.
        // For now, let's use @cf/suno/bark as the primary candidate in the plan.
        if (ai) {
          try {
            const response = await ai.run('@cf/suno/bark', {
              prompt: text,
            });

            // response from tts is usually a ReadableStream or ArrayBuffer
            return new Response(response, {
              headers: {
                'Content-Type': 'audio/mpeg', // Bark usually outputs mp3/audio
              },
            });
          } catch (workersAiError) {
            console.warn('Workers AI failed, trying OpenAI fallback:', workersAiError);
          }
        }

        // 2. Fallback to OpenAI (TTS)
        if (apiKey) {
          try {
            const adapter = openaiSpeech({
              model: model,
              apiKey,
            } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

            const result = await generateSpeech({
              adapter,
              input: text,
              voice,
              responseFormat: format,
              speed,
            } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

            // result.audio is expected to be a buffer or compatible type

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            console.error('OpenAI fallback failed:', error);
          }
        }

        return new Response(
          JSON.stringify({
            error: 'Failed to generate speech. Providers exhausted or not configured.',
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
