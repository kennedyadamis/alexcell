export function formatCPF(cpf) {
    return cpf.replace(/\D/g, '')
              .replace(/(\d{3})(\d)/, '$1.$2')
              .replace(/(\d{3})(\d)/, '$1.$2')
              .replace(/(\d{3})(\d{1,2})/, '$1-$2')
              .replace(/(-\d{2})\d+?$/, '$1');
}

export function formatPhone(phone) {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Se tem 11 dígitos (celular com 9)
    if (cleanPhone.length === 11) {
        return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    // Se tem 10 dígitos (fixo ou celular antigo)
    else if (cleanPhone.length === 10) {
        return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    // Se tem menos dígitos, retorna como está
    else {
        return phone;
    }
}

export function formatValueForDisplay(value) {
    if (value === null || value === undefined) return '0,00';
    const num = parseFloat(value);
    if (isNaN(num)) return '0,00';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDateForDisplay(dateValue, includeTime = false) {
    if (!dateValue) return 'Não definida';
    
    // Se for uma string no formato YYYY-MM-DD (input date), formatar diretamente
    if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateValue.split('-');
        return `${day}/${month}/${year}`;
    }
    
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) {
        return dateValue; // Retorna a string original se não for uma data válida
    }
    
    if (includeTime) {
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    return date.toLocaleDateString('pt-BR');
}

export function formatCurrencyBR(value) {
    if (typeof value !== 'number') {
        value = parseFloat(value);
    }
    if (isNaN(value)) {
        return 'R$ 0,00';
    }
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatPhoneMask(value) {
    value = value.replace(/\D/g, ''); // Remove tudo que não é dígito
    if (value.length > 10) {
        return value.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
        return value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        return value.replace(/^(\d\d)(\d{0,5})/, '($1) $2');
    } else {
        return value.replace(/^(\d*)/, '($1');
    }
}
