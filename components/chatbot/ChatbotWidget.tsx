"use client";

import { useState, useRef, useEffect } from "react";
import { MOCK_COURSES } from "@/mock/courses";
import { getBotReply, WELCOME_MESSAGE, type ChatMessage } from "./chatbot-logic";

// ─── Robot icon ───────────────────────────────────────────────────────────────
function RobotIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      {/* head */}
      <rect x="5" y="8" width="18" height="13" rx="3" stroke="currentColor" strokeWidth="1.8" />
      {/* eyes */}
      <circle cx="10.5" cy="14" r="2" fill="currentColor" />
      <circle cx="17.5" cy="14" r="2" fill="currentColor" />
      {/* mouth */}
      <path d="M10 18.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* antenna */}
      <line x1="14" y1="8" x2="14" y2="4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="14" cy="3" r="1.5" fill="currentColor" />
      {/* ears */}
      <rect x="2" y="11" width="3" height="5" rx="1.5" fill="currentColor" />
      <rect x="23" y="11" width="3" height="5" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M17 10L3 3l3.5 7L3 17l14-7z" fill="currentColor" />
    </svg>
  );
}

// ─── Course card inside chat ──────────────────────────────────────────────────
function CoursePill({ course }: { course: (typeof MOCK_COURSES)[0] }) {
  const price = !course.price || course.price === 0 ? "ฟรี" : `฿${course.price.toLocaleString()}`;
  return (
    <div className="chatbot-course-pill">
      <span className="chatbot-course-title">{course.title}</span>
      <span className="chatbot-course-meta">
        {course.category?.name} · {price} · ⭐ {course.averageRating}
      </span>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isBot = msg.role === "bot";
  return (
    <div className={`chatbot-msg-row ${isBot ? "chatbot-msg-bot" : "chatbot-msg-user"}`}>
      {isBot && (
        <div className="chatbot-avatar">
          <RobotIcon size={16} />
        </div>
      )}
      <div className="chatbot-bubble-wrap">
        <div className={`chatbot-bubble ${isBot ? "chatbot-bubble-bot" : "chatbot-bubble-user"}`}>
          {msg.text.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < msg.text.split("\n").length - 1 && <br />}
            </span>
          ))}
        </div>
        {msg.courses && msg.courses.length > 0 && (
          <div className="chatbot-courses">
            {msg.courses.map((c) => (
              <CoursePill key={c.id} course={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main widget ──────────────────────────────────────────────────────────────
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const reply = getBotReply(text);
      setMessages((prev) => [...prev, reply]);
      setLoading(false);
    }, 500);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      {/* ── Styles ── */}
      <style>{`
        .chatbot-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--vermilion);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(255,77,46,0.45);
          transition: transform 150ms, box-shadow 150ms;
        }
        .chatbot-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 20px rgba(255,77,46,0.55);
        }
        .chatbot-fab:active { transform: scale(0.96); }

        .chatbot-panel {
          position: fixed;
          bottom: 96px;
          right: 28px;
          z-index: 9998;
          width: 360px;
          max-height: 520px;
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          overflow: hidden;
          background: var(--paper);
          box-shadow: 0 8px 40px rgba(26,23,21,0.18);
          animation: chatbot-slide-in 200ms ease;
        }
        @keyframes chatbot-slide-in {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (max-width: 480px) {
          .chatbot-panel {
            right: 12px;
            left: 12px;
            width: auto;
            bottom: 88px;
          }
          .chatbot-fab { bottom: 20px; right: 16px; }
        }

        .chatbot-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          background: var(--pine);
          color: #fff;
          flex-shrink: 0;
        }
        .chatbot-header-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .chatbot-header-info { flex: 1; }
        .chatbot-header-name {
          font-family: var(--font-thai);
          font-weight: 600;
          font-size: 14px;
          line-height: 1.2;
        }
        .chatbot-header-status {
          font-family: var(--font-thai);
          font-size: 11px;
          color: rgba(255,255,255,0.65);
        }
        .chatbot-close-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 6px;
          transition: color 150ms;
        }
        .chatbot-close-btn:hover { color: #fff; }

        .chatbot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--cream);
          scrollbar-width: thin;
          scrollbar-color: var(--line-2) transparent;
        }

        .chatbot-msg-row {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .chatbot-msg-bot { flex-direction: row; }
        .chatbot-msg-user { flex-direction: row-reverse; }

        .chatbot-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--pine);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .chatbot-bubble-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-width: calc(100% - 40px);
        }
        .chatbot-bubble {
          padding: 9px 12px;
          border-radius: 12px;
          font-family: var(--font-thai);
          font-size: 13.5px;
          line-height: 1.55;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .chatbot-bubble-bot {
          background: var(--paper);
          color: var(--ink);
          border-radius: 4px 12px 12px 12px;
          box-shadow: 0 1px 4px rgba(26,23,21,0.07);
        }
        .chatbot-bubble-user {
          background: var(--vermilion);
          color: #fff;
          border-radius: 12px 4px 12px 12px;
          margin-left: auto;
        }

        .chatbot-courses {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .chatbot-course-pill {
          background: var(--paper);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 7px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          cursor: default;
          transition: border-color 150ms;
        }
        .chatbot-course-pill:hover { border-color: var(--vermilion); }
        .chatbot-course-title {
          font-family: var(--font-thai);
          font-size: 12.5px;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.4;
        }
        .chatbot-course-meta {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--ink-4);
          letter-spacing: 0.01em;
        }

        .chatbot-typing {
          display: flex;
          gap: 8px;
          align-items: center;
          padding: 4px 0;
        }
        .chatbot-typing-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: var(--pine);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .chatbot-typing-dots {
          display: flex;
          gap: 4px;
          padding: 10px 14px;
          background: var(--paper);
          border-radius: 4px 12px 12px 12px;
          box-shadow: 0 1px 4px rgba(26,23,21,0.07);
        }
        .chatbot-typing-dots span {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--ink-4);
          animation: chatbot-bounce 1.2s infinite;
        }
        .chatbot-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .chatbot-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes chatbot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }

        .chatbot-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-top: 1px solid var(--line);
          background: var(--paper);
          flex-shrink: 0;
        }
        .chatbot-input {
          flex: 1;
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 8px 14px;
          font-family: var(--font-thai);
          font-size: 13.5px;
          color: var(--ink);
          background: var(--cream);
          outline: none;
          transition: border-color 150ms;
        }
        .chatbot-input:focus { border-color: var(--vermilion); }
        .chatbot-input::placeholder { color: var(--ink-4); }
        .chatbot-send-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: var(--vermilion);
          color: #fff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 150ms, transform 100ms;
        }
        .chatbot-send-btn:hover { background: var(--vermilion-2); }
        .chatbot-send-btn:active { transform: scale(0.92); }
        .chatbot-send-btn:disabled { background: var(--line-2); cursor: default; }
      `}</style>

      {/* ── FAB button ── */}
      <button
        className="chatbot-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "ปิด Chatbot" : "เปิด Plearn AI Chatbot"}
        title="Plearn AI"
      >
        {open ? <CloseIcon /> : <RobotIcon size={26} />}
      </button>

      {/* ── Chat panel ── */}
      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Plearn AI Chatbot">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-icon">
              <RobotIcon size={18} />
            </div>
            <div className="chatbot-header-info">
              <div className="chatbot-header-name">Plearn AI</div>
              <div className="chatbot-header-status">ออนไลน์ • ตอบทันที</div>
            </div>
            <button className="chatbot-close-btn" onClick={() => setOpen(false)} aria-label="ปิด">
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
            {loading && (
              <div className="chatbot-typing">
                <div className="chatbot-typing-avatar">
                  <RobotIcon size={14} />
                </div>
                <div className="chatbot-typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-row">
            <input
              ref={inputRef}
              className="chatbot-input"
              type="text"
              placeholder="พิมพ์คำถามเกี่ยวกับคอร์ส..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
              maxLength={200}
            />
            <button
              className="chatbot-send-btn"
              onClick={send}
              disabled={!input.trim() || loading}
              aria-label="ส่ง"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
