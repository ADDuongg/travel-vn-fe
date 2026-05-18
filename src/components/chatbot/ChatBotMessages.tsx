import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { UIMessage } from '@tanstack/ai-client';
import { cn } from '@/lib/utils';
import ChatBotToolResult from './ChatBotToolResult';

interface ChatBotMessagesProps {

  messages: Array<
    | UIMessage
    | {
        id: string;
        role: 'user' | 'assistant' | 'system';
        content: string;
      }
  >;
  isLoading: boolean;
}

function ChatBotMessages({ messages, isLoading }: ChatBotMessagesProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-3 text-4xl">🇻🇳</div>
          <p className="text-sm font-medium text-foreground">
            {t('chatbot.welcome_title')}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t('chatbot.welcome_subtitle')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
}

function MessageBubble({
  message,
}: {
  message:
    | UIMessage
    | {
        id: string;
        role: 'user' | 'assistant' | 'system';
        content: string;
      };
}) {
  const isUser = message.role === 'user';

  const renderContent = () => {
    if ('parts' in message && Array.isArray(message.parts)) {
      return message.parts.map((part, idx) => {
        if (part.type === 'text') {
          return (
            <span key={idx} className="whitespace-pre-wrap">
              {part.content}
            </span>
          );
        }

        if (part.type === 'thinking') {
          return (
            <div
              key={idx}
              className="mb-1.5 border-l-2 border-muted-foreground/30 pl-2 text-xs italic text-muted-foreground"
            >
              {part.content}
            </div>
          );
        }

        if (part.type === 'tool-call' && part.output) {
          return (
            <ChatBotToolResult
              key={idx}
              name={part.name}
              output={part.output}
            />
          );
        }

        if (part.type === 'tool-call' && part.state !== 'input-complete') {
          return (
            <div
              key={idx}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              {part.name}...
            </div>
          );
        }

        return null;
      });
    }

    return (
      <span className="whitespace-pre-wrap">
        {'content' in message ? message.content : ''}
      </span>
    );
  };

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted text-foreground rounded-bl-md',
        )}
      >
        {renderContent()}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
        <div className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export default ChatBotMessages;

