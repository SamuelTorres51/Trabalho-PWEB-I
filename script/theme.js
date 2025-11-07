// ============================================
// BARBEARIA STYLE - GERENCIADOR DE TEMA
// ============================================

/**
 * Inicializa o sistema de tema escuro/claro
 */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Aplica o tema salvo
    applyTheme(savedTheme);
    
    // Configura o botão toggle
    if (themeToggle) {
        updateToggleIcon(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            applyTheme(newTheme);
            updateToggleIcon(newTheme);
            saveTheme(newTheme);
        });
    }
}

/**
 * Aplica o tema ao body
 */
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

/**
 * Atualiza o ícone do botão toggle
 */
function updateToggleIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    if (icon) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
            themeToggle.title = 'Ativar modo claro';
        } else {
            icon.className = 'fas fa-moon';
            themeToggle.title = 'Ativar modo escuro';
        }
    }
}

/**
 * Salva a preferência do tema no localStorage
 */
function saveTheme(theme) {
    localStorage.setItem('theme', theme);
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
}

