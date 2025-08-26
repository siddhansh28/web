// MUN Speech and Research Generator
class MUNGenerator {
    constructor() {
        this.munModal = document.getElementById('mun-modal');
        this.munForm = document.getElementById('mun-form');
        this.munOutput = document.getElementById('mun-output');
        this.munContent = document.getElementById('mun-content');
        this.generateBtn = null;
        
        // MUN-specific knowledge base
        this.munData = {
            countries: {
                'united-states': {
                    name: 'United States of America',
                    position: 'Often advocates for democratic values, human rights, and free market economics',
                    diplomacy: 'Tends to be assertive in international forums',
                    key_issues: ['Security', 'Economic development', 'Democratic governance', 'Climate change']
                },
                'china': {
                    name: 'People\'s Republic of China',
                    position: 'Emphasizes sovereignty, development rights, and South-South cooperation',
                    diplomacy: 'Focuses on consensus-building and non-interference',
                    key_issues: ['Development', 'Sovereignty', 'Economic cooperation', 'Climate action']
                },
                'russia': {
                    name: 'Russian Federation',
                    position: 'Advocates for multipolar world order and traditional sovereignty',
                    diplomacy: 'Emphasizes state sovereignty and regional stability',
                    key_issues: ['Security', 'Energy', 'Regional stability', 'Sovereignty']
                },
                'united-kingdom': {
                    name: 'United Kingdom',
                    position: 'Supports multilateral cooperation and human rights',
                    diplomacy: 'Often acts as bridge between different positions',
                    key_issues: ['Human rights', 'Rule of law', 'International cooperation', 'Climate action']
                },
                'france': {
                    name: 'French Republic',
                    position: 'Champions human rights, multilateralism, and cultural diversity',
                    diplomacy: 'Advocates for principled diplomacy and international law',
                    key_issues: ['Human rights', 'Cultural diversity', 'International law', 'Climate change']
                },
                'germany': {
                    name: 'Federal Republic of Germany',
                    position: 'Emphasizes multilateral solutions and European integration',
                    diplomacy: 'Focuses on consensus-building and technical cooperation',
                    key_issues: ['European integration', 'Sustainable development', 'International cooperation', 'Peace-building']
                },
                'japan': {
                    name: 'Japan',
                    position: 'Advocates for peaceful development and technological innovation',
                    diplomacy: 'Emphasizes dialogue and practical cooperation',
                    key_issues: ['Peace and security', 'Technology', 'Sustainable development', 'Disaster resilience']
                },
                'india': {
                    name: 'Republic of India',
                    position: 'Represents developing world interests and South-South cooperation',
                    diplomacy: 'Advocates for equitable development and reform',
                    key_issues: ['Development', 'South-South cooperation', 'Climate justice', 'Reform of international institutions']
                },
                'brazil': {
                    name: 'Federative Republic of Brazil',
                    position: 'Champions environmental protection and developing world rights',
                    diplomacy: 'Focuses on regional leadership and global environmental issues',
                    key_issues: ['Environmental protection', 'Sustainable development', 'Regional cooperation', 'Social inclusion']
                },
                'canada': {
                    name: 'Canada',
                    position: 'Advocates for human security, peacekeeping, and multiculturalism',
                    diplomacy: 'Emphasizes middle-power diplomacy and bridge-building',
                    key_issues: ['Human security', 'Peacekeeping', 'Multiculturalism', 'Arctic cooperation']
                }
            },
            
            committees: {
                'unga': {
                    name: 'United Nations General Assembly',
                    focus: 'Global governance and international cooperation',
                    style: 'Broad policy discussions and normative frameworks'
                },
                'unsc': {
                    name: 'United Nations Security Council',
                    focus: 'International peace and security',
                    style: 'Direct action-oriented discussions'
                },
                'ecosoc': {
                    name: 'Economic and Social Council',
                    focus: 'Economic and social development',
                    style: 'Development-focused and technical discussions'
                },
                'unhrc': {
                    name: 'UN Human Rights Council',
                    focus: 'Human rights protection and promotion',
                    style: 'Rights-based approaches and accountability'
                },
                'unep': {
                    name: 'UN Environment Programme',
                    focus: 'Environmental protection and sustainability',
                    style: 'Science-based environmental policy'
                },
                'who': {
                    name: 'World Health Organization',
                    focus: 'Global health and pandemic preparedness',
                    style: 'Technical health policy and international cooperation'
                }
            },
            
            speechStructures: {
                'opening': {
                    sections: ['Greeting and Position', 'Problem Analysis', 'National Perspective', 'Proposed Solutions', 'Call for Cooperation'],
                    tone: 'Formal and diplomatic'
                },
                'position-paper': {
                    sections: ['Background', 'National Position', 'Key Issues', 'Proposed Solutions', 'Conclusion'],
                    tone: 'Analytical and comprehensive'
                },
                'resolution': {
                    sections: ['Preamble', 'Operative Clauses', 'Implementation Mechanisms', 'Follow-up Measures'],
                    tone: 'Legal and precise'
                },
                'amendment': {
                    sections: ['Reference to Original', 'Proposed Changes', 'Justification', 'Expected Impact'],
                    tone: 'Constructive and specific'
                },
                'closing': {
                    sections: ['Summary of Discussions', 'Key Achievements', 'Remaining Challenges', 'Future Commitments'],
                    tone: 'Reflective and forward-looking'
                }
            }
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (this.munForm) {
            this.munForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.generateMUNContent();
            });
        }
    }
    
    async generateMUNContent() {
        const formData = new FormData(this.munForm);
        const data = {
            country: formData.get('country'),
            committee: formData.get('committee'),
            topic: formData.get('topic'),
            speechType: formData.get('speech-type'),
            keyPoints: formData.get('key-points') || ''
        };
        
        // Disable form and show loading
        this.toggleFormLoading(true);
        
        try {
            // Simulate API delay for realistic experience
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
            
            const content = this.generateContent(data);
            this.displayContent(content, data);
            this.showOutput();
        } catch (error) {
            console.error('Error generating MUN content:', error);
            this.showError('Failed to generate content. Please try again.');
        } finally {
            this.toggleFormLoading(false);
        }
    }
    
    generateContent(data) {
        const country = this.munData.countries[data.country];
        const committee = this.munData.committees[data.committee];
        const structure = this.munData.speechStructures[data.speechType];
        
        let content = '';
        
        switch (data.speechType) {
            case 'opening':
                content = this.generateOpeningStatement(data, country, committee);
                break;
            case 'position-paper':
                content = this.generatePositionPaper(data, country, committee);
                break;
            case 'resolution':
                content = this.generateResolution(data, country, committee);
                break;
            case 'amendment':
                content = this.generateAmendment(data, country, committee);
                break;
            case 'closing':
                content = this.generateClosingStatement(data, country, committee);
                break;
            default:
                content = this.generateOpeningStatement(data, country, committee);
        }
        
        return content;
    }
    
    generateOpeningStatement(data, country, committee) {
        return `OPENING STATEMENT
Delegation: ${country.name}
Committee: ${committee.name}
Topic: ${data.topic}

Honorable Chair, distinguished delegates,

The delegation of ${country.name} is honored to participate in this crucial discussion on "${data.topic}" before the ${committee.name}. This issue represents one of the most pressing challenges of our time, requiring immediate international attention and coordinated action.

PROBLEM ANALYSIS:
${country.name} recognizes that ${data.topic.toLowerCase()} poses significant challenges to global stability and development. The international community must acknowledge that this issue transcends national boundaries and requires multilateral solutions rooted in international law and cooperation.

NATIONAL PERSPECTIVE:
From our national perspective, ${country.position.toLowerCase()}. Our experience demonstrates the importance of ${country.key_issues.join(', ')} in addressing complex global challenges. ${country.name} has consistently advocated for approaches that respect sovereignty while promoting effective international cooperation.

PROPOSED SOLUTIONS:
We propose the following framework for action:

1. STRENGTHENING INTERNATIONAL COOPERATION
   - Enhanced dialogue between all stakeholders
   - Establishment of multilateral mechanisms for coordination
   - Sharing of best practices and technical expertise

2. CAPACITY BUILDING AND TECHNICAL ASSISTANCE
   - Support for developing nations in implementation
   - Technology transfer and knowledge sharing
   - Financial assistance through established mechanisms

3. MONITORING AND ACCOUNTABILITY
   - Regular reporting and assessment procedures
   - Transparent monitoring mechanisms
   - Accountability measures that respect national sovereignty

${data.keyPoints ? `\nKEY PRIORITIES:\n${data.keyPoints.split('\n').map(point => `- ${point.trim()}`).join('\n')}` : ''}

CALL FOR COOPERATION:
${country.name} calls upon all member states to engage constructively in these deliberations. The magnitude of this challenge requires us to set aside narrow interests and work toward comprehensive solutions that serve the global community.

We stand ready to work with all delegations to forge consensus and develop actionable recommendations that will make a meaningful difference in addressing ${data.topic.toLowerCase()}.

Thank you, Honorable Chair.

---
Generated by MUN Assistant - Siddhansh Govind Portfolio`;
    }
    
    generatePositionPaper(data, country, committee) {
        return `POSITION PAPER
Delegation: ${country.name}
Committee: ${committee.name}
Topic: ${data.topic}
Date: ${new Date().toLocaleDateString()}

I. BACKGROUND AND CONTEXT

The issue of ${data.topic.toLowerCase()} has emerged as a critical priority for the international community. The ${committee.name} has a vital role in addressing this challenge through ${committee.style.toLowerCase()}.

Historical context demonstrates that similar challenges have required sustained international cooperation and innovative approaches. The evolution of this issue reflects broader trends in global governance and the need for adaptive multilateral responses.

II. NATIONAL POSITION AND INTERESTS

${country.name} approaches this issue from the perspective of ${country.position.toLowerCase()}. Our national interests are aligned with promoting solutions that advance ${country.key_issues.join(', ')}.

Key principles guiding our position:
- Respect for sovereignty and international law
- Commitment to multilateral cooperation
- Emphasis on sustainable and equitable solutions
- Recognition of diverse national circumstances

III. KEY ISSUES AND CHALLENGES

A. IMMEDIATE CHALLENGES:
1. Coordination among multiple stakeholders
2. Resource mobilization and allocation
3. Implementation capacity variations
4. Measuring progress and accountability

B. LONG-TERM CONSIDERATIONS:
1. Sustainability of proposed solutions
2. Adaptation to changing circumstances
3. Integration with existing frameworks
4. Capacity building needs

IV. PROPOSED SOLUTIONS AND RECOMMENDATIONS

A. INSTITUTIONAL MECHANISMS:
- Establishment of coordinating bodies with clear mandates
- Regular review and assessment procedures
- Integration with existing UN system architecture

B. IMPLEMENTATION STRATEGIES:
- Phased approach with clear milestones
- Technical assistance and capacity building programs
- Financial mechanisms that ensure adequate resources

C. MONITORING AND EVALUATION:
- Transparent reporting systems
- Regular progress assessments
- Adaptive management approaches

${data.keyPoints ? `\nV. SPECIFIC PRIORITIES:\n${data.keyPoints.split('\n').map((point, index) => `${index + 1}. ${point.trim()}`).join('\n')}` : ''}

V. CONCLUSION

${country.name} believes that addressing ${data.topic.toLowerCase()} requires both urgent action and long-term commitment. We are prepared to work constructively with all partners to develop comprehensive solutions that reflect our shared values and diverse perspectives.

Success will depend on our collective ability to balance different interests while maintaining focus on our common objectives. ${country.name} remains committed to this important work and looks forward to productive discussions.

---
Position Paper prepared for ${committee.name}
Generated by MUN Assistant - Siddhansh Govind Portfolio`;
    }
    
    generateResolution(data, country, committee) {
        const resolutionNumber = Math.floor(Math.random() * 9000) + 1000;
        const currentYear = new Date().getFullYear();
        
        return `DRAFT RESOLUTION ${resolutionNumber}
Submitted by: ${country.name}
Committee: ${committee.name}
Subject: ${data.topic}

The ${committee.name},

Recalling the purposes and principles of the Charter of the United Nations,

Reaffirming the commitment of all Member States to achieve international cooperation in solving international problems,

Recognizing that ${data.topic.toLowerCase()} represents a significant challenge requiring coordinated international action,

Acknowledging the diverse perspectives and experiences of Member States on this issue,

Emphasizing the importance of multilateral approaches that respect sovereignty while promoting effective cooperation,

Noting with concern the current gaps in addressing this issue comprehensively,

Welcoming existing initiatives and frameworks that contribute to progress in this area,

1. CALLS UPON all Member States to strengthen their commitment to addressing ${data.topic.toLowerCase()} through enhanced international cooperation;

2. ENCOURAGES the development of national action plans that align with international frameworks while respecting diverse national circumstances;

3. REQUESTS the Secretary-General to establish a coordination mechanism to facilitate dialogue and cooperation among relevant stakeholders;

4. INVITES Member States to share best practices, technical expertise, and innovative approaches to addressing this challenge;

5. EMPHASIZES the importance of capacity building, particularly for developing countries, in implementing effective solutions;

6. CALLS FOR adequate financial resources to be mobilized through existing mechanisms and voluntary contributions;

7. REQUESTS regular reporting on progress made in implementing this resolution, with the first report due within twelve months;

8. ENCOURAGES partnerships between governments, civil society, private sector, and international organizations;

9. DECIDES to remain seized of this matter and to review progress at appropriate intervals;

${data.keyPoints ? `\n10. FURTHER EMPHASIZES the following priorities:\n${data.keyPoints.split('\n').map((point, index) => `    ${String.fromCharCode(97 + index)}) ${point.trim()}`).join('\n')};` : ''}

10. REQUESTS the Secretary-General to report on the implementation of this resolution to the ${committee.name} at its next session.

---
Draft Resolution ${resolutionNumber}
${committee.name} - ${currentYear}
Generated by MUN Assistant - Siddhansh Govind Portfolio`;
    }
    
    generateAmendment(data, country, committee) {
        return `PROPOSED AMENDMENT
Submitted by: ${country.name}
Committee: ${committee.name}
Reference: Draft Resolution on ${data.topic}

AMENDMENT TO OPERATIVE CLAUSE [X]:

ORIGINAL TEXT:
[Reference to original resolution text that would be amended]

PROPOSED AMENDMENT:
The delegation of ${country.name} proposes to amend the referenced operative clause to read as follows:

"[Proposed new text that addresses specific concerns while maintaining the resolution's overall objectives]"

JUSTIFICATION:

The delegation of ${country.name} proposes this amendment to strengthen the resolution's effectiveness while ensuring that it reflects the diverse perspectives of the international community.

Key reasons for this amendment:

1. ENHANCED CLARITY: The proposed language provides greater precision in implementation guidance while maintaining flexibility for different national circumstances.

2. IMPROVED EFFECTIVENESS: This amendment addresses potential implementation challenges identified during our national consultations and regional discussions.

3. BROADER CONSENSUS: The revised language better reflects concerns raised by multiple delegations during informal consultations.

4. PRACTICAL IMPLEMENTATION: The amendment includes specific mechanisms that will facilitate more effective implementation at the national level.

${data.keyPoints ? `\nSPECIFIC CONSIDERATIONS:\n${data.keyPoints.split('\n').map(point => `• ${point.trim()}`).join('\n')}` : ''}

EXPECTED IMPACT:

This amendment will:
- Strengthen the resolution's implementation potential
- Address concerns of multiple delegations
- Maintain the resolution's core objectives
- Enhance prospects for consensus adoption

The delegation of ${country.name} believes this amendment represents a constructive contribution that will strengthen the final resolution while respecting the diverse perspectives within this committee.

We look forward to discussing this proposal with other delegations and remain open to further refinements that serve our common objectives.

Thank you, Honorable Chair.

---
Proposed Amendment
Generated by MUN Assistant - Siddhansh Govind Portfolio`;
    }
    
    generateClosingStatement(data, country, committee) {
        return `CLOSING STATEMENT
Delegation: ${country.name}
Committee: ${committee.name}
Topic: ${data.topic}

Honorable Chair, distinguished delegates,

As we conclude our deliberations on "${data.topic}," the delegation of ${country.name} wishes to reflect on the significant progress we have achieved and outline our commitments moving forward.

SUMMARY OF DISCUSSIONS:

Throughout these sessions, we have engaged in substantive discussions that have deepened our collective understanding of this complex issue. The diversity of perspectives represented in this room has enriched our analysis and contributed to more comprehensive solutions.

Key themes that emerged from our discussions include:
- The interconnected nature of global challenges
- The importance of multilateral cooperation
- The need for sustainable and equitable solutions
- The critical role of capacity building and technical assistance

KEY ACHIEVEMENTS:

Our committee has accomplished several important objectives:

1. CONSENSUS BUILDING: We have successfully built consensus around core principles that will guide future action on this issue.

2. PRACTICAL SOLUTIONS: The recommendations we have developed provide concrete pathways for implementation while respecting diverse national circumstances.

3. ENHANCED COOPERATION: These discussions have strengthened relationships and established frameworks for ongoing collaboration.

4. SHARED COMMITMENT: All delegations have demonstrated genuine commitment to addressing this challenge collectively.

REMAINING CHALLENGES:

While we celebrate our achievements, we must acknowledge challenges that require continued attention:

- Implementation capacity varies significantly among member states
- Resource mobilization remains a critical concern
- Coordination mechanisms need further development
- Monitoring and accountability systems require strengthening

${data.keyPoints ? `\nCOMMITMENTS FOR MOVING FORWARD:\n${data.keyPoints.split('\n').map(point => `• ${point.trim()}`).join('\n')}` : ''}

FUTURE COMMITMENTS:

${country.name} makes the following commitments:

1. We will work diligently to implement the recommendations we have adopted, adapting them to our national context while maintaining their essential spirit.

2. We will continue to engage constructively with international partners, sharing our experiences and learning from others.

3. We will support capacity building initiatives, particularly for developing countries that may need assistance in implementation.

4. We will participate actively in follow-up mechanisms and contribute to ongoing assessment and refinement of our approaches.

FINAL REFLECTIONS:

The challenges we face in addressing ${data.topic.toLowerCase()} are significant, but our discussions have demonstrated that the international community possesses both the will and the capacity to make meaningful progress.

The diplomatic skills, analytical rigor, and collaborative spirit demonstrated in this committee give us confidence that we can translate our agreements into tangible improvements in people's lives around the world.

${country.name} thanks the Chair and the Secretariat for their excellent leadership, and we thank all delegations for their constructive engagement and commitment to finding common ground.

Together, we have advanced the cause of international cooperation and demonstrated the continued relevance of multilateral diplomacy in addressing global challenges.

Thank you, Honorable Chair, and thank you, distinguished delegates.

---
Closing Statement
Generated by MUN Assistant - Siddhansh Govind Portfolio`;
    }
    
    toggleFormLoading(loading) {
        const generateBtn = this.munForm.querySelector('.generate-btn');
        if (loading) {
            generateBtn.disabled = true;
            generateBtn.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    Generating Content...
                </div>
            `;
        } else {
            generateBtn.disabled = false;
            generateBtn.innerHTML = `
                <i class="fas fa-magic"></i>
                Generate MUN Content
            `;
        }
    }
    
    displayContent(content, data) {
        this.munContent.textContent = content;
        
        // Store content for copying/downloading
        this.currentContent = {
            content: content,
            data: data,
            timestamp: new Date()
        };
    }
    
    showOutput() {
        this.munOutput.style.display = 'block';
        this.munOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    showError(message) {
        // Create error message display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            ${message}
        `;
        errorDiv.style.cssText = `
            background: #fee;
            color: #c53030;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;
        
        // Insert after form
        this.munForm.insertAdjacentElement('afterend', errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Modal control functions
function openMunModal() {
    const modal = document.getElementById('mun-modal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
    }
}

function closeMunModal() {
    const modal = document.getElementById('mun-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function copyMunContent() {
    if (window.munGenerator && window.munGenerator.currentContent) {
        navigator.clipboard.writeText(window.munGenerator.currentContent.content).then(() => {
            // Show success feedback
            const btn = event.target.closest('.action-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            btn.style.background = '#10b981';
            btn.style.color = 'white';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy content:', err);
        });
    }
}

function downloadMunContent() {
    if (window.munGenerator && window.munGenerator.currentContent) {
        const content = window.munGenerator.currentContent.content;
        const data = window.munGenerator.currentContent.data;
        const timestamp = window.munGenerator.currentContent.timestamp;
        
        const filename = `MUN_${data.speechType}_${data.country}_${timestamp.getTime()}.txt`;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        // Show success feedback
        const btn = event.target.closest('.action-btn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
        btn.style.background = '#10b981';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
    }
}

// Initialize MUN generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.munGenerator = new MUNGenerator();
    
    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('mun-modal');
        if (e.target === modal) {
            closeMunModal();
        }
    });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MUNGenerator;
}