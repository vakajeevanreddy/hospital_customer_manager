import React, { useState } from "react";
import AIAssistant from "./Components/AIAssistant";
import InteractionForm from "./Components/InteractionForm";
import InteractionHistory from "./Components/interactionhistory";
import "./styles.css";

const initialFormData = {
    hcp_name: "",
    specialty: "",
    organization: "",
    product_focus: "",
    interaction_type: "",
    date: "",
    time: "",
    attendees: "",
    topics_discussed: "",
    voice_summary: "",
    sentiment: "",
    follow_up_actions: "",
    materials_shared: "",
    samples_distributed: "",
    suggested_references: "",
    observation: "",
};

// Canonical key mapping to handle LLM field name variations
const keyMap = {
    hcpname: "hcp_name", hcp_name: "hcp_name", doctor: "hcp_name", physician: "hcp_name",
    specialty: "specialty", therapeuticarea: "specialty", department: "specialty",
    organization: "organization", hospital: "organization", clinic: "organization",
    facility: "organization", location: "organization",
    product: "product_focus", drug: "product_focus", product_focus: "product_focus",
    productfocus: "product_focus", disease: "product_focus",
    interactiontype: "interaction_type", interaction_type: "interaction_type", type: "interaction_type",
    interaction: "interaction_type", method: "interaction_type",
    date: "date", time: "time",
    attendees: "attendees", staff: "attendees", people: "attendees",
    topicsdiscussed: "topics_discussed", topics_discussed: "topics_discussed",
    topics: "topics_discussed", discussion: "topics_discussed",
    voicesummary: "voice_summary", voice_summary: "voice_summary", summary: "voice_summary",
    observation: "observation", sentiment: "sentiment", reaction: "observation",
    followupactions: "follow_up_actions", follow_up_actions: "follow_up_actions",
    actions: "follow_up_actions", nextsteps: "follow_up_actions",
    materialsshared: "materials_shared", materials_shared: "materials_shared", materials: "materials_shared",
    samplesdistributed: "samples_distributed", samples_distributed: "samples_distributed", samples: "samples_distributed",
    suggestedreferences: "suggested_references", suggested_references: "suggested_references", references: "suggested_references",
};

function normalizeTime(val) {
    if (!val) return "";
    const str = String(val).trim().toUpperCase();
    // Handle "10:00 AM", "2:30 PM", etc.
    const ampmMatch = str.match(/^(\d{1,2})[:\.]?(\d{2})?\s*(AM|PM)$/i);
    if (ampmMatch) {
        let h = parseInt(ampmMatch[1], 10);
        const m = ampmMatch[2] || "00";
        const period = ampmMatch[3].toUpperCase();
        if (period === "PM" && h < 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return `${String(h).padStart(2, "0")}:${m}`;
    }
    // Handle "10:00" already in 24h
    const match24 = str.match(/^(\d{1,2})[:\.](\d{2})$/);
    if (match24) {
        return `${match24[1].padStart(2, "0")}:${match24[2]}`;
    }
    return val;
}

function normalizeAIData(updates) {
    const sanitized = {};
    Object.entries(updates).forEach(([key, value]) => {
        const normKey = key.toLowerCase().replace(/[_\s-]/g, "");
        const canonical = keyMap[normKey] || keyMap[key];
        if (canonical && value !== undefined && value !== null && value !== "") {
            let finalValue = String(value);
            // Normalize time to HH:mm for HTML time input
            if (canonical === "time") {
                finalValue = normalizeTime(value);
            }
            sanitized[canonical] = finalValue;
        }
    });
    return sanitized;
}

const App = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [flashFields, setFlashFields] = useState([]);

    const handleAIUpdate = (aiFormData) => {
        const normalized = normalizeAIData(aiFormData);
        const changedKeys = Object.keys(normalized);

        setFormData((prev) => ({ ...prev, ...normalized }));

        // Trigger flash animation on changed fields
        setFlashFields(changedKeys);
        setTimeout(() => setFlashFields([]), 1500);
    };

    const handleSaved = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <div className="dashboard-container">
            {/* Left Panel: Form + History */}
            <div className="form-panel">
                <div className="form-panel-header">
                    <div>
                        <h1>AIVOA CRM</h1>
                        <div className="subtitle">Healthcare Professional Interaction Portal</div>
                    </div>
                </div>
                <div className="form-scroll">
                    <InteractionForm
                        formData={formData}
                        setFormData={setFormData}
                        flashFields={flashFields}
                        onSaved={handleSaved}
                    />
                    <InteractionHistory refreshTrigger={refreshTrigger} />
                </div>
            </div>

            {/* Right Panel: AI Assistant */}
            <div className="ai-panel">
                <AIAssistant
                    formData={formData}
                    onAIUpdate={handleAIUpdate}
                />
            </div>
        </div>
    );
};

export default App;
