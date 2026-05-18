import { useCallback, useRef } from 'react';
import { authUtils } from '@/lib/auth-token';
import { useChatStore } from '@/stores/useChatStore';
import type { ChatMessage } from '@/stores/useChatStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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
      continue;
    }
  }

  return incomplete;
}

export function useChatBot() {
  const conversationId = useChatStore((s) => s.conversationId);
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const error = useChatStore((s) => s.error);
  const appendMessage = useChatStore((s) => s.appendMessage);
  const upsertMessage = useChatStore((s) => s.upsertMessage);
  const setIsLoading = useChatStore((s) => s.setIsLoading);
  const setError = useChatStore((s) => s.setError);
  const clearChat = useChatStore((s) => s.clearChat);

  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setIsLoading(false);
  }, [setIsLoading]);

  const clear = useCallback(() => {
    stop();
    clearChat();
  }, [stop, clearChat]);

  const sendMessage = useCallback(
    async (content: string) => {

      const userMessage: ChatMessage = {
        id: `${Date.now()}-user`,
        role: 'user',
        content,
      };
      appendMessage(userMessage);

      stop();
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const currentMessages = useChatStore.getState().messages;
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authUtils.getAccessToken()}`,
          },
          body: JSON.stringify({
            conversationId,
            messages: currentMessages.map((m) => ({
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

        appendMessage({ id: assistantId, role: 'assistant', content: '' });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          buffer = parseSSEChunks(buffer, (chunk) => {
            if (chunk.type === 'content' && typeof chunk.content === 'string') {
              assistantText = chunk.content;
              upsertMessage({ id: assistantId, role: 'assistant', content: assistantText });
            }

            if (chunk.type === 'error') {
              setError(chunk.error?.message || 'Unexpected error from server');
            }
          });
        }
      } catch (err) {
        if ((err as { name?: string })?.name !== 'AbortError') {
          setError((err as { message?: string })?.message ?? 'Unexpected error');
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [conversationId, appendMessage, upsertMessage, stop, setIsLoading, setError],
  );

  return {
    messages,
    isLoading,
    error: error ? new Error(error) : null,
    sendMessage,
    stop,
    clear,
  };
}

