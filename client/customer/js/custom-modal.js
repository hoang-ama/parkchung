// Global Custom Modal System for Parkchung
// Replaces browser alert(), confirm(), and provides custom notifications

class CustomModal {
    constructor() {
        this.currentModal = null;
    }

    // Custom Alert
    alert(message, title = 'Notice') {
        return new Promise((resolve) => {
            this.show({
                title,
                message,
                type: 'alert',
                icon: 'ℹ️',
                buttons: [
                    { text: 'OK', style: 'primary', onClick: () => resolve(true) }
                ]
            });
        });
    }

    // Custom Confirm
    confirm(message, title = 'Confirm') {
        return new Promise((resolve) => {
            this.show({
                title,
                message,
                type: 'confirm',
                icon: '❓',
                buttons: [
                    { text: 'Cancel', style: 'secondary', onClick: () => resolve(false) },
                    { text: 'OK', style: 'primary', onClick: () => resolve(true) }
                ]
            });
        });
    }

    // Success notification
    success(message, title = 'Success') {
        return new Promise((resolve) => {
            this.show({
                title,
                message,
                type: 'success',
                icon: '✅',
                buttons: [
                    { text: 'OK', style: 'primary', onClick: () => resolve(true) }
                ]
            });
        });
    }

    // Error notification
    error(message, title = 'Error') {
        return new Promise((resolve) => {
            this.show({
                title,
                message,
                type: 'error',
                icon: '❌',
                buttons: [
                    { text: 'OK', style: 'primary', onClick: () => resolve(true) }
                ]
            });
        });
    }

    // Warning notification
    warning(message, title = 'Warning') {
        return new Promise((resolve) => {
            this.show({
                title,
                message,
                type: 'warning',
                icon: '⚠️',
                buttons: [
                    { text: 'OK', style: 'primary', onClick: () => resolve(true) }
                ]
            });
        });
    }

    // Core show method
    show(options) {
        // Close existing modal if any
        if (this.currentModal) {
            this.close();
        }

        const { title, message, icon, buttons, type = 'alert' } = options;

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'custom-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'custom-modal-content';
        modal.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            animation: slideIn 0.3s ease;
            position: relative;
        `;

        // Build modal HTML
        modal.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">${icon}</div>
            <h2 style="color: #333; margin-bottom: 16px; font-size: 24px; font-weight: 600;">${title}</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 24px; font-size: 16px; white-space: pre-line;">${message}</p>
            <div class="modal-buttons" style="display: flex; gap: 12px; justify-content: center;"></div>
        `;

        // Add buttons
        const buttonsContainer = modal.querySelector('.modal-buttons');
        buttons.forEach((btn, index) => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.className = `modal-btn modal-btn-${btn.style}`;

            const isPrimary = btn.style === 'primary';
            button.style.cssText = `
                background: ${isPrimary ? 'linear-gradient(135deg, #13b47e 0%, #1f6f35 100%)' : '#fff'};
                color: ${isPrimary ? 'white' : '#64748b'};
                border: ${isPrimary ? 'none' : '2px solid #e2e8f0'};
                padding: 12px 32px;
                border-radius: 50px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: ${isPrimary ? '0 4px 15px rgba(19, 180, 126, 0.3)' : 'none'};
                min-width: 100px;
            `;

            button.addEventListener('click', () => {
                btn.onClick();
                this.close();
            });

            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
                if (isPrimary) {
                    button.style.boxShadow = '0 8px 25px rgba(19, 180, 126, 0.4)';
                } else {
                    button.style.background = '#f8fafc';
                }
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
                if (isPrimary) {
                    button.style.boxShadow = '0 4px 15px rgba(19, 180, 126, 0.3)';
                } else {
                    button.style.background = '#fff';
                }
            });

            buttonsContainer.appendChild(button);

            // Auto-focus first button
            if (index === buttons.length - 1) {
                setTimeout(() => button.focus(), 100);
            }
        });

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        this.currentModal = { overlay, style };

        // Close on overlay click for alerts only
        if (type === 'alert' || type === 'success' || type === 'error' || type === 'warning') {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    buttons[buttons.length - 1].onClick();
                    this.close();
                }
            });
        }

        // Close on Escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                buttons[buttons.length - 1].onClick();
                this.close();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        this.currentModal.escHandler = escHandler;
    }

    close() {
        if (!this.currentModal) return;

        const { overlay, style, escHandler } = this.currentModal;

        overlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
            if (style.parentNode) {
                document.head.removeChild(style);
            }
            if (escHandler) {
                document.removeEventListener('keydown', escHandler);
            }
        }, 300);

        this.currentModal = null;
    }
}

// Create global instance
window.customModal = new CustomModal();

// Override native alert and confirm
window.alert = function (message) {
    return window.customModal.alert(message);
};

window.confirm = function (message) {
    return window.customModal.confirm(message);
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomModal;
}
