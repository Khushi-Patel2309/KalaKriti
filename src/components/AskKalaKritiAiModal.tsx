import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, Sparkles, X, User, RefreshCw, MessageSquare, Lightbulb } from 'lucide-react';
import { ChatMessage } from '../types';

interface AskKalaKritiAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVoiceModal?: () => void;
}

const QUICK_PROMPTS = [
  { label: '💰 Fair Pricing Help', text: 'How should I calculate the fair price for my handwoven cotton dupatta?' },
  { label: '📝 Improve Description', text: 'How can I make my terracotta pottery description attractive to urban buyers?' },
  { label: '📦 Safe Packaging Tips', text: 'What is the best eco-friendly packaging for fragile terracotta clay items?' },
  { label: '🎨 Madhubani Care', text: 'What are the care instructions for authentic Madhubani handpainted canvas?' },
  { label: '🚚 Delivery Tracking', text: 'How does live customer delivery tracking work on KalaKriti?' },
];

export const AskKalaKritiAiModal: React.FC<AskKalaKritiAiModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Namaste! 🙏 I am **KalaKriti AI**, your digital craft mentor and marketplace guide. How can I assist your artisan journey or help you discover authentic handmade heritage today?',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'bot',
        text: data.reply || 'KalaKriti is here to empower artisans and delight buyers with authentic Indian crafts!',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'bot',
        text: 'Namaste! KalaKriti provides direct UPI QR payments, fair-trade pricing, AI listing creation, and live delivery tracking. Please feel free to ask about your craft listings, prices, or orders!',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 sm:right-8 z-50 w-full max-w-md bg-[#FFFDF7] border border-[#3A2317]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[560px] max-h-[85vh] animate-in slide-in-from-bottom-5 duration-200">
      {/* Chat Header */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-[#1F3D2E] via-[#2D5A42] to-[#12241A] text-white flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#C1502E] flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
              Ask KalaKriti AI <Sparkles className="w-3.5 h-3.5 text-[#C98A2E]" />
            </h3>
            <p className="text-[10px] text-white/80">Digital Craft Mentor & Marketplace Assistant</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FBF6EA]/40">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-[#C1502E] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#1F3D2E] text-white rounded-tr-xs shadow-xs'
                  : 'bg-white text-[#241A12] border border-[#3A2317]/15 rounded-tl-xs shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <span className={`text-[9px] block mt-1 ${msg.role === 'user' ? 'text-white/60 text-right' : 'text-[#6B5749]'}`}>
                {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-[#3A2317] text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#6B5749] italic bg-white p-3 rounded-2xl border border-[#3A2317]/10 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-[#C98A2E] animate-spin" />
            KalaKriti AI is crafting advice...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 py-2 bg-[#FDFBF7] border-t border-[#3A2317]/10 overflow-x-auto flex items-center gap-1.5 no-scrollbar shrink-0">
        <span className="text-[10px] font-bold text-[#6B5749] shrink-0 flex items-center gap-0.5">
          <Lightbulb className="w-3 h-3 text-[#C98A2E]" /> Suggestions:
        </span>
        {QUICK_PROMPTS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q.text)}
            className="px-2.5 py-1 text-[10px] font-semibold bg-[#FBF6EA] hover:bg-[#FDF3E0] text-[#3A2317] border border-[#3A2317]/15 rounded-lg whitespace-nowrap transition-colors"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-[#3A2317]/15 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask KalaKriti AI anything about crafts, pricing, listings..."
          className="flex-1 px-3.5 py-2 text-xs bg-[#FBF6EA] border border-[#3A2317]/20 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-[#C1502E]"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 text-white bg-[#C1502E] hover:bg-[#9E3E22] disabled:opacity-50 rounded-xl transition-colors shrink-0 shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
