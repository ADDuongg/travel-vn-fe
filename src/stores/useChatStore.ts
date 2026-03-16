import { create } from 'zustand';

interface ChatState {
  isOpen: boolean;
  conversationId: string | null;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setConversationId: (id: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  conversationId: null,

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  setConversationId: (conversationId) => set({ conversationId }),
}));
