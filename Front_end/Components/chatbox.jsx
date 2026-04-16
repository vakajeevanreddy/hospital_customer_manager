import { useState } from "react";
import axios from "axios";

export default function ChatBox({ onFormUpdate }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);

    // Preprocess input into structured fields that match InteractionForm.jsx
    const preprocessInput = (input) => {
        const payload = {};

        const nameMatch = input.match(/name\s+([A-Za-z\s.]+)/i);
        if (nameMatch) payload.hcp_name = nameMatch[1].trim();

        const specialtyMatch = input.match(/specialty\s+([A-Za-z\s]+)/i);
        if (specialtyMatch) payload.specialty = specialtyMatch[1].trim();

        const hospitalMatch = input.match(/hospital\s+([A-Za-z\s,]+)/i);
        if (hospitalMatch) payload.organization = hospitalMatch[1].trim();

        const drugMatch = input.match(/drug\s+(.+?)(?=\s+and|$)/i) || input.match(/disease\s+(.+?)(?=\s+and|$)/i);
        if (drugMatch) payload.product_focus = drugMatch[1].trim();

        const interactionMatch = input.match(/interaction\s+([A-Za-z]+)/i);
        if (interactionMatch) payload.interaction_type = interactionMatch[1].trim();

        const dateMatch = input.match(/date\s+([0-9-]+)/i);
        if (dateMatch) payload.date = dateMatch[1].trim();

        const timeMatch = input.match(/time\s+([0-9:]+)/i);
        if (timeMatch) payload.time = timeMatch[1].trim();

        const attendeesMatch = input.match(/attendees\s+(.+)/i) || input.match(/staff\s+(.+)/i);
        if (attendeesMatch) payload.attendees = attendeesMatch[1].trim();

        return payload;
    };

    const sendMessage = async () => {
        if (!input) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);

        try {
            const structuredPayload = preprocessInput(input);

            const res = await axios.post("http://127.0.0.1:8000/ai-assistant", {
                message: input,          // raw text for logging
                fields: structuredPayload // structured fields for backend
            });

            // Update messages
            const botMsg = { role: "bot", text: JSON.stringify(res.data) };
            setMessages(prev => [...prev, botMsg]);
            setInput("");

            // Update the form with returned fields
            if (res.data.updated_fields && onFormUpdate) {
                onFormUpdate(res.data.updated_fields);
            }
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
