import { generateTranscription } from '@tanstack/ai';
import { openaiTranscription } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/ai/transcription')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        const formData = await request.formData();
        const audioFile = formData.get('audio') as File | null;
        const audioBase64 = formData.get('audioBase64') as string | null;
        const modelValue = (formData.get('model') as string) || 'whisper-1';
        const languageValue = formData.get('language') as string | null;
        const responseFormatValue = formData.get('responseFormat') as string | null;

        if (!audioFile && !audioBase64) {
          return new Response(
            JSON.stringify({
              error: 'Audio file or base64 data is required',
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
          const adapter = openaiTranscription({ model: modelValue, apiKey } as any);

          // Prepare audio data
          let audioData: string | File;
          if (audioFile) {
            audioData = audioFile;
          } else if (audioBase64) {
            audioData = audioBase64;
          } else {
            throw new Error('No audio data provided');
          }

          const result = await generateTranscription({
            adapter,
            audio: audioData,
            language: languageValue || undefined,

            responseFormat: (responseFormatValue as any) || 'verbose_json',
          });

          return new Response(
            JSON.stringify({
              id: result.id,
              model: result.model,
              text: result.text,
              language: result.language,
              duration: result.duration,
              segments: result.segments,
              words: result.words,
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
