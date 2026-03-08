'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useCityContext } from '@/lib/city-context';
import { getCityById } from '@/lib/cities-data';
import { Send, X, Loader2, MessageCircle } from 'lucide-react';

function generateSessionId(): string {
  return crypto.randomUUID();
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'wolfre';
  text: string;
}

export function WolfreChat() {
  const { selectedCityId, chatOpen, setChatOpen, chatNewsContext, clearChatNewsContext } = useCityContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(generateSessionId());
  const processedNewsRef = useRef<string | null>(null);
  const prevCityIdRef = useRef<string | undefined>(selectedCityId);

  const city = selectedCityId ? getCityById(selectedCityId) : null;

  // Reset conversation only when user selects a different city
  useEffect(() => {
    if (prevCityIdRef.current !== selectedCityId) {
      prevCityIdRef.current = selectedCityId;
      setMessages([]);
      sessionIdRef.current = generateSessionId();
      processedNewsRef.current = null;
    }
  }, [selectedCityId]);

  const predefinedQuestions = city
    ? [
        `How to start investing in ${city.name}?`,
        'How much min capital required to start investing?',
        `Recently started project in ${city.name}?`,
        `What are the best neighborhoods in ${city.name}?`,
        `What's the rental yield in ${city.name}?`,
      ]
    : [
        'How to start real estate investing?',
        'What are the different property types?',
        'How much capital do I need?',
        'What are the market trends?',
        'How to evaluate properties?',
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async (question?: string) => {
    const messageText = question || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: messageText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          userName: 'Investor',
          cityName: city?.name,
          sessionId: sessionIdRef.current,
          history,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const wolfResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'wolfre',
        text: data.response,
      };
      setMessages((prev) => [...prev, wolfResponse]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'wolfre',
        text: `Sorry, I couldn't process that right now. ${err instanceof Error ? err.message : 'Please try again.'}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, city?.name]);

  useEffect(() => {
    if (chatNewsContext && chatOpen && chatNewsContext !== processedNewsRef.current) {
      processedNewsRef.current = chatNewsContext;
      handleSendMessage(chatNewsContext);
      clearChatNewsContext();
    }
  }, [chatNewsContext, chatOpen, clearChatNewsContext, handleSendMessage]);

  const handleClose = useCallback(() => {
    setChatOpen(false);
  }, [setChatOpen]);

  return (
    <>
      {/* Backdrop */}
      {chatOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={handleClose}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-black/80 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out text-white ${
          chatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-white/10 px-6 py-4 flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Wolfre AI</h3>
              <p className="text-xs text-white/60">
                {isLoading ? 'Thinking...' : city ? `${city.name} · Real Estate` : 'Real Estate Assistant'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden scrollbar-hide p-4 space-y-4 bg-transparent">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white/80" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Hi! I&apos;m Wolfre</p>
                <p className="text-xs text-white/50 max-w-xs">
                  Your AI-powered real estate assistant.
                  {city ? ` Ask me anything about ${city.name}!` : ' Ask me anything about real estate!'}
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[85%] min-w-0 text-sm break-words ${
                      msg.sender === 'user'
                        ? 'bg-white/20 border border-white/15 text-white rounded-br-none font-medium'
                        : 'bg-white/10 border border-white/10 text-white rounded-bl-none'
                    }`}
                  >
                    <p className="text-pretty whitespace-pre-wrap break-words">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 rounded-bl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="px-4 py-3 space-y-2 bg-transparent border-t border-white/10 max-h-40 overflow-y-auto overflow-x-hidden scrollbar-hide shrink-0">
            <p className="text-xs font-semibold text-white/40 mb-2">Suggested questions:</p>
            {predefinedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(question)}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 text-xs bg-white/5 hover:bg-white/10 text-white/80 rounded transition disabled:opacity-50 border border-white/5"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/10 bg-black/40 shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder={isLoading ? 'Wolfre is thinking...' : 'Ask Wolfre...'}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/20 placeholder-white/30 disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-white/20 text-white rounded-xl border border-white/10 hover:bg-white/30 transition disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
