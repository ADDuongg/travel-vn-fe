import { create } from 'zustand';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

interface ChatState {
  isOpen: boolean;
  conversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;

  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setConversationId: (id: string) => void;

  setMessages: (messages: ChatMessage[]) => void;
  appendMessage: (message: ChatMessage) => void;
  upsertMessage: (message: ChatMessage) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  conversationId: null,
  messages: [],
  isLoading: false,
  error: null,

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  setConversationId: (conversationId) => set({ conversationId }),

  setMessages: (messages) => set({ messages: [...messages] }),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  upsertMessage: (message) =>
    set((state) => {
      const idx = state.messages.findIndex((m) => m.id === message.id);
      if (idx === -1) return { messages: [...state.messages, message] };
      return {
        messages: state.messages.map((m) => (m.id === message.id ? { ...m, ...message } : m)),
      };
    }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearChat: () =>
    set({
      messages: [],
      isLoading: false,
      error: null,
    }),
}));

