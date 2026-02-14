import { useLiveQuery } from '@tanstack/react-db';
import { useEffect, useRef } from 'react';

import type { Message } from '@/db-collections';
import type { Collection, UtilsRecord } from '@tanstack/react-db';

import { messagesCollection } from '@/db-collections';

function useStreamConnection<
  T extends object,
  TKey extends string | number,
  TUtils extends UtilsRecord,
>(url: string, collection: Collection<T, TKey, TUtils>) {
  const loadedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (loadedRef.current) return;
      loadedRef.current = true;

      const response = await fetch(url);
      const reader = response.body?.getReader();
      if (!reader) {
        return;
      }

      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const chunk of decoder
          .decode(value, { stream: true })
          .split('\n')
          .filter((c) => c.length > 0)) {
          collection.insert(JSON.parse(chunk));
        }
      }
    };
    fetchData();
  }, [url, collection]);
}

export function useChat() {
  useStreamConnection('/api/db-chat', messagesCollection);

  const sendMessage = (message: string, user: string) => {
    fetch('/api/db-chat', {
      method: 'POST',
      body: JSON.stringify({ text: message.trim(), user: user.trim() }),
    });
  };

  return { sendMessage };
}

export function useMessages() {
  const { data: messages } = useLiveQuery((q) =>
    q.from({ message: messagesCollection }).select(({ message }) => ({
      ...message,
    }))
  );

  return messages as Array<Message>;
}
