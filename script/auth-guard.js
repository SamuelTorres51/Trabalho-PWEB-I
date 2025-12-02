// ============================================
// BARBEARIA STYLE - PROTEÇÃO DE ROTAS
// ============================================

/**
 * Verifica se o usuário está autenticado
 * Se não estiver, redireciona para a página de login
 */
(function() {
    // Lista de páginas que não precisam de autenticação
    const publicPages = [
        'login.html',
        'index.html',
        'home.html'
    ];

    // Verifica se a página atual é pública
    const currentPage = window.location.pathname.split('/').pop();
    const isPublicPage = publicPages.some(page => currentPage.includes(page));

    // Se for página pública, não precisa verificar autenticação
    if (isPublicPage) {
        return;
    }

    // Verifica se tem token de autenticação
    const token = localStorage.getItem('authToken');
    const usuario = localStorage.getItem('usuario');

    // Se não tiver token ou dados do usuário, redireciona para login
    if (!token || !usuario) {
        console.log('Usuário não autenticado. Redirecionando para login...');
        window.location.href = '/index/login.html';
        return;
    }

    // Opcionalmente, verifica se o token ainda é válido
    // (isso pode ser feito de forma assíncrona)
    if (window.api) {
        window.api.verificarToken()
            .catch(error => {
                console.error('Token inválido ou expirado:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('usuario');
                window.location.href = '/index/login.html';
            });
    }
})();
