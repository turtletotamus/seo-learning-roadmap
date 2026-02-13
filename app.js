// Supabase Configuration
const SUPABASE_URL = 'https://ufdmwakspvbmlycoynts.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZG13YWtzcHZibWx5Y295bnRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NjIxMTAsImV4cCI6MjA4NjUzODExMH0.zOSrXdgNtszAwRsJyoKK5vZsHAT6woDWa4hktmz6BGo';

// Initialize Supabase Client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Tab Switching
function switchTab(tabName, el) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tabName).classList.add('active');
    if (el) el.classList.add('active');
    
    if (tabName === 'joe') loadJoeChecklist();
    if (tabName === 'status') { loadClients(); loadIncome(); }
    if (tabName === 'learning') loadLearning();
    if (tabName === 'tasks') loadTasks();
}

function toggleCard(header) {
    header.parentElement.classList.toggle('open');
}

// Joe's Checklist
const joeItems = [
    { id: 1, title: '1. 搞清楚市場與痛點', desc: '找到第一批客人的根本痛點是什麼' },
    { id: 2, title: '2. 優化產品', desc: '讓產品交付明確、規格明確，能驅動客戶動機或解決痛點' },
    { id: 3, title: '3. 建立個人品牌', desc: '規劃免費試吃品，建構信任資產與口碑轉介' },
    { id: 4, title: '4. 正確發聲', desc: '讓更多人認識你' },
    { id: 5, title: '5. 五個流程', desc: '個人品牌 → 篩選客戶 → 盤點商品 → 組合提案 → 議約議價' },
    { id: 6, title: '6. 控制客戶組合', desc: '降低營運風險' },
    { id: 7, title: '7. 增加利潤，控制風險', desc: '在提升獲利的同時，確保風險可控' },
    { id: 8, title: '8. 思考規模與擴張', desc: '在營收穩定後，思考如何成長' },
    { id: 9, title: '9. 避免市場侵蝕', desc: '小心不同產品互搶市場' },
    { id: 10, title: '10. 保護毛利', desc: '保護毛利、保護毛利、保護毛利！' }
];

async function loadJoeChecklist() {
    const { data } = await supabaseClient.from('joe_checklist').select('*');
    const statusMap = {};
    if (data) data.forEach(item => statusMap[item.item_id] = item.status);
    
    const html = joeItems.map(item => {
        const status = statusMap['joe-' + item.id] || '';
        const statusClass = status === 'done' ? 'done' : status === 'failed' ? 'failed' : status === 'note' ? 'note' : '';
        const symbol = status === 'done' ? '✓' : status === 'failed' ? '✗' : status === 'note' ? '⚠' : '';
        
        return `
            <div class="joe-item" onclick="toggleJoeStatus(${item.id})">
                <div class="joe-status ${statusClass}">${symbol}</div>
                <div><div style="font-weight:500;margin-bottom:4px">${item.title}</div>
                <div style="font-size:0.85rem;color:var(--gray-600)">${item.desc}</div></div>
            </div>
        `;
    }).join('');
    
    document.getElementById('joe-checklist').innerHTML = html;
    loadJoeConcepts();
}

async function toggleJoeStatus(id) {
    const itemId = 'joe-' + id;
    const { data } = await supabaseClient.from('joe_checklist').select('status').eq('item_id', itemId).single();
    const current = data?.status || '';
    const next = current === '' ? 'done' : current === 'done' ? 'failed' : current === 'failed' ? 'note' : '';
    
    await supabaseClient.from('joe_checklist').upsert({ item_id: itemId, status: next, updated_at: new Date() });
    loadJoeChecklist();
}

// Joe's Core Concepts
const joeConcepts = [
    { title: '1. 高槓桿 vs 高執行', content: '專業服務分為高槓桿（可規模化）和高執行（需持續投入時間）。目標是從高執行走向高槓桿。付費規格品 > 付費進階商品。' },
    { title: '2. 價值 vs 便宜', content: '客戶期待「超值」不等於「便宜」。降低客戶的總成本（時間、風險、溝通）比降低價格更重要。' },
    { title: '3. 保護毛利', content: '保護毛利、保護毛利、保護毛利！付費進階商品看似毛利高，實際考慮時間成本後常常最低。' },
    { title: '4. 市場侵蝕', content: '同樣內容的產品不能有高價又有低價。免費試吃品可以低價，但主軸產品不行。' },
    { title: '5. 客戶組合', content: '永遠不要讓單一客戶占你年營收 25% 以上。理想：4 個客戶各占 25%。' },
    { title: '6. Billable Hour', content: '專業工作者的時間不是全部都能計價。要區分「可計價時數」和「投資時數」。' },
    { title: '7. 信任資產', content: '客戶購買專業服務的最大障礙是「不信任」。累積信任資產是長期經營的核心。' },
    { title: '8. 免費試吃品的四個好', content: '免費試吃品必須「好搜尋、好分類、好傳播、好分享」。' },
    { title: '9. 訂閱制的陷阱', content: '內容訂閱制可能是「一開始辛苦，將來更辛苦」的壞模式。' },
    { title: '10. 五個流程', content: '個人品牌 → 篩選客戶 → 盤點商品 → 組合提案 → 議約議價' }
];

function loadJoeConcepts() {
    const html = joeConcepts.map((concept, i) => `
        <div class="card">
            <div class="card-header" onclick="toggleCard(this)">
                <span style="font-size:0.85rem;font-weight:500">${concept.title}</span>
                <span style="font-family:monospace">→</span>
            </div>
            <div class="card-body">
                <div style="font-size:0.9rem;line-height:1.6;color:var(--gray-700)">${concept.content}</div>
            </div>
        </div>
    `).join('');
    document.getElementById('joe-concepts').innerHTML = '<div style="margin-top:32px"><div class="header"><div class="header-label">Core Concepts</div><h1>核心觀念複習</h1></div>' + html + '</div>';
}

// Clients Management
async function loadClients() {
    const { data } = await supabaseClient.from('clients').select('*').order('created_at', { ascending: false });
    
    if (!data || data.length === 0) {
        document.getElementById('clients').innerHTML = '<div style="text-align:center;padding:40px;color:var(--gray-500)">尚無客戶資料</div>';
        return;
    }
    
    const total = data.reduce((sum, c) => sum + c.monthly_fee, 0);
    const html = `
        ${data.map(c => `
            <div class="client-item">
                <div>
                    <div style="font-weight:500">${c.client_name}</div>
                    <div style="font-size:0.85rem;color:var(--gray-600)">${c.project_name}</div>
                </div>
                <div style="display:flex;align-items:center;gap:12px">
                    <span style="font-family:monospace;font-weight:500">NT$ ${c.monthly_fee.toLocaleString()}</span>
                    <button onclick="deleteClient(${c.id})" style="padding:4px 8px;background:var(--danger);color:white;border:none;cursor:pointer;font-size:0.75rem">刪除</button>
                </div>
            </div>
        `).join('')}
        <div class="total-row">
            <span>總計月費</span>
            <span style="font-family:monospace;font-size:1.1rem">NT$ ${total.toLocaleString()}</span>
        </div>
    `;
    document.getElementById('clients').innerHTML = html;
}

function showAddClient() {
    document.getElementById('clientModal').classList.add('show');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}

async function saveClient() {
    const name = document.getElementById('clientName').value;
    const project = document.getElementById('projectName').value;
    const fee = parseInt(document.getElementById('monthlyFee').value);
    
    if (!name || !project || !fee) {
        alert('請填寫所有欄位');
        return;
    }
    
    await supabaseClient.from('clients').insert({ client_name: name, project_name: project, monthly_fee: fee });
    
    document.getElementById('clientName').value = '';
    document.getElementById('projectName').value = '';
    document.getElementById('monthlyFee').value = '';
    closeModal('clientModal');
    loadClients();
}

async function deleteClient(id) {
    if (!confirm('確定要刪除這個客戶嗎？')) return;
    await supabaseClient.from('clients').delete().eq('id', id);
    loadClients();
}

// Income Management
async function loadIncome() {
    const now = new Date();
    const month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    
    const { data: clients } = await supabaseClient.from('clients').select('monthly_fee');
    const { data: extra } = await supabaseClient.from('extra_income').select('*').eq('income_month', month);
    
    const fixedIncome = clients ? clients.reduce((sum, c) => sum + c.monthly_fee, 0) : 0;
    const extraIncome = extra ? extra.reduce((sum, e) => sum + e.amount, 0) : 0;
    const total = fixedIncome + extraIncome;
    
    const html = `
        <div style="margin-bottom:16px">
            <div style="font-family:monospace;font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;margin-bottom:8px">固定收入（自動計算）</div>
            <div style="font-family:monospace;font-size:1.1rem;font-weight:600">NT$ ${fixedIncome.toLocaleString()}</div>
        </div>
        
        <div style="margin-bottom:16px">
            <div style="font-family:monospace;font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;margin-bottom:8px">額外收入</div>
            ${extra && extra.length > 0 ? extra.map(e => `
                <div class="client-item">
                    <div>
                        <div style="font-weight:500">${e.project_name}</div>
                        <div style="font-size:0.85rem;color:var(--gray-600)">${e.description || ''}</div>
                    </div>
                    <div style="display:flex;align-items:center;gap:12px">
                        <span style="font-family:monospace;font-weight:500">NT$ ${e.amount.toLocaleString()}</span>
                        <button onclick="deleteIncome(${e.id})" style="padding:4px 8px;background:var(--danger);color:white;border:none;cursor:pointer;font-size:0.75rem">刪除</button>
                    </div>
                </div>
            `).join('') : '<div style="text-align:center;padding:20px;color:var(--gray-500);font-size:0.9rem">本月尚無額外收入</div>'}
        </div>
        
        <div class="total-row">
            <span>本月總收入</span>
            <span style="font-family:monospace;font-size:1.1rem">NT$ ${total.toLocaleString()}</span>
        </div>
    `;
    
    document.getElementById('income').innerHTML = html;
}

function showAddIncome() {
    document.getElementById('incomeModal').classList.add('show');
}

async function saveIncome() {
    const project = document.getElementById('incomeProject').value;
    const amount = parseInt(document.getElementById('incomeAmount').value);
    const desc = document.getElementById('incomeDesc').value;
    
    if (!project || !amount) {
        alert('請填寫專案名稱和金額');
        return;
    }
    
    const now = new Date();
    const month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    
    await supabaseClient.from('extra_income').insert({ 
        project_name: project, 
        amount: amount, 
        description: desc,
        income_month: month
    });
    
    document.getElementById('incomeProject').value = '';
    document.getElementById('incomeAmount').value = '';
    document.getElementById('incomeDesc').value = '';
    closeModal('incomeModal');
    loadIncome();
}

async function deleteIncome(id) {
    if (!confirm('確定要刪除這筆收入嗎？')) return;
    await supabaseClient.from('extra_income').delete().eq('id', id);
    loadIncome();
}

// Learning Progress
const learningData = {
    '深度訪談技巧': {
        priority: 'Priority 1',
        why: '這是你「文章包」的核心競爭力。直接影響內容品質跟客戶滿意度。',
        phases: {
            '階段 1：建立基礎概念（1-2 個月）': [
                { key: 'interview-book-1', text: '《價值主張年代》', detail: '系統化圖表工具' },
                { key: 'interview-book-2', text: '《故事行銷》', detail: 'SB7 框架' },
                { key: 'interview-book-3', text: '《先問，為什麼？》', detail: '黃金圈法則' },
                { key: 'interview-course-1', text: 'Coursera: Market Research', detail: 'IE Business School' },
            ],
            '階段 2：實戰練習（1-2 個月）': [
                { key: 'interview-practice-1', text: '用 StoryBrand 框架訪談 1 個客戶' },
                { key: 'interview-practice-2', text: '建立自己的訪談 SOP' },
            ],
            '階段 3：進階技能（選修）': [
                { key: 'interview-advanced-1', text: 'IxDF: User Research Methods' },
            ]
        }
    },
    '技術 SEO 診斷': {
        priority: 'Priority 1',
        why: '這是「方案 A」的核心。如果你不熟，會失去客戶信任。',
        phases: {
            '進修方向': [
                { key: 'tech-seo-1', text: 'WordPress 效能優化' },
                { key: 'tech-seo-2', text: 'Core Web Vitals 實戰' },
                { key: 'tech-seo-3', text: '結構化資料（Schema Markup）' },
            ]
        }
    },
    'UX/CRO 優化': {
        priority: 'Priority 2',
        why: '能讓你的報告更有價值（不只找問題，還能提供改善建議）。',
        phases: {
            '階段 1：建立基礎（1-2 個月）': [
                { key: 'ux-book-1', text: '《絕對別讓使用者思考》' },
                { key: 'ux-book-2', text: '《設計的心理學》' },
                { key: 'ux-course-1', text: 'Google UX Design Certificate' },
            ],
            '階段 2：實戰應用': [
                { key: 'ux-practice-1', text: '建立 UX 檢測 Checklist' },
                { key: 'ux-practice-2', text: '用 Clarity 分析客戶網站' },
            ]
        }
    }
};

async function loadLearning() {
    const { data } = await supabaseClient.from('learning_progress').select('*');
    const progressMap = {};
    if (data) data.forEach(item => progressMap[item.item_key] = item.completed);
    
    const html = Object.entries(learningData).map(([skill, info]) => `
        <div class="card open">
            <div class="card-header" onclick="toggleCard(this)">
                <span style="font-size:0.85rem;text-transform:uppercase">${info.priority}：${skill}</span>
                <span style="font-family:monospace">→</span>
            </div>
            <div class="card-body">
                <div style="margin-bottom:16px;padding:12px;background:var(--gray-100)">
                    <strong>為什麼重要：</strong><br>${info.why}
                </div>
                ${Object.entries(info.phases).map(([phase, items]) => `
                    <div style="margin-top:16px">
                        <div style="font-family:monospace;font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;margin-bottom:10px">${phase}</div>
                        ${items.map(item => {
                            const checked = progressMap[item.key] || false;
                            return `
                                <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--gray-200)">
                                    <div class="learning-checkbox ${checked ? 'checked' : ''}" onclick="toggleLearning('${item.key}')"></div>
                                    <div style="flex:1;font-size:0.9rem">
                                        <strong>${item.text}</strong>
                                        ${item.detail ? `<div style="font-size:0.8rem;color:var(--gray-500);margin-top:2px">${item.detail}</div>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
    
    document.getElementById('learning').innerHTML = html;
}

async function toggleLearning(key) {
    const { data } = await supabaseClient.from('learning_progress').select('completed').eq('item_key', key).single();
    const completed = data ? !data.completed : true;
    
    await supabaseClient.from('learning_progress').upsert({ item_key: key, completed: completed, updated_at: new Date() });
    loadLearning();
}

// Tasks
const tasksData = [
    {
        id: 'task1-done',
        title: '作業 1：實戰驗證技術檢測 SOP',
        desc: '找一個網站實際跑一遍你的「50+ 檢測項目」。',
        steps: [
            '打開方案 A（基礎檢測）的檢測清單',
            '一項一項實際操作，記錄需要的工具和時間',
            '完成後跟 Claude 討論哪些可以自動化'
        ]
    },
    {
        id: 'task2-done',
        title: '作業 2：定義理想客戶 vs. 拒絕客戶',
        desc: '建立客戶篩選機制。',
        steps: [
            '理想客戶是誰？（3-5 點）',
            '要拒絕哪些客戶？（3-5 點）',
            '篩選機制在銷售流程的哪個階段？'
        ]
    },
    {
        id: 'task3-done',
        title: '作業 3：重新思考文章包的定位',
        desc: '釐清「深度協作」是否能外包。',
        steps: [
            '列出內容創作流程每個步驟的時間',
            '標記哪些只有你能做，哪些可外包',
            '計算外包後的時間節省'
        ]
    }
];

async function loadTasks() {
    const { data } = await supabaseClient.from('tasks').select('*');
    const statusMap = {};
    if (data) data.forEach(item => statusMap[item.task_id] = item.completed);
    
    const html = tasksData.map(task => `
        <div class="card open">
            <div class="card-header" onclick="toggleCard(this)">
                <span style="font-size:0.85rem">${task.title}</span>
                <span style="font-family:monospace">→</span>
            </div>
            <div class="card-body">
                <div style="font-size:0.9rem;color:var(--gray-600);margin-bottom:12px">${task.desc}</div>
                <div style="font-size:0.85rem;color:var(--gray-600)">
                    ${task.steps.map((step, i) => `<div style="margin-bottom:4px">${i + 1}. ${step}</div>`).join('')}
                </div>
                <label style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid var(--gray-300);background:var(--gray-100);margin-top:12px;cursor:pointer">
                    <input type="checkbox" ${statusMap[task.id] ? 'checked' : ''} onchange="toggleTask('${task.id}', this.checked)">
                    <span style="font-size:0.85rem">已完成</span>
                </label>
            </div>
        </div>
    `).join('');
    
    document.getElementById('tasks').innerHTML = html;
}

async function toggleTask(taskId, completed) {
    await supabaseClient.from('tasks').upsert({ task_id: taskId, completed: completed, updated_at: new Date() });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadJoeChecklist();
    loadClients();
    loadIncome();
    loadLearning();
    loadTasks();
});
