import { Bot, Send, Sparkles, X } from "lucide-react";
export default function ChefModal({
  messages,
  input,
  onInput,
  onSend,
  onClose,
}: {
  messages: string[];
  input: string;
  onInput: (v: string) => void;
  onSend: () => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="chef-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chef-header">
          <div className="chef-icon">
            <Bot size={23} />
          </div>
          <div>
            <span className="eyebrow">Gemini ile güçlendirilir</span>
            <h2>AI Şef</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="chef-intro">
          <Sparkles size={18} />
          <p>Mutfağındaki malzemeleri yaz, sana yaratıcı bir tarif önereyim.</p>
        </div>
        <div className="chat-log">
          {!messages.length && (
            <div className="assistant-bubble">
              Merhaba! Bugün mutfakta ne var? 👋
            </div>
          )}
          {messages.map((m, i) => (
            <div
              className={i % 2 ? "assistant-bubble" : "user-bubble"}
              key={`${m}-${i}`}
            >
              {m}
            </div>
          ))}
        </div>
        <div className="chef-input">
          <input
            value={input}
            onChange={(e) => onInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="Örn. nohut, ıspanak ve yoğurt..."
          />
          <button onClick={onSend} aria-label="Gönder">
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
