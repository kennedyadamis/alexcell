import { supabase } from '../api/supabase.js';
import { showToast } from '../utils/utils.js';
import { formatCurrencyBR, formatDateForDisplay } from '../utils/formatters.js';
import { getSelectedStoreId } from '../utils/globals.js';
import { canViewCostPrices } from '../utils/costPermissions.js';

// Função para gerar relatório de produtos mais vendidos
export async function generateTopProductsReport() {
    try {
        showToast('Gerando relatório de produtos mais vendidos...', 'info');
        
        const reportContent = document.getElementById('top-products-report-content');
        if (!reportContent) return;
        
        reportContent.innerHTML = '<div class="loading-spinner"></div>';
        
        // Buscar produtos mais vendidos
        const { data, error } = await supabase
            .from('sales')
            .select('items')
            .eq('store_id', getSelectedStoreId())
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!data || data.length === 0) {
            reportContent.innerHTML = '<p class="no-data-message">Nenhum produto vendido no período.</p>';
            return;
        }
        
        // Processar dados de vendas para obter produtos mais vendidos
        const productMap = new Map();
        
        data.forEach(sale => {
            if (sale.items && Array.isArray(sale.items)) {
                sale.items.forEach(item => {
                    if (!item.product_id || !item.name) return;
                    
                    const key = item.product_id.toString();
                    if (!productMap.has(key)) {
                        productMap.set(key, {
                            id: item.product_id,
                            name: item.name,
                            quantity: 0,
                            total_value: 0,
                            total_cost: 0
                        });
                    }
                    
                    const product = productMap.get(key);
                    const quantity = item.quantity || 1;
                    
                    product.quantity += quantity;
                    product.total_value += (item.price || 0) * quantity;
                    product.total_cost += (item.cost_price || 0) * quantity;
                });
            }
        });
        
        // Converter para array e ordenar por quantidade
        const topProducts = Array.from(productMap.values())
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 20); // Limitar aos 20 mais vendidos
        
        if (topProducts.length === 0) {
            reportContent.innerHTML = '<p class="no-data-message">Nenhum produto vendido no período.</p>';
            return;
        }
        
        // Verificar permissão para ver preços de custo
        const hasPermission = await canViewCostPrices();
        
        // Gerar HTML do relatório
        let html = `
            <div class="report-header">
                <h4>Top Produtos Vendidos</h4>
                <p>Gerado em: ${formatDateForDisplay(new Date(), true)}</p>
            </div>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Produto</th>
                        <th>Quantidade</th>
                        <th>Valor Total</th>
                        ${hasPermission ? '<th>Custo Total</th><th>Lucro</th>' : ''}
                    </tr>
                </thead>
                <tbody>
        `;
        
        topProducts.forEach((item, index) => {
            const profit = item.total_value - (item.total_cost || 0);
            
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrencyBR(item.total_value)}</td>
                    ${hasPermission ? `
                        <td>${formatCurrencyBR(item.total_cost || 0)}</td>
                        <td>${formatCurrencyBR(profit)}</td>
                    ` : ''}
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
            <div class="report-actions">
                <button class="btn btn-secondary" onclick="window.print()">Imprimir Relatório</button>
                <button class="btn btn-secondary" onclick="exportToExcel('top-products-report')">Exportar para Excel</button>
            </div>
        `;
        
        reportContent.innerHTML = html;
        showToast('Relatório gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar relatório de produtos mais vendidos:', error);
        showToast('Erro ao gerar relatório: ' + (error.message || error), 'error');
        
        const reportContent = document.getElementById('top-products-report-content');
        if (reportContent) {
            reportContent.innerHTML = '<p class="error-message">Erro ao gerar relatório. Tente novamente.</p>';
        }
    }
}

// Função para gerar relatório de fluxo de caixa por período
export async function generateCashFlowReport() {
    try {
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        
        if (!startDate || !endDate) {
            showToast('Selecione as datas de início e fim', 'warning');
            return;
        }
        
        showToast('Gerando relatório de fluxo de caixa...', 'info');
        
        const reportContent = document.getElementById('cash-flow-report-content');
        if (!reportContent) return;
        
        reportContent.innerHTML = '<div class="loading-spinner"></div>';
        
        // Buscar dados do fluxo de caixa no período
        const { data: cashRegisters, error: cashError } = await supabase
            .from('cash_registers')
            .select('*')
            .eq('store_id', getSelectedStoreId())
            .gte('opened_at', startDate + 'T00:00:00')
            .lte('closed_at', endDate + 'T23:59:59')
            .order('opened_at', { ascending: false });
            
        if (cashError) throw cashError;
        
        if (!cashRegisters || cashRegisters.length === 0) {
            reportContent.innerHTML = '<p class="no-data-message">Nenhum registro de caixa encontrado no período selecionado.</p>';
            return;
        }
        
        // Buscar entradas e saídas para cada caixa
        const cashIds = cashRegisters.map(cash => cash.id);
        
        const { data: entries, error: entriesError } = await supabase
            .from('cash_register_entries')
            .select('*')
            .in('cash_register_id', cashIds);
            
        if (entriesError) throw entriesError;
        
        // Buscar vendas para cada caixa
        const { data: sales, error: salesError } = await supabase
            .from('sales')
            .select('*')
            .in('cash_register_id', cashIds);
            
        if (salesError) throw salesError;
        
        // Verificar permissão para ver preços de custo
        const hasPermission = await canViewCostPrices();
        
        // Calcular totais
        let totalOpeningBalance = 0;
        let totalClosingBalance = 0;
        let totalSales = 0;
        let totalEntries = 0;
        let totalWithdrawals = 0;
        let totalCosts = 0;
        let totalProfit = 0;
        
        cashRegisters.forEach(cash => {
            totalOpeningBalance += cash.opening_balance || 0;
            totalClosingBalance += cash.closing_balance || 0;
        });
        
        if (entries) {
            entries.forEach(entry => {
                if (entry.type === 'sale' || entry.type === 'service') {
                    totalSales += entry.amount || 0;
                } else if (entry.amount > 0) {
                    totalEntries += entry.amount || 0;
                } else {
                    totalWithdrawals += Math.abs(entry.amount || 0);
                }
            });
        }
        
        if (sales && hasPermission) {
            sales.forEach(sale => {
                if (sale.items) {
                    sale.items.forEach(item => {
                        totalCosts += (item.cost_price || 0) * (item.quantity || 1);
                    });
                }
            });
            
            totalProfit = totalSales - totalCosts;
        }
        
        // Gerar HTML do relatório
        let html = `
            <div class="report-header">
                <h4>Relatório de Fluxo de Caixa</h4>
                <p>Período: ${formatDateForDisplay(new Date(startDate))} a ${formatDateForDisplay(new Date(endDate))}</p>
            </div>
            <div class="report-summary">
                <div class="summary-item">
                    <span class="summary-label">Total de Vendas:</span>
                    <span class="summary-value">${formatCurrencyBR(totalSales)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total de Entradas:</span>
                    <span class="summary-value">${formatCurrencyBR(totalEntries)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Total de Saídas:</span>
                    <span class="summary-value">${formatCurrencyBR(totalWithdrawals)}</span>
                </div>
                ${hasPermission ? `
                <div class="summary-item">
                    <span class="summary-label">Total de Custos:</span>
                    <span class="summary-value">${formatCurrencyBR(totalCosts)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Lucro Total:</span>
                    <span class="summary-value">${formatCurrencyBR(totalProfit)}</span>
                </div>
                ` : ''}
            </div>
            <h5>Detalhes por Caixa</h5>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Abertura</th>
                        <th>Fechamento</th>
                        <th>Vendas</th>
                        <th>Entradas</th>
                        <th>Saídas</th>
                        ${hasPermission ? '<th>Lucro</th>' : ''}
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (const cash of cashRegisters) {
            // Calcular totais para este caixa
            const cashEntries = entries ? entries.filter(e => e.cash_register_id === cash.id) : [];
            const cashSales = cashEntries.filter(e => e.type === 'sale' || e.type === 'service');
            const cashDeposits = cashEntries.filter(e => e.type !== 'sale' && e.type !== 'service' && e.amount > 0);
            const cashWithdrawals = cashEntries.filter(e => e.amount < 0);
            
            const totalCashSales = cashSales.reduce((sum, e) => sum + (e.amount || 0), 0);
            const totalCashDeposits = cashDeposits.reduce((sum, e) => sum + (e.amount || 0), 0);
            const totalCashWithdrawals = cashWithdrawals.reduce((sum, e) => sum + Math.abs(e.amount || 0), 0);
            
            // Calcular lucro se tiver permissão
            let cashProfit = 0;
            if (hasPermission) {
                const cashSalesIds = cashSales.map(e => e.sale_id).filter(id => id);
                const relatedSales = sales ? sales.filter(s => cashSalesIds.includes(s.id)) : [];
                
                let cashCosts = 0;
                relatedSales.forEach(sale => {
                    if (sale.items) {
                        sale.items.forEach(item => {
                            cashCosts += (item.cost_price || 0) * (item.quantity || 1);
                        });
                    }
                });
                
                cashProfit = totalCashSales - cashCosts;
            }
            
            html += `
                <tr>
                    <td>${formatDateForDisplay(new Date(cash.opened_at))}</td>
                    <td>${formatCurrencyBR(cash.opening_balance || 0)}</td>
                    <td>${formatCurrencyBR(cash.closing_balance || 0)}</td>
                    <td>${formatCurrencyBR(totalCashSales)}</td>
                    <td>${formatCurrencyBR(totalCashDeposits)}</td>
                    <td>${formatCurrencyBR(totalCashWithdrawals)}</td>
                    ${hasPermission ? `<td>${formatCurrencyBR(cashProfit)}</td>` : ''}
                </tr>
            `;
        }
        
        html += `
                </tbody>
            </table>
            <div class="report-actions">
                <button class="btn btn-secondary" onclick="window.print()">Imprimir Relatório</button>
                <button class="btn btn-secondary" onclick="exportToExcel('cash-flow-report')">Exportar para Excel</button>
            </div>
        `;
        
        reportContent.innerHTML = html;
        showToast('Relatório gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar relatório de fluxo de caixa:', error);
        showToast('Erro ao gerar relatório: ' + (error.message || error), 'error');
        
        const reportContent = document.getElementById('cash-flow-report-content');
        if (reportContent) {
            reportContent.innerHTML = '<p class="error-message">Erro ao gerar relatório. Tente novamente.</p>';
        }
    }
}

// Função auxiliar para exportar tabela para Excel
export function exportToExcel(reportId) {
    try {
        const reportContent = document.getElementById(`${reportId}-content`);
        if (!reportContent) return;
        
        const table = reportContent.querySelector('table');
        if (!table) {
            showToast('Nenhuma tabela encontrada para exportar', 'error');
            return;
        }
        
        // Converter tabela para CSV
        let csv = [];
        const rows = table.querySelectorAll('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const row = [], cols = rows[i].querySelectorAll('td, th');
            
            for (let j = 0; j < cols.length; j++) {
                // Remover formatação de moeda para Excel
                let text = cols[j].innerText.replace('R$', '').replace(/\./g, '').replace(',', '.');
                
                // Se não for um número, usar o texto original
                if (isNaN(parseFloat(text))) {
                    text = cols[j].innerText;
                }
                
                // Escapar aspas duplas
                text = text.replace(/"/g, '""');
                
                // Adicionar aspas ao redor do texto
                row.push('"' + text + '"');
            }
            
            csv.push(row.join(';'));
        }
        
        // Criar blob e link para download
        const csvString = csv.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        // Criar nome do arquivo
        const date = new Date().toISOString().slice(0, 10);
        const filename = `relatorio_${reportId}_${date}.csv`;
        
        // Configurar link para download
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        showToast('Relatório exportado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao exportar para Excel:', error);
        showToast('Erro ao exportar relatório: ' + (error.message || error), 'error');
    }
}

// Inicializar módulo de relatórios
export function initializeReportsModule() {
    // Configurar eventos dos botões
    const btnTopProducts = document.getElementById('btn-generate-top-products-report');
    const btnCashFlow = document.getElementById('btn-generate-cash-flow-report');
    
    if (btnTopProducts) {
        btnTopProducts.addEventListener('click', generateTopProductsReport);
    }
    
    if (btnCashFlow) {
        btnCashFlow.addEventListener('click', generateCashFlowReport);
    }
    
    // Configurar data atual nos campos de data
    const startDateInput = document.getElementById('report-start-date');
    const endDateInput = document.getElementById('report-end-date');
    
    if (startDateInput && endDateInput) {
        // Definir data inicial como primeiro dia do mês atual
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        startDateInput.value = firstDay.toISOString().split('T')[0];
        
        // Definir data final como hoje
        endDateInput.value = today.toISOString().split('T')[0];
    }
    
    // Expor funções globalmente para uso nos botões
    window.exportToExcel = exportToExcel;
}