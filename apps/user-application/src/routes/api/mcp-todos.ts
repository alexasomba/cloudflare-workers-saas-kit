import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { addTodo, getTodos, subscribeToTodos } from '../../mcp-todos';

export const Route = createFileRoute('/api/mcp-todos')({
  server: {
    handlers: {
      GET: () => {
        const stream = new ReadableStream({
          start(controller) {
            function ping() {
              try {
                controller.enqueue(`event: ping\n\n`);
                setTimeout(ping, 1000);
              } catch {
                // ignore error
              }
            }
            ping();
            const unsubscribe = subscribeToTodos((todos) => {
              controller.enqueue(`data: ${JSON.stringify(todos)}\n\n`);
            });
            const todos = getTodos();
            controller.enqueue(`data: ${JSON.stringify(todos)}\n\n`);
            return () => unsubscribe();
          },
        });
        return new Response(stream, {
          headers: { 'Content-Type': 'text/event-stream' },
        });
      },
      POST: async ({ request }) => {
        const TodoSchema = z.object({
          title: z.string(),
        });
        const body = await request.json();
        const { title } = await TodoSchema.parseAsync(body);
        addTodo(title);
        return Response.json(getTodos());
      },
    },
  },
});
