import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';
import ChatBot from './ChatBot';

const ChatBotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnread(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen &&
      <div className="fixed bottom-4 right-4 z-40" data-id="znmwp7pkm" data-path="src/components/ChatBotWidget.tsx">
          <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          size="lg" data-id="u138xsdz2" data-path="src/components/ChatBotWidget.tsx">

            <div className="relative" data-id="hzbhh1ctd" data-path="src/components/ChatBotWidget.tsx">
              <MessageCircle className="h-6 w-6" data-id="ch5abjche" data-path="src/components/ChatBotWidget.tsx" />
              {hasUnread &&
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs" data-id="ppqnht9l5" data-path="src/components/ChatBotWidget.tsx">

                  !
                </Badge>
            }
            </div>
          </Button>
        </div>
      }

      {/* Chat Bot Component */}
      <ChatBot isOpen={isOpen} onToggle={toggleChat} data-id="e432l9lny" data-path="src/components/ChatBotWidget.tsx" />
    </>);

};

export default ChatBotWidget;