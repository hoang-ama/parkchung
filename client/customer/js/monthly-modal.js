// Custom modal for "Coming Soon" message
function showComingSoonModal() {
    // Create modal overlay
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

    // Create modal content
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

    modal.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">🚧</div>
        <h2 style="color: #333; margin-bottom: 16px; font-size: 24px; font-weight: 600;">Coming Soon!</h2>
        <p style="color: #666; line-height: 1.6; margin-bottom: 24px; font-size: 16px;">
            This feature is currently under development and will be released soon!
            <br><br>
            Thank you for your interest. Please follow our updates!
        </p>
        <button id="modal-close-btn" style="
            background: linear-gradient(135deg, #13b47e 0%, #1f6f35 100%);
            color: white;
            border: none;
            padding: 12px 32px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 4px 15px rgba(19, 180, 126, 0.3);
        ">Got it!</button>
    `;

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
        #modal-close-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(19, 180, 126, 0.4);
        }
    `;
    document.head.appendChild(style);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close modal function
    const closeModal = () => {
        overlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(overlay);
            document.head.removeChild(style);
        }, 300);
    };

    // Close on button click
    const closeBtn = modal.querySelector('#modal-close-btn');
    closeBtn.addEventListener('click', closeModal);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Close on Escape key
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
}

// Monthly tab - Coming Soon popup
document.addEventListener('DOMContentLoaded', () => {
    const monthlyTab = document.getElementById('monthly-tab');
    if (monthlyTab) {
        monthlyTab.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showComingSoonModal();
        });
    }
});
