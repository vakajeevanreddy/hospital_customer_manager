import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const InteractionForm = ({ formData = {}, setFormData, flashFields = [], onSaved }) => {
    const [status, setStatus] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatus("");

        try {
            const res = await fetch(`${API_URL}/interactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error(`Backend error: ${res.status}`);
            await res.json();

            setStatus("success");
            if (onSaved) onSaved();

            // Auto-clear status after 3s
            setTimeout(() => setStatus(""), 3000);
        } catch (error) {
            console.error("Error saving interaction:", error);
            setStatus("error");
            setTimeout(() => setStatus(""), 4000);
        } finally {
            setSaving(false);
        }
    };

    // Helper: get flash class for a field
    const flashClass = (fieldName) =>
        flashFields.includes(fieldName) ? "ai-flash-field" : "";

    return (
        <form onSubmit={handleSubmit}>
            {/* HCP Details */}
            <div className="glass-card">
                <div className="card-title">
                    <span className="icon">👤</span> HCP Details
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="hcp_name">HCP Name</label>
                        <input
                            id="hcp_name"
                            name="hcp_name"
                            className={flashClass("hcp_name")}
                            placeholder="e.g. Dr. Sharma"
                            value={formData.hcp_name || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="specialty">Specialty</label>
                        <input
                            id="specialty"
                            name="specialty"
                            className={flashClass("specialty")}
                            placeholder="e.g. Cardiologist"
                            value={formData.specialty || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="organization">Organization</label>
                        <input
                            id="organization"
                            name="organization"
                            className={flashClass("organization")}
                            placeholder="e.g. Apollo Hospital"
                            value={formData.organization || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="product_focus">Product Focus</label>
                        <input
                            id="product_focus"
                            name="product_focus"
                            className={flashClass("product_focus")}
                            placeholder="e.g. DrugX"
                            value={formData.product_focus || ""}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* Interaction Details */}
            <div className="glass-card">
                <div className="card-title">
                    <span className="icon">📋</span> Interaction Details
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="interaction_type">Interaction Type</label>
                        <select
                            id="interaction_type"
                            name="interaction_type"
                            className={flashClass("interaction_type")}
                            value={formData.interaction_type || ""}
                            onChange={handleChange}
                        >
                            <option value="">Select type</option>
                            <option value="Meeting">Meeting</option>
                            <option value="Call">Call</option>
                            <option value="Email">Email</option>
                            <option value="Conference">Conference</option>
                            <option value="Medical Inquiry">Medical Inquiry</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="attendees">Attendees</label>
                        <input
                            id="attendees"
                            name="attendees"
                            className={flashClass("attendees")}
                            placeholder="e.g. Dr. Rao, Team"
                            value={formData.attendees || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            className={flashClass("date")}
                            value={formData.date || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input
                            id="time"
                            name="time"
                            type="time"
                            className={flashClass("time")}
                            value={formData.time || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="topics_discussed">Topics Discussed</label>
                        <textarea
                            id="topics_discussed"
                            name="topics_discussed"
                            className={flashClass("topics_discussed")}
                            placeholder="Key discussion points..."
                            value={formData.topics_discussed || ""}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Summary & Sentiment */}
            <div className="glass-card">
                <div className="card-title">
                    <span className="icon">📝</span> Summary & Assessment
                </div>
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label htmlFor="voice_summary">Voice Summary</label>
                        <textarea
                            id="voice_summary"
                            name="voice_summary"
                            className={flashClass("voice_summary")}
                            placeholder="Summary of the interaction..."
                            value={formData.voice_summary || ""}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label>Sentiment</label>
                        <div className="sentiment-group">
                            {[
                                { label: "💚 Interested", value: "Interested", cls: "interested" },
                                { label: "😐 Neutral", value: "Neutral", cls: "neutral" },
                                { label: "⚠️ Skeptical", value: "Skeptical", cls: "skeptical" },
                            ].map((s) => (
                                <button
                                    key={s.value}
                                    type="button"
                                    className={`sentiment-btn ${formData.sentiment === s.value ? `active ${s.cls}` : ""}`}
                                    onClick={() => setFormData((prev) => ({ ...prev, sentiment: s.value }))}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="follow_up_actions">Follow-up Actions</label>
                        <textarea
                            id="follow_up_actions"
                            name="follow_up_actions"
                            className={flashClass("follow_up_actions")}
                            placeholder="Next steps..."
                            value={formData.follow_up_actions || ""}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Additional Details */}
            <div className="glass-card">
                <div className="card-title">
                    <span className="icon">📦</span> Additional Details
                </div>
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="materials_shared">Materials Shared</label>
                        <input
                            id="materials_shared"
                            name="materials_shared"
                            className={flashClass("materials_shared")}
                            placeholder="e.g. Brochures, Papers"
                            value={formData.materials_shared || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="samples_distributed">Samples Distributed</label>
                        <input
                            id="samples_distributed"
                            name="samples_distributed"
                            className={flashClass("samples_distributed")}
                            placeholder="e.g. DrugX samples"
                            value={formData.samples_distributed || ""}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="suggested_references">Suggested References</label>
                        <textarea
                            id="suggested_references"
                            name="suggested_references"
                            className={flashClass("suggested_references")}
                            placeholder="Reference materials..."
                            value={formData.suggested_references || ""}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="observation">Observation</label>
                        <textarea
                            id="observation"
                            name="observation"
                            className={flashClass("observation")}
                            placeholder="Key observations..."
                            value={formData.observation || ""}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <button type="submit" className="btn-save" disabled={saving}>
                {saving ? "Saving..." : "💾 Save Interaction"}
            </button>

            {status === "success" && (
                <div className="status-toast success">✅ Interaction saved successfully!</div>
            )}
            {status === "error" && (
                <div className="status-toast error">❌ Failed to save. Is the backend running?</div>
            )}
        </form>
    );
};

export default InteractionForm;
