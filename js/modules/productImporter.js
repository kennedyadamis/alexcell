import { importProductsFromExcel, validateExcelFile } from '../utils/excelImporter.js';
import { showToast } from '../components/toast.js';
import { showModal, hideModal } from '../components/modal.js';

class ProductImporter {
    constructor() {
        this.currentFile = null;
        this.selectedStoreId = null;
        this.init();
    }

    init() {
        this.createImportModal();
        this.bindEvents();
    }

    createImportModal() {
        const modalHTML = `
            <div id="importProductsModal" class="modal" style="display: none;">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h2>Importar Produtos da Planilha</h2>
                        <span class="close" onclick="hideModal('importProductsModal')">&times;</span>
                    </div>
                    <div class="modal-body">
                        <div class="import-steps">
                            <!-- Passo 1: Seleção de Loja -->
                            <div class="step" id="step1">
                                <h3>1. Selecione a Loja</h3>
                                <div class="form-group">
                                    <label for="storeSelect">Loja de Destino:</label>
                                    <select id="storeSelect" class="form-control" required>
                                        <option value="">Selecione uma loja...</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Passo 2: Upload do Arquivo -->
                            <div class="step" id="step2" style="display: none;">
                                <h3>2. Selecione o Arquivo Excel</h3>
                                <div class="form-group">
                                    <label for="excelFile">Arquivo Excel (.xlsx ou .xls):</label>
                                    <input type="file" id="excelFile" class="form-control" accept=".xlsx,.xls" required>
                                    <small class="form-text text-muted">
                                        O arquivo deve conter colunas: Nome/Produto, Custo, Categoria (opcional), SKU (opcional), Estoque (opcional)
                                    </small>
                                </div>
                                <div id="fileValidation" class="mt-3"></div>
                            </div>

                            <!-- Passo 3: Preview e Configuração -->
                            <div class="step" id="step3" style="display: none;">
                                <h3>3. Preview dos Dados</h3>
                                <div class="pricing-rules mb-3">
                                    <h4>Regras de Margem Aplicadas:</h4>
                                    <ul>
                                        <li><strong>Custo abaixo de R$ 65:</strong> +150% (x2.5)</li>
                                        <li><strong>Custo entre R$ 66-80:</strong> +110% (x2.1)</li>
                                        <li><strong>Custo entre R$ 80-120:</strong> +130% (x2.3)</li>
                                        <li><strong>Custo acima de R$ 120:</strong> +100% (x2.0)</li>
                                    </ul>
                                </div>
                                <div id="dataPreview"></div>
                            </div>

                            <!-- Passo 4: Resultado -->
                            <div class="step" id="step4" style="display: none;">
                                <h3>4. Resultado da Importação</h3>
                                <div id="importResults"></div>
                            </div>
                        </div>

                        <div class="modal-actions mt-4">
                            <button type="button" id="prevStepBtn" class="btn btn-secondary" style="display: none;">
                                Anterior
                            </button>
                            <button type="button" id="nextStepBtn" class="btn btn-primary" disabled>
                                Próximo
                            </button>
                            <button type="button" id="importBtn" class="btn btn-success" style="display: none;">
                                Importar Produtos
                            </button>
                            <button type="button" class="btn btn-secondary" onclick="hideModal('importProductsModal')">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Adiciona o modal ao body se não existir
        if (!document.getElementById('importProductsModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
    }

    bindEvents() {
        // Botão para abrir modal de importação
        const importBtn = document.getElementById('importProductsBtn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.showImportModal());
        }

        // Eventos dos passos
        document.addEventListener('change', (e) => {
            if (e.target.id === 'storeSelect') {
                this.handleStoreSelection(e.target.value);
            } else if (e.target.id === 'excelFile') {
                this.handleFileSelection(e.target.files[0]);
            }
        });

        // Botões de navegação
        document.addEventListener('click', (e) => {
            if (e.target.id === 'nextStepBtn') {
                this.nextStep();
            } else if (e.target.id === 'prevStepBtn') {
                this.prevStep();
            } else if (e.target.id === 'importBtn') {
                this.startImport();
            }
        });
    }

    async showImportModal() {
        await this.loadStores();
        this.resetModal();
        showModal('importProductsModal');
    }

    async loadStores() {
        try {
            const { data: stores, error } = await supabase
                .from('stores')
                .select('id, name')
                .order('name');

            if (error) throw error;

            const storeSelect = document.getElementById('storeSelect');
            storeSelect.innerHTML = '<option value="">Selecione uma loja...</option>';
            
            stores.forEach(store => {
                storeSelect.innerHTML += `<option value="${store.id}">${store.name}</option>`;
            });

        } catch (error) {
            console.error('Erro ao carregar lojas:', error);
            showToast('Erro ao carregar lojas', 'error');
        }
    }

    resetModal() {
        this.currentStep = 1;
        this.currentFile = null;
        this.selectedStoreId = null;
        
        // Reset form
        document.getElementById('storeSelect').value = '';
        document.getElementById('excelFile').value = '';
        
        // Reset steps
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`step${i}`).style.display = i === 1 ? 'block' : 'none';
        }
        
        // Reset buttons
        document.getElementById('nextStepBtn').disabled = true;
        document.getElementById('prevStepBtn').style.display = 'none';
        document.getElementById('importBtn').style.display = 'none';
        
        // Clear content
        document.getElementById('fileValidation').innerHTML = '';
        document.getElementById('dataPreview').innerHTML = '';
        document.getElementById('importResults').innerHTML = '';
    }

    handleStoreSelection(storeId) {
        this.selectedStoreId = storeId;
        document.getElementById('nextStepBtn').disabled = !storeId;
    }

    async handleFileSelection(file) {
        this.currentFile = file;
        const validationDiv = document.getElementById('fileValidation');
        
        if (!file) {
            validationDiv.innerHTML = '';
            document.getElementById('nextStepBtn').disabled = true;
            return;
        }

        validationDiv.innerHTML = '<div class="loading">Validando arquivo...</div>';

        try {
            const validation = await validateExcelFile(file);
            
            if (validation.valid) {
                validationDiv.innerHTML = `
                    <div class="alert alert-success">
                        <h5>✓ Arquivo válido!</h5>
                        <p><strong>Planilhas:</strong> ${validation.sheets.join(', ')}</p>
                        <p><strong>Linhas de dados:</strong> ${validation.rows}</p>
                        <p><strong>Colunas encontradas:</strong> ${validation.headers.join(', ')}</p>
                    </div>
                `;
                document.getElementById('nextStepBtn').disabled = false;
            } else {
                validationDiv.innerHTML = `
                    <div class="alert alert-error">
                        <h5>✗ Arquivo inválido</h5>
                        <p>${validation.error}</p>
                    </div>
                `;
                document.getElementById('nextStepBtn').disabled = true;
            }
        } catch (error) {
            validationDiv.innerHTML = `
                <div class="alert alert-error">
                    <h5>✗ Erro ao validar arquivo</h5>
                    <p>${error.message}</p>
                </div>
            `;
            document.getElementById('nextStepBtn').disabled = true;
        }
    }

    async nextStep() {
        if (this.currentStep === 2) {
            await this.showPreview();
        }
        
        this.currentStep++;
        this.updateStepDisplay();
    }

    prevStep() {
        this.currentStep--;
        this.updateStepDisplay();
    }

    updateStepDisplay() {
        // Hide all steps
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`step${i}`).style.display = 'none';
        }
        
        // Show current step
        document.getElementById(`step${this.currentStep}`).style.display = 'block';
        
        // Update buttons
        document.getElementById('prevStepBtn').style.display = this.currentStep > 1 ? 'inline-block' : 'none';
        document.getElementById('nextStepBtn').style.display = this.currentStep < 3 ? 'inline-block' : 'none';
        document.getElementById('importBtn').style.display = this.currentStep === 3 ? 'inline-block' : 'none';
        
        // Enable/disable next button based on step
        if (this.currentStep === 1) {
            document.getElementById('nextStepBtn').disabled = !this.selectedStoreId;
        } else if (this.currentStep === 2) {
            document.getElementById('nextStepBtn').disabled = !this.currentFile;
        }
    }

    async showPreview() {
        const previewDiv = document.getElementById('dataPreview');
        previewDiv.innerHTML = '<div class="loading">Carregando preview...</div>';

        try {
            const validation = await validateExcelFile(this.currentFile);
            
            if (!validation.valid) {
                throw new Error(validation.error);
            }

            let previewHTML = `
                <div class="preview-container">
                    <h5>Preview dos Primeiros Produtos:</h5>
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Nome/Produto</th>
                                    <th>Custo</th>
                                    <th>Preço Calculado</th>
                                    <th>Margem</th>
                                    <th>Categoria</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            // Processa preview das primeiras linhas
            const headers = validation.headers.map(h => h ? h.toString().toLowerCase().trim() : '');
            const nameCol = headers.findIndex(h => 
                h.includes('produto') || h.includes('nome') || h.includes('descrição') || h.includes('descricao') || h.includes('item')
            );
            const costCol = headers.findIndex(h => 
                h.includes('custo') || h.includes('preço de custo') || h.includes('preco de custo') || h.includes('valor de custo') || h.includes('cost')
            );
            const categoryCol = headers.findIndex(h => 
                h.includes('categoria') || h.includes('tipo') || h.includes('class') || h.includes('grupo')
            );

            validation.preview.forEach((row, index) => {
                const name = row[nameCol] || 'N/A';
                const cost = parseFloat(row[costCol]) || 0;
                const category = row[categoryCol] || 'Diversos';
                
                if (name && name !== 'N/A' && cost > 0) {
                    let margin, price;
                    
                    if (cost < 65) {
                        margin = '150%';
                        price = cost * 2.5;
                    } else if (cost >= 66 && cost <= 80) {
                        margin = '110%';
                        price = cost * 2.1;
                    } else if (cost >= 80 && cost <= 120) {
                        margin = '130%';
                        price = cost * 2.3;
                    } else {
                        margin = '100%';
                        price = cost * 2.0;
                    }
                    
                    previewHTML += `
                        <tr>
                            <td>${name}</td>
                            <td>R$ ${cost.toFixed(2)}</td>
                            <td>R$ ${price.toFixed(2)}</td>
                            <td>${margin}</td>
                            <td>${category}</td>
                        </tr>
                    `;
                }
            });

            previewHTML += `
                            </tbody>
                        </table>
                    </div>
                    <p class="text-muted">
                        <small>Mostrando apenas os primeiros produtos para preview. 
                        Total de linhas a serem processadas: ${validation.rows}</small>
                    </p>
                </div>
            `;

            previewDiv.innerHTML = previewHTML;

        } catch (error) {
            previewDiv.innerHTML = `
                <div class="alert alert-error">
                    <h5>Erro ao gerar preview</h5>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    async startImport() {
        const importBtn = document.getElementById('importBtn');
        const resultsDiv = document.getElementById('importResults');
        
        importBtn.disabled = true;
        importBtn.textContent = 'Importando...';
        
        resultsDiv.innerHTML = '<div class="loading">Importando produtos, aguarde...</div>';

        try {
            const results = await importProductsFromExcel(this.currentFile, this.selectedStoreId);
            
            this.currentStep = 4;
            this.updateStepDisplay();
            
            let resultHTML = `
                <div class="import-summary">
                    <div class="alert alert-success">
                        <h4>Importação Concluída!</h4>
                        <p><strong>Total processado:</strong> ${results.total} produtos</p>
                        <p><strong>Importados com sucesso:</strong> ${results.success} produtos</p>
                        <p><strong>Erros:</strong> ${results.errors.length}</p>
                    </div>
            `;

            if (results.errors.length > 0) {
                resultHTML += `
                    <div class="alert alert-warning">
                        <h5>Erros encontrados:</h5>
                        <ul>
                            ${results.errors.map(error => `<li>${error}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }

            if (results.products.length > 0) {
                resultHTML += `
                    <div class="products-imported">
                        <h5>Produtos Importados:</h5>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Custo</th>
                                        <th>Preço</th>
                                        <th>Margem</th>
                                        <th>Categoria</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${results.products.map(product => `
                                        <tr>
                                            <td>${product.name}</td>
                                            <td>R$ ${product.cost.toFixed(2)}</td>
                                            <td>R$ ${product.price.toFixed(2)}</td>
                                            <td>${product.margin}</td>
                                            <td>${product.category}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            }

            resultHTML += '</div>';
            resultsDiv.innerHTML = resultHTML;
            
            showToast(`${results.success} produtos importados com sucesso!`, 'success');
            
            // Atualiza a lista de produtos se estiver na página de estoque
            if (typeof window.loadProducts === 'function') {
                window.loadProducts();
            }

        } catch (error) {
            console.error('Erro na importação:', error);
            resultsDiv.innerHTML = `
                <div class="alert alert-error">
                    <h4>Erro na Importação</h4>
                    <p>${error.message}</p>
                </div>
            `;
            showToast('Erro na importação de produtos', 'error');
        } finally {
            importBtn.disabled = false;
            importBtn.textContent = 'Importar Produtos';
        }
    }
}

// Inicializa o importador quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.productImporter = new ProductImporter();
});

export default ProductImporter;