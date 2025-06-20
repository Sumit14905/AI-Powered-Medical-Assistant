class VoiceAppointmentAssistant {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.transcript = '';
        
        this.voiceButton = document.getElementById('voiceButton');
        this.voiceStatus = document.getElementById('voiceStatus');
        this.voiceTranscript = document.getElementById('voiceTranscript');
        this.micIcon = document.getElementById('micIcon');
        this.voiceButtonText = document.getElementById('voiceButtonText');
        
        this.initSpeechRecognition();
        this.setupEventListeners();
    }
    
    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUI('recording');
                this.voiceStatus.textContent = 'Listening... Please speak clearly';
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                this.transcript = finalTranscript;
                this.voiceTranscript.textContent = finalTranscript + interimTranscript;
                this.voiceTranscript.classList.add('show');
            };
            
            this.recognition.onend = () => {
                this.isListening = false;
                if (this.transcript) {
                    this.processTranscript();
                } else {
                    this.updateUI('idle');
                    this.voiceStatus.textContent = 'No speech detected. Please try again.';
                }
            };
            
            this.recognition.onerror = (event) => {
                this.isListening = false;
                this.updateUI('idle');
                this.voiceStatus.textContent = `Error: ${event.error}. Please try again.`;
            };
        } else {
            this.voiceStatus.textContent = 'Speech recognition not supported in this browser.';
            this.voiceButton.disabled = true;
        }
    }
    
    setupEventListeners() {
        this.voiceButton.addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });
        
        document.getElementById('appointmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Appointment booked successfully! We will contact you soon.');
        });
    }
    
    startListening() {
        if (this.recognition) {
            this.transcript = '';
            this.voiceTranscript.textContent = '';
            this.recognition.start();
        }
    }
    
    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }
    
    updateUI(state) {
        this.voiceButton.className = `voice_button ${state}`;
        
        switch (state) {
            case 'recording':
                this.micIcon.className = 'fa-solid fa-stop';
                this.voiceButtonText.textContent = 'Stop Recording';
                break;
            case 'processing':
                this.micIcon.className = 'fa-solid fa-cog fa-spin';
                this.voiceButtonText.textContent = 'Processing...';
                break;
            case 'idle':
            default:
                this.micIcon.className = 'fa-solid fa-microphone';
                this.voiceButtonText.textContent = 'Start Speaking';
                break;
        }
    }
    
    processTranscript() {
        this.updateUI('processing');
        this.voiceStatus.textContent = 'Processing your request...';
        
        // Simulate AI processing delay
        setTimeout(() => {
            this.extractAndFillFormData(this.transcript);
        }, 1500);
    }
    
    extractAndFillFormData(text) {
        const formData = this.parseAppointmentData(text.toLowerCase());
        
        // Fill form fields with animation
        Object.keys(formData).forEach((fieldId, index) => {
            setTimeout(() => {
                const field = document.getElementById(fieldId);
                if (field && formData[fieldId]) {
                    field.value = formData[fieldId];
                    field.classList.add('auto-filled');
                    
                    // Remove the animation class after animation completes
                    setTimeout(() => {
                        field.classList.remove('auto-filled');
                    }, 500);
                }
            }, index * 200);
        });
        
        this.updateUI('idle');
        this.voiceStatus.textContent = 'Form filled successfully! Please review and submit.';
        
        // Clear transcript after processing
        setTimeout(() => {
            this.voiceTranscript.classList.remove('show');
            this.voiceStatus.textContent = '';
        }, 3000);
    }
    
    parseAppointmentData(text) {
        const formData = {};
        
        // Extract name
        const namePatterns = [
            /my name is ([a-zA-Z\s]+?)(?:\s|$|\.)/,
            /i am ([a-zA-Z\s]+?)(?:\s|$|\.)/,
            /name ([a-zA-Z\s]+?)(?:\s|$|\.)/
        ];
        
        for (const pattern of namePatterns) {
            const nameMatch = text.match(pattern);
            if (nameMatch) {
                formData.fullName = this.capitalizeWords(nameMatch[1].trim());
                break;
            }
        }
        
        // Extract email
        const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
            formData.email = emailMatch[1];
        }
        
        // Extract phone number
        const phonePatterns = [
            /phone.*?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/,
            /number.*?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/,
            /(\d{10})/
        ];
        
        for (const pattern of phonePatterns) {
            const phoneMatch = text.match(pattern);
            if (phoneMatch) {
                formData.phone = phoneMatch[1];
                break;
            }
        }
        
        // Extract date
        const datePatterns = [
            /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})/i,
            /(\d{1,2})\/(d{1,2})\/(\d{4})/,
            /tomorrow/i,
            /next week/i
        ];
        
        for (const pattern of datePatterns) {
            const dateMatch = text.match(pattern);
            if (dateMatch) {
                if (pattern.source.includes('tomorrow')) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    formData.date = tomorrow.toISOString().split('T')[0];
                } else if (pattern.source.includes('next week')) {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    formData.date = nextWeek.toISOString().split('T')[0];
                } else if (dateMatch[1] && dateMatch[2]) {
                    // Handle month/day format
                    const months = {
                        'january': '01', 'february': '02', 'march': '03', 'april': '04',
                        'may': '05', 'june': '06', 'july': '07', 'august': '08',
                        'september': '09', 'october': '10', 'november': '11', 'december': '12'
                    };
                    const month = months[dateMatch[1].toLowerCase()];
                    const day = dateMatch[2].padStart(2, '0');
                    const year = new Date().getFullYear();
                    formData.date = `${year}-${month}-${day}`;
                }
                break;
            }
        }
        
        // Extract time
        const timePatterns = [
            /(\d{1,2})\s*(?::|o'clock)\s*(\d{0,2})\s*(am|pm)/i,
            /(morning)/i,
            /(afternoon)/i,
            /(evening)/i
        ];
        
        for (const pattern of timePatterns) {
            const timeMatch = text.match(pattern);
            if (timeMatch) {
                if (timeMatch[0].includes('morning')) {
                    formData.time = '09:00';
                } else if (timeMatch[0].includes('afternoon')) {
                    formData.time = '14:00';
                } else if (timeMatch[0].includes('evening')) {
                    formData.time = '16:00';
                } else if (timeMatch[1]) {
                    let hour = parseInt(timeMatch[1]);
                    const isPM = timeMatch[3] && timeMatch[3].toLowerCase() === 'pm';
                    
                    if (isPM && hour !== 12) hour += 12;
                    if (!isPM && hour === 12) hour = 0;
                    
                    formData.time = hour.toString().padStart(2, '0') + ':00';
                }
                break;
            }
        }
        
        // Extract doctor preference
        if (text.includes('cardiologist') || text.includes('heart')) {
            formData.doctor = 'dr-sarah';
        } else if (text.includes('neurologist') || text.includes('brain') || text.includes('nerve')) {
            formData.doctor = 'dr-michael';
        } else if (text.includes('pediatrician') || text.includes('child') || text.includes('kid')) {
            formData.doctor = 'dr-emily';
        }
        
        // Extract reason/symptoms
        const reasonPatterns = [
            /(?:because|reason|problem|issue|symptom).*?(?:i have|is)(.+?)(?:\.|$)/i,
            /(?:suffering from|experiencing)(.+?)(?:\.|$)/i,
            /(?:pain|ache|hurt)(.+?)(?:\.|$)/i
        ];
        
        for (const pattern of reasonPatterns) {
            const reasonMatch = text.match(pattern);
            if (reasonMatch) {
                formData.reason = reasonMatch[1].trim();
                break;
            }
        }
        
        return formData;
    }
    
    capitalizeWords(str) {
        return str.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    }
}

// Initialize the voice assistant when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VoiceAppointmentAssistant();
});
