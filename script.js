// Data Paket Hosting
const hostingPackages = [
    { name: '1GB', price: '3.000', ram: '1.5GB', disk: '3GB', cpu: '100%' },
    { name: '2GB', price: '5.000', ram: '3.5GB', disk: '6GB', cpu: '190%' },
    { name: '3GB', price: '7.000', ram: '4GB', disk: '7GB', cpu: '250%' },
    { name: '4GB', price: '9.000', ram: '5GB', disk: '9GB', cpu: '290%' },
    { name: '5GB', price: '11.000', ram: '6GB', disk: '13GB', cpu: '330%' },
    { name: '6GB', price: '13.000', ram: '7GB', disk: '15GB', cpu: '450%' },
    { name: '7GB', price: '15.000', ram: '8GB', disk: '17GB', cpu: '500%' },
    { name: 'Premium', price: '25.000', ram: 'Unlimited', disk: '25GB', cpu: 'Unlimited', isPremium: true },
];

// Data Paket Sewa Bot
const botPackages = [
    { duration: '15 Hari', price: '5.000', features: ['Bisa Invite Bot ke Grup', 'Akses Premium Dasar', 'Online 24 Jam', 'Anti Delay / Error', 'Fitur terus bertambah'] },
    { duration: '1 Bulan', price: '10.000', features: ['Bisa Invite Bot ke Grup', 'Akses Premium Penuh', 'Online 24 Jam', 'Anti Delay / Error', 'Fitur terus bertambah'] },
    { duration: '2 Bulan', price: '20.000', features: ['Bisa Invite Bot ke Grup', 'Akses Premium Penuh', 'Online 24 Jam (Prioritas)', 'Anti Delay / Error', 'Fitur terus bertambah + Request Dasar'] },
    { duration: 'Permanen', price: '80.000', features: ['Bisa Invite Bot ke Grup', 'Akses PREMIUM SEUMUR HIDUP', 'Online 24 Jam (Prioritas Tertinggi)', 'Anti Delay / Error', 'Fitur terus bertambah + Request Penuh'], isBest: true },
];


// 1. Function to populate Hosting Cards using the template
function populateHostingCards() {
    const container = document.getElementById('hosting-cards-container');
    const template = document.getElementById('hosting-card-template');
    if (!container || !template) return;
    
    container.innerHTML = ''; // Clear existing content
    
    hostingPackages.forEach(pkg => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('div');

        // Set styles for Premium card
        if (pkg.isPremium) {
            card.classList.add('bg-neon-blue/10', 'border-neon-blue');
        }

        // Populate data
        clone.querySelector('[data-id="name"]').textContent = pkg.name + '/bulan';
        clone.querySelector('[data-id="price"]').textContent = pkg.price;
        clone.querySelector('[data-id="ram"]').textContent = pkg.ram;
        clone.querySelector('[data-id="disk"]').textContent = pkg.disk;
        clone.querySelector('[data-id="cpu"]').textContent = pkg.cpu;
        
        container.appendChild(clone);
    });
}

// 2. Function to populate Bot Cards using the template
function populateBotCards() {
    const container = document.getElementById('bot-cards-container');
    const template = document.getElementById('bot-card-template');
    if (!container || !template) return;
    
    container.innerHTML = ''; // Clear existing content
    
    botPackages.forEach(pkg => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('div');
        
        // Set styles for Best/Permanen card
        if (pkg.isBest) {
            card.classList.add('bg-neon-blue/10', 'border-neon-blue', 'shadow-2xl');
            const durationElement = clone.querySelector('[data-id="duration"]');
            durationElement.innerHTML = `<span class="bg-neon-blue text-white text-xs px-3 py-1 rounded-full absolute -top-3 left-1/2 transform -translate-x-1/2 font-semibold">BEST VALUE</span><br>${pkg.duration}`;
        } else {
            clone.querySelector('[data-id="duration"]').textContent = pkg.duration;
        }
        
        clone.querySelector('[data-id="price"]').textContent = pkg.price;

        const ul = clone.querySelector('ul');
        pkg.features.forEach(feature => {
            const li = document.createElement('li');
            li.className = 'flex items-start text-sm text-text-white/80';
            // Note: Lucide icons are automatically initialized by the window.onload function
            li.innerHTML = `<i data-lucide="zap" class="w-4 h-4 mr-2 mt-1 text-neon-blue/90 flex-shrink-0"></i> <span>${feature}</span>`;
            ul.appendChild(li);
        });
        
        container.appendChild(clone);
    });
}

// 3. Navigation Logic (Tab Switching)
function setupNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.content-section');
    const sidebar = document.getElementById('sidebar');

    function showSection(sectionId) {
        sections.forEach(section => {
            // Hide all sections
            section.style.display = 'none';
            section.classList.remove('is-visible');
        });

        const activeSection = document.getElementById(`section-${sectionId}`);
        if (activeSection) {
            // Show the active section with a fade-in animation
            activeSection.style.display = 'block';
            // Timeout to ensure transition starts after display:block
            setTimeout(() => {
                activeSection.classList.add('is-visible');
                // Re-initialize Lucide Icons for newly displayed content
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }, 50); 
        }
        
        // Set the active class on the sidebar link
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`.sidebar-link[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Close sidebar on mobile after clicking
        if (window.innerWidth < 768 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    }

    // Add event listener to all navigation triggers (sidebar and homepage button)
    const allNavTriggers = document.querySelectorAll('.sidebar-link, .sidebar-nav-trigger');
    
    allNavTriggers.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Get section ID from data-section or href (for the homepage button)
            const sectionId = link.getAttribute('data-section') || link.getAttribute('href').replace('#', '');
            showSection(sectionId);
        });
    });

    // Show default section (Beranda) on initial load
    showSection('beranda');
}

// 4. Scroll Fade-in Animation (Intersection Observer)
function setupIntersectionObserver() {
    const fadeIns = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // Only trigger if the scrolled section is currently displayed
            const parentSection = entry.target.closest('.content-section');
            if (entry.isIntersecting && parentSection && parentSection.style.display !== 'none') {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 
    });

    // Observe all elements with the fade-in-section class
    fadeIns.forEach(el => {
        observer.observe(el);
    });
}

// 5. Sidebar Toggle (Mobile Responsiveness)
function setupSidebarToggle() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const contentArea = document.getElementById('content');
    if (!sidebar || !sidebarToggle || !contentArea) return;

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
    
    // Close sidebar when clicking content area on mobile (if open)
    contentArea.addEventListener('click', () => {
        if (window.innerWidth < 768 && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });
}

// Run all setup functions when the document is fully loaded
window.onload = function() {
    // 1. Populate dynamic content
    populateHostingCards();
    populateBotCards();
    
    // 2. Setup Navigation (Tab Switching)
    setupNavigation();
    
    // 3. Setup Sidebar Toggle
    setupSidebarToggle();
    
    // 4. Initialize Lucide Icons for all initial content
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // 5. Setup Fade-in Animation Observer
    setupIntersectionObserver();
}

