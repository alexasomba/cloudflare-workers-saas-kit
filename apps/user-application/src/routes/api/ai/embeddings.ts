import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/ai/embeddings')({
  server: {
    handlers: {
      POST: ({ request, context }) => {
        // Placeholder implementation
        return new Response(
          JSON.stringify({
            message: 'Embeddings feature is currently disabled/placeholder.',
            embeddings: [],
          }),
          {
            status: 200, // Or 501 Not Implemented
            headers: { 'Content-Type': 'application/json' },
          }
        );
      },
    },
  },
});
