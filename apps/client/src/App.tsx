import { useState } from "react";

type Message = {
  role: "user" | "agent" | "status";
  text: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    setLoading(true);

    // Add user message
    setMessages((m) => [...m, { role: "user", text: input }]);

    // Show status
    setMessages((m) => [...m, { role: "status", text: "Agent is working..." }]);

    const userInput = input;
    setInput("");

    try {
      const res = await fetch("http://localhost:4000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: userInput }),
      });

      const data = await res.json();

      // Remove status line and add reply
      setMessages((m) => [
        ...m.filter((msg) => msg.role !== "status"),
        { role: "agent", text: data.reply }
      ]);

    } catch (err) {
      console.log(err)
      setMessages((m) => [
        ...m.filter((msg) => msg.role !== "status"),
        { role: "agent", text: "⚠️ Error contacting agent." }
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={{ margin: 50 }}>
      <h2>MCP Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 20,
          height: 400,
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: "10px 0",
              color:
                msg.role === "user"
                  ? "blue"
                  : msg.role === "agent"
                  ? "green"
                  : "gray",
              fontStyle: msg.role === "status" ? "italic" : "normal",
            }}
          >
            <strong>{msg.role !== "status" ? msg.role + ":" : ""}</strong>{" "}
            {msg.text}
          </div>
        ))}
      </div>

      <input
        style={{ width: "80%", padding: 10, marginTop: 20 }}
        value={input}
        disabled={loading}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder={loading ? "Agent is thinking..." : "Message the agent..."}
      />

      <button style={{ padding: 10, marginLeft: 10 }} onClick={sendMessage} disabled={loading}>
        {loading ? "Working..." : "Send"}
      </button>
    </div>
  );
}
