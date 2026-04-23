import React, { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AIAssistant = ({ formData, onAIUpdate }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading) return;

        // Add user message immediately
        setMessages((prev) => [...prev, { role: "user", content: text }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/ai-assistant`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text, formData }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);

            const data = await res.json();

            // Add AI response to chat
            const reply = data.response || "Extraction complete.";
            setMessages((prev) => [...prev, { role: "ai", content: reply }]);

            // Update form fields via parent callback
            if (data.formData && typeof data.formData === "object") {
                onAIUpdate(data.formData);
            }
        } catch (error) {
            console.error("AI Assistant error:", error);
            setMessages((prev) => [
                ...prev,
                { role: "ai", content: "⚠️ Connection failed. Make sure the backend is running on port 8000." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Build extracted fields display from formData
    const filledFields = Object.entries(formData || {}).filter(
        ([, v]) => v && v !== ""
    );

    return (
        <>
            {/* Header */}
            <div className="ai-panel-header">
                <h2>
                    <span className="ai-dot"></span>
                    AI Assistant
                </h2>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                    Describe an interaction and I'll extract the details
                </p>
            </div>

            {/* Chat Messages */}
            <div className="chat-area">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">💬</div>
                        <div>Start by describing a medical interaction</div>
                        <div style={{ fontSize: "0.78rem", marginTop: "0.5rem", color: "var(--text-muted)" }}>
                            e.g. "Meeting with Dr. Sharma, cardiologist at Apollo Hospital tomorrow 10 AM about DrugX"
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`chat-msg ${msg.role}`}>
                        <div className="msg-label">
                            {msg.role === "user" ? "You" : "AIVOA"}
                        </div>
                        <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                    </div>
                ))}

                {loading && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}

                <div ref={chatEndRef} />
            </div>

            {/* Extracted Fields Summary */}
            {filledFields.length > 0 && (
                <div className="extracted-panel">
                    <div style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        marginBottom: "0.5rem"
                    }}>
                        Extracted Fields
                    </div>
                    <div className="extracted-grid">
                        {filledFields.slice(0, 8).map(([key, value]) => (
                            <div key={key} className="extracted-item">
                                <div className="ext-label">{key.replace(/_/g, " ")}</div>
                                <div className="ext-value">{String(value).substring(0, 40)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Chat Input */}
            <form className="chat-input-area" onSubmit={sendMessage}>
                <input
                    type="text"
                    placeholder="Describe an interaction..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="btn-send"
                    disabled={loading || !input.trim()}
                >
                    {loading ? "..." : "Send →"}
                </button>
            </form>
        </>
    );
};

export default AIAssistant;
