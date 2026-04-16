import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AIAssistant({ onAIUpdate, currentData }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! I'm your AI CRM Assistant. You can describe your interaction with an HCP here (e.g., 'Met Dr. Smith today about Product X, positive feedback'), and I'll fill out the form for you." }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/ai-chat", {
                message: input,
                context: currentData
            });

            const aiMsg = { 
                role: "ai", 
                text: response.data.ai_response || "I've processed that for you." 
            };
            
            setMessages(prev => [...prev, aiMsg]);

            if (response.data.form_data) {
                onAIUpdate(response.data.form_data);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            const errorDetail = error.response ? JSON.stringify(error.response.data) : error.message;
            setMessages(prev => [...prev, { 
                role: "ai", 
                text: `Connection Error: ${errorDetail}. Please make sure the backend server at 127.0.0.1:8000 is running.` 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-assistant-panel">
            <h3>AI Assistant</h3>
            <div className="chat-history">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.text}
                    </div>
                ))}
                {isLoading && <div className="message ai">...</div>}
                <div ref={chatEndRef} />
            </div>
            <div className="chat-input-area">
                <input
                    type="text"
                    placeholder="Describe interaction..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="btn btn-primary" onClick={handleSend} disabled={isLoading}>
                    Submit
                </button>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Tip: You can say "change date to tomorrow" or "summarize my notes".
            </div>
        </div>
    );
}
