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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ai = (context as { cloudflare?: { env?: { AI: any } } }).cloudflare?.env?.AI;
        const apiKey = (context as { cloudflare?: { env?: Record<string, string> } }).cloudflare
          ?.env?.OPENAI_API_KEY;

        // 1. Try Cloudflare Workers AI (Whisper)
        if (ai) {
          try {
            let audioInput: Array<number> = [];
            if (audioFile) {
              const arrayBuffer = await audioFile.arrayBuffer();
              audioInput = Array.from(new Uint8Array(arrayBuffer));
            } else if (audioBase64) {
              const binaryString = atob(audioBase64);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              audioInput = Array.from(bytes);
            }

            if (audioInput.length > 0) {
              const response = await ai.run('@cf/openai/whisper', {
                audio: audioInput,
              });

              return new Response(
                JSON.stringify({
                  text: response.text,
                  word_count: response.word_count,
                  model: '@cf/openai/whisper',
                  // Map other fields as best as possible or leaving undefined/null if appropriate for the UI
                  id: 'workers-ai-whisper',
                  language: 'en', // Assumption or needs detection
                  duration: 0,
                  segments: [],
                  words: response.words || [],
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

        // 2. Fallback to OpenAI (Whisper)
        if (apiKey) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          } catch (openAiError) {
            console.error('OpenAI fallback failed:', openAiError);
          }
        }

        return new Response(
          JSON.stringify({
            error: 'Failed to transcribe audio. Providers exhausted or not configured.',
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
