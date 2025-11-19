// Strand AI Prototype - Main Application Logic

// Mock data for demonstration
const mockData = {
    promptAnalysis: {
        intent: "Film noir scene creation",
        characters: ["Two men"],
        objects: ["Gun", "Detective's office"],
        actions: ["Fight"],
        sentiment: "Tense, dramatic"
    },
    retrievedContent: [
        { title: "Casablanca", relevance: 0.85, attribution: 38 },
        { title: "The Maltese Falcon", relevance: 0.72, attribution: 32 },
        { title: "Double Indemnity", relevance: 0.68, attribution: 30 }
    ],
    safetyCheck: {
        status: "pass",
        violations: []
    },
    contamination: {
        percentage: 0.5,
        detected: false
    },
    finalAttribution: [
        { title: "Casablanca", percentage: 37 },
        { title: "The Maltese Falcon", percentage: 33 },
        { title: "Double Indemnity", percentage: 30 }
    ]
};

// DOM Elements
const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const outputSection = document.getElementById('outputSection');
const statusGrid = document.getElementById('statusGrid');
const sidebar = document.getElementById('sidebar');
const sidebarContent = document.getElementById('sidebarContent');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');

// Chart instances
let attributionChartInstance = null;
let relevanceChartInstance = null;

// Event Listeners
generateBtn.addEventListener('click', handleGenerate);
clearBtn.addEventListener('click', handleClear);
sidebarToggle.addEventListener('click', toggleSidebar);
sidebarClose.addEventListener('click', toggleSidebar);

// Chart Creation Functions
function createAttributionChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (attributionChartInstance) {
        attributionChartInstance.destroy();
    }
    
    attributionChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.map(item => item.title),
            datasets: [{
                data: data.map(item => item.percentage),
                backgroundColor: [
                    '#000000',
                    '#404040',
                    '#808080'
                ],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#1a1a1a',
                        padding: 15,
                        font: {
                            size: 13,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function createRelevanceChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (relevanceChartInstance) {
        relevanceChartInstance.destroy();
    }
    
    relevanceChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.title),
            datasets: [{
                label: 'Attribution %',
                data: data.map(item => item.attribution),
                backgroundColor: '#000000',
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#666666',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: '#e5e5e5',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#666666',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Attribution: ' + context.parsed.y + '%';
                        }
                    }
                }
            }
        }
    });
}

// Handle Generate Button Click
function handleGenerate() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i data-lucide="loader"></i> Processing...';
    lucide.createIcons();

    // Simulate processing delay
    setTimeout(() => {
        // Show output section, status grid, and reports section
        outputSection.style.display = 'block';
        statusGrid.style.display = 'grid';
        document.getElementById('reportsSection').style.display = 'block';
        
        // Update output status
        document.getElementById('outputStatus').innerHTML = `
            <strong>Status:</strong> Generation complete<br>
            <strong>Processing Time:</strong> 3.2 seconds<br>
            <strong>Timestamp:</strong> ${new Date().toLocaleString()}
        `;

        // Populate sidebar with process trace
        populateProcessTrace(prompt);

        // Create charts with a slight delay to ensure DOM is ready
        setTimeout(() => {
            createRelevanceChart('relevanceChart', mockData.retrievedContent);
            createAttributionChart('attributionChart', mockData.finalAttribution);
        }, 100);

        // Reset button
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i data-lucide="play"></i> Generate';
        lucide.createIcons();

        // Scroll to output
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2000);
}

// Handle Clear Button Click
function handleClear() {
    promptInput.value = '';
    outputSection.style.display = 'none';
    statusGrid.style.display = 'none';
    document.getElementById('reportsSection').style.display = 'none';
    
    // Destroy charts
    if (attributionChartInstance) {
        attributionChartInstance.destroy();
        attributionChartInstance = null;
    }
    if (relevanceChartInstance) {
        relevanceChartInstance.destroy();
        relevanceChartInstance = null;
    }
    
    sidebarContent.innerHTML = `
        <div class="empty-state">
            <i data-lucide="info"></i>
            <p>Generate content to view process trace</p>
        </div>
    `;
    lucide.createIcons();
}

// Toggle Sidebar (Mobile)
function toggleSidebar() {
    sidebar.classList.toggle('active');
}

// Populate Process Trace Sidebar
function populateProcessTrace(prompt) {
    const processSteps = [
        {
            title: "1. Prompt Receipt",
            status: "Complete",
            content: `Original prompt received and validated`,
            detail: `Prompt: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`
        },
        {
            title: "2. Semantic Analysis",
            status: "Complete",
            content: "Prompt analyzed for creative intent",
            detail: `Intent: ${mockData.promptAnalysis.intent}<br>
                     Characters: ${mockData.promptAnalysis.characters.join(', ')}<br>
                     Objects: ${mockData.promptAnalysis.objects.join(', ')}<br>
                     Actions: ${mockData.promptAnalysis.actions.join(', ')}`
        },
        {
            title: "3. IP Safety Check (Pre-Gen)",
            status: "Passed",
            content: "No safety violations detected in prompt",
            detail: `Checked against ${mockData.retrievedContent.length} IP safety rules`
        },
        {
            title: "4. Content Retrieval",
            status: "Complete",
            content: `Retrieved ${mockData.retrievedContent.length} relevant IP sources`,
            detail: mockData.retrievedContent.map(item => 
                `${item.title}: ${(item.relevance * 100).toFixed(0)}% relevance`
            ).join('<br>')
        },
        {
            title: "5. Initial Attribution",
            status: "Complete",
            content: "Pre-generation attribution calculated",
            detail: `<ul class="attribution-list">
                ${mockData.retrievedContent.map(item => 
                    `<li class="attribution-item">
                        <span class="attribution-name">${item.title}</span>
                        <span class="attribution-percent">${item.attribution}%</span>
                    </li>`
                ).join('')}
            </ul>`
        },
        {
            title: "6. Prompt Augmentation",
            status: "Complete",
            content: "Prompt enhanced with IP-specific guidance",
            detail: "Added cinematic lighting, composition, and style directives based on retrieved content"
        },
        {
            title: "7. Video Generation",
            status: "Complete",
            content: "AI model executed with augmented prompt",
            detail: "Model: Mochi-1 | Duration: 8 seconds | Resolution: 720p"
        },
        {
            title: "8. Output Analysis",
            status: "Complete",
            content: "Generated video analyzed frame-by-frame",
            detail: "Processed 240 frames | Extracted embeddings for comparison"
        },
        {
            title: "9. Final Attribution",
            status: "Complete",
            content: "Post-generation attribution verified",
            detail: `<ul class="attribution-list">
                ${mockData.finalAttribution.map(item => 
                    `<li class="attribution-item">
                        <span class="attribution-name">${item.title}</span>
                        <span class="attribution-percent">${item.percentage}%</span>
                    </li>`
                ).join('')}
            </ul>`
        },
        {
            title: "10. Contamination Detection",
            status: "Passed",
            content: `Model contamination: ${mockData.contamination.percentage}%`,
            detail: "Detected minimal influence from model training data. Within acceptable threshold."
        },
        {
            title: "11. IP Safety Check (Post-Gen)",
            status: "Passed",
            content: "Output validated against IP safety rules",
            detail: "No violations detected in generated content"
        },
        {
            title: "12. Monetization Validation",
            status: "Approved",
            content: "Content approved for monetization",
            detail: "All safety checks passed | Attribution complete | Ready for release"
        }
    ];

    sidebarContent.innerHTML = processSteps.map(step => `
        <div class="process-step fade-in">
            <div class="step-header">
                <span class="step-title">${step.title}</span>
                <span class="step-status">${step.status}</span>
            </div>
            <div class="step-content">${step.content}</div>
            ${step.detail ? `<div class="step-detail">${step.detail}</div>` : ''}
        </div>
    `).join('');

    lucide.createIcons();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    
    // Add example prompt
    promptInput.placeholder = "Example: Create a film noir scene in which two men fight in a detective's office. One man has a gun.";
});

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    }
});