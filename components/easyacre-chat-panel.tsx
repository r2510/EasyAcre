'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useCityContext } from '@/lib/city-context';
import { useCitiesData } from '@/lib/cities-data-provider';
import { Send, Loader2, ChevronDown } from 'lucide-react';

function generateSessionId(): string {
  return crypto.randomUUID();
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'easyacre';
  text: string;
}

const CHAT_CONTEXT_GENERAL = '';

function renderMessageText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <span key={idx}>{part}</span>;
  });
}

export function EasyAcreChatPanel() {
  const { selectedCityId, chatNewsContext, clearChatNewsContext } = useCityContext();
  const { getCityById } = useCitiesData();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatContext, setChatContext] = useState<string>(CHAT_CONTEXT_GENERAL);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef<string>(generateSessionId());
  const processedNewsRef = useRef<string | null>(null);
  const prevCityIdRef = useRef<string | null | undefined>(selectedCityId);

  const city = selectedCityId ? getCityById(selectedCityId) : null;
  const effectiveCity = chatContext ? getCityById(chatContext) : null;

  // Keep dropdown in sync with the city selected on the map
  useEffect(() => {
    setChatContext(selectedCityId ?? CHAT_CONTEXT_GENERAL);
  }, [selectedCityId]);

  // New conversation each time the user picks a different city on the map
  useEffect(() => {
    if (prevCityIdRef.current !== selectedCityId) {
      prevCityIdRef.current = selectedCityId;
      setMessages([]);
      sessionIdRef.current = generateSessionId();
      processedNewsRef.current = null;
    }
  }, [selectedCityId]);

  // Pain-point oriented prompts — designed to surface user worries / blockers
  const predefinedQuestions = effectiveCity
    ? [
        `What's stopping me from investing in ${effectiveCity.name}?`,
        `Is now the right time to buy in ${effectiveCity.name}?`,
        `Minimum capital I need to start in ${effectiveCity.name}?`,
        `Common mistakes investors make in ${effectiveCity.name}?`,
        `How do I evaluate a property in ${effectiveCity.name}?`,
        `Best neighborhoods in ${effectiveCity.name} for first-time investors?`,
      ]
    : [
        "I don't know where to start — help me out",
        'Capital feels like a barrier. What are my options?',
        'Is real estate still worth it right now?',
        "How do I avoid making a bad investment?",
        'What property type fits a first-time investor?',
        'Renting vs buying — what makes sense for me?',
      ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(
    async (question?: string) => {
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
          text: `Sorry, I couldn't process that right now. ${
            err instanceof Error ? err.message : 'Please try again.'
          }`,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, effectiveCity?.name]
  );

  // Auto-send when a news item triggers "Ask EasyAcre"
  useEffect(() => {
    if (chatNewsContext && chatNewsContext !== processedNewsRef.current) {
      processedNewsRef.current = chatNewsContext;
      handleSendMessage(chatNewsContext);
      clearChatNewsContext();
    }
  }, [chatNewsContext, clearChatNewsContext, handleSendMessage]);

  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_80%_85%,rgba(20,184,166,0.1),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.03] to-transparent" />
      {/* Messages area */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-5">
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center text-center py-6 lg:py-10">
              <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/15 bg-white/[0.05] text-[11px] font-semibold tracking-wide uppercase text-white/65 mb-4">
                EasyAcre AI
              </span>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight">
                How can I help you today?
              </h1>
              <p className="text-base text-white/65 max-w-xl mx-auto leading-relaxed">
                Tell us your real estate worries, doubts, or questions.{' '}
                {effectiveCity
                  ? `We're focused on ${effectiveCity.name} right now.`
                  : "We'll help you find clarity."}
              </p>

              <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {predefinedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    disabled={isLoading}
                    className="group text-left px-4 py-3.5 text-sm bg-white/[0.04] hover:bg-white/[0.09] text-white/80 hover:text-white rounded-2xl border border-white/10 hover:border-white/25 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                  >
                    <span className="block leading-relaxed">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5 pb-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  {msg.sender === 'easyacre' && (
                    <span className="text-[10px] font-semibold tracking-wide uppercase text-white/35 px-1 mb-1.5">
                      EasyAcre
                    </span>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl max-w-[85%] min-w-0 text-sm break-words shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-white/25 border border-white/20 text-white rounded-br-none font-medium shadow-black/25'
                        : 'bg-black/35 border border-white/15 text-white/90 rounded-bl-none'
                    }`}
                  >
                    <p className="text-pretty whitespace-pre-wrap break-words leading-relaxed">
                      {renderMessageText(msg.text)}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-black/30 border border-white/10 rounded-bl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-white/50" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="relative z-10 border-t border-white/10 px-4 sm:px-6 py-3 shrink-0 bg-black/30 backdrop-blur-md">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden focus-within:border-cyan-200/35 focus-within:bg-white/[0.06] transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isLoading
                  ? 'EasyAcre is thinking...'
                  : 'Share your real estate question, doubt, or worry...'
              }
              disabled={isLoading}
              rows={2}
              className="w-full min-h-[52px] max-h-[140px] resize-none overflow-y-auto scrollbar-hide px-4 pt-3 pb-1 bg-transparent text-white text-sm focus:outline-none placeholder-white/45 disabled:opacity-50 whitespace-pre-wrap break-words border-0 focus:ring-0"
            />
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-white/5">
              <div className="relative inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <select
                  value={chatContext}
                  onChange={(e) => setChatContext(e.target.value)}
                  className="chat-context-select max-w-[150px] pr-5 text-[11px] font-medium text-white/85 bg-transparent border-0 focus:outline-none focus:ring-0 cursor-pointer appearance-none truncate"
                  style={{ colorScheme: 'dark' }}
                  aria-label="Chat context"
                >
                  <option value={CHAT_CONTEXT_GENERAL}>General</option>
                  {city && <option value={city.id}>{city.name}</option>}
                </select>
                <ChevronDown
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-white/60"
                  aria-hidden
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-white to-slate-200 text-black text-xs font-bold disabled:opacity-30 hover:from-white hover:to-white transition disabled:cursor-not-allowed shrink-0 shadow-sm shadow-black/20"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="text-[10px] text-white/30 text-center mt-2">
            Private conversation. Press Enter to send, Shift+Enter for a new line.
          </p>
        </div>
      </div>
    </div>
  );
}
