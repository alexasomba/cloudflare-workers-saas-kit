import { createCollection, localOnlyCollectionOptions } from '@tanstack/react-db';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const IncomingMessageSchema = z.object({
  user: z.string(),
  text: z.string(),
});

const MessageSchema = IncomingMessageSchema.extend({
  id: z.number(),
});

export type Message = z.infer<typeof MessageSchema>;

export const serverMessagesCollection = createCollection(
  localOnlyCollectionOptions({
    getKey: (message) => message.id,
    schema: MessageSchema,
  })
);

let id = 0;
serverMessagesCollection.insert({
  id: id++,
  user: 'Alice',
  text: 'Hello, how are you?',
});
serverMessagesCollection.insert({
  id: id++,
  user: 'Bob',
  text: "I'm fine, thank you!",
});

const sendMessage = (message: { user: string; text: string }) => {
  serverMessagesCollection.insert({
    id: id++,
    user: message.user,
    text: message.text,
  });
};

export const Route = createFileRoute('/demo/db-chat-api')({
  server: {
    handlers: {
      GET: () => {
        const stream = new ReadableStream({
          start(controller) {
            for (const [, message] of serverMessagesCollection.state) {
              controller.enqueue(JSON.stringify(message) + '\n');
            }
            serverMessagesCollection.subscribeChanges((changes) => {
              for (const change of changes) {
                if (change.type === 'insert') {
                  controller.enqueue(JSON.stringify(change.value) + '\n');
                }
              }
            });
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'application/x-ndjson',
          },
        });
      },
      POST: async ({ request }) => {
        const message = await request.json();
        const parsedMessage = IncomingMessageSchema.safeParse(message);
        if (!parsedMessage.success) {
          return new Response(parsedMessage.error.message, { status: 400 });
        }
        sendMessage(parsedMessage.data);
        return Response.json(parsedMessage.data); // Use Response.json()
      },
    },
  },
});
