'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useCityContext } from '@/lib/city-context';
import { useCitiesData } from '@/lib/cities-data-provider';
import { Send, X, Loader2, MessageCircle, ChevronDown } from 'lucide-react';

function generateSessionId(): string {
  return crypto.randomUUID();
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'easyacre';
  text: string;
}

const CHAT_CONTEXT_GENERAL = '';

export function EasyAcreChat() {
  const { selectedCityId, chatOpen, setChatOpen, chatNewsContext, clearChatNewsContext } = useCityContext();
  const { getCityById } = useCitiesData();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatContext, setChatContext] = useState<string>(CHAT_CONTEXT_GENERAL);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(generateSessionId());
  const processedNewsRef = useRef<string | null>(null);
  const prevCityIdRef = useRef<string | undefined>(selectedCityId);

  const city = selectedCityId ? getCityById(selectedCityId) : null;
  const effectiveCity = chatContext ? getCityById(chatContext) : null;

  // Sync dropdown with map selection: when map city changes, set chat context to it or General
  useEffect(() => {
    setChatContext(selectedCityId ?? CHAT_CONTEXT_GENERAL);
  }, [selectedCityId]);

  // Reset conversation only when user selects a different city on the map
  useEffect(() => {
    if (prevCityIdRef.current !== selectedCityId) {
      prevCityIdRef.current = selectedCityId;
      setMessages([]);
      sessionIdRef.current = generateSessionId();
      processedNewsRef.current = null;
    }
  }, [selectedCityId]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const predefinedQuestions = effectiveCity
    ? [
        `How to start investing in ${effectiveCity.name}?`,
        'How much min capital required to start investing?',
        `Recently started project in ${effectiveCity.name}?`,
        `What are the best neighborhoods in ${effectiveCity.name}?`,
        `What's the rental yield in ${effectiveCity.name}?`,
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
          cityName: effectiveCity?.name,
          sessionId: sessionIdRef.current,
          history,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'easyacre',
        text: data.response,
      };
      setMessages((prev) => [...prev, assistantResponse]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'easyacre',
        text: `Sorry, I couldn't process that right now. ${err instanceof Error ? err.message : 'Please try again.'}`,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, effectiveCity?.name]);

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
              <h3 className="font-bold text-sm text-white">EasyAcre AI</h3>
              <p className="text-xs text-white/60">
                {isLoading ? 'Thinking...' : effectiveCity ? `${effectiveCity.name} · Real Estate` : 'General · Real Estate'}
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
                <p className="font-semibold text-white mb-1">Hi! I&apos;m EasyAcre</p>
                <p className="text-xs text-white/50 max-w-xs">
                  Your AI-powered real estate assistant.
                  {effectiveCity ? ` Ask me anything about ${effectiveCity.name}!` : ' Ask me anything about real estate!'}
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

        {/* Input — Cursor-style: one clean box, textarea + bottom row (dropdown + send) */}
        <div className="px-4 py-3 border-t border-white/10 shrink-0">
          <div className="flex flex-col rounded-lg border border-white/10 bg-white/[0.04] overflow-hidden">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              onScroll={() => {
                setShowScrollbar(true);
                if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                scrollTimeoutRef.current = setTimeout(() => {
                  setShowScrollbar(false);
                  scrollTimeoutRef.current = null;
                }, 1200);
              }}
              data-scrolling={showScrollbar ? 'true' : undefined}
              placeholder={isLoading ? 'EasyAcre is thinking...' : 'Ask EasyAcre...'}
              disabled={isLoading}
              rows={3}
              className="w-full min-h-[72px] max-h-[180px] resize-none overflow-y-auto scrollbar-overlay px-4 pt-3 pb-1 bg-transparent text-white text-sm focus:outline-none placeholder-white/40 disabled:opacity-50 whitespace-pre-wrap break-words border-0 focus:ring-0"
            />
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 border-t border-white/5">
              {/* Context dropdown – styled similar to Ask EasyAcre button, with Cursor-like mode switch feel */}
              <div className="relative inline-flex items-center max-w-[60%] px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition-colors">
                <select
                  value={chatContext}
                  onChange={(e) => setChatContext(e.target.value)}
                  className="chat-context-select max-w-[140px] pr-6 text-[11px] font-medium text-white/85 bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer appearance-none truncate"
                  style={{ colorScheme: 'dark' }}
                  aria-label="Chat context"
                >
                  <option value={CHAT_CONTEXT_GENERAL}>General</option>
                  {city && <option value={city.id}>{city.name}</option>}
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-white/60" aria-hidden />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="p-1.5 rounded text-white/70 hover:text-white hover:bg-white/10 transition disabled:opacity-40 shrink-0"
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
      </div>
    </>
  );
}
