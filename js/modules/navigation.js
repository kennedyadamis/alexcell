import { debounce } from '../utils/utils.js';
import { supabase } from '../api/supabase.js';

export function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        // Accessibility: Update aria-expanded
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // Evitar outros listeners
            
            const isExpanded = nav.classList.contains('active');
            
            nav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            
            // Menu mobile elegante e normal
            if (nav.classList.contains('active')) {
                // Limpar estilos conflitantes
                nav.removeAttribute('style');
                nav.style.cssText = '';
                
                // Aplicar estilos de menu mobile normal
                nav.style.setProperty('display', 'flex', 'important');
                nav.style.setProperty('position', 'fixed', 'important');
                nav.style.setProperty('top', '70px', 'important'); // Logo abaixo do header
                nav.style.setProperty('left', '0', 'important');
                nav.style.setProperty('right', '0', 'important');
                nav.style.setProperty('width', '100%', 'important');
                nav.style.setProperty('background', '#1c1c1c', 'important'); // Preto da marca
                nav.style.setProperty('z-index', '9999', 'important');
                nav.style.setProperty('flex-direction', 'column', 'important');
                nav.style.setProperty('padding', '10px 0', 'important');
                nav.style.setProperty('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)', 'important');
                nav.style.setProperty('border-top', '2px solid #2E8B57', 'important'); // Verde da marca
                
                // Menu compacto sem rolagem
                nav.innerHTML = `
                    <li><a href="index.html" style="
                        display: block !important;
                        color: #ffffff !important;
                        padding: 10px 25px !important;
                        text-decoration: none !important;
                        font-weight: 600 !important;
                        font-size: 15px !important;
                        border-bottom: 1px solid #333 !important;
                        transition: all 0.3s ease !important;
                    " onmouseover="this.style.background='#2E8B57'" onmouseout="this.style.background='transparent'">Início</a></li>
                    
                    <li><a href="servicos.html" style="
                        display: block !important;
                        color: #ffffff !important;
                        padding: 10px 25px !important;
                        text-decoration: none !important;
                        font-weight: 600 !important;
                        font-size: 15px !important;
                        border-bottom: 1px solid #333 !important;
                        transition: all 0.3s ease !important;
                    " onmouseover="this.style.background='#2E8B57'" onmouseout="this.style.background='transparent'">Serviços</a></li>
                    
                    <li><a href="sobre.html" style="
                        display: block !important;
                        color: #ffffff !important;
                        padding: 10px 25px !important;
                        text-decoration: none !important;
                        font-weight: 600 !important;
                        font-size: 15px !important;
                        border-bottom: 1px solid #333 !important;
                        transition: all 0.3s ease !important;
                    " onmouseover="this.style.background='#2E8B57'" onmouseout="this.style.background='transparent'">Sobre Nós</a></li>
                    
                    <li><a href="contato.html" style="
                        display: block !important;
                        color: #ffffff !important;
                        padding: 10px 25px !important;
                        text-decoration: none !important;
                        font-weight: 600 !important;
                        font-size: 15px !important;
                        border-bottom: 1px solid #333 !important;
                        transition: all 0.3s ease !important;
                    " onmouseover="this.style.background='#2E8B57'" onmouseout="this.style.background='transparent'">Contato</a></li>
                    
                    <li><a href="consultar-os.html" style="
                        display: block !important;
                        color: #ffffff !important;
                        padding: 10px 25px !important;
                        text-decoration: none !important;
                        font-weight: 600 !important;
                        font-size: 15px !important;
                        border-bottom: 1px solid #333 !important;
                        transition: all 0.3s ease !important;
                    " onmouseover="this.style.background='#2E8B57'" onmouseout="this.style.background='transparent'">Consultar OS</a></li>
                    
                    <li><a href="auth.html" style="
                        display: block !important;
                        color: #ffffff !important;
                        padding: 10px 25px !important;
                        text-decoration: none !important;
                        font-weight: 600 !important;
                        font-size: 15px !important;
                    " onmouseover="this.style.background='#2E8B57'" onmouseout="this.style.background='transparent'">Login</a></li>
                `;
                

            } else {
                nav.style.setProperty('display', 'none', 'important');
            }
            

            
            // Accessibility: Focus management
            if (!isExpanded) {
                const firstLink = nav.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });

        // Fechar menu ao clicar em um link (mobile)
        function setupMenuLinks() {
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    nav.style.setProperty('display', 'none', 'important');
                });
            });
        }
        
        // Configurar links após o menu ser criado
        setTimeout(setupMenuLinks, 100);

        // Fechar menu ao redimensionar para desktop
        const handleResize = debounce(() => {
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                nav.style.display = ''; // Limpar estilos inline
            }
        }, 250);

        window.addEventListener('resize', handleResize);

        // Accessibility: Close menu with Escape key - TEMPORARIAMENTE DESABILITADO
        /*document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                nav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                nav.style.display = 'none'; // Forçar fechamento
                menuToggle.focus();
            }
        });*/

        // Performance: Close menu when clicking outside (COM DELAY)
        document.addEventListener('click', (e) => {
            // Delay para evitar conflito com o clique do botão
            setTimeout(() => {
                if (!menuToggle.contains(e.target) && !nav.contains(e.target) && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    nav.style.setProperty('display', 'none', 'important');
                }
            }, 100);
        });
    }

    // Controlar visibilidade da aba "Ordem de Serviço"
    updateNavigationVisibility();
}

// Atualiza a navegação com base na sessão (recebe a sessão como parâmetro)
export function updateNavigationVisibility(session) {
    const loginLinks = document.querySelectorAll('a[href="auth.html"]');
    loginLinks.forEach(link => {
        if (session) {
            link.textContent = 'Dashboard';
            link.href = 'dashboard.html';
        } else {
            link.textContent = 'Login';
            link.href = 'auth.html';
        }
    });
} 