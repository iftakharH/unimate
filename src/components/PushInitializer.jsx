import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { enablePushNotifications } from "../utils/pushClient";
import Modal from "./Modal";

const PushInitializer = () => {
    const { user } = useAuth();
    const [dismissed, setDismissed] = useState(false);

    const showPrompt =
        !dismissed &&
        !!user &&
        !localStorage.getItem("push_prompt_shown") &&
        typeof Notification !== "undefined" &&
        Notification.permission === "default";

    const handleConfirm = async () => {
        setDismissed(true);
        localStorage.setItem("push_prompt_shown", "true");
        try {
            await enablePushNotifications();
        } catch (err) {
            console.error("Push init failed:", err);
        }
    };

    const handleClose = () => {
        setDismissed(true);
        localStorage.setItem("push_prompt_shown", "true");
    };

    return (
        <Modal
            isOpen={showPrompt}
            onClose={handleClose}
            onConfirm={handleConfirm}
            title="Enable Notifications"
            message="Stay updated! Would you like to enable push notifications for new messages and deal updates?"
            confirmText="Yes, notify me"
            cancelText="Not now"
            type="info"
        />
    );
};

export default PushInitializer;
