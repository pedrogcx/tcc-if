document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA GERAL DO SITE (MENU, RODAPÉ, ETC) ---
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('overlay');

    if (hamburgerMenu && mobileNav && overlay) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('open');
            mobileNav.classList.toggle('open');
            
            // Animação do overlay
            if (mobileNav.classList.contains('open')) {
                overlay.style.opacity = 0.5;
                overlay.style.pointerEvents = 'auto';
            } else {
                overlay.style.opacity = 0;
                overlay.style.pointerEvents = 'none';
            }
        });

        overlay.addEventListener('click', () => {
             hamburgerMenu.click();
        });
    }

    // Atualiza o ano no rodapé
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});