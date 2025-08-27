import { RECORDS_PER_PAGE } from './constants.js';

export function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

export function trapFocus(element) {
    // Importar FOCUSABLE_ELEMENTS de constants.js se necessário, ou definir aqui
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableContent = element.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    document.addEventListener('keydown', function(e) {
        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        if (!isTabPressed) return;

        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    });
}

export function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        let imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

export function preloadCriticalResources() {
    const criticalImages = document.querySelectorAll('img.critical');
    criticalImages.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
}

export function setupModalCloseEvents() {
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modalId = btn.getAttribute('data-modal');
            if (modalId) {
                const modal = document.getElementById(modalId);
                if (modal) modal.style.display = 'none';
            } else {
                // Fecha o modal pai
                let parent = btn.closest('.modal-overlay');
                if (parent) parent.style.display = 'none';
            }
        });
    });
    
    // Evento específico para o botão de fechar modal de visualização de OS
    const closeViewOSBtn = document.getElementById('btn-close-view-os-modal');
    if (closeViewOSBtn) {
        closeViewOSBtn.addEventListener('click', function() {
            // Importa dinamicamente a função closeViewOSModal
            import('../modules/serviceOrders.js').then(module => {
                module.closeViewOSModal();
            });
        });
    }
}

export function updatePaginationUI(module, currentPage, totalRecords) {
    const paginationContainer = document.getElementById(`${module}-pagination`);
    const pageInfoSpan = document.getElementById(`${module}-page-info`);
    const prevBtn = document.getElementById(`${module}-prev-page`);
    const nextBtn = document.getElementById(`${module}-next-page`);

    if (!paginationContainer || !pageInfoSpan || !prevBtn || !nextBtn) {
        return;
    }

    const totalPages = Math.ceil(totalRecords / RECORDS_PER_PAGE);

    pageInfoSpan.textContent = `Página ${currentPage} de ${totalPages || 1} (${totalRecords} registros)`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;

    // Adiciona event listeners se ainda não tiverem sido adicionados
    // (Evita adicionar múltiplos listeners em recargas da tabela)
    if (!prevBtn.dataset.listenerAdded) {
        prevBtn.addEventListener('click', async () => {
            if (currentPage > 1) {
                if (module === 'os') {
                    const { loadOSTable } = await import('../modules/serviceOrders.js');
                    const { getSelectedStoreId } = await import('../auth/auth.js');
                    loadOSTable(currentPage - 1, getSelectedStoreId());
                }
                if (module === 'customers') {
                    const { loadCustomersTable } = await import('../modules/customers.js');
                    loadCustomersTable(currentPage - 1);
                }
                if (module === 'warranty') {
                    const { loadWarrantyTable } = await import('../modules/warranty.js');
                    loadWarrantyTable(currentPage - 1);
                }
            }
        });
        prevBtn.dataset.listenerAdded = true;
    }

    if (!nextBtn.dataset.listenerAdded) {
        nextBtn.addEventListener('click', async () => {
            if (currentPage < totalPages) {
                if (module === 'os') {
                    const { loadOSTable } = await import('../modules/serviceOrders.js');
                    const { getSelectedStoreId } = await import('../auth/auth.js');
                    loadOSTable(currentPage + 1, getSelectedStoreId());
                }
                if (module === 'customers') {
                    const { loadCustomersTable } = await import('../modules/customers.js');
                    loadCustomersTable(currentPage + 1);
                }
                if (module === 'warranty') {
                    const { loadWarrantyTable } = await import('../modules/warranty.js');
                    loadWarrantyTable(currentPage + 1);
                }
            }
        });
        nextBtn.dataset.listenerAdded = true;
    }
}

export function showToast(message, type = 'success') {
    let toast = document.getElementById('toast-notification');
    let toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) {
        toast = document.createElement('div');
        toast.id = 'toast-notification';
        toast.className = 'toast';
        toastMsg = document.createElement('span');
        toastMsg.id = 'toast-message';
        toast.appendChild(toastMsg);
        document.body.appendChild(toast);
    }
    toastMsg.textContent = message;
    toast.className = 'toast show ' + (type === 'error' ? 'error' : 'success');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}