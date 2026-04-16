import { useState } from "react";
import axios from "axios";

export default function ChatBox() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (!input) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);

        try {
            const res = await axios.post("http://localhost:8000/ai-chat", {
                message: input,
            });

            const botMsg = { role: "bot", text: JSON.stringify(res.data) };

            setMessages(prev => [...prev, botMsg]);
            setInput("");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>AI CRM Assistant</h2>

            <div style={{ height: 300, overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ margin: "10px 0" }}>
                        <b>{msg.role}:</b> {msg.text}
                    </div>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your interaction..."
                style={{ width: "80%", padding: 10 }}
            />

            <button onClick={sendMessage}>Send</button>
        </div>
    );
}