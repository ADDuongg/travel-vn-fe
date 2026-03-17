import { useCallback, useRef, useState } from 'react';
import { authUtils } from '@/lib/auth-token';
import { useChatStore } from '@/stores/useChatStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

function parseSSEChunks(buffer: string, onChunk: (data: any) => void): string {
  const lines = buffer.split('\n');
  const incomplete = lines.pop() ?? '';

  for (const line of lines) {
    if (!line.startsWith('data:')) continue;
    const payload = line.slice(5).trim();
    if (!payload) continue;
    if (payload === '[DONE]') {
      onChunk({ type: 'done' });
      continue;
    }
    try {
      const json = JSON.parse(payload);
      onChunk(json);
    } catch {
      // ignore malformed chunk
    }
  }

  return incomplete;
}

export function useChatBot() {
  const { conversationId } = useChatStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const clear = useCallback(() => {
    stop();
    setMessages([]);
    setError(null);
  }, [stop]);

  const sendMessage = useCallback(
    async (content: string) => {
      // Push user message immediately
      const userMessage: ChatMessage = {
        id: `${Date.now()}-user`,
        role: 'user',
        content,
      };
      setMessages((prev) => [...prev, userMessage]);

      // Prepare streaming request
      stop();
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authUtils.getAccessToken()}`,
          },
          body: JSON.stringify({
            conversationId,
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          signal: controller.signal,
        });

        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        let buffer = '';
        const assistantId = `${Date.now()}-assistant`;
        let assistantText = '';

        // create empty assistant message to update as stream arrives
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: 'assistant', content: '' },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          buffer = parseSSEChunks(buffer, (chunk) => {
            if (chunk.type === 'content' && typeof chunk.content === 'string') {
              assistantText = chunk.content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantText } : m,
                ),
              );
            }

            if (chunk.type === 'error') {
              setError(
                new Error(
                  chunk.error?.message || 'Unexpected error from server',
                ),
              );
            }
          });
        }
      } catch (err) {
        if ((err as any)?.name === 'AbortError') {
          // stopped by user
        } else {
          setError(err as Error);
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [conversationId, messages, stop],
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stop,
    clear,
  };
}
