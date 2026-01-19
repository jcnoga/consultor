// --- CONFIGURAÇÃO FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyB30QPE40atu__s4z3WlDBXHaryIE6asfE",
    authDomain: "consultor-3016e.firebaseapp.com",
    projectId: "consultor-3016e",
    storageBucket: "consultor-3016e.appspot.com",
    messagingSenderId: "819781871365",
    appId: "1:819781871365:web:a13d6930c8738a69af396c",
    measurementId: "G-C86JBXTK16"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- SELEÇÃO DE ELEMENTOS DO DOM ---
const app = document.getElementById('app');
const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const resetPasswordForm = document.getElementById('reset-password-form');
const forgotPasswordLink = document.querySelector('.forgot-password');
const toggleFormsLinks = document.querySelectorAll('.toggle-form');
const companyNameEl = document.getElementById('company-name');
const logoutBtn = document.getElementById('logoutBtn');
const syncBtn = document.getElementById('syncBtn'); 
const saveDataBtn = document.getElementById('save-data');
const yearSelector = document.getElementById('year-selector');
const mainNav = document.getElementById('main-nav');
const tabContents = document.querySelectorAll('.tab-content');
const recalculateAnnualBtn = document.getElementById('recalculate-annual');
const deleteAccountBtn = document.getElementById('delete-account-btn');
const exportPdfMonthlyBtn = document.getElementById('export-pdf-monthly');
const exportExcelMonthlyBtn = document.getElementById('export-excel-monthly');
const recalculateAllBtn = document.getElementById('recalculate-all');
const saveSettingsBtn = document.getElementById('save-settings');
const allowManualEditCheckbox = document.getElementById('allow-manual-edit');
const btnResetPopulateDemo = document.getElementById('btn-reset-populate-demo');

// Botões de Relatório
const btnFullReport = document.getElementById('btn-full-report');
const btnExportDaily = document.getElementById('btn-export-daily');
const btnExportCompany = document.getElementById('btn-export-company');
const btnExportMonthlyInputs = document.getElementById('btn-export-monthly-inputs');
const btnExportAnnual = document.getElementById('btn-export-annual');
const btnExportEvolution = document.getElementById('btn-export-evolution');
const btnExportGlossary = document.getElementById('btn-export-glossary');
const btnExportConsultant = document.getElementById('btn-export-consultant');

// Botões XLSX
const btnExportCompanyXLSX = document.getElementById('btn-export-company-xlsx');
const btnImportCompanyXLSX = document.getElementById('btn-import-company-xlsx');
const btnExportDailyXLSX = document.getElementById('btn-export-daily-xlsx');
const btnImportDailyXLSX = document.getElementById('btn-import-daily-xlsx');
const btnExportMonthlyXLSX = document.getElementById('btn-export-monthly-xlsx');
const btnImportMonthlyXLSX = document.getElementById('btn-import-monthly-xlsx');
const btnExportAnnualXLSX = document.getElementById('btn-export-annual-xlsx');
const btnExportEvolutionXLSX = document.getElementById('btn-export-evolution-xlsx');

// Botões de Backup
const btnBackupLocal = document.getElementById('btn-backup-local');
const btnRestoreLocal = document.getElementById('btn-restore-local');
const inputRestoreFile = document.getElementById('input-restore-file');

// Elementos da aba Diária
const dailyEntryForm = document.getElementById('daily-entry-form');
const dailyMonthSelector = document.getElementById('daily-month-selector');
const dailyMessageEl = document.getElementById('daily-message');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Elementos da aba Diagnóstico
const diagnosisForm = document.getElementById('diagnosis-form');

// Elementos da Nova Aba Consultor
const saveConsultantDiagnosisBtn = document.getElementById('save-consultant-diagnosis');
const consultantDiagnosisText = document.getElementById('consultant-diagnosis-text');

// Elementos de Desbloqueio e Acesso
const btnGenerateUnlockCode = document.getElementById('btn-generate-unlock-code');
const generatedCodeDisplay = document.getElementById('generated-code-display');
const btnTestAccess = document.getElementById('btn-test-access');
const btnResetAuth = document.getElementById('btn-reset-auth');
const accessStatusDisplay = document.getElementById('access-status-display');
const statusText = document.getElementById('status-text');
const expirationText = document.getElementById('expiration-text');
const daysLeftText = document.getElementById('days-left-text');

// Elementos da Área de Informação de Campos
const monthlyFieldInfoBox = document.getElementById('monthly-field-info');
const monthlyFieldText = document.getElementById('monthly-field-text');


// --- VARIÁVEIS DE ESTADO E CONSTANTES ---
let currentUser = null;
let currentYear = new Date().getFullYear();
let financialData = {};
let userSettings = {};
let currentlyEditingIndex = null;
const DEFAULT_COMPANY_NAME = 'Noga Consultoria'; 
const ADMIN_EMAIL = 'jcnvap@gmail.com'; 
const DEFAULT_TRIAL_DAYS = 0; 

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const INPUT_FIELDS = [
    'faturamento', 'numeroDeVendas', 'custosVariaveis', 'custosFixos', 'despesasOperacionais', 'depreciacao',
    'outrasReceitasDespesas', 'investimentos', 'financiamentosEntradas', 'amortizacaoDividas', 'aporteSocios',
    'distribuicaoLucros', 'impostos'
];

const FIELD_DESCRIPTIONS = {
    'faturamento': 'Receita bruta total obtida com a venda de produtos ou prestação de serviços no mês.',
    'numeroDeVendas': 'Quantidade total de transações comerciais (pedidos ou contratos) realizadas no mês.',
    'custosVariaveis': 'Gastos que aumentam ou diminuem conforme o volume de vendas (ex: matéria-prima, comissões).',
    'custosFixos': 'Gastos recorrentes que independem das vendas (ex: aluguel, salários administrativos, internet).',
    'despesasOperacionais': 'Gastos necessários para manter a operação, mas não ligados diretamente à produção (ex: marketing, escritório).',
    'depreciacao': 'Perda de valor mensal de equipamentos e bens da empresa (não é uma saída de caixa real).',
    'outrasReceitasDespesas': 'Entradas ou saídas atípicas, como rendimentos financeiros, multas ou venda de bens usados.',
    'investimentos': 'Saída de caixa para aquisição de ativos duráveis (CAPEX), como máquinas, veículos ou reformas.',
    'financiamentosEntradas': 'Dinheiro que entrou no caixa proveniente de empréstimos bancários ou financiamentos.',
    'amortizacaoDividas': 'Saída de caixa destinada ao pagamento do valor principal de empréstimos e dívidas.',
    'aporteSocios': 'Dinheiro injetado no caixa da empresa pelos próprios sócios ou investidores.',
    'distribuicaoLucros': 'Saída de caixa para pagamento de dividendos ou lucros aos sócios.',
    'impostos': 'Total de tributos pagos sobre o faturamento ou lucro (ex: DAS, ICMS, ISS, IRPJ).'
};

const GLOSSARY_DATA = {
    faturamento: {nome: "Faturamento", formula: "Preço de Venda × Quantidade Vendida", significado: "Valor total das vendas de produtos ou serviços em um período, antes de qualquer dedução.", exemplo: "Vender 100 produtos a R$50 cada gera um faturamento de R$5.000.", dica: "Aumente o faturamento com estratégias de marketing, diversificação de produtos ou ajuste de preços."},
    faturamentoMedio: {nome: "Faturamento Bruto Médio", formula: "Faturamento Anual Total / 12", significado: "A média mensal do seu faturamento bruto durante o ano. Ajuda a entender a sazonalidade e o desempenho de vendas consistente.", dica: "Compare a média com os meses individuais para identificar seus melhores períodos de venda e planejar campanhas."},
    volumeVendasMedio: {nome: "Volume de Vendas Médio", formula: "Número de Vendas Anual Total / 12", significado: "O número médio de vendas realizadas por mês. Indica a sua capacidade de atrair e converter clientes.", dica: "Se o volume médio for baixo, foque em estratégias de marketing para atrair mais clientes ou em otimizar sua taxa de conversão."},
    custosVariaveis: {nome: "Custos Variáveis (CV)", formula: "Custo por Unidade × Quantidade Vendida", significado: "Custos que variam diretamente com o volume de produção ou vendas, como matéria-prima e comissões.", exemplo: "Se o custo da matéria-prima de um produto é R$10, e você vende 100, seu CV é de R$1.000.", dica: "Negocie com fornecedores e otimize a produção para reduzir os custos variáveis por unidade."},
    custosFixos: {nome: "Custos Fixos (CF)", formula: "Soma dos custos que não variam com a produção", significado: "Custos que a empresa tem todo mês, independentemente de vender muito ou pouco, como aluguel e salários fixos.", exemplo: "Aluguel do escritório de R$2.000 e folha de pagamento de R$8.000 somam R$10.000 de custos fixos.", dica: "Revise periodicamente seus custos fixos para identificar oportunidades de redução sem impactar a operação."},
    lucroBruto: {nome: "Lucro Bruto", formula: "Faturamento - Custos Variáveis", significado: "Dinheiro que sobra das vendas após subtrair os custos diretos para produzir ou adquirir o que foi vendido.", exemplo: "Faturamento de R$10.000 e CV de R$4.000 resultam em Lucro Bruto de R$6.000.", dica: "É o primeiro indicador de rentabilidade do seu produto ou serviço."},
    markup: {nome: "Markup Divisor", formula: "((Faturamento - CV) / CV) × 100", significado: "Índice que mostra o quanto seu preço de venda está acima do custo variável do produto.", exemplo: "Custo de R$50 e venda por R$120 resulta em Markup de 140%.", dica: "Use o markup como base para sua estratégia de precificação, garantindo que ele cubra todos os custos e o lucro."},
    lucroOperacional: {nome: "Lucro Operacional", formula: "Lucro Bruto - Custos Fixos - Despesas Operacionais", significado: "Lucro gerado exclusivamente pela operação principal da empresa, antes de impostos e juros.", exemplo: "Lucro Bruto de R$6.000, com CF de R$3.000, resulta em Lucro Operacional de R$3.000.", dica: "Um lucro operacional positivo mostra que a atividade principal da sua empresa é rentável."},
    lucroLiquido: {nome: "Lucro Líquido", formula: "Lucro Operacional +/- Outras Receitas/Despesas - Impostos", significado: "O resultado final da empresa após todas as deduções. É o que realmente sobra para os sócios.", exemplo: "Lucro Operacional de R$3.000 menos R$500 de impostos resulta em Lucro Líquido de R$2.500.", dica: "É a métrica final de sucesso financeiro do negócio em um período."},
    margemLiquida: {nome: "Margem Líquida (%)", formula: "(Lucro Líquido / Faturamento) × 100", significado: "A porcentagem de cada real de faturamento que se transforma em lucro líquido.", exemplo: "Lucro de R$2.500 em um faturamento de R$10.000 resulta em uma margem de 25%.", dica: "Compare sua margem líquida com a média do seu setor para avaliar a competitividade."},
    pontoEquilibrio: {nome: "Ponto de Equilíbrio", formula: "Custos Fixos / (1 - (Custos Variáveis / Faturamento))", significado: "O valor mínimo de faturamento necessário para cobrir todos os custos, onde o lucro é zero.", exemplo: "Se seus custos fixos são R$5.000 e seus custos variáveis representam 60% do faturamento, seu Ponto de Equilíbrio é R$12.500.", dica: "Conhecer seu ponto de equilíbrio é vital para definir metas de vendas realistas e garantir a sobrevivência do negócio."},
    ticketMedio: {nome: "Ticket Médio", formula: "Faturamento Total / Número de Vendas", significado: "Valor médio que cada cliente gasta por compra.", exemplo: "Faturamento de R$10.000 com 100 vendas resulta em um Ticket Médio de R$100.", dica: "Crie combos, ofereça produtos complementares (cross-sell) e versões melhores (upsell) para aumentar o ticket médio."},
    depreciacao: {nome: "Depreciação", formula: "(Custo do Ativo - Valor Residual) / Vida Útil", significado: "É a perda de valor de um ativo (máquina, veículo) ao longo do tempo. É uma despesa que não representa saída de caixa.", exemplo: "Uma máquina de R$50.000 com vida útil de 5 anos deprecia R$10.000 por ano.", dica: "A depreciação reduz o lucro tributável, gerando economia de impostos, e é somada de volta no cálculo do fluxo de caixa."},
    fluxoCaixaOperacional: {nome: "Fluxo de Caixa Operacional (FCO)", formula: "Lucro Líquido + Depreciação", significado: "Mede o caixa efetivamente gerado pelas operações principais do negócio. É o coração financeiro da empresa.", exemplo: "Lucro de R$8.500 + Depreciação de R$1.000 = FCO de R$9.500.", dica: "Um FCO consistentemente positivo e crescente indica uma operação saudável e eficiente."},
    fluxoCaixaInvestimentos: {nome: "Fluxo de Caixa de Investimentos (FCI)", formula: "(-) Aquisição de Ativos (+) Venda de Ativos", significado: "Mostra o caixa utilizado na compra (CAPEX) ou gerado na venda de ativos de longo prazo, como máquinas e imóveis.", exemplo: "A compra de uma máquina por R$20.000 gera um FCI de -R$20.000.", dica: "Um FCI negativo indica que a empresa está investindo em seu crescimento futuro."},
    fluxoCaixaFinanciamentos: {nome: "Fluxo de Caixa de Financiamentos (FCF)", formula: "Novos Empréstimos - Pagamento de Dívidas + Aportes de Sócios - Distribuição de Lucros", significado: "Reflete as transações de caixa com proprietários (sócios) e credores (bancos).", exemplo: "Pegou R$30.000 de empréstimo e pagou R$5.000 aos sócios = FCF de +R$25.000.", dica: "Ajuda a entender como a empresa está financiando suas operações e seu crescimento."},
    fluxoCaixaLivre: {nome: "Fluxo de Caixa Livre (FCL)", formula: "FCO + FCI + FCF", significado: "A variação total de caixa no período. É a métrica mais importante para a saúde financeira de curto prazo.", exemplo: "FCO de R$9.500 + FCI de -R$20.000 + FCF de R$25.000 = FCL de +R$14.500.", dica: "Um FCL positivo significa que a empresa gerou mais caixa do que gastou, aumentando sua reserva financeira."}
};

// --- FUNÇÕES DE LÓGICA ---

function initialize() {
    auth.signOut().then(() => {
        auth.onAuthStateChanged(handleAuthStateChange);
    });
}

async function handleAuthStateChange(user) {
    try {
        if (user) {
            currentUser = user;
            [financialData, userSettings] = await Promise.all([
                loadDataFromFirestore(user.uid, 'financialData'),
                loadDataFromFirestore(user.uid, 'userSettings')
            ]);
            showApp();
        } else {
            currentUser = null;
            showLogin();
        }
    } catch (error) { console.error("Erro crítico na autenticação:", error); showLogin(); }
}

// --- FUNÇÃO DE SINCRONIZAÇÃO (NOVA) ---
async function handleSync() {
    if (!currentUser) {
        alert("Usuário não autenticado. Faça login novamente.");
        showLogin();
        return;
    }

    const originalText = syncBtn.textContent;
    syncBtn.textContent = "Sincronizando...";
    syncBtn.disabled = true;

    try {
        // 1. Recarrega a autenticação para garantir que o token é válido
        await currentUser.reload();
        currentUser = auth.currentUser;

        if(!currentUser) throw new Error("Sessão expirada.");

        // 2. Busca dados frescos do Firestore
        const [newData, newSettings] = await Promise.all([
            loadDataFromFirestore(currentUser.uid, 'financialData'),
            loadDataFromFirestore(currentUser.uid, 'userSettings')
        ]);

        // 3. Atualiza estado local
        financialData = newData || {};
        userSettings = newSettings || {};

        // 4. Atualiza a UI (chama showApp que popula os inputs novamente)
        await showApp(); 

        alert("Sincronização e autenticação concluídas com sucesso!");
    } catch (error) {
        console.error("Erro na sincronização:", error);
        alert("Erro ao sincronizar. Verifique sua conexão ou faça login novamente.");
        if (error.code === 'auth/user-token-expired' || !auth.currentUser) {
            showLogin();
        }
    } finally {
        syncBtn.textContent = originalText;
        syncBtn.disabled = false;
    }
}

function handleLogin(e) { 
    e.preventDefault(); 
    
    // Agora loginForm já foi definido nas constantes lá em cima
    if (loginForm.style.display === 'none') return;

    // Correção: pegar o valor aqui dentro, não fora
    const email = document.getElementById('login-user').value; 
    const pass = document.getElementById('login-password').value; 
    const errorEl = document.getElementById('login-error'); 
    
    errorEl.textContent = ''; 
    auth.signInWithEmailAndPassword(email, pass).catch(error => { errorEl.textContent = "Email ou senha inválidos."; }); 
}

function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('register-user').value;
    const company = document.getElementById('register-company').value;
    const pass = document.getElementById('register-password').value;
    const errorEl = document.getElementById('register-error');
    errorEl.textContent = '';
    
    auth.createUserWithEmailAndPassword(email, pass)
        .then(userCredential => {
            const now = new Date();
            const expirationDate = new Date();
            expirationDate.setDate(now.getDate() + DEFAULT_TRIAL_DAYS);

            return db.collection('users').doc(userCredential.user.uid).set({ 
                email: userCredential.user.email, 
                company: company || DEFAULT_COMPANY_NAME, 
                createdAt: firebase.firestore.FieldValue.serverTimestamp() 
            }).then(() => {
                return db.collection('userSettings').doc(userCredential.user.uid).set({
                    corporateName: company || DEFAULT_COMPANY_NAME,
                    accessExpiration: expirationDate.toISOString(),
                    lastAccess: now.toISOString()
                }, { merge: true });
            });
        })
        .then(() => { 
            alert(`Cadastro realizado com sucesso! Acesso liberado conforme regra do sistema (${DEFAULT_TRIAL_DAYS} dias).`); 
            toggleForms('login'); 
        })
        .catch(error => {
            switch (error.code) {
                case 'auth/email-already-in-use': errorEl.textContent = "Este email já está cadastrado."; break;
                case 'auth/weak-password': errorEl.textContent = "A senha deve ter no mínimo 6 caracteres."; break;
                case 'auth/invalid-email': errorEl.textContent = "O formato do email é inválido."; break;
                default: errorEl.textContent = "Erro no cadastro. Verifique a config do Firebase."; console.error("Erro:", error); break;
            }
        });
}

function handlePasswordReset(e) {
    e.preventDefault();
    const email = document.getElementById('reset-email').value;
    const messageEl = document.getElementById('reset-message');
    messageEl.textContent = 'Enviando...';
    messageEl.className = '';
    auth.sendPasswordResetEmail(email)
        .then(() => { messageEl.textContent = "Email de recuperação enviado! Verifique sua caixa de entrada e spam."; messageEl.className = 'success-message'; })
        .catch((error) => {
            messageEl.className = 'error-message';
            if (error.code === 'auth/user-not-found') messageEl.textContent = "Este email não está cadastrado.";
            else if (error.code === 'auth/invalid-email') messageEl.textContent = "O formato do email é inválido.";
            else messageEl.textContent = "Ocorreu um erro. Tente novamente.";
        });
}

async function deleteAccountAndData() {
    if (!currentUser) return;
    const confirmation = prompt("Atenção: Ação irreversível. Para excluir sua conta e todos os dados, digite 'EXCLUIR'.");
    if (confirmation !== 'EXCLUIR') { alert("Ação cancelada."); return; }
    try {
        await db.collection('financialData').doc(currentUser.uid).delete();
        await db.collection('userSettings').doc(currentUser.uid).delete();
        await db.collection('users').doc(currentUser.uid).delete();
        await currentUser.delete();
        alert("Conta e dados excluídos com sucesso.");
    } catch (error) {
        console.error("Erro ao excluir conta:", error);
        alert("Erro ao excluir conta. Pode ser necessário fazer login novamente por segurança.");
    }
}

function toggleForms(formToShow) {
    loginForm.style.display = formToShow === 'login' ? 'block' : 'none';
    registerForm.style.display = formToShow === 'register' ? 'block' : 'none';
    resetPasswordForm.style.display = formToShow === 'reset' ? 'block' : 'none';
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
    document.getElementById('reset-message').textContent = '';
}

async function showApp() {
    loginSection.style.display = 'none';
    app.style.display = 'block';
    
    companyNameEl.textContent = userSettings.corporateName || DEFAULT_COMPANY_NAME;
    
    document.getElementById('business-type').value = userSettings.businessType || 'varejo';
    document.getElementById('benchmark-margem').value = (userSettings.benchmarkMargem != null) ? userSettings.benchmarkMargem : '';
    document.getElementById('benchmark-custos').value = (userSettings.benchmarkCustos != null) ? userSettings.benchmarkCustos : '';
    document.getElementById('benchmark-markup').value = (userSettings.benchmarkMarkup != null) ? userSettings.benchmarkMarkup : '';

    document.getElementById('diag-corporate-name').value = userSettings.corporateName || '';
    document.getElementById('diag-cnpj').value = userSettings.cnpj || '';
    document.getElementById('diag-responsible').value = userSettings.responsibleName || '';
    document.getElementById('diag-email').value = userSettings.contactEmail || '';
    document.getElementById('diag-phone').value = userSettings.phone || '';
    document.getElementById('diag-sector').value = userSettings.sector || 'Comércio';
    document.getElementById('diag-tax-regime').value = userSettings.taxRegime || 'Simples Nacional';

    document.getElementById('diag-erp').value = userSettings.hasErp || 'Não';
    document.getElementById('diag-instagram').value = userSettings.hasInstagram || 'Não';
    document.getElementById('diag-facebook').value = userSettings.hasFacebook || 'Não';
    document.getElementById('diag-landingpage').value = userSettings.hasLandingPage || 'Não';
    document.getElementById('diag-site').value = userSettings.hasSite || 'Não';
    document.getElementById('diag-ecommerce').value = userSettings.hasEcommerce || 'Não';
    document.getElementById('diag-ads').value = userSettings.hasAds || 'Não';
    document.getElementById('diag-marketplace').value = userSettings.marketplaceList || '';
    
    document.getElementById('diag-observations').value = userSettings.observations || '';
    
    consultantDiagnosisText.value = userSettings.consultantDiagnosis || '';

    allowManualEditCheckbox.checked = userSettings.allowManualEdit === true;

    const isAdmin = currentUser.email === ADMIN_EMAIL;
    const adminButtons = [btnTestAccess, btnResetAuth];
    adminButtons.forEach(btn => {
        if(btn) btn.style.display = isAdmin ? 'inline-block' : 'none';
    });
    if(btnGenerateUnlockCode) btnGenerateUnlockCode.style.display = 'inline-block';

    await checkAccessStatus();

    setupYearSelector();
    setupDailyMonthSelector();
    updateAllCalculations(); 
    renderGlossary();
    renderDailyEntries(currentYear, new Date().getMonth());
}

function showLogin() {
    app.style.display = 'none';
    loginSection.style.display = 'flex';
}

async function loadDataFromFirestore(userId, collection) {
    if (!userId || !collection) return {};
    try {
        const docRef = db.collection(collection).doc(userId);
        const doc = await docRef.get();
        return doc.exists ? doc.data() : {};
    } catch (error) { console.error(`Erro ao carregar dados da coleção ${collection}:`, error); return {}; }
}

async function saveDataToFirestore(userId, data, collection) {
    try { await db.collection(collection).doc(userId).set(data, { merge: true });
    } catch (error) { console.error(`Erro ao salvar dados na coleção ${collection}:`, error); alert('Falha ao salvar. Verifique sua conexão.'); throw error; }
}

async function saveMonthlyData() {
    if (!currentUser) return;
    if (!financialData[currentYear]) financialData[currentYear] = {};
    
    if (!allowManualEditCheckbox.checked) {
        aggregateDailyData(currentYear);
    }

    document.querySelectorAll('#monthly-inputs input').forEach(input => {
        const month = parseInt(input.dataset.month);
        const field = input.dataset.field;
        
        if (!financialData[currentYear][month]) {
            financialData[currentYear][month] = { dailyEntries: [] };
        }
        
        financialData[currentYear][month][field] = parseFloat(input.value) || 0;
    });

    try {
        await saveDataToFirestore(currentUser.uid, financialData, 'financialData');
        alert('Dados salvos na nuvem com sucesso!');
        updateAllCalculations(); 
    } catch (e) {}
}


async function saveBusinessSettings() {
    if (!currentUser) return;
    const settings = {
        ...userSettings,
        businessType: document.getElementById('business-type').value,
        benchmarkMargem: parseFloat(document.getElementById('benchmark-margem').value) || 0,
        benchmarkCustos: parseFloat(document.getElementById('benchmark-custos').value) || 0,
        benchmarkMarkup: parseFloat(document.getElementById('benchmark-markup').value) || 0,
        allowManualEdit: allowManualEditCheckbox.checked 
    };
    try { 
        await saveDataToFirestore(currentUser.uid, settings, 'userSettings'); 
        userSettings = settings; 
        alert('Configurações salvas com sucesso!');
    } catch (error) {
        console.error("Falha ao salvar configurações:", error);
    }
}

async function saveDiagnosisData(e) {
    if (e) e.preventDefault();
    if (!currentUser) return;

    const corporateName = document.getElementById('diag-corporate-name').value;
    const cnpj = document.getElementById('diag-cnpj').value;
    const responsibleName = document.getElementById('diag-responsible').value;
    const contactEmail = document.getElementById('diag-email').value;
    const phone = document.getElementById('diag-phone').value;
    const sector = document.getElementById('diag-sector').value;
    const taxRegime = document.getElementById('diag-tax-regime').value;

    const hasErp = document.getElementById('diag-erp').value;
    const hasInstagram = document.getElementById('diag-instagram').value;
    const hasFacebook = document.getElementById('diag-facebook').value;
    const hasLandingPage = document.getElementById('diag-landingpage').value;
    const hasSite = document.getElementById('diag-site').value;
    const hasEcommerce = document.getElementById('diag-ecommerce').value;
    const hasAds = document.getElementById('diag-ads').value;
    const marketplaceList = document.getElementById('diag-marketplace').value;
    const observations = document.getElementById('diag-observations').value;

    const settings = {
        ...userSettings,
        corporateName,
        cnpj,
        responsibleName,
        contactEmail,
        phone,
        sector,
        taxRegime,
        hasErp,
        hasInstagram,
        hasFacebook,
        hasLandingPage,
        hasSite,
        hasEcommerce,
        hasAds,
        marketplaceList,
        observations
    };

    try {
        await saveDataToFirestore(currentUser.uid, settings, 'userSettings');
        userSettings = settings;
        companyNameEl.textContent = corporateName || DEFAULT_COMPANY_NAME;
        if(e) alert('Dados do Diagnóstico Empresarial salvos com sucesso!');
    } catch (error) {
        console.error("Falha ao salvar diagnóstico:", error);
    }
}

async function saveConsultantDiagnosis() {
    if (!currentUser) return;
    const diagnosis = consultantDiagnosisText.value;

    const settings = {
        ...userSettings,
        consultantDiagnosis: diagnosis
    };

    try {
        await saveDataToFirestore(currentUser.uid, settings, 'userSettings');
        userSettings = settings;
        alert('Parecer do Consultor salvo com sucesso!');
    } catch (error) {
        console.error("Falha ao salvar parecer:", error);
    }
}

// === VERIFICAÇÃO E CONTROLE DE ACESSO ===

async function checkAccessStatus() {
    if (!currentUser) return;

    const now = new Date();
    
    let expirationDate = userSettings.accessExpiration ? new Date(userSettings.accessExpiration) : new Date(0); 
    let lastAccess = userSettings.lastAccess ? new Date(userSettings.lastAccess) : now;

    if (now.getTime() < lastAccess.getTime() - 60000) { 
        alert("Erro de Sincronização: A data do sistema parece incorreta (anterior ao último acesso). Por favor, ajuste o relógio.");
        lockAllTabs();
        return;
    }

    userSettings.lastAccess = now.toISOString();
    await saveDataToFirestore(currentUser.uid, { lastAccess: userSettings.lastAccess }, 'userSettings');

    const timeLeft = expirationDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

    if (timeLeft <= 0) {
        lockAllTabs();
        updateAccessDisplay("Expirado", expirationDate, 0);
    } else {
        unlockAllTabs();
        updateAccessDisplay("Ativo", expirationDate, daysLeft);
    }
}

function lockAllTabs() {
    const allowedTabs = ['diagnostico', 'entradas-diarias', 'entradas-mensais', 'configuracoes'];
    
    const allTabs = document.querySelectorAll('nav button');
    
    allTabs.forEach(tab => {
        if(allowedTabs.includes(tab.dataset.tab)) {
            tab.classList.remove('hidden-tab');
        } else {
            tab.classList.add('hidden-tab');
        }
    });

    if(btnGenerateUnlockCode) {
        btnGenerateUnlockCode.disabled = false;
        btnGenerateUnlockCode.style.backgroundColor = '#d4ac0d';
        btnGenerateUnlockCode.textContent = 'Gerar Código de Desbloqueio';
    }
}

function unlockAllTabs() {
    const hiddenTabs = document.querySelectorAll('.hidden-tab');
    hiddenTabs.forEach(tab => {
        tab.classList.remove('hidden-tab');
    });
    btnGenerateUnlockCode.disabled = true;
    btnGenerateUnlockCode.style.backgroundColor = '#ccc';
    btnGenerateUnlockCode.textContent = 'Sistema Desbloqueado';
}

function updateAccessDisplay(status, date, days) {
    accessStatusDisplay.style.display = 'block';
    statusText.textContent = status;
    statusText.style.color = status === "Ativo" ? "green" : "red";
    expirationText.textContent = date.toLocaleDateString('pt-BR');
    daysLeftText.textContent = days > 0 ? days : 0;
}

// === FUNÇÕES DE DESBLOQUEIO ===

async function handleUnlockTabs() {
    const CALC_OFFSET = 13;
    const CALC_MULTIPLIER = 9;
    const CALC_BASE = 1954;

    const randomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    generatedCodeDisplay.textContent = randomNumber;
    
    const expectedBaseCode = (randomNumber + CALC_OFFSET) * CALC_MULTIPLIER + CALC_BASE;

    setTimeout(async () => {
        const userInput = prompt(`Código gerado: ${randomNumber}.\nDigite a contra-senha no formato: CÓDIGO-DIAS (ex: 5000-30).`);

        if (userInput) {
            const parts = userInput.split('-');
            const codeInput = parseInt(parts[0]);
            const daysInput = parts.length > 1 ? parseInt(parts[1]) : 30; 

            let isValid = false;
            // Senha mestra
            if (parts[0] === '130954') {
                isValid = true;
            } 
            else if (codeInput === expectedBaseCode && !isNaN(daysInput) && daysInput > 0) {
                isValid = true;
            }

            if (isValid) {
                const now = new Date();
                const newExpiration = new Date();
                newExpiration.setDate(now.getDate() + daysInput);

                userSettings.accessExpiration = newExpiration.toISOString();
                
                await saveDataToFirestore(currentUser.uid, { accessExpiration: userSettings.accessExpiration }, 'userSettings');
                
                alert(`Acesso liberado com sucesso por ${daysInput} dias!`);
                generatedCodeDisplay.textContent = "Desbloqueado";
                checkAccessStatus(); 
                
            } else {
                alert("Contra-senha inválida ou formato incorreto. Use CÓDIGO-DIAS.");
                generatedCodeDisplay.textContent = ""; 
            }
        } else {
             generatedCodeDisplay.textContent = ""; 
        }
    }, 200); 
}

async function addTestDay() {
    if (!currentUser) return;
    if(confirm("Adicionar 1 dia de teste para a conta atual?")) {
        const currentExp = userSettings.accessExpiration ? new Date(userSettings.accessExpiration) : new Date();
        const baseDate = currentExp < new Date() ? new Date() : currentExp;
        baseDate.setDate(baseDate.getDate() + 1);
        
        userSettings.accessExpiration = baseDate.toISOString();
        await saveDataToFirestore(currentUser.uid, { accessExpiration: userSettings.accessExpiration }, 'userSettings');
        alert("1 Dia de teste adicionado!");
        checkAccessStatus();
    }
}

async function resetAccess() {
    if (!currentUser) return;
    if(confirm("ATENÇÃO: Isso irá zerar o período de autorização e bloquear o sistema imediatamente. Continuar?")) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        userSettings.accessExpiration = yesterday.toISOString();
        await saveDataToFirestore(currentUser.uid, { accessExpiration: userSettings.accessExpiration }, 'userSettings');
        
        alert("Autorização zerada. O sistema foi bloqueado.");
        checkAccessStatus();
    }
}

btnGenerateUnlockCode.addEventListener('click', handleUnlockTabs);
btnTestAccess.addEventListener('click', addTestDay);
btnResetAuth.addEventListener('click', resetAccess);

// === FUNÇÕES DE DADOS DE DEMONSTRAÇÃO E RESET ===

function generateDailySimulation(year, monthIndex, totals) {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const entries = [];
    
    let remFat = totals.faturamento;
    let remCustos = totals.custosVariaveis; 
    let remDesp = totals.despesasOperacionais;
    let remVendas = totals.numeroDeVendas;

    for (let day = 1; day <= daysInMonth; day++) {
        const isLastDay = day === daysInMonth;
        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        let dFat, dCustos, dDesp, dVendas;

        if (isLastDay) {
            dFat = parseFloat(remFat.toFixed(2));
            dCustos = parseFloat(remCustos.toFixed(2));
            dDesp = parseFloat(remDesp.toFixed(2));
            dVendas = Math.round(remVendas);
        } else {
            const variance = 0.6 + Math.random() * 0.8; 
            const daysLeft = (daysInMonth - day + 1);

            dFat = parseFloat(((remFat / daysLeft) * variance).toFixed(2));
            dCustos = parseFloat(((remCustos / daysLeft) * variance).toFixed(2));
            dDesp = parseFloat(((remDesp / daysLeft) * variance).toFixed(2));
            dVendas = Math.round((remVendas / daysLeft) * variance);
        }

        dFat = Math.max(0, dFat);
        dCustos = Math.max(0, dCustos);
        dDesp = Math.max(0, dDesp);
        dVendas = Math.max(0, dVendas);

        remFat -= dFat;
        remCustos -= dCustos;
        remDesp -= dDesp;
        remVendas -= dVendas;

        entries.push({
            date: dateStr,
            faturamento: dFat,
            despesas: dDesp,
            comissao: dCustos, 
            outras: 0,
            vendas: dVendas
        });
    }
    return entries;
}

async function handleResetAndPopulateDemoData() {
    if (!currentUser) return;

    const confirmed = confirm(
        "AVISO: Esta ação irá ZERAR os dados atuais das abas 'Empresa', 'Valores Mensais' e 'Entradas Diárias', preenchendo-os com dados de simulação (Comércio R$ 60k).\n\n" +
        "Esta ação é irreversível e afetará os dados de todo o ano atual.\n\nDeseja continuar?"
    );

    if (!confirmed) return;

    const demoCompanyData = {
        corporateName: "Loja Modelo de Exemplo Ltda",
        cnpj: "12.345.678/0001-90",
        responsibleName: "João Empreendedor",
        contactEmail: currentUser.email,
        phone: "(11) 98765-4321",
        sector: "Comércio",
        taxRegime: "Simples Nacional",
        hasErp: "Sim",
        hasInstagram: "Sim",
        hasFacebook: "Sim",
        hasSite: "Sim",
        observations: "Dados gerados automaticamente para demonstração do sistema. Faturamento médio de R$ 60k com distribuição diária proporcional."
    };
    
    userSettings = { ...userSettings, ...demoCompanyData, allowManualEdit: true };
    document.getElementById('diag-corporate-name').value = demoCompanyData.corporateName;
    document.getElementById('diag-cnpj').value = demoCompanyData.cnpj;
    document.getElementById('diag-responsible').value = demoCompanyData.responsibleName;
    document.getElementById('diag-phone').value = demoCompanyData.phone;
    document.getElementById('diag-sector').value = demoCompanyData.sector;
    document.getElementById('diag-tax-regime').value = demoCompanyData.taxRegime;
    document.getElementById('diag-observations').value = demoCompanyData.observations;
    companyNameEl.textContent = demoCompanyData.corporateName;

    if (!financialData[currentYear]) financialData[currentYear] = {};
    
    for (let i = 0; i < 12; i++) {
        const variation = 1 + (Math.random() * 0.2 - 0.1); 
        const baseRevenue = 60000 * variation;
        
        const monthFaturamento = parseFloat(baseRevenue.toFixed(2));
        const monthNumVendas = Math.floor(300 * variation);
        const monthCustosVar = parseFloat((baseRevenue * 0.45).toFixed(2)); // ~45%
        const monthDespesasOp = parseFloat((3000 + (Math.random() * 500)).toFixed(2));

        const generatedDailyEntries = generateDailySimulation(currentYear, i, {
            faturamento: monthFaturamento,
            custosVariaveis: monthCustosVar,
            despesasOperacionais: monthDespesasOp,
            numeroDeVendas: monthNumVendas
        });

        const monthlyData = {
            faturamento: monthFaturamento,
            numeroDeVendas: monthNumVendas,
            custosVariaveis: monthCustosVar,
            custosFixos: parseFloat((12000 + (Math.random() * 1000)).toFixed(2)),
            despesasOperacionais: monthDespesasOp,
            depreciacao: 500,
            outrasReceitasDespesas: 0,
            investimentos: i === 5 ? 5000 : 0, 
            financiamentosEntradas: 0,
            amortizacaoDividas: 0,
            aporteSocios: 0,
            distribuicaoLucros: 0,
            impostos: parseFloat((baseRevenue * 0.08).toFixed(2)), 
            
            dailyEntries: generatedDailyEntries 
        };

        financialData[currentYear][i] = monthlyData;
    }

    allowManualEditCheckbox.checked = true;

    try {
        await saveDataToFirestore(currentUser.uid, userSettings, 'userSettings');
        await saveDataToFirestore(currentUser.uid, financialData, 'financialData');
        
        updateAllCalculations(); 
        
        const selectedMonth = parseInt(dailyMonthSelector.value) || 0;
        renderDailyEntries(currentYear, selectedMonth);

        alert("Simulação concluída! Dados mensais e diários gerados com sucesso.");
    } catch (error) {
        console.error("Erro ao preencher dados de demo:", error);
        alert("Erro ao salvar os dados simulados.");
    }
}

btnResetPopulateDemo.addEventListener('click', handleResetAndPopulateDemoData);


// === FUNÇÕES DE BACKUP E RESTORE ===

function exportLocalBackup() {
    if (!financialData || Object.keys(financialData).length === 0) {
        const confirmBackup = confirm("Parece que não há dados financeiros carregados. Deseja fazer o backup mesmo assim?");
        if (!confirmBackup) return;
    }

    const backupData = {
        financialData: JSON.parse(JSON.stringify(financialData)), 
        userSettings: JSON.parse(JSON.stringify(userSettings)), 
        exportDate: new Date().toISOString(),
        appVersion: "1.2"
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_financeiro_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importLocalBackup(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm("ATENÇÃO: Restaurar um backup substituirá TODOS os dados atuais da tela e salvará na nuvem (Firebase). Deseja continuar?")) {
        e.target.value = ''; 
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(event) {
        try {
            const parsedData = JSON.parse(event.target.result);
            if (!parsedData.financialData && !parsedData.userSettings) throw new Error("Arquivo de backup inválido.");

            financialData = parsedData.financialData || {};
            userSettings = parsedData.userSettings || {};

            await db.collection('financialData').doc(currentUser.uid).set(financialData); 
            await db.collection('userSettings').doc(currentUser.uid).set(userSettings);

            alert("Dados restaurados com sucesso!");
            
            const years = Object.keys(financialData).map(Number);
            if (years.length > 0) {
                currentYear = Math.max(...years);
                let yearExists = false;
                for(let opt of yearSelector.options){ if(parseInt(opt.value) === currentYear) yearExists = true; }
                if(!yearExists) {
                    const option = document.createElement('option');
                    option.value = currentYear; option.textContent = currentYear;
                    yearSelector.appendChild(option);
                }
                yearSelector.value = currentYear;
            }
            showApp(); 
        } catch (error) {
            console.error("Erro ao restaurar:", error);
            alert("Erro ao ler o arquivo de backup ou salvar no banco.");
        }
        e.target.value = ''; 
    };
    reader.readAsText(file);
}

// === FUNÇÕES XLSX ===

function createSheetFromData(data, headers, sheetName) {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    return wb;
}

function readXLSXFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            resolve(workbook);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function handleExportCompanyXLSX() {
    const formMap = {
        'Razão Social': userSettings.corporateName,
        'CNPJ': userSettings.cnpj,
        'Responsável': userSettings.responsibleName,
        'Email': userSettings.contactEmail,
        'Telefone': userSettings.phone,
        'Setor': userSettings.sector,
        'Regime': userSettings.taxRegime,
        'ERP': userSettings.hasErp,
        'Instagram': userSettings.hasInstagram,
        'Facebook': userSettings.hasFacebook,
        'Landing Page': userSettings.hasLandingPage,
        'Site': userSettings.hasSite,
        'E-commerce': userSettings.hasEcommerce,
        'Tráfego Pago': userSettings.hasAds,
        'Marketplace': userSettings.marketplaceList,
        'Observações': userSettings.observations
    };
    
    const rows = Object.entries(formMap);
    const wb = createSheetFromData(rows, ['Campo', 'Valor'], 'Dados Empresa');
    XLSX.writeFile(wb, `Empresa_${currentYear}.xlsx`);
}

async function handleImportCompanyXLSX(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const wb = await readXLSXFile(file);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }); // Array of arrays

        const fieldMapReverse = {
            'Razão Social': 'diag-corporate-name',
            'CNPJ': 'diag-cnpj',
            'Responsável': 'diag-responsible',
            'Email': 'diag-email',
            'Telefone': 'diag-phone',
            'Setor': 'diag-sector',
            'Regime': 'diag-tax-regime',
            'ERP': 'diag-erp',
            'Instagram': 'diag-instagram',
            'Facebook': 'diag-facebook',
            'Landing Page': 'diag-landingpage',
            'Site': 'diag-site',
            'E-commerce': 'diag-ecommerce',
            'Tráfego Pago': 'diag-ads',
            'Marketplace': 'diag-marketplace',
            'Observações': 'diag-observations'
        };

        let updated = false;
        data.forEach(row => {
            if (row.length >= 2) {
                const key = row[0];
                const value = row[1];
                const elementId = fieldMapReverse[key];
                if (elementId) {
                    const el = document.getElementById(elementId);
                    if (el) { el.value = value || ''; updated = true; }
                }
            }
        });

        if (updated) {
            saveDiagnosisData(null); 
            alert('Dados da empresa importados com sucesso!');
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao importar arquivo. Verifique o formato.');
    }
    e.target.value = '';
}

function handleExportDailyXLSX() {
    const month = parseInt(dailyMonthSelector.value);
    const yearData = financialData[currentYear] || {};
    const monthData = yearData[month] || {};
    const entries = monthData.dailyEntries || [];

    if (entries.length === 0) {
        alert('Não há lançamentos para exportar neste mês.');
        return;
    }

    const rows = entries.map(e => [e.date, e.faturamento, e.despesas, e.comissao, e.outras, e.vendas]);
    const wb = createSheetFromData(rows, ['Data', 'Faturamento', 'Despesas', 'Comissão', 'Outras', 'Vendas'], `${MONTHS[month]}_Diario`);
    XLSX.writeFile(wb, `Diario_${currentYear}_${MONTHS[month]}.xlsx`);
}

async function handleImportDailyXLSX(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm("A importação irá adicionar os lançamentos da planilha aos existentes. Continuar?")) {
        e.target.value = ''; return;
    }

    try {
        const wb = await readXLSXFile(file);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws); 

        const month = parseInt(dailyMonthSelector.value);
        if (!financialData[currentYear]) financialData[currentYear] = {};
        if (!financialData[currentYear][month]) financialData[currentYear][month] = { dailyEntries: [] };

        let addedCount = 0;
        data.forEach(row => {
            const date = row['Data'] || row['date'];
            if (date) {
                financialData[currentYear][month].dailyEntries.push({
                    date: date,
                    faturamento: parseFloat(row['Faturamento'] || 0),
                    despesas: parseFloat(row['Despesas'] || 0),
                    comissao: parseFloat(row['Comissão'] || row['Comissao'] || 0),
                    outras: parseFloat(row['Outras'] || 0),
                    vendas: parseInt(row['Vendas'] || 0)
                });
                addedCount++;
            }
        });

        if (addedCount > 0) {
            await saveDataToFirestore(currentUser.uid, financialData, 'financialData');
            updateAllCalculations();
            renderDailyEntries(currentYear, month);
            alert(`${addedCount} lançamentos importados com sucesso!`);
        } else {
            alert('Nenhum dado válido encontrado. Verifique os cabeçalhos (Data, Faturamento, Despesas...).');
        }

    } catch (err) {
        console.error(err);
        alert('Erro na importação. Verifique o arquivo.');
    }
    e.target.value = '';
}

function handleExportMonthlyXLSX() {
    const yearData = financialData[currentYear] || {};
    const headers = ['Mês', 'Faturamento', 'NumVendas', 'CustosVariaveis', 'CustosFixos', 'DespesasOp', 'Depreciacao', 'Outras', 'Investimentos', 'FinancEntradas', 'AmortDividas', 'AporteSocios', 'DistrLucros', 'Impostos'];
    
    const rows = MONTHS.map((m, i) => {
        const d = yearData[i] || {};
        return [
            m, 
            d.faturamento || 0, d.numeroDeVendas || 0, d.custosVariaveis || 0, d.custosFixos || 0, 
            d.despesasOperacionais || 0, d.depreciacao || 0, d.outrasReceitasDespesas || 0, 
            d.investimentos || 0, d.financiamentosEntradas || 0, d.amortizacaoDividas || 0, 
            d.aporteSocios || 0, d.distribuicaoLucros || 0, d.impostos || 0
        ];
    });

    const wb = createSheetFromData(rows, headers, `Mensal_${currentYear}`);
    XLSX.writeFile(wb, `Entradas_Mensais_${currentYear}.xlsx`);
}

async function handleImportMonthlyXLSX(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm("A importação substituirá os dados manuais da tabela mensal para este ano. Continuar?")) {
        e.target.value = ''; return;
    }

    try {
        const wb = await readXLSXFile(file);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws); 

        if (!financialData[currentYear]) financialData[currentYear] = {};
        
        const mapKeys = {
            'Faturamento': 'faturamento', 'NumVendas': 'numeroDeVendas', 'CustosVariaveis': 'custosVariaveis',
            'CustosFixos': 'custosFixos', 'DespesasOp': 'despesasOperacionais', 'Depreciacao': 'depreciacao',
            'Outras': 'outrasReceitasDespesas', 'Investimentos': 'investimentos', 'FinancEntradas': 'financiamentosEntradas',
            'AmortDividas': 'amortizacaoDividas', 'AporteSocios': 'aporteSocios', 'DistrLucros': 'distribuicaoLucros',
            'Impostos': 'impostos'
        };

        data.forEach((row, idx) => {
            if (idx < 12) { 
                if (!financialData[currentYear][idx]) financialData[currentYear][idx] = { dailyEntries: [] };
                Object.keys(mapKeys).forEach(header => {
                    if (row[header] !== undefined) {
                        financialData[currentYear][idx][mapKeys[header]] = parseFloat(row[header]) || 0;
                    }
                });
            }
        });

        await saveDataToFirestore(currentUser.uid, financialData, 'financialData');
        updateAllCalculations();
        alert('Tabela mensal importada e salva!');

    } catch (err) {
        console.error(err);
        alert('Erro ao importar. Certifique-se de usar o mesmo modelo da exportação.');
    }
    e.target.value = '';
}

function handleExportAnnualXLSX() {
    const tableData = [];
    const yearData = financialData[currentYear] || {};
    let annualTotals = {}; 
    INPUT_FIELDS.forEach(field => annualTotals[field] = 0);
    
    for(let i=0; i<12; i++) { 
        if(yearData[i]) INPUT_FIELDS.forEach(field => annualTotals[field] += yearData[i][field] || 0);
    }
    const indicators = calculateIndicators(annualTotals);
    
    Object.keys(indicators).forEach(k => {
        tableData.push([k, indicators[k]]);
    });
    
    const wb = createSheetFromData(tableData, ['Indicador', 'Valor Total'], 'Indicadores Anuais');
    XLSX.writeFile(wb, `Indicadores_Anuais_${currentYear}.xlsx`);
}

function handleExportEvolutionXLSX() {
    const yearData = financialData[currentYear] || {};
    const rows = [];
    for(let i=0; i<12; i++) {
        const ind = calculateIndicators(yearData[i]);
        rows.push([MONTHS[i], ind.faturamento, ind.custosTotais, ind.lucroLiquido, ind.fluxoCaixaLivre]);
    }
    const wb = createSheetFromData(rows, ['Mês', 'Faturamento', 'Custos Totais', 'Lucro Líquido', 'Fluxo Caixa Livre'], 'Evolução');
    XLSX.writeFile(wb, `Evolucao_${currentYear}.xlsx`);
}


// === GERAÇÃO DE PDFS POR ABA (MANTIDO) ===

function generateCompanyPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(0, 95, 115);
    doc.text(`Dados da Empresa e Diagnóstico - ${currentYear}`, 14, 20);
    
    const companyData = [
        ["Razão Social", userSettings.corporateName || "-"],
        ["CNPJ", userSettings.cnpj || "-"],
        ["Responsável", userSettings.responsibleName || "-"],
        ["E-mail", userSettings.contactEmail || "-"],
        ["Telefone", userSettings.phone || "-"],
        ["Setor", userSettings.sector || "-"],
        ["Regime Tributário", userSettings.taxRegime || "-"],
        ["Utiliza ERP", userSettings.hasErp || "Não"],
        ["Instagram", userSettings.hasInstagram || "Não"],
        ["Facebook", userSettings.hasFacebook || "Não"],
        ["Site", userSettings.hasSite || "Não"],
        ["Loja Virtual", userSettings.hasEcommerce || "Não"],
        ["Tráfego Pago", userSettings.hasAds || "Não"],
        ["Marketplaces", userSettings.marketplaceList || "-"]
    ];

    doc.autoTable({
        startY: 30,
        head: [['Campo', 'Informação']],
        body: companyData,
        theme: 'striped',
        headStyles: { fillColor: [0, 95, 115] },
        styles: { fontSize: 10 }
    });

    if (userSettings.observations) {
        let currentY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Observações Gerais:", 14, currentY);
        doc.setFontSize(10);
        const splitObs = doc.splitTextToSize(userSettings.observations, 180);
        doc.text(splitObs, 14, currentY + 7);
    }
    doc.save(`Relatorio_Empresa_${currentYear}.pdf`);
}

function generateMonthlyInputsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l'); 
    doc.setFontSize(16);
    doc.setTextColor(0, 95, 115);
    doc.text(`Entradas Mensais Detalhadas - ${currentYear}`, 14, 20);

    const monthlyData = [];
    const yearData = financialData[currentYear] || {};
    
    MONTHS.forEach((month, index) => {
        const data = yearData[index] || {};
        const row = [
            month,
            formatCurrency(data.faturamento),
            data.numeroDeVendas || 0,
            formatCurrency(data.custosVariaveis),
            formatCurrency(data.custosFixos),
            formatCurrency(data.despesasOperacionais),
            formatCurrency(data.outrasReceitasDespesas),
            formatCurrency(data.investimentos),
            formatCurrency(data.financiamentosEntradas),
            formatCurrency(data.amortizacaoDividas),
            formatCurrency(data.impostos)
        ];
        monthlyData.push(row);
    });

    doc.autoTable({
        startY: 30,
        head: [['Mês', 'Fat.', 'Vendas', 'C.Var.', 'C.Fix.', 'Desp.Op.', 'Outras', 'Invest.', 'Financ.', 'Amort.', 'Imp.']],
        body: monthlyData,
        theme: 'grid',
        headStyles: { fillColor: [10, 147, 150], fontSize: 8 },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold' } }
    });
    doc.save(`Entradas_Mensais_${currentYear}.pdf`);
}

function generateAnnualIndicatorsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(0, 95, 115);
    doc.text(`Indicadores Anuais - ${currentYear}`, 14, 20);

    let annualTotals = {}; 
    INPUT_FIELDS.forEach(field => annualTotals[field] = 0);
    const yearData = financialData[currentYear] || {};
    let monthsWithDataCount = 0;
    for(let i=0; i<12; i++) { 
        if(yearData[i]) {
            INPUT_FIELDS.forEach(field => annualTotals[field] += yearData[i][field] || 0);
            if((yearData[i].faturamento > 0) || (yearData[i].custosVariaveis > 0) || (yearData[i].custosFixos > 0)) monthsWithDataCount++;
        }
    }
    const divisor = monthsWithDataCount > 0 ? monthsWithDataCount : 1;
    const annualIndicators = calculateIndicators(annualTotals);

    const summaryData = [
        ["Faturamento Total", formatCurrency(annualIndicators.faturamento)],
        ["Faturamento Médio Mensal", formatCurrency(annualIndicators.faturamento / divisor)],
        ["Volume de Vendas Médio", (annualTotals.numeroDeVendas / divisor).toFixed(1)],
        ["Lucro Líquido Total", formatCurrency(annualIndicators.lucroLiquido)],
        ["Margem Líquida Média", formatPercent(annualIndicators.margemLiquida)],
        ["Markup Médio", formatPercent(annualIndicators.markup)],
        ["Fluxo de Caixa Livre Total", formatCurrency(annualIndicators.fluxoCaixaLivre)],
        ["Ponto de Equilíbrio Médio", formatCurrency(annualIndicators.pontoEquilibrio / divisor)]
    ];

    doc.autoTable({
        startY: 30,
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 12, fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 80, halign: 'right' } }
    });
    doc.save(`Indicadores_Anuais_${currentYear}.pdf`);
}

function generateEvolutionPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(0, 95, 115);
    doc.text(`Evolução Gráfica do Negócio - ${currentYear}`, 14, 20);
    
    let currentY = 30;
    const chart1 = document.getElementById('monthlyEvolutionChart');
    if (chart1) {
        const img1 = chart1.toDataURL('image/png');
        doc.addImage(img1, 'PNG', 14, currentY + 10, 180, 90);
        currentY += 100;
    }

    const chart2 = document.getElementById('cashFlowChart');
    if (chart2) {
        const img2 = chart2.toDataURL('image/png');
        doc.addImage(img2, 'PNG', 14, currentY, 180, 90);
    }
    doc.save(`Evolucao_Grafica_${currentYear}.pdf`);
}

function generateGlossaryPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(0, 95, 115);
    doc.text("Glossário de Termos Financeiros", 14, 20);
    
    let currentY = 30;
    doc.setFontSize(10);
    doc.setTextColor(0);

    Object.keys(GLOSSARY_DATA).sort().forEach(key => {
        const item = GLOSSARY_DATA[key];
        if (currentY > 270) { doc.addPage(); currentY = 20; }
        
        doc.setFont(undefined, 'bold');
        doc.text(item.nome, 14, currentY);
        currentY += 5;
        
        doc.setFont(undefined, 'normal');
        const text = `Significado: ${item.significado}\nFórmula: ${item.formula}`;
        const splitText = doc.splitTextToSize(text, 180);
        doc.text(splitText, 14, currentY);
        currentY += (splitText.length * 5) + 10;
    });
    doc.save("Glossario_Financeiro.pdf");
}

function generateConsultantDiagnosisPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(0, 95, 115);
    doc.text(`Parecer do Consultor - ${currentYear}`, 14, 20);
    
    let currentY = 30;
    doc.setFontSize(11);
    doc.setTextColor(0);
    const diagnosisText = userSettings.consultantDiagnosis || "Nenhum diagnóstico registrado.";
    const splitDiagnosis = doc.splitTextToSize(diagnosisText, 180); // Adjusted width
    doc.text(splitDiagnosis, 14, currentY);

    doc.save(`Parecer_Consultor_${currentYear}.pdf`);
}

function generateFullReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;

    doc.setFontSize(18);
    doc.setTextColor(0, 95, 115);
    doc.text(`Relatório Financeiro Integrado - ${currentYear}`, 14, currentY);
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Empresa: ${userSettings.corporateName || 'Não informada'}`, 14, currentY + 10);
    doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 14, currentY + 17);
    
    currentY += 30;

    doc.setFontSize(14);
    doc.setTextColor(0, 95, 115);
    doc.text("1. Dados da Empresa e Presença Digital", 14, currentY);
    currentY += 10;

    const companyData = [
        ["Razão Social", userSettings.corporateName || "-"],
        ["CNPJ", userSettings.cnpj || "-"],
        ["Responsável", userSettings.responsibleName || "-"],
        ["E-mail", userSettings.contactEmail || "-"],
        ["Telefone", userSettings.phone || "-"],
        ["Setor", userSettings.sector || "-"],
        ["Regime Tributário", userSettings.taxRegime || "-"],
        ["Utiliza ERP", userSettings.hasErp || "Não"],
        ["Instagram", userSettings.hasInstagram || "Não"],
        ["Facebook", userSettings.hasFacebook || "Não"],
        ["Site", userSettings.hasSite || "Não"],
        ["Loja Virtual", userSettings.hasEcommerce || "Não"],
        ["Tráfego Pago", userSettings.hasAds || "Não"],
        ["Marketplaces", userSettings.marketplaceList || "-"]
    ];

    doc.autoTable({
        startY: currentY,
        head: [['Campo', 'Informação']],
        body: companyData,
        theme: 'striped',
        headStyles: { fillColor: [0, 95, 115] },
        styles: { fontSize: 10 }
    });

    currentY = doc.lastAutoTable.finalY + 15;

    if (userSettings.observations) {
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text("Observações Gerais:", 14, currentY);
        currentY += 7;
        doc.setFontSize(10);
        const splitObs = doc.splitTextToSize(userSettings.observations, pageWidth - 28);
        doc.text(splitObs, 14, currentY);
        currentY += (splitObs.length * 5) + 15;
    }

    if (currentY > 250) { doc.addPage(); currentY = 20; }
    doc.setFontSize(14);
    doc.setTextColor(0, 95, 115);
    doc.text("2. Entradas Mensais Detalhadas", 14, currentY);
    
    const monthlyData = [];
    const yearData = financialData[currentYear] || {};
    
    MONTHS.forEach((month, index) => {
        const data = yearData[index] || {};
        const row = [
            month,
            formatCurrency(data.faturamento),
            data.numeroDeVendas || 0,
            formatCurrency(data.custosVariaveis),
            formatCurrency(data.custosFixos),
            formatCurrency(data.despesasOperacionais),
            formatCurrency(data.outrasReceitasDespesas),
            formatCurrency(data.investimentos),
            formatCurrency(data.financiamentosEntradas),
            formatCurrency(data.amortizacaoDividas),
            formatCurrency(data.impostos)
        ];
        monthlyData.push(row);
    });

    doc.autoTable({
        startY: currentY + 10,
        head: [['Mês', 'Fat.', 'Vendas', 'C.Var.', 'C.Fix.', 'Desp.Op.', 'Outras', 'Invest.', 'Financ.', 'Amort.', 'Imp.']],
        body: monthlyData,
        theme: 'grid',
        headStyles: { fillColor: [10, 147, 150], fontSize: 8 },
        styles: { fontSize: 7, cellPadding: 2 },
        columnStyles: { 0: { fontStyle: 'bold' } }
    });

    doc.addPage();
    currentY = 20;
    doc.setFontSize(14);
    doc.setTextColor(0, 95, 115);
    doc.text("3. Indicadores Financeiros Mensais", 14, currentY);

    const indicatorsData = [];
    MONTHS.forEach((month, index) => {
        const indicators = calculateIndicators(yearData[index]);
        indicatorsData.push([
            month,
            formatCurrency(indicators.lucroLiquido),
            formatPercent(indicators.margemLiquida),
            formatPercent(indicators.markup),
            formatCurrency(indicators.fluxoCaixaOperacional),
            formatCurrency(indicators.fluxoCaixaInvestimentos),
            formatCurrency(indicators.fluxoCaixaFinanciamentos),
            formatCurrency(indicators.fluxoCaixaLivre)
        ]);
    });

    doc.autoTable({
        startY: currentY + 10,
        head: [['Mês', 'Lucro Líq.', 'Margem %', 'Markup %', 'FCO', 'FCI', 'FCF', 'FCL']],
        body: indicatorsData,
        theme: 'grid',
        headStyles: { fillColor: [42, 157, 143] },
        styles: { fontSize: 8 }
    });

    currentY = doc.lastAutoTable.finalY + 20;
    if (currentY > 250) { doc.addPage(); currentY = 20; }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 95, 115);
    doc.text("4. Resumo de Indicadores Anuais", 14, currentY);
    currentY += 10;

    let annualTotals = {}; 
    INPUT_FIELDS.forEach(field => annualTotals[field] = 0);
    let monthsWithDataCount = 0;
    for(let i=0; i<12; i++) { 
        if(yearData[i]) {
            INPUT_FIELDS.forEach(field => annualTotals[field] += yearData[i][field] || 0);
        }
    }
    
    const summaryData = [
        ["Faturamento Total", formatCurrency(annualTotals.faturamento)],
        ["Lucro Líquido Total", formatCurrency(annualTotals.lucroLiquido)], 
        ["Total de Vendas", annualTotals.numeroDeVendas],
        ["Custos Variáveis", formatCurrency(annualTotals.custosVariaveis)],
        ["Custos Fixos", formatCurrency(annualTotals.custosFixos)],
        ["Despesas Operacionais", formatCurrency(annualTotals.despesasOperacionais)]
    ];

    doc.autoTable({
        startY: currentY,
        body: summaryData,
        theme: 'grid',
        styles: { fontSize: 10, fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 80, halign: 'right' } }
    });

    doc.save(`Relatorio_Completo_${currentYear}.pdf`);
}

// === FUNÇÕES AUXILIARES E DE FORMATAÇÃO ===

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}

function formatPercent(value) {
    return (value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
}

function parseCurrency(value) {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
}

// === LÓGICA DE CÁLCULO FINANCEIRO ===

function calculateIndicators(data) {
    if (!data) data = {};
    const fat = data.faturamento || 0;
    const cv = data.custosVariaveis || 0;
    const cf = data.custosFixos || 0;
    const despOp = data.despesasOperacionais || 0;
    const outras = data.outrasReceitasDespesas || 0;
    const impostos = data.impostos || 0;
    const depreciacao = data.depreciacao || 0;
    
    // Cálculos Intermediários
    const lucroBruto = fat - cv;
    const lucroOperacional = lucroBruto - cf - despOp;
    const lucroLiquido = lucroOperacional + outras - impostos;
    
    // Margens e Índices
    const margemLiquida = fat > 0 ? (lucroLiquido / fat) * 100 : 0;
    const markup = cv > 0 ? ((fat - cv) / cv) * 100 : 0;
    const margemContribuicao = fat - cv;
    const indiceMargemContribuicao = fat > 0 ? margemContribuicao / fat : 0;
    
    const pontoEquilibrio = indiceMargemContribuicao > 0 ? (cf + despOp) / indiceMargemContribuicao : 0;
    
    // Fluxos de Caixa
    // FCO: Lucro Líquido + Depreciação (Non-cash expense added back)
    const fco = lucroLiquido + depreciacao; 
    
    // FCI: Investimentos (Capex) - Assumindo que 'investimentos' é saída (-)
    const fci = -(data.investimentos || 0);
    
    // FCF: Entradas de Financ. - Amortização - Distribuição Lucros + Aporte Sócios
    const fcf = (data.financiamentosEntradas || 0) - (data.amortizacaoDividas || 0) + (data.aporteSocios || 0) - (data.distribuicaoLucros || 0);
    
    const fcl = fco + fci + fcf;

    return {
        faturamento: fat,
        custosTotais: cv + cf + despOp + impostos,
        lucroBruto,
        lucroOperacional,
        lucroLiquido,
        margemLiquida,
        markup,
        pontoEquilibrio,
        fluxoCaixaOperacional: fco,
        fluxoCaixaInvestimentos: fci,
        fluxoCaixaFinanciamentos: fcf,
        fluxoCaixaLivre: fcl
    };
}

// === GERENCIAMENTO DE TABELAS E DOM ===

function setupYearSelector() {
    yearSelector.innerHTML = '';
    const startYear = 2023;
    const endYear = new Date().getFullYear() + 2;
    
    for (let y = startYear; y <= endYear; y++) {
        const option = document.createElement('option');
        option.value = y;
        option.textContent = y;
        if (y === currentYear) option.selected = true;
        yearSelector.appendChild(option);
    }
}

function setupDailyMonthSelector() {
    dailyMonthSelector.innerHTML = '';
    MONTHS.forEach((m, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = m;
        if (i === new Date().getMonth()) option.selected = true;
        dailyMonthSelector.appendChild(option);
    });
}

function aggregateDailyData(year) {
    if (!financialData[year]) return;
    
    // Se a edição manual estiver ativada, não sobrescrevemos os dados mensais com a soma dos diários
    if (allowManualEditCheckbox.checked) return;

    for (let i = 0; i < 12; i++) {
        const monthData = financialData[year][i];
        if (monthData && monthData.dailyEntries && monthData.dailyEntries.length > 0) {
            const totals = monthData.dailyEntries.reduce((acc, entry) => {
                acc.faturamento += entry.faturamento || 0;
                acc.despesas += entry.despesas || 0; // Vai para Despesas Operacionais
                acc.comissao += entry.comissao || 0; // Vai para Custos Variáveis
                acc.outras += entry.outras || 0;     // Vai para Outras Rec/Desp
                acc.vendas += entry.vendas || 0;
                return acc;
            }, { faturamento: 0, despesas: 0, comissao: 0, outras: 0, vendas: 0 });

            // Atualiza os campos mensais calculados
            monthData.faturamento = parseFloat(totals.faturamento.toFixed(2));
            monthData.despesasOperacionais = parseFloat(totals.despesas.toFixed(2));
            monthData.custosVariaveis = parseFloat(totals.comissao.toFixed(2));
            monthData.outrasReceitasDespesas = parseFloat(totals.outras.toFixed(2));
            monthData.numeroDeVendas = totals.vendas;
        }
    }
}

function renderDailyEntries(year, monthIndex) {
    const tbody = document.querySelector('#daily-entries-table tbody');
    tbody.innerHTML = '';
    
    const yearData = financialData[year] || {};
    const monthData = yearData[monthIndex] || { dailyEntries: [] };
    const entries = monthData.dailyEntries || [];

    // Ordenar por data
    entries.sort((a, b) => new Date(a.date) - new Date(b.date));

    entries.forEach((entry, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(entry.date + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
            <td>${formatCurrency(entry.faturamento)}</td>
            <td>${formatCurrency(entry.despesas)}</td>
            <td>${formatCurrency(entry.comissao)}</td>
            <td>${formatCurrency(entry.outras)}</td>
            <td>${entry.vendas}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editDailyEntry(${index})">✎</button>
                <button class="action-btn delete-btn" onclick="deleteDailyEntry(${index})">🗑</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateAllCalculations() {
    if (!financialData[currentYear]) financialData[currentYear] = {};
    
    // 1. Agregar dados diários se necessário
    aggregateDailyData(currentYear);

    const tbodyInputs = document.querySelector('#monthly-inputs tbody');
    const tbodyIndicators = document.querySelector('#monthly-indicators-table tbody');
    tbodyInputs.innerHTML = '';
    tbodyIndicators.innerHTML = '';

    const chartLabels = [];
    const chartFat = [];
    const chartCustos = [];
    const chartLucro = [];
    const chartFCL = [];

    MONTHS.forEach((month, index) => {
        const data = financialData[currentYear][index] || {};
        const indicators = calculateIndicators(data);

        // Renderizar Linha de Inputs
        const trInput = document.createElement('tr');
        // Define se os campos são somente leitura baseados na config
        const isReadOnly = !allowManualEditCheckbox.checked;
        const readOnlyAttr = isReadOnly ? 'readonly' : '';
        const readOnlyClass = isReadOnly ? 'readonly-input' : '';

        // Helper para criar input cell
        const createInput = (field, val, readOnly = false) => `
            <td><input type="number" step="0.01" 
                data-month="${index}" 
                data-field="${field}" 
                value="${(val || 0)}" 
                ${readOnly ? 'readonly' : ''}
                onchange="saveMonthlyData()"></td>`;

        trInput.innerHTML = `
            <td style="font-weight:bold;">${month}</td>
            ${createInput('faturamento', data.faturamento, isReadOnly)}
            ${createInput('numeroDeVendas', data.numeroDeVendas, isReadOnly)}
            ${createInput('custosVariaveis', data.custosVariaveis, isReadOnly)}
            ${createInput('custosFixos', data.custosFixos)}
            ${createInput('despesasOperacionais', data.despesasOperacionais, isReadOnly)}
            ${createInput('depreciacao', data.depreciacao)}
            ${createInput('outrasReceitasDespesas', data.outrasReceitasDespesas, isReadOnly)}
            ${createInput('investimentos', data.investimentos)}
            ${createInput('financiamentosEntradas', data.financiamentosEntradas)}
            ${createInput('amortizacaoDividas', data.amortizacaoDividas)}
            ${createInput('aporteSocios', data.aporteSocios)}
            ${createInput('distribuicaoLucros', data.distribuicaoLucros)}
            ${createInput('impostos', data.impostos)}
        `;
        tbodyInputs.appendChild(trInput);

        // Renderizar Linha de Indicadores
        const trInd = document.createElement('tr');
        trInd.innerHTML = `
            <td>${month}</td>
            <td class="${indicators.lucroLiquido >= 0 ? 'positive' : 'negative'}">${formatCurrency(indicators.lucroLiquido)}</td>
            <td>${formatPercent(indicators.margemLiquida)}</td>
            <td>${formatPercent(indicators.markup)}</td>
            <td>${formatCurrency(indicators.fluxoCaixaOperacional)}</td>
            <td>${formatCurrency(indicators.fluxoCaixaInvestimentos)}</td>
            <td>${formatCurrency(indicators.fluxoCaixaFinanciamentos)}</td>
            <td class="${indicators.fluxoCaixaLivre >= 0 ? 'positive' : 'negative'}" style="font-weight:bold;">${formatCurrency(indicators.fluxoCaixaLivre)}</td>
        `;
        tbodyIndicators.appendChild(trInd);

        // Dados para Gráficos
        chartLabels.push(month.substr(0, 3));
        chartFat.push(indicators.faturamento);
        chartCustos.push(indicators.custosTotais);
        chartLucro.push(indicators.lucroLiquido);
        chartFCL.push(indicators.fluxoCaixaLivre);
    });

    updateCharts(chartLabels, chartFat, chartCustos, chartLucro, chartFCL);
    updateAnnualIndicators();
    updateAdvice();

    // Reaplicar listeners para info box nos inputs
    document.querySelectorAll('#monthly-inputs input').forEach(input => {
        input.addEventListener('focus', (e) => showFieldInfo(e.target.dataset.field));
        input.addEventListener('click', (e) => showFieldInfo(e.target.dataset.field));
    });
}

function updateAnnualIndicators() {
    const container = document.getElementById('annual-indicators-content');
    let totals = {};
    INPUT_FIELDS.forEach(f => totals[f] = 0);
    
    let count = 0;
    for(let i=0; i<12; i++) {
        if(financialData[currentYear] && financialData[currentYear][i]) {
            const d = financialData[currentYear][i];
            INPUT_FIELDS.forEach(f => totals[f] += (d[f] || 0));
            if(d.faturamento > 0) count++;
        }
    }
    
    const indicators = calculateIndicators(totals);
    const divisor = count > 0 ? count : 1;

    container.innerHTML = `
        <div class="indicators-grid">
            <div class="card">
                <div class="card-category"><h2>💰 Resultados Operacionais</h2></div>
                <h3>Faturamento Anual</h3><div class="value">${formatCurrency(indicators.faturamento)}</div>
                <h3>Lucro Líquido Anual</h3><div class="value ${indicators.lucroLiquido >= 0 ? 'positive' : 'negative'}">${formatCurrency(indicators.lucroLiquido)}</div>
                <h3>Margem Líquida Média</h3><div class="value">${formatPercent(indicators.margemLiquida)}</div>
            </div>
            <div class="card">
                <div class="card-category"><h2>📉 Custos e Eficiência</h2></div>
                <h3>Custos Variáveis Totais</h3><div class="value">${formatCurrency(totals.custosVariaveis)}</div>
                <h3>Custos Fixos Totais</h3><div class="value">${formatCurrency(totals.custosFixos)}</div>
                <h3>Ponto de Equilíbrio (Médio/Mês)</h3><div class="value">${formatCurrency(indicators.pontoEquilibrio / divisor)}</div>
            </div>
            <div class="card">
                <div class="card-category"><h2>📊 Fluxo de Caixa (Caixa Real)</h2></div>
                <h3>Fluxo de Caixa Operacional</h3><div class="value">${formatCurrency(indicators.fluxoCaixaOperacional)}</div>
                <h3>Fluxo de Caixa Livre (Accum.)</h3><div class="value ${indicators.fluxoCaixaLivre >= 0 ? 'positive' : 'negative'}">${formatCurrency(indicators.fluxoCaixaLivre)}</div>
                <p class="explanation">Dinheiro real que sobrou no bolso após pagar tudo e investir.</p>
            </div>
        </div>
    `;
}

// === EDIÇÃO DIÁRIA ===

dailyEntryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const date = document.getElementById('daily-date').value;
    const faturamento = parseFloat(document.getElementById('daily-faturamento').value);
    const despesas = parseFloat(document.getElementById('daily-despesas').value);
    const comissao = parseFloat(document.getElementById('daily-comissao').value) || 0;
    const outras = parseFloat(document.getElementById('daily-outras').value) || 0;
    const vendas = parseInt(document.getElementById('daily-vendas').value);

    // Validação de Mês
    const entryDate = new Date(date);
    const entryMonth = entryDate.getMonth();
    const entryYear = entryDate.getFullYear();

    if (entryYear !== currentYear) {
        if(confirm(`A data selecionada é do ano ${entryYear}. Deseja mudar o painel para este ano?`)) {
            currentYear = entryYear;
            // Atualiza seletor de ano
            let yearExists = false;
            for(let opt of yearSelector.options) { if(parseInt(opt.value) === currentYear) yearExists = true; }
            if(!yearExists) {
                const opt = document.createElement('option'); opt.value = currentYear; opt.textContent = currentYear;
                yearSelector.appendChild(opt);
            }
            yearSelector.value = currentYear;
            await showApp(); // Recarrega
        } else {
            return;
        }
    }

    if (!financialData[currentYear]) financialData[currentYear] = {};
    if (!financialData[currentYear][entryMonth]) financialData[currentYear][entryMonth] = { dailyEntries: [] };

    const newEntry = { date, faturamento, despesas, comissao, outras, vendas };

    if (currentlyEditingIndex !== null) {
        // Editando existente
        financialData[currentYear][entryMonth].dailyEntries[currentlyEditingIndex] = newEntry;
        currentlyEditingIndex = null;
        cancelEditBtn.style.display = 'none';
        dailyEntryForm.querySelector('button[type="submit"]').textContent = 'Adicionar Lançamento';
        dailyMessageEl.textContent = 'Lançamento atualizado!';
    } else {
        // Novo
        financialData[currentYear][entryMonth].dailyEntries.push(newEntry);
        dailyMessageEl.textContent = 'Lançamento adicionado!';
    }

    // Salvar e atualizar
    await saveDataToFirestore(currentUser.uid, financialData, 'financialData');
    
    // Resetar form
    dailyEntryForm.reset();
    document.getElementById('daily-date').valueAsDate = new Date();
    
    // Atualizar UI
    dailyMonthSelector.value = entryMonth;
    renderDailyEntries(currentYear, entryMonth);
    updateAllCalculations();
    
    setTimeout(() => dailyMessageEl.textContent = '', 3000);
});

window.editDailyEntry = (index) => {
    const month = parseInt(dailyMonthSelector.value);
    const entries = financialData[currentYear][month].dailyEntries;
    // Precisamos achar a entrada correta, pois a renderização pode estar ordenada
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const entryToEdit = sortedEntries[index];
    
    // Agora achar o índice real no array original
    const realIndex = entries.indexOf(entryToEdit);
    
    document.getElementById('daily-date').value = entryToEdit.date;
    document.getElementById('daily-faturamento').value = entryToEdit.faturamento;
    document.getElementById('daily-despesas').value = entryToEdit.despesas;
    document.getElementById('daily-comissao').value = entryToEdit.comissao;
    document.getElementById('daily-outras').value = entryToEdit.outras;
    document.getElementById('daily-vendas').value = entryToEdit.vendas;

    currentlyEditingIndex = realIndex;
    dailyEntryForm.querySelector('button[type="submit"]').textContent = 'Salvar Alteração';
    cancelEditBtn.style.display = 'inline-block';
    window.scrollTo(0, document.getElementById('entradas-diarias').offsetTop);
};

window.deleteDailyEntry = async (index) => {
    if(!confirm("Tem certeza que deseja excluir este lançamento?")) return;
    
    const month = parseInt(dailyMonthSelector.value);
    const entries = financialData[currentYear][month].dailyEntries;
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const entryToDelete = sortedEntries[index];
    const realIndex = entries.indexOf(entryToDelete);

    financialData[currentYear][month].dailyEntries.splice(realIndex, 1);
    
    await saveDataToFirestore(currentUser.uid, financialData, 'financialData');
    renderDailyEntries(currentYear, month);
    updateAllCalculations();
};

cancelEditBtn.addEventListener('click', () => {
    currentlyEditingIndex = null;
    dailyEntryForm.reset();
    dailyEntryForm.querySelector('button[type="submit"]').textContent = 'Adicionar Lançamento';
    cancelEditBtn.style.display = 'none';
});

// === GRÁFICOS E GLOSSÁRIO ===

let chartInstance1 = null;
let chartInstance2 = null;

function updateCharts(labels, fat, custos, lucro, fcl) {
    const ctx1 = document.getElementById('monthlyEvolutionChart').getContext('2d');
    const ctx2 = document.getElementById('cashFlowChart').getContext('2d');

    if (chartInstance1) chartInstance1.destroy();
    if (chartInstance2) chartInstance2.destroy();

    chartInstance1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Faturamento', data: fat, backgroundColor: '#2a9d8f' },
                { label: 'Custos Totais', data: custos, backgroundColor: '#e76f51' },
                { label: 'Lucro Líquido', data: lucro, type: 'line', borderColor: '#264653', borderWidth: 2, fill: false }
            ]
        },
        options: { responsive: true }
    });

    chartInstance2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Fluxo de Caixa Livre',
                data: fcl,
                borderColor: '#e9c46a',
                backgroundColor: 'rgba(233, 196, 106, 0.2)',
                fill: true
            }]
        },
        options: { responsive: true }
    });
}

function renderGlossary() {
    const container = document.getElementById('glossary-container');
    container.innerHTML = '';
    const term = document.getElementById('glossary-search').value.toLowerCase();

    Object.values(GLOSSARY_DATA).forEach(item => {
        if (item.nome.toLowerCase().includes(term)) {
            const div = document.createElement('div');
            div.className = 'glossary-item';
            div.innerHTML = `
                <div class="glossary-header">${item.nome}</div>
                <div class="glossary-content">
                    <div>
                        <p><strong>Fórmula:</strong> ${item.formula}</p>
                        <p><strong>Significado:</strong> ${item.significado}</p>
                        <p><strong>Exemplo:</strong> ${item.exemplo}</p>
                        <p><strong>💡 Dica do Consultor:</strong> ${item.dica}</p>
                    </div>
                </div>
            `;
            div.querySelector('.glossary-header').addEventListener('click', () => {
                div.classList.toggle('active');
            });
            container.appendChild(div);
        }
    });
}

function showFieldInfo(fieldName) {
    if(FIELD_DESCRIPTIONS[fieldName]) {
        monthlyFieldInfoBox.style.display = 'flex';
        monthlyFieldText.innerHTML = `<strong>${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}:</strong> ${FIELD_DESCRIPTIONS[fieldName]}`;
    }
}

function updateAdvice() {
    const container = document.getElementById('advice-container');
    const businessType = userSettings.businessType || 'geral';
    const margins = [];
    
    for(let i=0; i<12; i++) {
        if(financialData[currentYear] && financialData[currentYear][i] && financialData[currentYear][i].faturamento > 0) {
            const ind = calculateIndicators(financialData[currentYear][i]);
            margins.push(ind.margemLiquida);
        }
    }
    
    if (margins.length === 0) {
        container.innerHTML = "<p>Insira dados de faturamento e custos para receber conselhos.</p>";
        return;
    }

    const avgMargin = margins.reduce((a,b)=>a+b, 0) / margins.length;
    const targetMargin = userSettings.benchmarkMargem || 15;
    
    let advice = "";
    if(avgMargin < targetMargin) {
        advice += `<p class="negative">⚠️ Sua margem média (${avgMargin.toFixed(1)}%) está abaixo da meta (${targetMargin}%). Tente reduzir custos variáveis ou revisar a precificação.</p>`;
    } else {
        advice += `<p class="positive">✅ Ótimo trabalho! Sua margem (${avgMargin.toFixed(1)}%) está saudável.</p>`;
    }

    if (businessType === 'restaurante' && avgMargin < 10) {
        advice += "<p>💡 Para restaurantes, fique atento ao CMV (Custo da Mercadoria Vendida). Ele não deve passar de 35%.</p>";
    }
    
    container.innerHTML = advice;
}

// === EVENT LISTENERS GERAIS ===

// Navegação de Abas
document.querySelectorAll('.tab-link').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-link').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Event Listeners de Login/Registro
if(loginForm) loginForm.addEventListener('submit', handleLogin);
if(registerForm) registerForm.addEventListener('submit', handleRegister);
if(resetPasswordForm) resetPasswordForm.addEventListener('submit', handlePasswordReset);
if(logoutBtn) logoutBtn.addEventListener('click', () => auth.signOut());
if(syncBtn) syncBtn.addEventListener('click', handleSync);

// Event Listeners de Configuração
if(saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveBusinessSettings);
if(saveDataBtn) saveDataBtn.addEventListener('click', saveMonthlyData);
if(yearSelector) yearSelector.addEventListener('change', (e) => {
    currentYear = parseInt(e.target.value);
    updateAllCalculations();
    renderDailyEntries(currentYear, parseInt(dailyMonthSelector.value));
});
if(dailyMonthSelector) dailyMonthSelector.addEventListener('change', (e) => {
    renderDailyEntries(currentYear, parseInt(e.target.value));
});
if(recalculateAnnualBtn) recalculateAnnualBtn.addEventListener('click', updateAllCalculations);
if(recalculateAllBtn) recalculateAllBtn.addEventListener('click', updateAllCalculations);
if(deleteAccountBtn) deleteAccountBtn.addEventListener('click', deleteAccountAndData);
if(allowManualEditCheckbox) allowManualEditCheckbox.addEventListener('change', () => {
    updateAllCalculations();
});

// Event Listeners de Exportação PDF
if(btnExportDaily) btnExportDaily.addEventListener('click', () => alert("Funcionalidade de PDF Diário simplificado. Use o Excel para detalhes completos."));
if(btnExportCompany) btnExportCompany.addEventListener('click', generateCompanyPDF);
if(btnExportMonthlyInputs) btnExportMonthlyInputs.addEventListener('click', generateMonthlyInputsPDF);
if(btnExportAnnual) btnExportAnnual.addEventListener('click', generateAnnualIndicatorsPDF);
if(btnExportEvolution) btnExportEvolution.addEventListener('click', generateEvolutionPDF);
if(btnExportGlossary) btnExportGlossary.addEventListener('click', generateGlossaryPDF);
if(btnExportConsultant) btnExportConsultant.addEventListener('click', generateConsultantDiagnosisPDF);
if(btnFullReport) btnFullReport.addEventListener('click', generateFullReport);

// Event Listeners de Exportação/Importação Excel
if(btnExportCompanyXLSX) btnExportCompanyXLSX.addEventListener('click', handleExportCompanyXLSX);
if(btnImportCompanyXLSX) btnImportCompanyXLSX.addEventListener('change', handleImportCompanyXLSX);
if(btnExportDailyXLSX) btnExportDailyXLSX.addEventListener('click', handleExportDailyXLSX);
if(btnImportDailyXLSX) btnImportDailyXLSX.addEventListener('change', handleImportDailyXLSX);
if(btnExportMonthlyXLSX) btnExportMonthlyXLSX.addEventListener('click', handleExportMonthlyXLSX);
if(btnImportMonthlyXLSX) btnImportMonthlyXLSX.addEventListener('change', handleImportMonthlyXLSX);
if(btnExportAnnualXLSX) btnExportAnnualXLSX.addEventListener('click', handleExportAnnualXLSX);
if(btnExportEvolutionXLSX) btnExportEvolutionXLSX.addEventListener('click', handleExportEvolutionXLSX);

// Event Listeners de Diagnóstico
if(diagnosisForm) diagnosisForm.addEventListener('submit', saveDiagnosisData);
if(saveConsultantDiagnosisBtn) saveConsultantDiagnosisBtn.addEventListener('click', saveConsultantDiagnosis);

// Backup
if(btnBackupLocal) btnBackupLocal.addEventListener('click', exportLocalBackup);
if(btnRestoreLocal) btnRestoreLocal.addEventListener('click', () => inputRestoreFile.click());
if(inputRestoreFile) inputRestoreFile.addEventListener('change', importLocalBackup);

// Busca no Glossário
document.getElementById('glossary-search').addEventListener('input', renderGlossary);

// Toggle Forms (Login/Registro)
toggleFormsLinks.forEach(link => {
    link.addEventListener('click', () => toggleForms(link.dataset.form));
});
if(forgotPasswordLink) forgotPasswordLink.addEventListener('click', () => toggleForms('reset'));

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', initialize);