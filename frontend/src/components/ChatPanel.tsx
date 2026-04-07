import { useAppStore } from '../store';
import { 
  Send, 
  Bot, 
  User, 
  AlertCircle,
  Loader,
  Trash2
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { formatDistanceToNow } from 'date-fns';

// Chat message bubble
function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  
  return (
    <div className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && !isSystem && (
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4" />
        </div>
      )}
      
      <div 
        className={`max-w-[85%] rounded-lg p-3 ${
          isUser 
            ? 'bg-primary-600 text-white' 
            : isSystem 
              ? 'bg-dark-800 text-gray-400 text-xs italic'
              : 'bg-dark-700 text-white'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
        <div className="text-xs opacity-60 mt-1">
          {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}

export default function ChatPanel() {
  const { chatMessages, sendChatMessage, fetchChatHistory } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const message = input;
    setInput('');
    setIsTyping(true);
    
    await sendChatMessage(message);
    
    // Simulate response (in real app, this would come from backend)
    setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-dark-700">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <Bot className="w-4 h-4" />
          Chat avec Hermes
        </h2>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Bonjour Sylvain!</p>
            <p className="text-sm mt-1">Comment puis-je t'aider?</p>
          </div>
        ) : (
          <>
            {chatMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {isTyping && (
              <div className="flex gap-2 items-center text-gray-500">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-dark-700 rounded-lg p-3">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Input */}
      <div className="p-3 border-t border-dark-700">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écris ton message..."
            className="input flex-1 resize-none"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="btn btn-primary self-end"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Appuie sur Entrée pour envoyer, Shift+Entrée pour nouvelle ligne
        </div>
      </div>
    </div>
  );
}
