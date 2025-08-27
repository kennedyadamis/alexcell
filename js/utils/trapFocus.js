/**
 * Gerencia o foco dentro de um elemento (usado em modais para acessibilidade)
 * @param {HTMLElement} element - Elemento que deve conter o foco
 */
export function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    function handleTabKey(e) {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }

    element.addEventListener('keydown', handleTabKey);
    
    // Foca no primeiro elemento focável
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }

    // Retorna função para remover o listener
    return () => {
        element.removeEventListener('keydown', handleTabKey);
    };
} 