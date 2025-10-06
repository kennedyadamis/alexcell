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

// Função para imprimir relatório de OS por status usando o template
export async function printOSStatusReport() {
    try {
        // Obter dados do relatório atual
        const statusSelect = document.getElementById('os-status-filter');
        const startDateInput = document.getElementById('os-report-start-date');
        const endDateInput = document.getElementById('os-report-end-date');
        
        if (!statusSelect || !statusSelect.value) {
            showToast('Por favor, selecione um status primeiro', 'warning');
            return;
        }
        
        const selectedStatus = statusSelect.value;
        const startDate = startDateInput?.value;
        const endDate = endDateInput?.value;
        
        // Buscar dados das OS novamente para a impressão
        let query = supabase
            .from('service_orders')
            .select(`
                id,
                client_name,
                equipment_brand,
                equipment_model,
                quote_value,
                amount_paid,
                created_at,
                status,
                products,
                customers (
                    full_name
                )
            `)
            .eq('status', selectedStatus);
            
        // Aplicar filtros de data se fornecidos
        if (startDate && endDate) {
            query = query.gte('created_at', startDate + 'T00:00:00').lte('created_at', endDate + 'T23:59:59');
        }
        
        const { data: serviceOrders, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!serviceOrders || serviceOrders.length === 0) {
            showToast('Nenhuma OS encontrada para imprimir', 'warning');
            return;
        }
        
        // Preparar dados para o template (igual ao PDF)
        let totalValue = 0;
        let totalPaid = 0;
        
        const formattedOrders = serviceOrders.map(os => {
            const customerName = os.customers?.full_name || os.client_name || 'N/A';
            const equipment = `${os.equipment_brand || ''} ${os.equipment_model || ''}`.trim() || 'N/A';
            
            // Calcular valor da OS baseado nos produtos adicionados
            let calculatedValue = 0;
            
            if (os.products && Array.isArray(os.products) && os.products.length > 0) {
                // Calcular valor total dos produtos
                calculatedValue = os.products.reduce((total, product) => {
                    const quantity = parseInt(product.quantity) || 1;
                    const price = parseFloat(product.price) || 0;
                    return total + (quantity * price);
                }, 0);
            } else if (typeof os.products === 'string') {
                // Se products é uma string JSON, fazer parse
                try {
                    const parsedProducts = JSON.parse(os.products);
                    if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
                        calculatedValue = parsedProducts.reduce((total, product) => {
                            const quantity = parseInt(product.quantity) || 1;
                            const price = parseFloat(product.price) || 0;
                            return total + (quantity * price);
                        }, 0);
                    }
                } catch (error) {
                    console.error('Erro ao fazer parse dos produtos:', error);
                }
            }
            
            // Para OS entregues, usar apenas o valor total dos produtos
            // Para outros status, usar quote_value como fallback se não há produtos
            let osValue;
            if (selectedStatus === 'delivered') {
                osValue = calculatedValue; // Apenas valor dos produtos para OS entregues
            } else {
                osValue = calculatedValue > 0 ? calculatedValue : (parseFloat(os.quote_value) || 0);
            }
            
            const paidValue = parseFloat(os.amount_paid) || 0;
            totalValue += osValue;
            totalPaid += paidValue;
            
            // Processar produtos utilizados
            let productsUsed = 'Nenhum produto';
            if (os.products && Array.isArray(os.products) && os.products.length > 0) {
                productsUsed = os.products.map(product => 
                    `${product.name} (Qtd: ${product.quantity || 1})`
                ).join(', ');
            } else if (typeof os.products === 'string') {
                // Se products é uma string JSON, fazer parse
                try {
                    const parsedProducts = JSON.parse(os.products);
                    if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
                        productsUsed = parsedProducts.map(product => 
                            `${product.name || 'Produto sem nome'} (Qtd: ${product.quantity || 1})`
                        ).join(', ');
                    }
                } catch (error) {
                    console.error('Erro ao fazer parse dos produtos:', error);
                }
            }
            
            const orderData = {
                id: os.id,
                customer: customerName,
                equipment: equipment,
                products: productsUsed,
                value: formatCurrencyBR(osValue),
                date: formatDateForDisplay(os.created_at)
            };
            
            // Adicionar paidValue apenas se não for status 'delivered'
            if (selectedStatus !== 'delivered') {
                orderData.paidValue = formatCurrencyBR(paidValue);
            }
            
            return orderData;
        });

        // Obter configurações da loja
        const { data: storeSettings } = await supabase
            .from('store_settings')
            .select('*')
            .single();

        // Preparar dados para o template de impressão
        const reportData = {
            title: `Relatório de OS - ${getStatusDisplayName(selectedStatus)}`,
            info: {
                status: getStatusDisplayName(selectedStatus),
                dateRange: (startDate && endDate) ? `${formatDateForDisplay(startDate)} a ${formatDateForDisplay(endDate)}` : 'Todas as datas',
                totalOS: serviceOrders.length
            },
            serviceOrders: formattedOrders,
            summary: {},
            storeInfo: {
                name: storeSettings?.store_name || 'Assistência Técnica Especializada',
                address: storeSettings?.store_address || 'R. 38, N 518 - Sala 02 - Lot. Paraíso do Sul, Santa Maria, Aracaju - SE, 49044-451',
                phones: storeSettings?.store_phones || '(79) 9.8160-6441 / (79) 3011-2293'
            },
            logoUrl: storeSettings?.logo_url || null,
            generatedAt: new Date().toLocaleString('pt-BR')
        };

        // Para OS entregues, não incluir Total Pago e Saldo Pendente no summary
        if (selectedStatus === 'delivered') {
            reportData.summary = {
                'Total de OS': serviceOrders.length,
                'Valor Total': formatCurrencyBR(totalValue)
            };
        } else {
            reportData.summary = {
                'Total de OS': serviceOrders.length,
                'Valor Total': formatCurrencyBR(totalValue),
                'Total Pago': formatCurrencyBR(totalPaid),
                'Saldo Pendente': formatCurrencyBR(totalValue - totalPaid)
            };
        }

        // Salvar dados no localStorage para o template acessar
        localStorage.setItem('os_status_report_data', JSON.stringify(reportData));

        // Abrir template de impressão simples
        const timestamp = new Date().getTime();
        const printWindow = window.open(`print-os-simple-template.html?v=${timestamp}`, '_blank');
        
        if (printWindow) {
            printWindow.focus();
        }

        showToast('Relatório enviado para impressão', 'success');

    } catch (error) {
        console.error('Erro ao preparar impressão do relatório:', error);
        showToast('Erro ao preparar impressão', 'error');
    }
}

// Função para gerar PDF do relatório de fluxo de caixa por período
export async function generateCashFlowPDF() {
    try {
        // Obter dados do relatório atual
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        
        if (!startDate || !endDate) {
            showToast('Por favor, selecione as datas primeiro', 'warning');
            return;
        }

        showToast('Preparando PDF do relatório de fluxo de caixa...', 'info');

        // Buscar dados do fluxo de caixa no período
        const { data: cashRegisters, error: cashError } = await supabase
            .from('cash_registers')
            .select('*')
            .eq('store_id', getSelectedStoreId())
            .gte('opened_at', startDate + 'T00:00:00')
            .lte('opened_at', endDate + 'T23:59:59')
            .order('opened_at', { ascending: false });
            
        if (cashError) throw cashError;
        
        if (!cashRegisters || cashRegisters.length === 0) {
            showToast('Nenhum registro de caixa encontrado no período selecionado', 'warning');
            return;
        }

        // Buscar entradas e saídas para cada caixa
        const cashIds = cashRegisters.map(cash => cash.id);
        
        const { data: entries, error: entriesError } = await supabase
            .from('cash_register_entries')
            .select('*')
            .in('cash_register_id', cashIds);
            
        if (entriesError) throw entriesError;

        // Buscar vendas para calcular lucros (se tiver permissão)
        const hasPermission = await canViewCostPrices();
        let sales = [];
        
        if (hasPermission) {
            // Buscar vendas através das entradas de caixa
            const { data: salesEntries, error: salesEntriesError } = await supabase
                .from('cash_register_entries')
                .select('sale_id, cash_register_id')
                .in('cash_register_id', cashIds)
                .not('sale_id', 'is', null);
                
            if (!salesEntriesError && salesEntries && salesEntries.length > 0) {
                // Extrair IDs únicos das vendas
                const saleIds = [...new Set(salesEntries.map(entry => entry.sale_id))];
                
                // Buscar dados das vendas - usando apenas as colunas que existem
                const { data: salesData, error: salesError } = await supabase
                    .from('sales')
                    .select('id, items')
                    .in('id', saleIds);
                    
                if (!salesError) {
                    sales = salesData || [];
                }
            }
        }

        // Calcular totais gerais
        let totalSales = 0;
        let totalEntries = 0;
        let totalWithdrawals = 0;
        let totalCosts = 0;
        let totalProfit = 0;

        // Formatar dados dos registros de caixa para o PDF
        const formattedCashRegisters = [];
        
        for (const cash of cashRegisters) {
            const cashEntries = entries ? entries.filter(e => e.cash_register_id === cash.id) : [];
            
            let cashSales = 0;
            let cashEntries_amount = 0;
            let cashWithdrawals = 0;
            let cashProfit = 0;

            cashEntries.forEach(entry => {
                if (entry.type === 'entrada' && entry.sale_id) {
                    // É uma venda
                    cashSales += entry.amount || 0;
                } else if (entry.type === 'entrada' && !entry.sale_id) {
                    // É uma entrada manual
                    cashEntries_amount += entry.amount || 0;
                } else if (entry.type === 'saida') {
                    // É uma saída
                    cashWithdrawals += Math.abs(entry.amount || 0);
                }
            });

            // Calcular lucro se tiver permissão
            if (hasPermission) {
                const cashSalesIds = cashEntries
                    .filter(e => e.type === 'entrada' && e.sale_id)
                    .map(e => e.sale_id);
                
                const relatedSales = sales.filter(s => cashSalesIds.includes(s.id));
                
                let cashCosts = 0;
                
                // Processar vendas de forma assíncrona
                for (const sale of relatedSales) {
                    if (sale.items && Array.isArray(sale.items)) {
                        for (const item of sale.items) {
                            const quantidade = item.qty || item.quantity || 1;
                            
                            // Usar cost_price do item salvo na venda, se disponível
                            if (item.cost_price !== undefined && item.cost_price !== null) {
                                const itemCost = parseFloat(item.cost_price) * quantidade;
                                cashCosts += itemCost;
                            } else {
                                // Fallback: buscar cost_price da tabela products se não estiver salvo na venda
                                try {
                                    const { data: product } = await supabase
                                        .from('products')
                                        .select('cost_price')
                                        .eq('id', item.id)
                                        .single();
                                    if (product && product.cost_price) {
                                        const itemCost = parseFloat(product.cost_price) * quantidade;
                                        cashCosts += itemCost;
                                    }
                                } catch (productError) {
                                    // Silenciar erro de produto não encontrado
                                }
                            }
                        }
                    }
                }
                
                cashProfit = cashSales - cashCosts;
                totalCosts += cashCosts;
            }

            // Somar aos totais gerais
            totalSales += cashSales;
            totalEntries += cashEntries_amount;
            totalWithdrawals += cashWithdrawals;
            totalProfit += cashProfit;
            
            formattedCashRegisters.push({
                date: formatDateForDisplay(cash.opened_at),
                opening: formatCurrencyBR(cash.opening_balance || 0),
                closing: formatCurrencyBR(cash.closing_balance || 0),
                sales: formatCurrencyBR(cashSales),
                entries: formatCurrencyBR(cashEntries_amount),
                withdrawals: formatCurrencyBR(cashWithdrawals),
                profit: formatCurrencyBR(cashProfit)
            });
        }

        // Obter configurações da loja
        const { data: storeSettings } = await supabase
            .from('store_settings')
            .select('*')
            .single();

        // Tentar obter logo customizado
        let logoUrl = null;
        try {
            const { data: logoData } = await supabase
                .from('store_settings')
                .select('logo_url')
                .single();
                
            if (logoData && logoData.logo_url) {
                logoUrl = logoData.logo_url;
            }
        } catch (logoError) {
            console.log('Erro ao buscar logo customizado:', logoError);
        }

        // Preparar dados para o template de PDF
        const reportData = {
            info: {
                dateRange: `${formatDateForDisplay(startDate)} a ${formatDateForDisplay(endDate)}`,
                totalRegisters: cashRegisters.length
            },
            cashRegisters: formattedCashRegisters,
            summary: {
                'Total de Vendas': formatCurrencyBR(totalSales),
                'Total de Entradas': formatCurrencyBR(totalEntries),
                'Total de Saídas': formatCurrencyBR(totalWithdrawals),
                ...(hasPermission && {
                    'Total de Custos': formatCurrencyBR(totalCosts),
                    'Lucro Total': formatCurrencyBR(totalProfit)
                })
            },
            storeInfo: {
                name: storeSettings?.store_name || 'Assistência Técnica Especializada',
                address: storeSettings?.store_address || 'R. 38, N 518 - Sala 02 - Lot. Paraíso do Sul, Santa Maria, Aracaju - SE, 49044-451',
                phones: storeSettings?.store_phones || '(79) 9.8160-6441 / (79) 3011-2293'
            },
            logoUrl: logoUrl,
            canViewCosts: hasPermission,
            generatedAt: new Date().toLocaleString('pt-BR')
        };

        // Salvar dados no localStorage para o template acessar
        localStorage.setItem('cash_flow_pdf_report_data', JSON.stringify(reportData));

        // Abrir template de PDF em nova janela
        const pdfWindow = window.open('print-cash-flow-pdf-template.html', '_blank');
        
        if (pdfWindow) {
            pdfWindow.focus();
        }

        showToast('Relatório pronto! Clique no botão para baixar o PDF.', 'success');

    } catch (error) {
        console.error('Erro ao preparar PDF do relatório:', error);
        showToast('Erro ao preparar PDF', 'error');
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
            .lte('opened_at', endDate + 'T23:59:59')
            .order('opened_at', { ascending: false });
            
        if (cashError) throw cashError;
        
        if (!cashRegisters || cashRegisters.length === 0) {
            reportContent.innerHTML = '<p class="no-data-message">Nenhum registro de caixa encontrado no período selecionado.</p>';
            return;
        }
        
        // Buscar entradas e saídas para cada caixa
        const cashIds = cashRegisters.map(cash => cash.id);
        
        // Verificar se há IDs válidos antes de fazer as consultas
        if (!cashIds || cashIds.length === 0) {
            reportContent.innerHTML = '<p class="no-data-message">Nenhum registro de caixa válido encontrado no período selecionado.</p>';
            return;
        }
        
        const { data: entries, error: entriesError } = await supabase
            .from('cash_register_entries')
            .select('*')
            .in('cash_register_id', cashIds);
            
        if (entriesError) throw entriesError;
        
        // Buscar vendas através das entradas de caixa
        const { data: salesEntries, error: salesEntriesError } = await supabase
            .from('cash_register_entries')
            .select('sale_id, cash_register_id')
            .in('cash_register_id', cashIds)
            .not('sale_id', 'is', null);
            
        if (salesEntriesError) throw salesEntriesError;
        
        // Extrair IDs únicos das vendas
        const saleIds = [...new Set(salesEntries.map(entry => entry.sale_id))];
        
        // Buscar dados das vendas
        let sales = [];
        if (saleIds.length > 0) {
            const { data: salesData, error: salesError } = await supabase
                .from('sales')
                .select('*')
                .in('id', saleIds);
                
            if (salesError) throw salesError;
            sales = salesData || [];
        }
        
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
                if (entry.type === 'entrada' && entry.sale_id) {
                    // É uma venda (entrada com sale_id)
                    totalSales += entry.amount || 0;
                } else if (entry.type === 'entrada' && !entry.sale_id) {
                    // É uma entrada manual (sem sale_id)
                    totalEntries += entry.amount || 0;
                } else if (entry.type === 'saida') {
                    // É uma saída
                    totalWithdrawals += Math.abs(entry.amount || 0);
                }
            });
        }
        
        if (sales && hasPermission) {
            for (const sale of sales) {
                if (sale.items && Array.isArray(sale.items)) {
                    for (const item of sale.items) {
                        const quantidade = item.qty || item.quantity || 1;
                        
                        // Usar cost_price do item salvo na venda, se disponível
                        if (item.cost_price !== undefined && item.cost_price !== null) {
                            const itemCost = parseFloat(item.cost_price) * quantidade;
                            totalCosts += itemCost;
                        } else {
                            // Fallback: buscar cost_price da tabela products se não estiver salvo na venda
                            try {
                                const { data: product } = await supabase
                                    .from('products')
                                    .select('cost_price')
                                    .eq('id', item.id)
                                    .single();
                                if (product && product.cost_price) {
                                    const itemCost = parseFloat(product.cost_price) * quantidade;
                                    totalCosts += itemCost;
                                }
                            } catch (productError) {
                                console.warn(`Erro ao buscar custo do produto ${item.id}:`, productError);
                            }
                        }
                    }
                }
            }
            
            totalProfit = totalSales - totalCosts;
        }
        
        // Gerar HTML do relatório
        let html = `
            <div class="report-header">
                <h4>Relatório de Fluxo de Caixa</h4>
                <p>Período: ${formatDateForDisplay(startDate)} a ${formatDateForDisplay(endDate)}</p>
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
            const cashSales = cashEntries.filter(e => e.type === 'entrada' && e.sale_id);
            const cashDeposits = cashEntries.filter(e => e.type === 'entrada' && !e.sale_id);
            const cashWithdrawals = cashEntries.filter(e => e.type === 'saida');
            
            const totalCashSales = cashSales.reduce((sum, e) => sum + (e.amount || 0), 0);
            const totalCashDeposits = cashDeposits.reduce((sum, e) => sum + (e.amount || 0), 0);
            const totalCashWithdrawals = cashWithdrawals.reduce((sum, e) => sum + Math.abs(e.amount || 0), 0);
            
            // Calcular lucro se tiver permissão
            let cashProfit = 0;
            if (hasPermission) {
                const cashSalesIds = cashSales.map(e => e.sale_id).filter(id => id);
                const relatedSales = sales ? sales.filter(s => cashSalesIds.includes(s.id)) : [];
                
                let cashCosts = 0;
                for (const sale of relatedSales) {
                    if (sale.items && Array.isArray(sale.items)) {
                        for (const item of sale.items) {
                            const quantidade = item.qty || item.quantity || 1;
                            
                            // Usar cost_price do item salvo na venda, se disponível
                            if (item.cost_price !== undefined && item.cost_price !== null) {
                                const itemCost = parseFloat(item.cost_price) * quantidade;
                                cashCosts += itemCost;
                            } else {
                                // Fallback: buscar cost_price da tabela products se não estiver salvo na venda
                                try {
                                    const { data: product } = await supabase
                                        .from('products')
                                        .select('cost_price')
                                        .eq('id', item.id)
                                        .single();
                                    if (product && product.cost_price) {
                                        const itemCost = parseFloat(product.cost_price) * quantidade;
                                        cashCosts += itemCost;
                                    }
                                } catch (productError) {
                                    console.warn(`Erro ao buscar custo do produto ${item.id}:`, productError);
                                }
                            }
                        }
                    }
                }
                
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
                <button class="btn btn-secondary" onclick="printCashFlowReport()">Imprimir Relatório</button>
            </div>
        `;
        
        reportContent.innerHTML = html;
        showToast('Relatório gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar relatório de fluxo de caixa:', error);
        showToast('Erro ao gerar relatório: ' + (error.message || error), 'error');
        
        const reportContent = document.getElementById('cash-flow-report-content');
        if (reportContent) {
            reportContent.innerHTML = '<p class="error-message">Erro ao carregar relatório. Tente novamente.</p>';
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

// Função para gerar relatório de OS por status
export async function generateOSStatusReport() {
    try {
        const selectedStatus = document.getElementById('os-status-filter').value;
        const startDate = document.getElementById('os-report-start-date').value;
        const endDate = document.getElementById('os-report-end-date').value;
        
        if (!selectedStatus) {
            showToast('Selecione um status para gerar o relatório', 'warning');
            return;
        }
        
        showToast('Gerando relatório de OS por status...', 'info');
        
        const reportContent = document.getElementById('os-status-report-content');
        if (!reportContent) return;
        
        reportContent.innerHTML = '<div class="loading-spinner"></div>';
        
        // Construir query base
        let query = supabase
            .from('service_orders')
            .select(`
                id,
                client_name,
                equipment_brand,
                equipment_model,
                quote_value,
                amount_paid,
                products,
                status,
                created_at,
                customers (
                    full_name
                )
            `)
            .eq('store_id', getSelectedStoreId())
            .eq('status', selectedStatus);
            
        // Adicionar filtros de data se fornecidos
        if (startDate) {
            query = query.gte('created_at', startDate + 'T00:00:00');
        }
        if (endDate) {
            query = query.lte('created_at', endDate + 'T23:59:59');
        }
        
        const { data: serviceOrders, error } = await query.order('created_at', { ascending: false });
            
        if (error) throw error;
        
        if (!serviceOrders || serviceOrders.length === 0) {
            const dateFilter = (startDate && endDate) ? ` no período de ${formatDateForDisplay(startDate)} a ${formatDateForDisplay(endDate)}` : '';
            reportContent.innerHTML = `<p class="no-data-message">Nenhuma OS encontrada com status "${getStatusDisplayName(selectedStatus)}"${dateFilter}.</p>`;
            return;
        }
        
        // Gerar HTML do relatório
        const dateFilter = (startDate && endDate) ? ` (${formatDateForDisplay(startDate)} a ${formatDateForDisplay(endDate)})` : '';
        let html = `
            <div class="report-header">
                <h4>Relatório de OS - ${getStatusDisplayName(selectedStatus)}${dateFilter}</h4>
                <p>Gerado em: ${formatDateForDisplay(new Date(), true)}</p>
                <p>Total de OS: ${serviceOrders.length}</p>
            </div>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>OS #</th>
                        <th>Cliente</th>
                        <th>Equipamento</th>
                        <th>Produtos Utilizados</th>
                        <th>Valor da OS</th>
                        ${selectedStatus !== 'delivered' ? '<th>Valor Pago</th>' : ''}
                        <th>Data de Criação</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        let totalValue = 0;
        let totalPaid = 0;
        
        serviceOrders.forEach(os => {
            const customerName = os.customers?.full_name || os.client_name || 'N/A';
            const equipment = `${os.equipment_brand || ''} ${os.equipment_model || ''}`.trim() || 'N/A';
            
            // Calcular valor da OS baseado nos produtos adicionados
            let calculatedValue = 0;
            let productsUsed = 'Nenhum produto';
            
            if (os.products && Array.isArray(os.products) && os.products.length > 0) {
                // Calcular valor total dos produtos
                calculatedValue = os.products.reduce((total, product) => {
                    const quantity = parseInt(product.quantity) || 1;
                    const price = parseFloat(product.price) || 0;
                    return total + (quantity * price);
                }, 0);
                
                productsUsed = os.products.map(product => 
                    `${product.name || 'Produto sem nome'} (Qtd: ${product.quantity || 1})`
                ).join(', ');
            } else if (typeof os.products === 'string') {
                // Se products é uma string JSON, fazer parse
                try {
                    const parsedProducts = JSON.parse(os.products);
                    if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
                        calculatedValue = parsedProducts.reduce((total, product) => {
                            const quantity = parseInt(product.quantity) || 1;
                            const price = parseFloat(product.price) || 0;
                            return total + (quantity * price);
                        }, 0);
                        
                        productsUsed = parsedProducts.map(product => 
                            `${product.name || 'Produto sem nome'} (Qtd: ${product.quantity || 1})`
                        ).join(', ');
                    }
                } catch (error) {
                    console.error('Erro ao fazer parse dos produtos:', error);
                }
            }
            
            // Para OS entregues, usar apenas o valor total dos produtos
            // Para outros status, usar quote_value como fallback se não há produtos
            let osValue;
            if (selectedStatus === 'delivered') {
                osValue = calculatedValue; // Apenas valor dos produtos para OS entregues
            } else {
                osValue = calculatedValue > 0 ? calculatedValue : (parseFloat(os.quote_value) || 0);
            }
            
            const paidValue = parseFloat(os.amount_paid) || 0;
            totalValue += osValue;
            totalPaid += paidValue;
            
            html += `
                <tr>
                    <td><strong>${os.id}</strong></td>
                    <td>${customerName}</td>
                    <td>${equipment}</td>
                    <td>${productsUsed}</td>
                    <td>${formatCurrencyBR(osValue)}</td>
                    ${selectedStatus !== 'delivered' ? `<td>${formatCurrencyBR(paidValue)}</td>` : ''}
                    <td>${formatDateForDisplay(os.created_at)}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
            <div class="report-summary">
                <div class="summary-item">
                    <span class="summary-label">Total de OS:</span>
                    <span class="summary-value">${serviceOrders.length}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Valor Total:</span>
                    <span class="summary-value">${formatCurrencyBR(totalValue)}</span>
                </div>`;
        
        // Para OS entregues, não mostrar Total Pago e Saldo Pendente
        if (selectedStatus !== 'delivered') {
            html += `
                <div class="summary-item">
                    <span class="summary-label">Total Pago:</span>
                    <span class="summary-value">${formatCurrencyBR(totalPaid)}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Saldo Pendente:</span>
                    <span class="summary-value">${formatCurrencyBR(totalValue - totalPaid)}</span>
                </div>`;
        }
        
        html += `
            </div>
            <div class="report-actions">
                <button class="btn btn-secondary" onclick="printOSStatusReport()">Imprimir Relatório</button>
                <button class="btn btn-primary" onclick="generateOSStatusPDF()">Gerar PDF</button>
            </div>
        `;
        
        reportContent.innerHTML = html;
        showToast('Relatório gerado com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar relatório de OS por status:', error);
        showToast('Erro ao gerar relatório: ' + (error.message || error), 'error');
        
        const reportContent = document.getElementById('os-status-report-content');
        if (reportContent) {
            reportContent.innerHTML = '<p class="error-message">Erro ao gerar relatório. Tente novamente.</p>';
        }
    }
}

// Função auxiliar para obter o nome de exibição do status
function getStatusDisplayName(status) {
    const statusMap = {
        'progress': 'Em Conserto',
        'completed': 'Em Conserto',
        'pending': 'Em Conserto',
        'awaiting_pickup': 'Aguardando Retirada',
        'delivered': 'Entregue',
        'cancelled': 'Cancelada'
    };
    return statusMap[status] || 'Status Desconhecido';
}

// Inicializar módulo de relatórios
export function initializeReportsModule() {
    // Configurar eventos dos botões
    const btnTopProducts = document.getElementById('btn-generate-top-products-report');
    const btnCashFlow = document.getElementById('btn-generate-cash-flow-report');
    const btnOSStatus = document.getElementById('btn-generate-os-status-report');
    
    if (btnTopProducts) {
        btnTopProducts.addEventListener('click', generateTopProductsReport);
    }
    
    if (btnCashFlow) {
        btnCashFlow.addEventListener('click', generateCashFlowReport);
    }
    
    if (btnOSStatus) {
        btnOSStatus.addEventListener('click', generateOSStatusReport);
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
    
    // Configurar evento do botão de PDF do fluxo de caixa
    const btnCashFlowPDF = document.getElementById('btn-generate-cash-flow-pdf');
    if (btnCashFlowPDF) {
        btnCashFlowPDF.addEventListener('click', generateCashFlowPDF);
    }
    
    // Expor funções globalmente para uso nos botões
    window.exportToExcel = exportToExcel;
    window.generateOSStatusPDF = generateOSStatusPDF;
    window.printOSStatusReport = printOSStatusReport;
    window.printCashFlowReport = printCashFlowReport;
    window.generateCashFlowPDF = generateCashFlowPDF;
}

// Função para gerar PDF do relatório de OS por status
async function generateOSStatusPDF() {
    try {
        // Obter dados do relatório atual
        const statusSelect = document.getElementById('os-status-filter');
        const startDateInput = document.getElementById('os-report-start-date');
        const endDateInput = document.getElementById('os-report-end-date');
        
        if (!statusSelect || !statusSelect.value) {
            showToast('Por favor, selecione um status primeiro', 'warning');
            return;
        }
        
        const selectedStatus = statusSelect.value;
        const startDate = startDateInput?.value;
        const endDate = endDateInput?.value;
        
        // Buscar dados das OS novamente para o PDF
        let query = supabase
            .from('service_orders')
            .select(`
                id,
                client_name,
                equipment_brand,
                equipment_model,
                quote_value,
                amount_paid,
                created_at,
                status,
                products,
                customers (
                    full_name
                )
            `)
            .eq('status', selectedStatus);
            
        // Aplicar filtros de data se fornecidos
        if (startDate && endDate) {
            query = query.gte('created_at', startDate + 'T00:00:00').lte('created_at', endDate + 'T23:59:59');
        }
        
        const { data: serviceOrders, error } = await query.order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!serviceOrders || serviceOrders.length === 0) {
            showToast('Nenhuma OS encontrada para gerar o PDF', 'warning');
            return;
        }
        
        // Preparar dados para o PDF
        let totalValue = 0;
        let totalPaid = 0;
        
        const formattedOrders = serviceOrders.map(os => {
            const customerName = os.customers?.full_name || os.client_name || 'N/A';
            const equipment = `${os.equipment_brand || ''} ${os.equipment_model || ''}`.trim() || 'N/A';
            
            // Calcular valor da OS baseado nos produtos adicionados
            let calculatedValue = 0;
            
            if (os.products && Array.isArray(os.products) && os.products.length > 0) {
                // Calcular valor total dos produtos
                calculatedValue = os.products.reduce((total, product) => {
                    const quantity = parseInt(product.quantity) || 1;
                    const price = parseFloat(product.price) || 0;
                    return total + (quantity * price);
                }, 0);
            } else if (typeof os.products === 'string') {
                // Se products é uma string JSON, fazer parse
                try {
                    const parsedProducts = JSON.parse(os.products);
                    if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
                        calculatedValue = parsedProducts.reduce((total, product) => {
                            const quantity = parseInt(product.quantity) || 1;
                            const price = parseFloat(product.price) || 0;
                            return total + (quantity * price);
                        }, 0);
                    }
                } catch (error) {
                    console.error('Erro ao fazer parse dos produtos:', error);
                }
            }
            
            // Para OS entregues, usar apenas o valor total dos produtos
            // Para outros status, usar quote_value como fallback se não há produtos
            let osValue;
            if (selectedStatus === 'delivered') {
                osValue = calculatedValue; // Apenas valor dos produtos para OS entregues
            } else {
                osValue = calculatedValue > 0 ? calculatedValue : (parseFloat(os.quote_value) || 0);
            }
            
            const paidValue = parseFloat(os.amount_paid) || 0;
            totalValue += osValue;
            totalPaid += paidValue;
            
            // Processar produtos utilizados
            let productsUsed = 'Nenhum produto';
            if (os.products && Array.isArray(os.products) && os.products.length > 0) {
                productsUsed = os.products.map(product => 
                    `${product.name} (Qtd: ${product.quantity || 1})`
                ).join(', ');
            } else if (typeof os.products === 'string') {
                // Se products é uma string JSON, fazer parse
                try {
                    const parsedProducts = JSON.parse(os.products);
                    if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
                        productsUsed = parsedProducts.map(product => 
                            `${product.name || 'Produto sem nome'} (Qtd: ${product.quantity || 1})`
                        ).join(', ');
                    }
                } catch (error) {
                    console.error('Erro ao fazer parse dos produtos:', error);
                }
            }
            
            const orderData = {
                id: os.id,
                customer: customerName,
                equipment: equipment,
                products: productsUsed,
                value: formatCurrencyBR(osValue),
                date: formatDateForDisplay(os.created_at)
            };
            
            // Só incluir paidValue se o status não for 'delivered'
            if (selectedStatus !== 'delivered') {
                orderData.paidValue = formatCurrencyBR(paidValue);
            }
            
            return orderData;
        });
        
        // Obter configurações da loja
        const { data: storeSettings } = await supabase
            .from('store_settings')
            .select('*')
            .single();
        
        // Preparar dados para o template de PDF
        const reportData = {
            title: `Relatório de OS - ${getStatusDisplayName(selectedStatus)}`,
            info: {
                status: getStatusDisplayName(selectedStatus),
                dateRange: (startDate && endDate) ? `${formatDateForDisplay(startDate)} a ${formatDateForDisplay(endDate)}` : 'Todas as datas',
                totalOS: serviceOrders.length
            },
            serviceOrders: formattedOrders,
            summary: {},
            storeInfo: {
                name: storeSettings?.store_name || 'Assistência Técnica Especializada',
                address: storeSettings?.store_address || 'R. 38, N 518 - Sala 02 - Lot. Paraíso do Sul, Santa Maria, Aracaju - SE, 49044-451',
                phones: storeSettings?.store_phones || '(79) 9.8160-6441 / (79) 3011-2293'
            },
            logoUrl: storeSettings?.logo_url || null
        };
        
        // Para OS entregues, não incluir Total Pago e Saldo Pendente no summary
        if (selectedStatus === 'delivered') {
            reportData.summary = {
                'Total de OS': serviceOrders.length,
                'Valor Total': formatCurrencyBR(totalValue)
            };
        } else {
            reportData.summary = {
                'Total de OS': serviceOrders.length,
                'Valor Total': formatCurrencyBR(totalValue),
                'Total Pago': formatCurrencyBR(totalPaid),
                'Saldo Pendente': formatCurrencyBR(totalValue - totalPaid)
            };
        }
        
        // Salvar dados no localStorage
        localStorage.setItem('os_status_report_data', JSON.stringify(reportData));
        
        // Abrir template de PDF A4 em nova janela
        window.open('print-os-pdf-template.html', '_blank');
        
        showToast('PDF sendo gerado...', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar PDF do relatório de OS:', error);
        showToast('Erro ao gerar PDF: ' + (error.message || error), 'error');
    }
}

// Função para imprimir relatório de fluxo de caixa
export async function printCashFlowReport() {
    try {
        // Obter dados do relatório atual
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        
        if (!startDate || !endDate) {
            showToast('Por favor, selecione as datas primeiro', 'warning');
            return;
        }

        // Buscar dados do fluxo de caixa no período
        const { data: cashRegisters, error: cashError } = await supabase
            .from('cash_registers')
            .select('*')
            .eq('store_id', getSelectedStoreId())
            .gte('opened_at', startDate + 'T00:00:00')
            .lte('opened_at', endDate + 'T23:59:59')
            .order('opened_at', { ascending: false });
            
        if (cashError) throw cashError;
        
        if (!cashRegisters || cashRegisters.length === 0) {
            showToast('Nenhum registro de caixa encontrado no período selecionado', 'warning');
            return;
        }

        // Buscar entradas e saídas para cada caixa
        const cashIds = cashRegisters.map(cash => cash.id);
        
        const { data: entries, error: entriesError } = await supabase
            .from('cash_register_entries')
            .select('*')
            .in('cash_register_id', cashIds);
            
        if (entriesError) throw entriesError;
        
        // Buscar vendas através das entradas de caixa
        const { data: salesEntries, error: salesEntriesError } = await supabase
            .from('cash_register_entries')
            .select('sale_id, cash_register_id')
            .in('cash_register_id', cashIds)
            .not('sale_id', 'is', null);
            
        if (salesEntriesError) throw salesEntriesError;
        
        // Extrair IDs únicos das vendas
        const saleIds = [...new Set(salesEntries.map(entry => entry.sale_id))];
        
        // Buscar dados das vendas
        let sales = [];
        if (saleIds.length > 0) {
            const { data: salesData, error: salesError } = await supabase
                .from('sales')
                .select('*')
                .in('id', saleIds);
                
            if (salesError) throw salesError;
            sales = salesData || [];
        }

        // Verificar permissão para ver preços de custo
        const hasPermission = await canViewCostPrices();
        
        // Calcular totais
        let totalSales = 0;
        let totalEntries = 0;
        let totalWithdrawals = 0;
        let totalCosts = 0;
        let totalProfit = 0;
        
        if (entries) {
            entries.forEach(entry => {
                if (entry.type === 'entrada' && entry.sale_id) {
                    // É uma venda (entrada com sale_id)
                    totalSales += entry.amount || 0;
                } else if (entry.type === 'entrada' && !entry.sale_id) {
                    // É uma entrada manual (sem sale_id)
                    totalEntries += entry.amount || 0;
                } else if (entry.type === 'saida') {
                    // É uma saída
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

        // Formatar dados dos caixas para impressão
        const formattedCashRegisters = cashRegisters.map(cash => {
            const cashEntries = entries?.filter(entry => entry.cash_register_id === cash.id) || [];
            let cashSales = 0;
            let cashEntries_amount = 0;
            let cashWithdrawals = 0;
            
            cashEntries.forEach(entry => {
                if (entry.type === 'entrada' && entry.sale_id) {
                    // É uma venda (entrada com sale_id)
                    cashSales += entry.amount || 0;
                } else if (entry.type === 'entrada' && !entry.sale_id) {
                    // É uma entrada manual (sem sale_id)
                    cashEntries_amount += entry.amount || 0;
                } else if (entry.type === 'saida') {
                    // É uma saída
                    cashWithdrawals += Math.abs(entry.amount || 0);
                }
            });
            
            return {
                date: formatDateForDisplay(cash.opened_at),
                opening: formatCurrencyBR(cash.opening_balance || 0),
                closing: formatCurrencyBR(cash.closing_balance || 0),
                sales: formatCurrencyBR(cashSales),
                entries: formatCurrencyBR(cashEntries_amount),
                withdrawals: formatCurrencyBR(cashWithdrawals),
                profit: formatCurrencyBR(cashSales - (hasPermission ? 0 : 0)) // Simplificado para impressão
            };
        });

        // Obter configurações da loja
        const { data: storeSettings } = await supabase
            .from('store_settings')
            .select('*')
            .single();

        // Preparar dados para o template de impressão
        const reportData = {
            title: 'Relatório de Fluxo de Caixa',
            info: {
                dateRange: `${formatDateForDisplay(startDate)} a ${formatDateForDisplay(endDate)}`,
                totalRegisters: cashRegisters.length
            },
            cashRegisters: formattedCashRegisters,
            summary: {
                'Total de Vendas': formatCurrencyBR(totalSales),
                'Total de Entradas': formatCurrencyBR(totalEntries),
                'Total de Saídas': formatCurrencyBR(totalWithdrawals),
                ...(hasPermission && {
                    'Total de Custos': formatCurrencyBR(totalCosts),
                    'Lucro Total': formatCurrencyBR(totalProfit)
                })
            },
            storeInfo: {
                name: storeSettings?.store_name || 'Assistência Técnica Especializada',
                address: storeSettings?.store_address || 'R. 38, N 518 - Sala 02 - Lot. Paraíso do Sul, Santa Maria, Aracaju - SE, 49044-451',
                phones: storeSettings?.store_phones || '(79) 9.8160-6441 / (79) 3011-2293'
            },
            logoUrl: storeSettings?.logo_url || null,
            generatedAt: new Date().toLocaleString('pt-BR')
        };

        // Salvar dados no localStorage para o template acessar
        localStorage.setItem('cash_flow_report_data', JSON.stringify(reportData));

        // Abrir template de impressão simples
        const timestamp = new Date().getTime();
        const printWindow = window.open(`print-cash-flow-template.html?v=${timestamp}`, '_blank');
        
        if (printWindow) {
            printWindow.focus();
        }

        showToast('Relatório enviado para impressão', 'success');

    } catch (error) {
        console.error('Erro ao preparar impressão do relatório:', error);
        showToast('Erro ao preparar impressão', 'error');
    }
}