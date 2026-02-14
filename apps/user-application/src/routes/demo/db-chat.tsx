import { createFileRoute } from '@tanstack/react-router';

import ChatArea from '@/features/demo/components/ChatArea';

export const Route = createFileRoute('/demo/db-chat')({
  component: App,
});

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatArea />
    </div>
  );
}
