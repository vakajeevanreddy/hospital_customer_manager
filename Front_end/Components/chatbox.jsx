// ✅ imports must be first
import React, { useState } from "react";
import "./styles.css"; // your custom styles
import "bootstrap/dist/css/bootstrap.min.css"; // bootstrap styles

const ChatBox = ({ onExtract }) => {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [response, setResponse] = useState(""); // ✅ show assistant reply

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setError("");
        setResponse("");
        try {
            // ✅ Use VITE_API_URL from .env.development
            const res = await fetch(`${import.meta.env.VITE_API_URL}/ai-assistant`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });

            if (!res.ok) {
                throw new Error(`Backend error: ${res.status}`);
            }

            const data = await res.json();

            // ✅ update parent formData
            if (data.formData) {
                onExtract(data.formData);
            }

            // ✅ show assistant response
            setResponse(data.response || "No response");

            // clear input after success
            setInput("");
        } catch (err) {
            console.error("Error in ChatBox:", err);
            setError("❌ Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-3 shadow-sm">
            <h5>AI Assistant</h5>
            <form onSubmit={handleSubmit} className="d-flex align-items-center mb-3">
                <input
                    type="text"
                    className="form-control me-2 chatbox-input"
                    placeholder="Type interaction details here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="btn btn-primary chatbox-button"
                    disabled={loading}
                >
                    {loading ? "Sending..." : "Send"}
                </button>
            </form>

            {/* ✅ show errors or assistant response */}
            {error && <div className="text-danger mt-2">{error}</div>}
            {response && <div className="text-success mt-2">{response}</div>}
        </div>
    );
};

export default ChatBox;
