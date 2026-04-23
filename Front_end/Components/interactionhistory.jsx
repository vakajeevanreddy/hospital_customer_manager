import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const InteractionHistory = ({ refreshTrigger }) => {
    const [interactions, setInteractions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_URL}/interactions`);
            if (!res.ok) throw new Error(`Backend error: ${res.status}`);
            const data = await res.json();
            setInteractions(data);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [refreshTrigger]);

    if (loading) {
        return <div className="loading-spinner" />;
    }

    if (interactions.length === 0) {
        return (
            <div className="glass-card history-card">
                <div className="card-title">
                    <span className="icon">📜</span> Interaction History
                </div>
                <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <div>No interactions saved yet</div>
                    <div style={{ fontSize: "0.78rem", marginTop: "0.3rem" }}>
                        Use the AI assistant or fill the form to create one
                    </div>
                </div>
            </div>
        );
    }

    const getSentimentClass = (sentiment) => {
        const s = (sentiment || "").toLowerCase();
        if (s.includes("interest") || s.includes("positive")) return "interested";
        if (s.includes("skeptic") || s.includes("negative")) return "skeptical";
        return "neutral";
    };

    return (
        <div className="glass-card history-card">
            <div className="card-title">
                <span className="icon">📜</span> Interaction History ({interactions.length})
            </div>

            {interactions.map((item, index) => (
                <div key={item.id || index} className="history-item">
                    <div className="hi-header">
                        <div>
                            <div className="hi-name">{item.hcp_name || "Unknown HCP"}</div>
                            <div className="hi-meta">
                                {item.specialty && `${item.specialty} · `}
                                {item.organization || "No organization"}
                            </div>
                        </div>
                        {item.sentiment && (
                            <span className={`hi-badge ${getSentimentClass(item.sentiment)}`}>
                                {item.sentiment}
                            </span>
                        )}
                    </div>
                    <div className="hi-meta">
                        {item.interaction_type || "Interaction"}
                        {item.date && ` · ${item.date}`}
                        {item.time && ` at ${item.time}`}
                    </div>
                    <div className="hi-details">
                        {item.product_focus && (
                            <>
                                <span className="hi-detail-label">Product:</span>
                                <span className="hi-detail-value">{item.product_focus}</span>
                            </>
                        )}
                        {item.attendees && (
                            <>
                                <span className="hi-detail-label">Attendees:</span>
                                <span className="hi-detail-value">{item.attendees}</span>
                            </>
                        )}
                        {item.follow_up_actions && (
                            <>
                                <span className="hi-detail-label">Follow-up:</span>
                                <span className="hi-detail-value">{item.follow_up_actions}</span>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InteractionHistory;
