import { createWorkersAiChat } from '@cloudflare/tanstack-ai';
import { chat, maxIterations, toServerSentEventsResponse } from '@tanstack/ai';
import { anthropicText } from '@tanstack/ai-anthropic';
import { geminiText } from '@tanstack/ai-gemini';
import { ollamaText } from '@tanstack/ai-ollama';
import { openaiText } from '@tanstack/ai-openai';
import { createFileRoute } from '@tanstack/react-router';
import { env } from 'cloudflare:workers';
import { z } from 'zod';

import type { ModelMessage } from '@tanstack/ai';

import { getGuitars, recommendGuitarToolDef } from '@/features/demo/lib/guitar-tools';

const SYSTEM_PROMPT = `You are a helpful assistant for a store that sells guitars.

CRITICAL INSTRUCTIONS - YOU MUST FOLLOW THIS EXACT WORKFLOW:

When a user asks for a guitar recommendation:
1. FIRST: Use the getGuitars tool (no parameters needed)
2. SECOND: Use the recommendGuitar tool with the ID of the guitar you want to recommend
3. NEVER write a recommendation directly - ALWAYS use the recommendGuitar tool

IMPORTANT:
- The recommendGuitar tool will display the guitar in a special, appealing format
- You MUST use recommendGuitar for ANY guitar recommendation
- ONLY recommend guitars from our inventory (use getGuitars first)
- The recommendGuitar tool has a buy button - this is how customers purchase
- Do NOT describe the guitar yourself - let the recommendGuitar tool do it
`;

export const Route = createFileRoute('/api/ai/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Capture request signal before reading body (it may be aborted after body is consumed)
        const requestSignal = request.signal;

        // If request is already aborted, return early
        if (requestSignal.aborted) {
          return new Response(null, { status: 499 }); // 499 = Client Closed Request
        }

        const abortController = new AbortController();

        try {
          const body = await request.json();
          const { messages, provider: bodyProvider } = z
            .object({
              messages: z.array(z.any()),
              provider: z.string().optional(),
            })
            .parse(body);

          const typedMessages = messages as Array<ModelMessage>;

          // Determine the best available provider
          // Default to Workers AI using GLM-4.7-Flash for superior tool calling
          let provider = 'workers-ai';
          let model = '@cf/meta/llama-3.2-1b-instruct';

          // Override via request body if needed, otherwise stick to defaults
          // (We keep the keys check for fallback/optional selection logic later if needed)
          if (process.env.ANTHROPIC_API_KEY && bodyProvider === 'anthropic') {
            provider = 'anthropic';
            model = 'claude-haiku-4-5';
          } else if (process.env.OPENAI_API_KEY && bodyProvider === 'openai') {
            provider = 'openai';
            model = 'gpt-4o';
          } else if (process.env.GEMINI_API_KEY && bodyProvider === 'gemini') {
            provider = 'gemini';
            model = 'gemini-2.0-flash-exp';
          }

          // Adapter factory pattern for multi-vendor support
          const adapterConfig = {
            'workers-ai': () =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              createWorkersAiChat('@cf/meta/llama-3.2-1b-instruct' as any, {
                binding: env.AI,
              }),

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            anthropic: () => anthropicText(model as any),

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            openai: () => openaiText(model as any),

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            gemini: () => geminiText(model as any),

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ollama: () => ollamaText(model as any),
          };

          const adapter = adapterConfig[provider as keyof typeof adapterConfig]();

          const stream = chat({
            adapter,
            tools: [
              getGuitars, // Server tool
              recommendGuitarToolDef, // No server execute - client will handle
            ],
            systemPrompts: [SYSTEM_PROMPT],
            agentLoopStrategy: maxIterations(5),
            messages: typedMessages,
            abortController,
          });

          return toServerSentEventsResponse(stream, { abortController });
        } catch (error) {
          // If request was aborted, return early (don't send error response)
          if (
            (error instanceof Error && error.name === 'AbortError') ||
            abortController.signal.aborted
          ) {
            return new Response(null, { status: 499 }); // 499 = Client Closed Request
          }
          return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
