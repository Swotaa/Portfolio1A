// Immediately Invoked Function Expression (IIFE) to prevent global scope pollution
(function() {
    // State management
    const state = {
        theme: localStorage.getItem('theme') || 'light',
        language: localStorage.getItem('language') || 'fr'
    };

    // DOM Elements
    const elements = {
        hamburger: null,
        menu: null,
        themeButton: null,
        languageButton: null,
        languageMenu: null,
        languageOptions: null,
        modal: null
    };

    // Project data
    const projectsData = {
        university: {
            title: "SAE 2.01 - 2.05",
            description: "Adaptation d'un jeu de société en numérique.",
            technologies: ["C#", "XAML", ".NET"],
            images: ["/assets/univ1.jpg"]
        },
        personal: {
            title: "ValIA",
            description: "Création d'une intelligence artificielle capable de \"jouer\" à Valorant.",
            technologies: ["Python", "Yolo (You Only Look Once)", "OpenCV"],
            images: ["/assets/perso1.jpg"]
        }
    };

    // Initialize application
    function init() {
        cacheElements();
        setupEventListeners();
        applyInitialState();
    }

    // Cache DOM elements
    function cacheElements() {
        elements.hamburger = document.querySelector('.hamburger');
        elements.menu = document.querySelector('.menu');
        elements.themeButton = document.querySelector('.theme-button');
        elements.languageButton = document.querySelector('.language-button');
        elements.languageMenu = document.querySelector('.language-menu');
        elements.languageOptions = document.querySelectorAll('.language-option');
        elements.modal = document.getElementById('projectModal');
    }

    // Setup event listeners
    function setupEventListeners() {
        // Hamburger menu
        elements.hamburger?.addEventListener('click', toggleMenu);
        
        // Theme switcher
        elements.themeButton?.addEventListener('click', toggleTheme);
        
        // Language switcher
        elements.languageButton?.addEventListener('click', toggleLanguageMenu);
        elements.languageOptions?.forEach(option => {
            option.addEventListener('click', () => changeLanguage(option.dataset.lang));
        });

        // Project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => showProjectModal(card.dataset.project));
        });

        // Modal close
        elements.modal?.querySelector('.close-modal')?.addEventListener('click', hideModal);
        elements.modal?.addEventListener('click', e => e.target === elements.modal && hideModal());

        // Outside clicks
        document.addEventListener('click', handleOutsideClicks);
    }

    // Apply initial state
    function applyInitialState() {
        if (state.theme === 'dark') document.body.classList.add('dark-theme');
        updateContent(state.language);
    }

    // Event handlers
    function toggleMenu() {
        elements.hamburger.classList.toggle('active');
        elements.menu.classList.toggle('active');
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        state.theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', state.theme);
    }

    function toggleLanguageMenu(e) {
        e.stopPropagation();
        elements.languageMenu.classList.toggle('active');
    }

    function changeLanguage(lang) {
        state.language = lang;
        localStorage.setItem('language', lang);
        updateContent(lang);
        elements.languageMenu.classList.remove('active');
    }

    function handleOutsideClicks(e) {
        // Close menu if clicking outside
        if (!elements.menu?.contains(e.target) && 
            !elements.hamburger?.contains(e.target) && 
            elements.menu?.classList.contains('active')) {
            toggleMenu();
        }

        // Close language menu if clicking outside
        if (!elements.languageButton?.contains(e.target) && 
            !elements.languageMenu?.contains(e.target)) {
            elements.languageMenu?.classList.remove('active');
        }
    }

    function showProjectModal(projectId) {
        const project = projectsData[projectId];
        if (!project || !elements.modal) return;
    
        elements.modal.querySelector('.modal-body').innerHTML = generateProjectContent(project);
        elements.modal.style.display = 'block';
        document.documentElement.style.overflow = 'hidden';
        document.body.classList.add('modal-open');
    }
    
    function hideModal() {
        if (!elements.modal) return;
        elements.modal.style.display = 'none';
        document.documentElement.style.overflow = '';
        document.body.classList.remove('modal-open');
    }

    // Content updates
    function updateContent(lang) {
        if (!translations?.[lang]) {
            console.error('Translations not found');
            return;
        }

        try {
            updateMenuItems(lang);
            updateSections(lang);
            updateProjectCards(lang);
        } catch (error) {
            console.error('Error updating content:', error);
        }
    }

    function updateMenuItems(lang) {
        const menuItems = {
            '#accueil': 'home',
            '#about': 'about',
            '#projects': 'projects',
            '#contact': 'contact'
        };

        Object.entries(menuItems).forEach(([selector, key]) => {
            document.querySelector(`a[href="${selector}"]`).textContent = translations[lang].menu[key];
        });

        document.querySelector('.buttons').textContent = translations[lang].menu.cv;
    }

    function updateSections(lang) {
        ['accueil', 'about', 'projects', 'contact'].forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (!section) return;
    
            const title = section.querySelector('h1');
            const content = section.querySelector('p');
    
            if (title) title.textContent = translations[lang][sectionId].title;
            
            // Special handling for accueil/welcome message
            if (sectionId === 'accueil' && content) {
                content.innerHTML = translations[lang].accueil.welcome;
                stylizeNames(content);
            } else if (content && translations[lang][sectionId].content) {
                content.innerHTML = translations[lang][sectionId].content;
            }
        });
    }

    function updateProjectCards(lang) {
        document.querySelectorAll('.project-card').forEach(card => {
            const type = card.dataset.project;
            if (!translations[lang].projects[type]) return;

            const title = card.querySelector('h3');
            const preview = card.querySelector('.project-preview');

            if (title) title.textContent = translations[lang].projects[type].title;
            if (preview) preview.textContent = translations[lang].projects[type].preview;
        });
    }

    // Utility functions
    function stylizeNames(element) {
        element.innerHTML = element.innerHTML
            .replace('Yanis', '<span class="dancing-script-body">Y</span>anis')
            .replace('Ossedat', '<span class="dancing-script-body">O</span>ssedat');
    }

    function generateProjectContent(project) {
        const lang = state.language;
        const projectType = Object.keys(projectsData).find(key => projectsData[key].title === project.title);
        
        if (!projectType || !translations[lang].projects[projectType]) {
            console.error('Project translation not found');
            return '';
        }

        return `
            <h2>${translations[lang].projects[projectType].title}</h2>
            <p>${translations[lang].projects[projectType].description}</p>
            <div class="technologies">
                <h3>${translations[lang].projects.technologies_title}</h3>
                <ul>${project.technologies.map(tech => `<li>${tech}</li>`).join('')}</ul>
            </div>
            <div class="project-images">
                ${project.images.map(img => `<img src="${img}" alt="Screenshot">`).join('')}
            </div>
        `;
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);
})();