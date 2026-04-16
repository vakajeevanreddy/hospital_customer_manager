import React from "react";

export default function InteractionForm({ formData, onFormChange, onSave }) {
    const handleChange = (field, value) => {
        onFormChange({ ...formData, [field]: value });
    };

    return (
        <div className="glass-card">
            <h3>Log Medical Interaction</h3>
            <div className="form-grid">
                {/* Section 1: HCP & Healthcare Entity Info */}
                <div className="form-group">
                    <label>HCP Name</label>
                    <input
                        type="text"
                        placeholder="Dr. Name..."
                        value={formData.hcp_name || ""}
                        onChange={(e) => handleChange("hcp_name", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Medical Specialty</label>
                    <input
                        type="text"
                        placeholder="Oncology, Cardiology, etc."
                        value={formData.specialty || ""}
                        onChange={(e) => handleChange("specialty", e.target.value)}
                    />
                </div>
                <div className="form-group full-width">
                    <label>Healthcare Organization / Hospital</label>
                    <input
                        type="text"
                        placeholder="Hospital, Clinic, or Pharmacy name..."
                        value={formData.organization || ""}
                        onChange={(e) => handleChange("organization", e.target.value)}
                    />
                </div>

                {/* Section 2: Product & Interaction Details */}
                <div className="form-group">
                    <label>Drug or Disease Discussed</label>
                    <input
                        type="text"
                        placeholder="Drug or Disease discussed..."
                        value={formData.product_focus || ""}
                        onChange={(e) => handleChange("product_focus", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Interaction Type</label>
                    <select
                        value={formData.interaction_type || "Meeting"}
                        onChange={(e) => handleChange("interaction_type", e.target.value)}
                    >
                        <option value="Meeting">Meeting</option>
                        <option value="Call">Call</option>
                        <option value="Email">Email</option>
                        <option value="Conference">Conference</option>
                        <option value="Medical Inquiry">Medical Inquiry</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        value={formData.date || ""}
                        onChange={(e) => handleChange("date", e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Time</label>
                    <input
                        type="time"
                        value={formData.time || ""}
                        onChange={(e) => handleChange("time", e.target.value)}
                    />
                </div>

                <div className="form-group full-width">
                    <label>Attendees (KOLs / Staff)</label>
                    <input
                        type="text"
                        placeholder="Enter names or research colleagues..."
                        value={formData.attendees || ""}
                        onChange={(e) => handleChange("attendees", e.target.value)}
                    />
                </div>
                <div className="form-group full-width">
                    <label>Scientific Topics Discussed</label>
                    <textarea
                        rows="3"
                        placeholder="Clinical data, efficacy, safety profile..."
                        value={formData.topics_discussed || ""}
                        onChange={(e) => handleChange("topics_discussed", e.target.value)}
                    />
                </div>
                <div className="form-group full-width">
                    <label>AI Voice Summary</label>
                    <textarea
                        rows="4"
                        placeholder="AI will summarize your medical notes here..."
                        value={formData.voice_summary || ""}
                        onChange={(e) => handleChange("voice_summary", e.target.value)}
                    />
                </div>
                
                <div className="form-group full-width">
                    <label>HCP Sentiment / Reaction</label>
                    <div className="observation-toggle">
                        <button 
                            className={`obs-btn positive ${formData.observation === 'Positive' ? 'active' : ''}`}
                            onClick={() => handleChange("observation", "Positive")}
                        >
                            Interested
                        </button>
                        <button 
                            className={`obs-btn neutral ${formData.observation === 'Neutral' ? 'active' : ''}`}
                            onClick={() => handleChange("observation", "Neutral")}
                        >
                            Neutral
                        </button>
                        <button 
                            className={`obs-btn negative ${formData.observation === 'Negative' ? 'active' : ''}`}
                            onClick={() => handleChange("observation", "Negative")}
                        >
                            Skeptical
                        </button>
                    </div>
                </div>

                <div className="form-group full-width">
                    <label>Next Clinical Steps</label>
                    <textarea
                        rows="3"
                        placeholder="Trial info, follow-up meeting..."
                        value={formData.follow_up_actions || ""}
                        onChange={(e) => handleChange("follow_up_actions", e.target.value)}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={onSave}>Save Medical Interaction</button>
            </div>
        </div>
    );
}