// AI Chat System with Siddhansh's Personality
class SiddhansChatsAI {
    constructor() {
        this.chatModal = document.getElementById('chat-modal');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendBtn = document.getElementById('send-btn');
        this.isTyping = false;
        this.conversationHistory = [];
        
        // Siddhansh's personality and knowledge base
        this.personality = {
            name: "Siddhansh Govind",
            traits: [
                "Passionate about AI and machine learning",
                "Experienced MUN delegate and leader",
                "Diplomatic and articulate communicator",
                "Innovative problem solver",
                "Enthusiastic about technology trends",
                "Collaborative team player",
                "Strategic thinker with global perspective"
            ],
            expertise: [
                "Artificial Intelligence and Machine Learning",
                "Model United Nations and diplomacy",
                "Full-stack web development",
                "Python, JavaScript, React, Node.js",
                "TensorFlow, PyTorch, OpenAI API",
                "Cloud technologies (AWS, Azure)",
                "International relations and geopolitics",
                "Public speaking and negotiation"
            ],
            speaking_style: [
                "Uses thoughtful and measured responses",
                "Often relates topics to real-world applications",
                "Enjoys sharing learning experiences",
                "Asks engaging follow-up questions",
                "Uses diplomatic language from MUN background",
                "Enthusiastic about collaborative problem-solving",
                "Balances technical depth with accessibility"
            ]
        };
        
        // Pre-defined responses for common topics
        this.responses = {
            greeting: [
                "Hello! Great to meet you! I'm Siddhansh, though you're actually chatting with my AI counterpart. I'm passionate about AI, MUN, and creating innovative solutions. What brings you here today?",
                "Hi there! I'm Siddhansh's AI assistant, trained on his experiences and personality. Whether you want to discuss AI projects, MUN experiences, or just chat about technology, I'm here to help!",
                "Welcome! I'm excited to chat with you. As someone deeply involved in AI and diplomacy through MUN, I love connecting with people who share similar interests. What would you like to explore?"
            ],
            ai_ml: [
                "AI and ML are absolutely fascinating! I've been working on various projects from NLP to computer vision. The potential to solve real-world problems is what drives my passion. What specific area of AI interests you?",
                "Machine learning has been a game-changer in how we approach complex problems. In my experience, the key is starting with clear problem definition and quality data. Are you working on any ML projects currently?",
                "The AI field is evolving so rapidly! I'm particularly excited about the democratization of AI through APIs and frameworks. From my projects, I've learned that successful AI implementation requires both technical skills and domain understanding."
            ],
            mun: [
                "MUN has been transformative for my leadership and communication skills! The art of diplomacy, finding common ground, and building consensus are invaluable. Have you participated in any MUN conferences?",
                "Model UN taught me so much about international relations and negotiation. Each conference is like a masterclass in diplomacy, research, and public speaking. Which committees or topics interest you most?",
                "The skills from MUN - research, public speaking, negotiation, and cultural awareness - have been incredibly valuable in my tech career too. It's amazing how diplomatic skills translate to team leadership and project management."
            ],
            projects: [
                "I love building projects that combine AI with practical applications! My recent work includes chatbots, computer vision systems, and web platforms. The key is always starting with a real problem to solve. What kind of projects are you interested in?",
                "Each project teaches something new! I focus on end-to-end solutions - from data processing to deployment. My MUN background helps me think about user needs and global impact. Want to discuss any specific project ideas?",
                "Building innovative solutions is my passion! Whether it's AI-powered tools or web applications, I believe technology should solve real problems and create positive impact. What problems are you trying to solve?"
            ],
            career: [
                "My journey has been exciting - combining AI engineering with leadership experiences from MUN. The tech industry values diverse perspectives, and my diplomatic background helps in team collaboration and stakeholder management.",
                "I believe the future belongs to those who can bridge technical skills with human understanding. My experience in both AI and international relations gives me a unique perspective on building global, inclusive technology solutions.",
                "Career-wise, I'm focused on using AI for positive impact while continuing to develop leadership skills. The intersection of technology and diplomacy is where I see the most potential for meaningful change."
            ],
            technology: [
                "Technology is advancing at an incredible pace! I'm particularly excited about the convergence of AI, web3, and edge computing. The key is staying curious and continuously learning. What tech trends are you following?",
                "I love how technology can democratize opportunities and solve global challenges. From my experience, the most impactful solutions come from understanding both the technical possibilities and human needs.",
                "The tech landscape is constantly evolving! I try to stay updated through hands-on projects, conferences, and community involvement. Building and experimenting is the best way to understand new technologies."
            ]
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }
    
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.sendBtn.disabled = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate AI response
        setTimeout(async () => {
            const response = await this.generateResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
            this.sendBtn.disabled = false;
        }, 1000 + Math.random() * 2000); // Simulate thinking time
    }
    
    async generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Store conversation context
        this.conversationHistory.push({ role: 'user', content: userMessage });
        
        // Determine response category based on keywords
        let response;
        
        if (this.isGreeting(message)) {
            response = this.getRandomResponse('greeting');
        } else if (this.isAboutAI(message)) {
            response = this.getRandomResponse('ai_ml');
        } else if (this.isAboutMUN(message)) {
            response = this.getRandomResponse('mun');
        } else if (this.isAboutProjects(message)) {
            response = this.getRandomResponse('projects');
        } else if (this.isAboutCareer(message)) {
            response = this.getRandomResponse('career');
        } else if (this.isAboutTechnology(message)) {
            response = this.getRandomResponse('technology');
        } else {
            response = this.generateContextualResponse(userMessage);
        }
        
        this.conversationHistory.push({ role: 'assistant', content: response });
        return response;
    }
    
    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
        return greetings.some(greeting => message.includes(greeting));
    }
    
    isAboutAI(message) {
        const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 'neural network', 'tensorflow', 'pytorch', 'openai', 'gpt', 'algorithm'];
        return aiKeywords.some(keyword => message.includes(keyword));
    }
    
    isAboutMUN(message) {
        const munKeywords = ['mun', 'model un', 'united nations', 'diplomacy', 'delegate', 'conference', 'resolution', 'committee', 'negotiation', 'international relations'];
        return munKeywords.some(keyword => message.includes(keyword));
    }
    
    isAboutProjects(message) {
        const projectKeywords = ['project', 'build', 'develop', 'create', 'application', 'website', 'app', 'code', 'programming', 'github'];
        return projectKeywords.some(keyword => message.includes(keyword));
    }
    
    isAboutCareer(message) {
        const careerKeywords = ['career', 'job', 'work', 'experience', 'journey', 'advice', 'future', 'goals', 'path'];
        return careerKeywords.some(keyword => message.includes(keyword));
    }
    
    isAboutTechnology(message) {
        const techKeywords = ['technology', 'tech', 'programming', 'coding', 'javascript', 'python', 'react', 'node', 'web development', 'software'];
        return techKeywords.some(keyword => message.includes(keyword));
    }
    
    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    generateContextualResponse(userMessage) {
        // More sophisticated response generation based on context
        const responses = [
            "That's an interesting perspective! From my experience in both AI and MUN, I've learned that complex problems often require interdisciplinary approaches. Could you tell me more about your thoughts on this?",
            
            "I appreciate you bringing this up! It reminds me of a situation I encountered during a recent project. The key is often finding the right balance between technical feasibility and practical impact. What's your take on this?",
            
            "Great question! This actually relates to something I've been thinking about lately. In my work combining AI and diplomacy, I've found that diverse perspectives lead to better solutions. What has been your experience with this?",
            
            "Thanks for sharing that! It's fascinating how different fields can inform each other. My background in both technology and international relations has taught me to approach problems from multiple angles. How do you usually tackle complex challenges?",
            
            "That's a thought-provoking point! In my experience with AI projects and MUN conferences, I've learned that effective communication is key to success. Whether it's explaining technical concepts or building consensus in negotiations, clarity and empathy matter. What's your perspective on this?",
            
            "I find this really engaging! One thing I've learned from my diverse experiences is that innovation often happens at the intersection of different domains. The skills I've gained from MUN have actually enhanced my approach to AI projects. How do you see connections between different areas of your interest?",
            
            "Interesting! This reminds me of the interdisciplinary nature of modern problem-solving. Whether I'm working on machine learning algorithms or participating in diplomatic negotiations, the core principles of research, analysis, and collaboration remain constant. What connections do you see in your own work?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textP = document.createElement('p');
        textP.textContent = content;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'message-time';
        timeSpan.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        contentDiv.appendChild(textP);
        contentDiv.appendChild(timeSpan);
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    clearChat() {
        this.chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>Hi! I'm Siddhansh's AI assistant. I have his personality and knowledge about AI, MUN, and technology. How can I help you today?</p>
                    <span class="message-time">Just now</span>
                </div>
            </div>
        `;
        this.conversationHistory = [];
    }
}

// Modal control functions
function openChatModal() {
    const modal = document.getElementById('chat-modal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Focus on input
        setTimeout(() => {
            const chatInput = document.getElementById('chat-input');
            if (chatInput) chatInput.focus();
        }, 100);
    }
}

function closeChatModal() {
    const modal = document.getElementById('chat-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (window.siddhansChatsAI) {
            window.siddhansChatsAI.sendMessage();
        }
    }
}

function sendMessage() {
    if (window.siddhansChatsAI) {
        window.siddhansChatsAI.sendMessage();
    }
}

// Initialize chat system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.siddhansChatsAI = new SiddhansChatsAI();
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('chat-modal');
        if (e.target === modal) {
            closeChatModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeChatModal();
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiddhansChatsAI;
}