import React, { useState, useEffect, useRef } from "react";

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "bot",
    text: "Selam, እንኳን ደህና መጡ ወደ ጥቁር አንበሳ ሆስፒታል። I’m Merkuze, your digital supporter.",
  },
  {
    id: 2,
    role: "bot",
    text: "You can ask about departments, appointments, pre‑visit instructions, or medicines. How can I support you today?",
  },
];

const MOCK_ANSWERS = [
  "I can help you find the right department based on your symptoms, and explain which documents to bring for registration.",
  "For many lab tests you may be asked to fast 8–12 hours. Always follow the exact instruction given with your appointment slip.",
  "If you tell me your clinic (for example: oncology, cardiology, pediatrics), I can share typical clinic hours and waiting flow.",
  "I can remind you which medicines you are taking and repeat instructions after your visit, so you don’t have to remember everything alone.",
  "For complex or urgent medical questions, I will always recommend speaking directly with your doctor or a live pharmacist.",
];

function MerkuzeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [counter, setCounter] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const newUserMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsTyping(true);

    const answerIndex = counter % MOCK_ANSWERS.length;
    const answerText = MOCK_ANSWERS[answerIndex];
    setCounter((prev) => prev + 1);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: answerText,
        },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      <button
        type="button"
        className="merkuze-widget-button"
        onClick={handleToggle}
        aria-label={isOpen ? "Close Merkuze chat" : "Open Merkuze chat"}
      >
        <span className="merkuze-widget-icon">ም</span>
      </button>

      {isOpen && (
        <section
          className="merkuze-widget-panel"
          aria-label="Merkuze chatbot window"
        >
          <header className="merkuze-widget-header">
            <div className="merkuze-widget-header-main">
              <div className="merkuze-widget-avatar">ም</div>
              <div>
                <p className="merkuze-widget-title">Merkuze · ምርኩዜ</p>
                <p className="merkuze-widget-sub">
                  24/7 supporter at ጥቁር አንበሳ ሆስፒታል
                </p>
              </div>
            </div>
            <button
              type="button"
              className="merkuze-widget-close"
              onClick={handleToggle}
            >
              ✕
            </button>
          </header>

          <div className="merkuze-widget-body" ref={listRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`merkuze-msg merkuze-msg-${m.role}`}
              >
                <p>{m.text}</p>
              </div>
            ))}
            {isTyping && (
              <div className="merkuze-msg merkuze-msg-bot merkuze-msg-typing">
                <span className="merkuze-dot" />
                <span className="merkuze-dot" />
                <span className="merkuze-dot" />
                <span className="merkuze-typing-label">Merkuze is typing…</span>
              </div>
            )}
          </div>

          <form className="merkuze-widget-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              className="merkuze-input"
              placeholder="Ask about departments, tests, or medicines…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="merkuze-send-btn"
              disabled={!input.trim()}
            >
              Send
            </button>
          </form>
        </section>
      )}
    </>
  );
}

export default MerkuzeChatWidget;

