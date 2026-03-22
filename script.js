/**
 * Predictive Maintenance System - Main JavaScript
 * Handles navigation, charts, real-time updates, and interactivity
 */

// ============================================
// Global Variables & Configuration
// ============================================

const CONFIG = {
    apiUrl: '/api', // Use relative URL for deployment
    updateInterval: 5000, // Real-time update interval (ms)
    chartAnimationDuration: 750,
    toastDuration: 3000
};

let charts = {
    health: null,
    temperature: null,
    failure: null,
    forecast: null
};

let equipmentData = {
    equipment: [],
    alerts: [],
    metrics: {
        operationalStatus: 0,
        avgRUL: 0,
        costSaved: 0,
        downtimePrevented: 0
    },
    maintenanceHistory: []
};

// ============================================
// API Functions
// ============================================

async function fetchEquipment() {
    try {
        const response = await fetch(`${CONFIG.apiUrl}/equipment`);
        if (!response.ok) throw new Error('Failed to fetch equipment');
        const data = await response.json();
        equipmentData.equipment = data;
        console.log('✓ Equipment data loaded');
        return data;
    } catch (error) {
        console.error('Error fetching equipment:', error);
        return [];
    }
}

async function fetchAlerts() {
    try {
        const response = await fetch(`${CONFIG.apiUrl}/alerts`);
        if (!response.ok) throw new Error('Failed to fetch alerts');
        const data = await response.json();
        equipmentData.alerts = data;
        console.log('✓ Alerts data loaded');
        return data;
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return [];
    }
}

async function fetchMetrics() {
    try {
        const response = await fetch(`${CONFIG.apiUrl}/metrics`);
        if (!response.ok) throw new Error('Failed to fetch metrics');
        const data = await response.json();
        equipmentData.metrics = data;
        console.log('✓ Metrics data loaded');
        return data;
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return equipmentData.metrics;
    }
}

async function fetchMaintenanceHistory() {
    try {
        const response = await fetch(`${CONFIG.apiUrl}/maintenance`);
        if (!response.ok) throw new Error('Failed to fetch maintenance history');
        const data = await response.json();
        equipmentData.maintenanceHistory = data;
        console.log('✓ Maintenance history loaded');
        return data;
    } catch (error) {
        console.error('Error fetching maintenance history:', error);
        return [];
    }
}

async function loadAllData() {
    console.log('Loading data from backend...');
    await Promise.all([
        fetchEquipment(),
        fetchAlerts(),
        fetchMetrics(),
        fetchMaintenanceHistory()
    ]);
    console.log('✓ All data loaded from backend');
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    console.log('Initializing Predictive Maintenance System...');

    // Load data from backend first
    await loadAllData();

    // Initialize event listeners
    setupNavigationListeners();

    // Initialize charts
    setTimeout(() => {
        initializeCharts();
    }, 100);

    // Start real-time updates
    startRealTimeUpdates();

    // Log initialization complete
    console.log('✓ System initialized successfully');
}

// ============================================
// Navigation & Section Management
// ============================================

function setupNavigationListeners() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
}

function handleNavigation(event) {
    event.preventDefault();
    
    const sectionId = event.target.getAttribute('href').substring(1);
    switchSection(sectionId);
}

function switchSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update nav links styling
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Trigger chart resize if analytics section
    if (sectionId === 'analytics') {
        setTimeout(() => {
            resizeAllCharts();
        }, 100);
    }
    
    // Log section change
    console.log(`✓ Switched to section: ${sectionId}`);
}

// ============================================
// Chart Initialization & Management
// ============================================

function initializeCharts() {
    console.log('Initializing charts...');
    
    try {
        initializeHealthChart();
        initializeTemperatureChart();
        initializeFailureChart();
        initializeForecastChart();
        console.log('✓ All charts initialized');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

function initializeHealthChart() {
    const ctx = document.getElementById('healthChart');
    if (!ctx) return;

    // Get data for the first 3 equipment items for the chart
    const chartEquipment = equipmentData.equipment.slice(0, 3);

    charts.health = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
            datasets: chartEquipment.map((eq, index) => ({
                label: eq.name,
                data: [
                    Math.max(0, eq.health - (Math.random() * 10)), // Slight variation for historical data
                    Math.max(0, eq.health - (Math.random() * 8)),
                    Math.max(0, eq.health - (Math.random() * 6)),
                    Math.max(0, eq.health - (Math.random() * 4)),
                    Math.max(0, eq.health - (Math.random() * 2)),
                    eq.health // Current health
                ],
                borderColor: ['#667eea', '#28a745', '#dc3545'][index],
                backgroundColor: ['rgba(102, 126, 234, 0.1)', 'rgba(40, 167, 69, 0.1)', 'rgba(220, 53, 69, 0.1)'][index],
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: ['#667eea', '#28a745', '#dc3545'][index],
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 12, weight: '600' },
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 },
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

function initializeTemperatureChart() {
    const ctx = document.getElementById('temperatureChart');
    if (!ctx) return;

    // Generate temperature data based on equipment health (lower health = higher temperature)
    const temperatureData = equipmentData.equipment.map(eq => {
        // Simulate temperature based on health (healthy = cooler, unhealthy = hotter)
        const baseTemp = 60;
        const healthFactor = (100 - eq.health) / 100; // 0 for healthy, 1 for unhealthy
        return Math.round(baseTemp + (healthFactor * 40) + (Math.random() * 10 - 5)); // Add some variation
    });

    charts.temperature = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: equipmentData.equipment.map(eq => eq.name),
            datasets: [{
                label: 'Current Temperature (°C)',
                data: temperatureData,
                backgroundColor: equipmentData.equipment.map(eq => getStatusColor(eq.status)),
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.parsed.x + '°C';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 120,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

function initializeFailureChart() {
    const ctx = document.getElementById('failureChart');
    if (!ctx) return;

    // Calculate risk distribution from equipment data
    const lowRisk = equipmentData.equipment.filter(eq => eq.health >= 80).length;
    const mediumRisk = equipmentData.equipment.filter(eq => eq.health >= 60 && eq.health < 80).length;
    const highRisk = equipmentData.equipment.filter(eq => eq.health >= 40 && eq.health < 60).length;
    const critical = equipmentData.equipment.filter(eq => eq.health < 40).length;

    charts.failure = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
            datasets: [{
                data: [lowRisk, mediumRisk, highRisk, critical],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#ff9800',
                    '#dc3545'
                ],
                borderColor: '#fff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { size: 12, weight: '600' },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + ' units';
                        }
                    }
                }
            }
        }
    });
}

async function fetchMaintenanceForecast() {
    try {
        const response = await fetch(`${CONFIG.apiUrl}/metrics/maintenance-forecast`);
        if (!response.ok) throw new Error('Failed to fetch maintenance forecast');
        const data = await response.json();
        console.log('✓ Maintenance forecast loaded');
        return data;
    } catch (error) {
        console.error('Error fetching maintenance forecast:', error);
        return {
            thisWeek: 2,
            nextWeek: 1,
            weekPlus2: 3,
            weekPlus3: 2,
            weekPlus4: 1
        };
    }
}

async function initializeForecastChart() {
    const ctx = document.getElementById('forecastChart');
    if (!ctx) return;

    // Fetch forecast data
    const forecastData = await fetchMaintenanceForecast();

    charts.forecast = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['This Week', 'Next Week', 'Week +2', 'Week +3', 'Week +4'],
            datasets: [{
                label: 'Predicted Maintenance Events',
                data: [
                    forecastData.thisWeek || 2,
                    forecastData.nextWeek || 1,
                    forecastData.weekPlus2 || 3,
                    forecastData.weekPlus3 || 2,
                    forecastData.weekPlus4 || 1
                ],
                backgroundColor: '#667eea',
                borderRadius: 4,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: { size: 11 }
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

function resizeAllCharts() {
    Object.keys(charts).forEach(key => {
        if (charts[key]) {
            charts[key].resize();
        }
    });
}

// ============================================
// Real-Time Updates & Data Simulation
// ============================================

function startRealTimeUpdates() {
    console.log('Starting real-time updates...');
    
    // Update metrics periodically
    setInterval(updateMetrics, CONFIG.updateInterval);
    
    // Simulate real-time health data changes
    setInterval(updateHealthData, CONFIG.updateInterval * 2);
}

async function updateMetrics() {
    // Fetch latest metrics from backend
    await fetchMetrics();

    // Update UI elements if they exist
    updateMetricsDisplay();

    // Log update (in production, this would fetch real data)
    console.log('Metrics updated at', new Date().toLocaleTimeString());
}

function updateMetricsDisplay() {
    // Update operational status
    const operationalElement = document.querySelector('[style*="color: #28a745"]');
    if (operationalElement && equipmentData.metrics.operationalStatus !== undefined) {
        operationalElement.textContent = `${equipmentData.metrics.operationalStatus}%`;
    }

    // Update average RUL
    const rulElement = document.querySelector('[style*="color: #667eea"]');
    if (rulElement && equipmentData.metrics.avgRUL !== undefined) {
        rulElement.textContent = equipmentData.metrics.avgRUL;
    }

    // Update cost saved
    const costElement = document.querySelector('[style*="color: #20c997"]');
    if (costElement && equipmentData.metrics.costSaved !== undefined) {
        costElement.textContent = `$${equipmentData.metrics.costSaved.toLocaleString()}`;
    }

    // Update downtime prevented
    const downtimeElement = document.querySelector('[style*="color: #ff9800"]');
    if (downtimeElement && equipmentData.metrics.downtimePrevented !== undefined) {
        downtimeElement.textContent = `${equipmentData.metrics.downtimePrevented} hrs`;
    }
}

async function updateHealthData() {
    // Simulate small health value changes and update backend
    if (equipmentData.equipment.length > 0) {
        // Pick a random equipment to update
        const randomIndex = Math.floor(Math.random() * equipmentData.equipment.length);
        const equipment = equipmentData.equipment[randomIndex];

        // Generate small random change (-2 to +2)
        const change = (Math.random() - 0.5) * 4;
        const newHealth = Math.max(0, Math.min(100, equipment.health + change));

        try {
            // Update health in backend
            const response = await fetch(`${CONFIG.apiUrl}/equipment/${equipment.id}/health`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ health: Math.round(newHealth) })
            });

            if (response.ok) {
                // Update local data
                equipment.health = Math.round(newHealth);
                equipment.status = getEquipmentStatus(newHealth);
                equipment.lastUpdated = new Date();

                // Update charts if they're initialized
                if (charts.health) {
                    updateHealthChart();
                }
            }
        } catch (error) {
            console.error('Error updating equipment health:', error);
        }
    }
}

function updateHealthChart() {
    if (!charts.health || equipmentData.equipment.length === 0) return;

    // Update the latest data point for each equipment
    const pump1 = equipmentData.equipment.find(eq => eq.id === 'PUMP-001');
    const motor2 = equipmentData.equipment.find(eq => eq.id === 'MOTOR-002');
    const pump3 = equipmentData.equipment.find(eq => eq.id === 'PUMP-003');

    if (pump1) charts.health.data.datasets[0].data[5] = pump1.health;
    if (motor2) charts.health.data.datasets[1].data[5] = motor2.health;
    if (pump3) charts.health.data.datasets[2].data[5] = pump3.health;

    charts.health.update('none');
}

// ============================================
// Equipment & Status Management
// ============================================

function getEquipmentStatus(healthScore) {
    if (healthScore >= 80) return 'good';
    if (healthScore >= 60) return 'warning';
    return 'critical';
}

function getStatusColor(status) {
    const colors = {
        'good': '#28a745',
        'warning': '#ffc107',
        'critical': '#dc3545'
    };
    return colors[status] || '#667eea';
}

function getStatusBadgeClass(status) {
    const classes = {
        'good': 'status-good',
        'warning': 'status-warning',
        'critical': 'status-critical'
    };
    return classes[status] || 'status-good';
}

// ============================================
// Utility Functions
// ============================================

function formatDate(date) {
    if (typeof date === 'string') return date;
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatTime(hours) {
    return Math.round(hours * 10) / 10 + ' hrs';
}

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // In production, this could show a toast notification
}

// ============================================
// Window Resize Handling
// ============================================

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        if (document.getElementById('analytics').classList.contains('active')) {
            resizeAllCharts();
        }
    }, 200);
});

// ============================================
// Export Functions (for external use if needed)
// ============================================

window.PredictiveMaintenanceApp = {
    switchSection,
    updateMetrics,
    getEquipmentStatus,
    formatCurrency,
    showNotification,
    charts,
    config: CONFIG,
    data: equipmentData
};

// Log initialization
console.log('%cPredictive Maintenance System v1.0', 'color: #667eea; font-size: 18px; font-weight: bold;');
console.log('%cApp is ready to use', 'color: #28a745; font-size: 12px;');
