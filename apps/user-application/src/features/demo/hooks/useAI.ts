import { clientTools } from '@tanstack/ai-client';
import { createChatClientOptions, fetchServerSentEvents, useChat } from '@tanstack/ai-react';

import { recommendGuitarToolDef } from '../lib/guitar-tools';

import type { InferChatMessages } from '@tanstack/ai-react';


const recommendGuitarToolClient = recommendGuitarToolDef.client(({ id }) => ({
  id: +id,
}));

const chatOptions = createChatClientOptions({
  connection: fetchServerSentEvents('/api/ai/chat'),
  tools: clientTools(recommendGuitarToolClient),
});

export type ChatMessages = InferChatMessages<typeof chatOptions>;

export const useGuitarRecommendationChat = () => useChat(chatOptions);
