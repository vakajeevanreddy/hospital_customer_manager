import React, { useState } from "react";
import InteractionForm from "../Components/InteractionForm";
import AIAssistant from "../Components/AIAssistant";
import axios from "axios";
import "../styles.css";

export default function Dashboard() {
    const [formData, setFormData] = useState({
        hcp_name: "",
        specialty: "",
        organization: "",
        product_focus: "",
        interaction_type: "Meeting",
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5),
        attendees: "",
        topics_discussed: "",
        voice_summary: "",
        materials_shared: "",
        samples_distributed: "",
        observation: "Neutral",
        follow_up_actions: "",
        suggested_references: ""
    });
    const [isUpdating, setIsUpdating] = useState(false);

    // Canonical key mapping to handle LLM variations across medical/pharma entities
    const keyMap = {
        hcpname: "hcp_name",
        hcp_name: "hcp_name",
        doctor: "hcp_name",
        physician: "hcp_name",
        specialty: "specialty",
        therapeuticarea: "specialty",
        department: "specialty",
        organization: "organization",
        hospital: "organization",
        clinic: "organization",
        pharmacy: "organization",
        facility: "organization",
        location: "organization",
        product: "product_focus",
        drug: "product_focus",
        product_focus: "product_focus",
        productfocus: "product_focus",
        disease: "product_focus",
        interactiontype: "interaction_type",
        interaction_type: "interaction_type",
        type: "interaction_type",
        date: "date",
        time: "time",
        attendees: "attendees",
        staff: "attendees",
        people: "attendees",
        topicsdiscussed: "topics_discussed",
        topics_discussed: "topics_discussed",
        topics: "topics_discussed",
        discussion: "topics_discussed",
        voicesummary: "voice_summary",
        voice_summary: "voice_summary",
        summary: "voice_summary",
        observation: "observation",
        sentiment: "observation",
        reaction: "observation",
        followupactions: "follow_up_actions",
        follow_up_actions: "follow_up_actions",
        actions: "follow_up_actions",
        nextsteps: "follow_up_actions",
        materialsshared: "materials_shared",
        materials_shared: "materials_shared",
        materials: "materials_shared",
        samplesdistributed: "samples_distributed",
        samples_distributed: "samples_distributed",
        samples: "samples_distributed",
        suggestedreferences: "suggested_references",
        suggested_references: "suggested_references",
        references: "suggested_references"
    };

    const handleAIUpdate = (updates) => {
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 1000);

        const sanitizedUpdates = {};
        
        Object.entries(updates).forEach(([key, value]) => {
            const normalizedKey = key.toLowerCase().replace(/[_\s-]/g, '');
            const canonicalKey = keyMap[normalizedKey];

            if (canonicalKey && value !== undefined && value !== null) {
                let sanitizedValue = value;

                // Value-specific Sanitization
                if (canonicalKey === 'interaction_type') {
                    const val = String(value).toLowerCase();
                    if (val.includes('meet')) sanitizedValue = 'Meeting';
                    else if (val.includes('call')) sanitizedValue = 'Call';
                    else if (val.includes('email')) sanitizedValue = 'Email';
                    else if (val.includes('conf')) sanitizedValue = 'Conference';
                    else if (val.includes('inquiry')) sanitizedValue = 'Medical Inquiry';
                    else sanitizedValue = 'Meeting';
                } else if (canonicalKey === 'observation') {
                    const val = String(value).toLowerCase();
                    if (val.includes('pos') || val.includes('int')) sanitizedValue = 'Positive';
                    else if (val.includes('neg') || val.includes('skep')) sanitizedValue = 'Negative';
                    else sanitizedValue = 'Neutral';
                } else if (canonicalKey === 'time') {
                    const timeMatch = String(value).match(/(\d{1,2})[:.]?(\d{2})?/);
                    if (timeMatch) {
                        const h = timeMatch[1].padStart(2, '0');
                        const m = timeMatch[2] || '00';
                        sanitizedValue = `${h}:${m}`;
                    }
                }

                sanitizedUpdates[canonicalKey] = sanitizedValue;
            }
        });

        setFormData(prev => ({
            ...prev,
            ...sanitizedUpdates
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/interactions", formData);
            alert("Medical interaction saved successfully!");
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save interaction. Is the backend running?");
        }
    };

    return (
        <div className={`dashboard-container ${isUpdating ? 'ai-flash' : ''}`}>
            <div className="interaction-form-panel">
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>AIVOA CRM</h1>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Medical & Pharma Portal
                    </div>
                </header>
                
                <InteractionForm 
                    formData={formData} 
                    onFormChange={setFormData} 
                    onSave={handleSave} 
                />
            </div>
            
            <AIAssistant onAIUpdate={handleAIUpdate} currentData={formData} />
        </div>
    );
}