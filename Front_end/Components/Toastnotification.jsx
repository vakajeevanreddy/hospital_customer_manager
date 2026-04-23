import React, { useEffect } from "react";

const ToastNotification = ({ message, type, onClose }) => {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000); // auto-hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div
            className={`toast align-items-center text-white ${type === "success" ? "bg-success" : "bg-danger"
                } border-0 show position-fixed bottom-0 end-0 m-3`}
            role="alert"
        >
            <div className="d-flex">
                <div className="toast-body">{message}</div>
                <button
                    type="button"
                    className="btn-close btn-close-white me-2 m-auto"
                    onClick={onClose}
                ></button>
            </div>
        </div>
    );
};

export default ToastNotification;
