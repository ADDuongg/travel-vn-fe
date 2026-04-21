import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Minus, AlertCircle } from 'lucide-react';
import { Button } from '@components/ui/button';
import { useChatStore } from '@/stores/useChatStore';
import { useChatBot } from '@hooks/useChatBot';
import ChatBotMessages from './ChatBotMessages';
import ChatBotInput from './ChatBotInput';
import { cn } from '@/lib/utils';

function ChatBotWidget() {
  const { t } = useTranslation();
  const { isOpen, toggleChat, closeChat } = useChatStore();
  const { messages, sendMessage, stop, isLoading, clear, error } = useChatBot();
  const [errorDismissed, setErrorDismissed] = useState(false);

  const showError = Boolean(error && !errorDismissed);

  const handleSend = useCallback(
    (content: string) => {
      setErrorDismissed(false);
      sendMessage(content);
    },
    [sendMessage],
  );

  return (
    <>
      {/* Chat panel */}
      <div
        className={cn(
          'fixed bottom-20 right-6 z-[100] flex w-[380px] flex-col rounded-2xl border bg-background shadow-2xl transition-all duration-300',
          isOpen
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
        )}
        style={{ height: '520px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl bg-primary px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20 text-sm">
              🇻🇳
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-foreground">
                {t('chatbot.title')}
              </p>
              <p className="text-[11px] text-primary-foreground/70">
                {isLoading ? t('chatbot.typing') : t('chatbot.online')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={closeChat}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => {
                clear();
                closeChat();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Error banner when BE down / network error */}
        {showError && (
          <div className="border-b bg-destructive/10 px-3 py-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-destructive">
                  {t('chatbot.error_connection')}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-1.5 h-7 text-xs"
                  onClick={() => setErrorDismissed(true)}
                >
                  {t('chatbot.retry')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <ChatBotMessages messages={messages} isLoading={isLoading} />

        {/* Input */}
        <ChatBotInput onSend={handleSend} onStop={stop} isLoading={isLoading} />
      </div>

      {/* Toggle button */}
      <Button
        onClick={toggleChat}
        className={cn(
          'fixed bottom-6 right-6 z-[100] h-14 w-14 rounded-full shadow-lg transition-transform duration-300',
          isOpen && 'scale-0',
        )}
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  );
}

export default ChatBotWidget;
