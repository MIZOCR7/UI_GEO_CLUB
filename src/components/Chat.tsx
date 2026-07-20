import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function Chat({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askGeologyProfessor = async (userQuestion: string): Promise<string> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userQuestion, history: [] }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.response || `Server error: ${response.status}`);
      }

      return data.response || data.reply || data.message || data.answer || "";
    } catch (postErr) {
      if ((postErr as Error).name === "AbortError") {
        throw postErr;
      }

      const encodedMessage = encodeURIComponent(userQuestion);
      const response = await fetch(`/api/chat?message=${encodedMessage}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(180000),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || data.reply || data.message || data.answer || "";
    } finally {
      clearTimeout(timeout);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const reply = await askGeologyProfessor(text);
      setMessages((prev) => [...prev, { role: "ai", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "عذراً، حدث خطأ في الاتصال بسيرفر الأستاذ الآلي." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#EAD8C3",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 20px",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 22,
            color: "#2B1B10",
            padding: "4px 8px",
          }}
        >
          ←
        </button>
        <span style={{ fontWeight: 600, fontSize: 17, color: "#2B1B10" }}>
          Geology AI Professor
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
        {messages.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#8B7D72",
              marginTop: 60,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fff",
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              🌋
            </div>
            <div style={{ fontWeight: 600, color: "#2B1B10", fontSize: 16 }}>
              Ask me anything about Geology
            </div>
            <div style={{ marginTop: 4 }}>
              Rocks, minerals, fossils, earth science & more
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 14,
              maxWidth: "88%",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: msg.role === "user" ? "#C29B6D" : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              {msg.role === "user" ? "👤" : "🌋"}
            </div>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 16,
                fontSize: 15,
                lineHeight: 1.65,
                wordBreak: "break-word",
                background: msg.role === "user" ? "#2B1B10" : "#fff",
                color: msg.role === "user" ? "#fff" : "#2B1B10",
                borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                borderBottomLeftRadius: msg.role === "user" ? 16 : 4,
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🌋
            </div>
            <div
              style={{
                padding: "14px 20px",
                borderRadius: 16,
                background: "#fff",
                display: "flex",
                gap: 4,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C29B6D", animation: "dotPulse 1.2s infinite ease-in-out" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C29B6D", animation: "dotPulse 1.2s infinite ease-in-out", animationDelay: "0.2s" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C29B6D", animation: "dotPulse 1.2s infinite ease-in-out", animationDelay: "0.4s" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          background: "#EAD8C3",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            background: "#fff",
            borderRadius: 9999,
            padding: "6px 6px 6px 20px",
            border: "1px solid rgba(0,0,0,0.04)",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about geology..."
            disabled={loading}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15,
              color: "#2B1B10",
              padding: "12px 0",
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: 9999,
              background: input.trim() && !loading ? "#C29B6D" : "#ccc",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              cursor: input.trim() && !loading ? "pointer" : "default",
              fontFamily: "'Inter', sans-serif",
              transition: "background 0.2s",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
