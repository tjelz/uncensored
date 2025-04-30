"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

const TWITTER_URL = "https://x.com/ama_uncensored"; // Replace with actual handle if desired
const GITHUB_URL = "https://github.com/tjelz/uncensored";
const PUMPFUN_CONTRACT = "COMING SOON";

const messagesInitial: Message[] = [
  {
    sender: "ai",
    text: "Welcome to $ama."
  }
];

type Message = {
  sender: "user" | "ai";
  text: string;
};

const FADE_WORDS = ["ASK", "ME", "ANYTHING.", "(LITERALLY)"];

const FadeInWords = () => (
  <div className="mb-6 md:mb-8 text-center select-none" aria-label="ASK ME ANYTHING. (LITERALLY)">
    {FADE_WORDS.map((word, idx) => (
      <span
        key={word}
        className={`block ${idx === 3 ? 'text-xl md:text-2xl lg:text-3xl text-white/70' : 'text-4xl md:text-5xl lg:text-6xl'} font-extrabold tracking-tight uppercase`}
        style={{
          opacity: 0,
          animation: `fadeIn 0.7s ease forwards`,
          animationDelay: `${idx * 0.5}s`,
        }}
      >
        {word}
      </span>
    ))}
    <style>{`
      @keyframes fadeIn {
        to { opacity: 1; }
      }
    `}</style>
  </div>
);

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(messagesInitial);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { sender: "user" as const, text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);
    setStreamingMessage("");
    try {
      const chatHistory = [
        ...messages,
        userMsg,
      ].map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory }),
      });
      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        aiText += chunk;
        setStreamingMessage(aiText);
      }
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: aiText },
      ]);
      setStreamingMessage("");
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "ai", text: "[Error: AI failed to respond]" },
      ]);
      setStreamingMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(PUMPFUN_CONTRACT);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col text-white font-bold">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10">
        <span className="text-xl sm:text-2xl tracking-widest select-none">$ama</span>
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            tabIndex={0}
            className="flex items-center gap-1 hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded px-2"
          >
            <svg width="20" height="20" fill="currentColor" aria-hidden className="inline" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            tabIndex={0}
            className="flex items-center gap-1 hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded px-2"
          >
            <svg width="20" height="20" fill="currentColor" aria-hidden className="inline"><path d="M17.316 6.246c.008.11.008.221.008.332 0 3.385-2.577 7.29-7.29 7.29-1.448 0-2.797-.424-3.933-1.153.202.024.395.032.605.032 1.2 0 2.304-.404 3.186-1.085a2.57 2.57 0 0 1-2.4-1.785c.16.024.32.04.488.04.234 0 .468-.032.686-.09a2.567 2.567 0 0 1-2.057-2.52v-.032c.344.192.74.308 1.16.324a2.563 2.563 0 0 1-.796-3.422 7.29 7.29 0 0 0 5.29 2.682 2.893 2.893 0 0 1-.064-.588 2.567 2.567 0 0 1 4.44-1.753 5.09 5.09 0 0 0 1.626-.62 2.563 2.563 0 0 1-1.128 1.417 5.13 5.13 0 0 0 1.474-.404 5.51 5.51 0 0 1-1.28 1.33z"/></svg>
            <span className="hidden sm:inline">Twitter</span>
          </a>
          <button
            className="flex items-center gap-1 bg-white/10 text-white px-2 sm:px-3 py-1 rounded text-xs cursor-not-allowed opacity-60 select-none"
            aria-label="Pump.fun contract address coming soon"
            tabIndex={-1}
            disabled
            onClick={handleCopy}
          >
            <span className="text-xs">CA:</span>
            <span className="font-mono text-xs">{PUMPFUN_CONTRACT}</span>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" className="inline"><rect x="3" y="3" width="8" height="8" rx="2"/><path d="M6 6h2v2H6z"/></svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center px-3 sm:px-4 pt-6 sm:pt-8 pb-6 sm:pb-8 flex-1">
        <FadeInWords />
        <section
          className="w-full max-w-lg bg-white/5 rounded-xl shadow-lg p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 border border-white/10"
          aria-label="Chatbox"
        >
          <div className="flex flex-col gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto pr-1 text-xs sm:text-sm" role="log" aria-live="polite">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.sender === "user"
                    ? "self-end bg-white/20 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg w-full text-right"
                    : "self-start bg-white/10 text-white/90 px-3 sm:px-4 py-3 sm:py-4 rounded-lg w-full prose prose-invert prose-pre:bg-black/80 prose-pre:text-xs prose-pre:rounded-lg"
                }
                aria-label={msg.sender === "user" ? "You" : "AI"}
              >
                {msg.sender === "ai" ? (
                  <div className="whitespace-pre-line prose prose-invert prose-pre:text-xs prose-pre:rounded-lg" aria-live="polite">
                    <ReactMarkdown key={msg.text}>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {streamingMessage && (
              <div className="self-start bg-white/10 text-white/90 px-3 sm:px-4 py-3 sm:py-4 rounded-lg max-w-[80%] whitespace-pre-line prose prose-invert prose-pre:bg-black/80 prose-pre:text-xs prose-pre:rounded-lg" aria-live="polite">
                <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                <span className="animate-pulse">▋</span>
              </div>
            )}
            {loading && !streamingMessage && (
              <div className="self-start text-white/70 animate-pulse px-3 py-2">Thinking…</div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex flex-col sm:flex-row items-end mt-2 w-full">
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="flex-1 bg-black text-white px-3 sm:px-4 py-2 focus:outline-none resize-none text-xs md:text-sm border border-white/20 rounded-lg placeholder-white/40 min-h-[40px] max-h-40"
              placeholder="Type your question…"
              aria-label="Type your question"
              autoFocus
              tabIndex={0}
              disabled={loading}
              rows={1}
              style={{ lineHeight: '1.5', overflow: 'auto' }}
            />
            <button
              onClick={handleSend}
              className="ml-0 sm:ml-3 mt-2 sm:mt-0 px-4 sm:px-6 py-2 bg-white text-black font-bold rounded-full shadow transition hover:shadow-lg hover:bg-white/90 focus:outline-none disabled:opacity-50 text-xs md:text-sm border-none w-full sm:w-auto"
              aria-label="Send message"
              tabIndex={0}
              disabled={loading || !input.trim()}
              type="button"
            >
              Send
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
