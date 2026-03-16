import { useChat, fetchServerSentEvents } from '@tanstack/ai-react';
import { authUtils } from '@/lib/auth-token';
import { useChatStore } from '@/stores/useChatStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function useChatBot() {
  const { conversationId } = useChatStore();

  return useChat({
    connection: fetchServerSentEvents(
      `${API_BASE_URL}/api/chat`,
      () => ({
        headers: {
          Authorization: `Bearer ${authUtils.getAccessToken()}`,
        },
      }),
    ),
    body: { conversationId },
  });
}
