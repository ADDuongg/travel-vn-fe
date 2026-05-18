import { useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Square } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';

interface ChatBotInputProps {
  onSend: (content: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

function ChatBotInput({ onSend, onStop, isLoading }: ChatBotInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2 border-t p-3">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('chatbot.input_placeholder')}
        disabled={isLoading}
        size="sm"
        className="flex-1"
      />
      {isLoading ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onStop}
          className="shrink-0"
        >
          <Square className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="default"
          size="icon"
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default ChatBotInput;

