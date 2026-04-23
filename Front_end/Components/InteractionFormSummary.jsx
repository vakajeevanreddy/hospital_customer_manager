import React, { useState } from "react";
import ToastNotification from "./Toastnotification"; // ✅ ensure correct filename

const InteractionSummary = ({ formData }) => {
    const [toast, setToast] = useState({ message: "", type: "" });

    if (!formData || Object.keys(formData).length === 0) {
        return (
            <div className="alert alert-info">
                No interaction details extracted yet.
            </div>
        );
    }

    const handleSave = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/interactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData), // ✅ snake_case keys
            });

            if (!res.ok) throw new Error(`Backend error: ${res.status}`);
            await res.json();
            setToast({ message: "✅ Interaction saved successfully!", type: "success" });
        } catch (error) {
            console.error("Error saving interaction:", error);
            setToast({ message: "❌ Failed to save interaction", type: "error" });
        }
    };

    return (
        <>
            <div className="card shadow-sm p-3 mt-3">
                <h6 className="fw-bold mb-3">Review Extracted Interaction</h6>
                <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item"><strong>HCP Name:</strong> {formData.hcp_name}</li>
                    <li className="list-group-item"><strong>Specialty:</strong> {formData.specialty}</li>
                    <li className="list-group-item"><strong>Organization:</strong> {formData.organization}</li>
                    <li className="list-group-item"><strong>Product Focus:</strong> {formData.product_focus}</li>
                    <li className="list-group-item"><strong>Interaction Type:</strong> {formData.interaction_type}</li>
                    <li className="list-group-item"><strong>Date:</strong> {formData.date}</li>
                    <li className="list-group-item"><strong>Time:</strong> {formData.time}</li>
                    <li className="list-group-item"><strong>Attendees:</strong> {formData.attendees}</li>
                    <li className="list-group-item"><strong>Topics Discussed:</strong> {formData.topics_discussed}</li>
                    <li className="list-group-item"><strong>Voice Summary:</strong> {formData.voice_summary}</li>
                    <li className="list-group-item"><strong>Sentiment:</strong> {formData.sentiment}</li>
                    <li className="list-group-item"><strong>Follow-up Actions:</strong> {formData.follow_up_actions}</li>
                </ul>

                <button className="btn btn-success w-100" onClick={handleSave}>
                    💾 Save Interaction
                </button>
            </div>

            <ToastNotification
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: "", type: "" })}
            />
        </>
    );
};

export default InteractionSummary;
