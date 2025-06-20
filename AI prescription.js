
// Mock AI responses for demonstration
const mockResponses = [
    {
        symptoms: ["headache", "fever", "fatigue"],
        recommendations: [
            {
                title: "Rest and Hydration",
                icon: "fas fa-bed",
                text: "Get plenty of rest and stay well-hydrated. Drink water, herbal teas, or clear broths."
            },
            {
                title: "Over-the-Counter Relief",
                icon: "fas fa-pills",
                text: "Consider acetaminophen or ibuprofen for headache and fever relief. Follow package directions."
            },
            {
                title: "Monitor Symptoms",
                icon: "fas fa-thermometer-half",
                text: "Monitor your temperature regularly. Seek medical attention if fever exceeds 103°F (39.4°C)."
            },
            {
                title: "When to See a Doctor",
                icon: "fas fa-user-md",
                text: "Consult a healthcare provider if symptoms worsen or persist beyond 3-5 days."
            }
        ]
    },
    {
        symptoms: ["cough", "sore throat"],
        recommendations: [
            {
                title: "Throat Care",
                icon: "fas fa-heart",
                text: "Gargle with warm salt water several times daily. Use throat lozenges for relief."
            },
            {
                title: "Humidity",
                icon: "fas fa-cloud",
                text: "Use a humidifier or breathe steam from a hot shower to soothe airways."
            },
            {
                title: "Warm Fluids",
                icon: "fas fa-mug-hot",
                text: "Drink warm liquids like tea with honey, warm broth, or warm water with lemon."
            },
            {
                title: "Avoid Irritants",
                icon: "fas fa-ban",
                text: "Avoid smoke, strong odors, and other respiratory irritants."
            }
        ]
    }
];

// Default general recommendations
const defaultRecommendations = [
    {
        title: "General Health Monitoring",
        icon: "fas fa-heartbeat",
        text: "Monitor your symptoms and note any changes in severity or new symptoms that develop."
    },
    {
        title: "Stay Hydrated",
        icon: "fas fa-tint",
        text: "Maintain adequate fluid intake throughout the day to support your body's natural healing processes."
    },
    {
        title: "Rest and Recovery",
        icon: "fas fa-moon",
        text: "Ensure you get adequate sleep and rest to help your immune system function effectively."
    },
    {
        title: "Seek Professional Care",
        icon: "fas fa-stethoscope",
        text: "If symptoms persist, worsen, or you have concerns, consult with a healthcare professional promptly."
    }
];

function getRecommendations() {
    const symptomInput = document.getElementById('symptomInput');
    const recommendationsContainer = document.getElementById('recommendationsContainer');
    const loadingState = document.getElementById('loadingState');
    const button = document.querySelector('.get-recommendations-btn');
    
    const symptoms = symptomInput.value.trim().toLowerCase();
    
    if (!symptoms) {
        showToast('Please describe your symptoms first.', 'warning');
        symptomInput.focus();
        return;
    }
    
    // Show loading state
    recommendationsContainer.style.display = 'none';
    loadingState.style.display = 'block';
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    
    // Simulate AI processing delay
    setTimeout(() => {
        // Find matching recommendations based on symptoms
        let selectedRecommendations = defaultRecommendations;
        
        for (let response of mockResponses) {
            const matchCount = response.symptoms.filter(symptom => 
                symptoms.includes(symptom)
            ).length;
            
            if (matchCount > 0) {
                selectedRecommendations = response.recommendations;
                break;
            }
        }
        
        // Display recommendations
        displayRecommendations(selectedRecommendations);
        
        // Hide loading state
        loadingState.style.display = 'none';
        recommendationsContainer.style.display = 'block';
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-paper-plane"></i> Get AI Recommendations';
        
        // Show success message
        showToast('AI recommendations generated successfully!', 'success');
        
        // Scroll to recommendations
        document.querySelector('.recommendations-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
    }, 2000);
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendationsContainer');
    
    const content = `
        <div class="recommendations-content">
            ${recommendations.map(rec => `
                <div class="recommendation-card">
                    <h4 class="recommendation-title">
                        <i class="${rec.icon}"></i>
                        ${rec.title}
                    </h4>
                    <p class="recommendation-text">${rec.text}</p>
                </div>
            `).join('')}
            <div class="recommendation-card" style="border: 2px solid #fbbf24; background: #fef3c7;">
                <h4 class="recommendation-title" style="color: #92400e;">
                    <i class="fas fa-exclamation-triangle" style="color: #f59e0b;"></i>
                    Important Reminder
                </h4>
                <p class="recommendation-text" style="color: #92400e;">
                    These are general suggestions based on common symptoms. Always consult with a qualified healthcare professional for proper diagnosis and treatment.
                </p>
            </div>
        </div>
    `;
    
    container.innerHTML = content;
}

function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'warning' ? 'exclamation-triangle' : 
                 'info-circle';
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 4000);
}

// Add toast styles dynamically
const toastStyles = `
    .toast {
        position: fixed;
        top: 120px;
        right: 20px;
        background: white;
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        border-left: 4px solid #2563eb;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    }
    
    .toast-success {
        border-left-color: #059669;
        color: #059669;
    }
    
    .toast-warning {
        border-left-color: #f59e0b;
        color: #f59e0b;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 4px;
        margin-left: auto;
        border-radius: 4px;
        transition: all 0.2s ease;
    }
    
    .toast-close:hover {
        background: #f3f4f6;
        color: #374151;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .toast {
            right: 15px;
            left: 15px;
            min-width: auto;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// Add enter key support for textarea
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('symptomInput');
    
    textarea.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            getRecommendations();
        }
    });
    
    // Add character counter
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        text-align: right;
        color: #6b7280;
        font-size: 0.875rem;
        margin-top: 8px;
    `;
    
    textarea.parentElement.appendChild(counter);
    
    function updateCounter() {
        const length = textarea.value.length;
        counter.textContent = `${length}/1000 characters`;
        
        if (length > 800) {
            counter.style.color = '#f59e0b';
        } else if (length > 900) {
            counter.style.color = '#ef4444';
        } else {
            counter.style.color = '#6b7280';
        }
    }
    
    textarea.addEventListener('input', updateCounter);
    updateCounter();
    
    // Add maxlength
    textarea.setAttribute('maxlength', '1000');
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Console log for debugging
console.log('AI Prescription Assistant loaded successfully!');
