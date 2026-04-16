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

    // Parse all fields from one input
    const preprocessInput = (input) => {
        const payload = {};

        const nameMatch = input.match(/name\s+(.+?)(?=\s+and|$)/i);
        if (nameMatch) payload.hcp_name = nameMatch[1].trim();

        const specialtyMatch = input.match(/specialty\s+(.+?)(?=\s+and|$)/i);
        if (specialtyMatch) payload.specialty = specialtyMatch[1].trim();

        const hospitalMatch = input.match(/hospital\s+(.+?)(?=\s+and|$)/i);
        if (hospitalMatch) payload.organization = hospitalMatch[1].trim();

        const drugMatch = input.match(/drug\s+(.+?)(?=\s+and|$)/i) || input.match(/disease\s+(.+?)(?=\s+and|$)/i);
        if (drugMatch) payload.product_focus = drugMatch[1].trim();

        const interactionMatch = input.match(/interaction\s+(.+?)(?=\s+and|$)/i);
        if (interactionMatch) payload.interaction_type = interactionMatch[1].trim();

        const dateMatch = input.match(/date\s+([0-9]{2}-[0-9]{2}-[0-9]{4})/i);
        if (dateMatch) {
            const [day, month, year] = dateMatch[1].split("-");
            payload.date = `${year}-${month}-${day}`; // convert to YYYY-MM-DD
        }

        const timeMatch = input.match(/time\s+([0-9]{1,2}:[0-9]{2})/i);
        if (timeMatch) payload.time = timeMatch[1].trim();

        const attendeesMatch = input.match(/attendees\s+(.+?)(?=\s+and|$)/i) || input.match(/staff\s+(.+?)(?=\s+and|$)/i);
        if (attendeesMatch) payload.attendees = attendeesMatch[1].trim();

        const topicsMatch = input.match(/topics\s+(.+?)(?=\s+and|$)/i);
        if (topicsMatch) payload.topics_discussed = topicsMatch[1].trim();

        const summaryMatch = input.match(/summary\s+(.+?)(?=\s+and|$)/i);
        if (summaryMatch) payload.voice_summary = summaryMatch[1].trim();

        const sentimentMatch = input.match(/sentiment\s+(Positive|Neutral|Negative)/i);
        if (sentimentMatch) payload.observation = sentimentMatch[1].trim();

        const stepsMatch = input.match(/steps\s+(.+?)(?=\s+and|$)/i);
        if (stepsMatch) payload.follow_up_actions = stepsMatch[1].trim();

        return payload;
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const structuredPayload = preprocessInput(input);

            const response = await axios.post("http://127.0.0.1:8000/ai-assistant", {
                message: input,
                fields: structuredPayload,
                formData: currentData
            });

            const aiMsg = {
                role: "ai",
                text: response.data.ai_response || "I've processed that for you."
            };
            setMessages(prev => [...prev, aiMsg]);

            // ✅ Only update if we actually parsed something
            if (structuredPayload && Object.keys(structuredPayload).length > 0) {
                onAIUpdate(structuredPayload);
            } else if (response.data.form_data) {
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
