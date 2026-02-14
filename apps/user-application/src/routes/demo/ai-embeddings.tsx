import { Lightning } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';

function EmbeddingsPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-900 p-6 flex flex-col items-center justify-center text-center">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <Lightning className="w-16 h-16 text-yellow-500 opacity-50" />
        </div>
        <h1 className="text-2xl font-bold text-white">Embeddings Coming Soon</h1>
        <p className="text-gray-400">
          The text similarity and embeddings feature is currently under development. Check back
          later globally for updates.
        </p>
      </div>
    </div>
  );
}

export const Route = createFileRoute('/demo/ai-embeddings')({
  component: EmbeddingsPage,
});
