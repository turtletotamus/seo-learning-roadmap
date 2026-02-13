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

// Joe's Core Concepts（延伸版，用來複習）
const joeConcepts = [
    {
        title: '1. 搞清楚市場與痛點',
        related: '對應 02–06 集：市場認知與六種動機',
        points: [
            '專業服務的本質不是「賣技能」，而是幫客戶解決具體的痛點或達成明確的效益。',
            '先分清楚：客戶是為了賺錢、省錢、解痛、圖爽、交差、避麻煩、還是迴避衝突而來。',
            '沒有動機的人很難被說服，要把時間放在「本來就有痛、有事要解決的人」身上。'
        ]
    },
    {
        title: '2. 優化產品（商品設計）',
        related: '對應 13–22 集：產品設計與免費試吃品',
        points: [
            '客戶買的不是你的技術，而是一個「看得懂、交付清楚」的解決方案。',
            '用免費試吃品、付費規格品、高價客製的階梯，讓不同動機與預算的客戶都有合適入口。',
            '商品設計要避免模糊：規格、交付物、時間、價格、驗收方式都要寫清楚。'
        ]
    },
    {
        title: '3. 建立個人品牌與正確發聲',
        related: '對應 07–12、23–29 集：信任資產與個人品牌',
        points: [
            '個人品牌就是在客戶動機與時機具備時，他腦中第一個想到的人是你。',
            '一開始先專注在一個清楚的形象與主題，不要一開始就當「什麼都寫」的雜牌軍。',
            '文章、專欄、講座、案例分享，都是在慢慢累積信任資產，而不是立刻成交。'
        ]
    },
    {
        title: '4. 五個流程與客戶旅程',
        related: '貫穿全課：個人品牌 → 篩選客戶 → 盤點商品 → 組合提案 → 議約議價',
        points: [
            '不要只看單一成交，而是把客戶從「認識你」到「成交」拆成五個流程來設計。',
            '每一個流程都有對應要做的事：例如在「篩選客戶」階段先拒絕不合適的人。',
            '當流程清楚，你就不會每個案子都從零開始瞎忙，而是照 SOP 走。'
        ]
    },
    {
        title: '5. 控制客戶組合',
        related: '對應 34–36 集：客戶篩選與客戶組合',
        points: [
            '單一客戶年營收佔比不要超過 25%，理想狀態是 4 個客戶各佔 25%。',
            '主動設計「我不要的客戶」清單（預算、態度、風格），拒絕錯的客戶就是保護未來。',
            '用數字看風險：最大客戶佔比、前兩大佔比，當紅字亮起來就該調整。'
        ]
    },
    {
        title: '6. 增加利潤、控制風險',
        related: '對應 19–22、47 集：定價與槓桿',
        points: [
            '真正的毛利不是看「收多少錢」，而是扣掉你投入的所有時間成本之後還剩多少。',
            '盡量把服務往「高槓桿」移動：可重複、可教人做、可以標準化，就有機會放大。',
            '風險不只來自客戶流失，也來自你自己被時間綁死、無法休息與成長。'
        ]
    },
    {
        title: '7. 信任資產與價值感',
        related: '對應 07–09、31–33 集：信任資產與定價',
        points: [
            '大部分客戶無法分辨專業優劣，只能從頭銜、經歷、口碑與價格推估你的實力。',
            '信任資產就是：別人肯掛你名字、願意公開推薦你、願意付你高價還會回頭。',
            '產品定價會反過來塑造你的定位：永遠只有低價商品，就很難被當成專家。'
        ]
    },
    {
        title: '8. 免費試吃品的設計',
        related: '對應 15–18 集：免費試吃品與內容策略',
        points: [
            '好的免費試吃品要「好搜尋、好分類、好傳播、好分享」，而不是亂發折價券。',
            '免費內容要幫你過濾客戶：看完覺得「這就是我」的人留下來，其他人自然離開。',
            '免費試吃品的目的，是累積信任資產與名單，不是立刻賺錢。'
        ]
    },
    {
        title: '9. 避免市場侵蝕',
        related: '對應 48 集：「市場侵蝕」概念',
        points: [
            '同一組核心內容，不要同時賣高價又賣低價，會讓市場搞不清楚你的定位。',
            '免費試吃品可以便宜，但主力商品要維持價格與價值感，避免自己打自己。',
            '設計產品階梯時，要清楚區分：哪一階段在賣什麼深度，而不是只改價格。'
        ]
    },
    {
        title: '10. 重劍無鋒，大巧不工',
        related: '對應 49 集：重劍無鋒，大巧不工',
        points: [
            '長期穩定的事業，大多來自對的結構與習慣，而不是一兩次的爆衝與奇招。',
            '每天多做一點對的事：寫一篇好文章、優化一個流程、整理一個案例，時間會放大成果。',
            '當你有流程、有產品階梯、有正確客戶組合，營收自然會反映你的累積。'
        ]
    }
];

function loadJoeConcepts() {
    const html = joeConcepts.map(concept => `
        <div style="margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--gray-200);">
            <div style="font-size:0.9rem;font-weight:600;margin-bottom:4px;">${concept.title}</div>
            <div style="font-size:0.75rem;color:var(--gray-500);font-family:'JetBrains Mono',monospace;margin-bottom:8px;">${concept.related}</div>
            <ul style="list-style:none;padding-left:0;font-size:0.9rem;color:var(--gray-700);line-height:1.7;">
                ${concept.points.map(p => `<li style="position:relative;padding-left:14px;margin-bottom:6px;"><span style="position:absolute;left:0;color:var(--gray-400);">·</span>${p}</li>`).join('')}
            </ul>
        </div>
    `).join('');
    document.getElementById('joe-concepts').innerHTML =
        '<div style="margin-top:28px">' +
        '<div class="header"><div class="header-label">Core Concepts</div><h1>核心觀念複習</h1></div>' +
        html +
        '</div>';
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
                { key: 'interview-book-1', text: '《價值主張年代》', type: '書籍 / Book', english: 'Value Proposition Design', detail: '系統化圖表工具，練習把客戶痛點與方案具體化' },
                { key: 'interview-book-2', text: '《故事行銷》', type: '書籍 / Book', english: 'Building a StoryBrand', detail: 'SB7 框架，學會用故事結構說明客戶旅程' },
                { key: 'interview-book-3', text: '《先問，為什麼？》', type: '書籍 / Book', english: 'Start With Why', detail: '黃金圈法則，練習從 Why 開始設計訪談問題' },
                { key: 'interview-course-1', text: 'Coursera：Market Research and Consumer Behavior', type: '線上課程 / Course', english: 'Market Research and Consumer Behavior (IE Business School)', detail: '打底市場調查與質性研究的結構' },
            ],
            '階段 2：實戰練習（1-2 個月）': [
                { key: 'interview-practice-1', text: '用 StoryBrand 框架訪談 1 個客戶' },
                { key: 'interview-practice-2', text: '建立自己的訪談 SOP' },
            ],
            '階段 3：進階技能（選修）': [
                { key: 'interview-advanced-1', text: 'IxDF：User Research Methods', type: '線上課程 / Course', english: 'Interaction Design Foundation – User Research Methods', detail: '進一步把訪談放到 UX 方法論的脈絡裡' },
            ]
        }
    },
    '技術 SEO 診斷': {
        priority: 'Priority 1',
        why: '這是「方案 A」的核心。如果你不熟，會失去客戶信任。',
        phases: {
            '進修方向': [
                { key: 'tech-seo-1', text: 'WordPress 效能優化', type: '主題 / Topic', english: 'WordPress Performance Optimization', detail: '實作快取、圖片壓縮、外掛精簡、主機與 CDN 調整' },
                { key: 'tech-seo-2', text: 'Core Web Vitals 實戰', type: '主題 / Topic', english: 'Core Web Vitals in Practice', detail: 'LCP / CLS / INP 指標與實際優化手法' },
                { key: 'tech-seo-3', text: '結構化資料（Schema Markup）', type: '主題 / Topic', english: 'Schema Markup', detail: 'FAQ、Breadcrumb、Product 等實際標記與測試' },
            ]
        }
    },
    'UX/CRO 優化': {
        priority: 'Priority 2',
        why: '能讓你的報告更有價值（不只找問題，還能提供改善建議）。',
        phases: {
            '階段 1：建立基礎（1-2 個月）': [
                { key: 'ux-book-1', text: '《絕對別讓使用者思考》', type: '書籍 / Book', english: "Don't Make Me Think", detail: '學會基本易用性原則與實務範例' },
                { key: 'ux-book-2', text: '《設計的心理學》', type: '書籍 / Book', english: 'The Design of Everyday Things', detail: '從日常物品理解人因與介面設計' },
                { key: 'ux-course-1', text: 'Google UX Design Certificate', type: '線上課程 / Course', english: 'Google UX Design Professional Certificate', detail: '系統性走過 UX 流程與產出物' },
            ],
            '階段 2：實戰應用': [
                { key: 'ux-practice-1', text: '建立 UX 檢測 Checklist', type: '實作 / Practice', english: 'UX Heuristic Checklist', detail: '把常見 UX 原則整理成你自己的檢查表' },
                { key: 'ux-practice-2', text: '用 Clarity 分析客戶網站', type: '實作 / Practice', english: 'Microsoft Clarity Session Analysis', detail: '從實際錄影與熱圖找出轉化問題' },
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
                <span style="font-size:0.9rem;font-weight:500;">${skill}</span>
                <span style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:var(--gray-500);">${info.priority}</span>
            </div>
            <div class="card-body">
                <div style="margin-bottom:16px;padding:12px;background:var(--gray-100);border:1px solid var(--gray-200);">
                    <strong>為什麼重要：</strong><br>${info.why}
                </div>
                ${Object.entries(info.phases).map(([phase, items]) => `
                    <div style="margin-top:16px">
                        <div style="font-family:'JetBrains Mono',monospace;font-size:0.7rem;color:var(--gray-500);text-transform:uppercase;margin-bottom:8px;letter-spacing:0.06em;">${phase}</div>
                        ${items.map(item => {
                            const checked = progressMap[item.key] || false;
                            return `
                                <div style="display:flex;gap:10px;padding:10px 0;border-bottom:1px solid var(--gray-200);">
                                    <div class="learning-checkbox ${checked ? 'checked' : ''}" onclick="toggleLearning('${item.key}')"></div>
                                    <div style="flex:1;font-size:0.9rem;">
                                        <strong>${item.text}</strong>
                                        ${item.english ? `<div style="font-size:0.8rem;color:var(--gray-500);margin-top:2px">${item.english}</div>` : ''}
                                        ${item.type ? `<div style="font-size:0.75rem;color:var(--gray-500);margin-top:2px">${item.type}</div>` : ''}
                                        ${item.detail ? `<div style="font-size:0.8rem;color:var(--gray-600);margin-top:4px">${item.detail}</div>` : ''}
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

// Tasks：改成母任務 + 子任務，語氣簡化
const tasksData = [
    {
        id: 'foundation',
        title: '事業基礎打底',
        desc: '先把目前的服務與結構站穩，再談放大。',
        subtasks: [
            { id: 't-found-1', label: '在「現狀」頁填好目前所有長期客戶與月費' },
            { id: 't-found-2', label: '在「現狀」頁填入本月額外收入與作業內容' },
            { id: 't-found-3', label: '檢查最大客戶佔比與前兩大佔比，寫下一句觀察' }
        ]
    },
    {
        id: 'client-fit',
        title: '客戶篩選與定位',
        desc: '弄清楚你要服務誰，也要清楚說 NO 給誰。',
        subtasks: [
            { id: 't-fit-1', label: '寫出 3–5 點「理想客戶長什麼樣子」' },
            { id: 't-fit-2', label: '寫出 3–5 點「要拒絕的客戶特徵」' },
            { id: 't-fit-3', label: '在筆記裡寫一份簡短的「禮貌拒絕話術」' }
        ]
    },
    {
        id: 'ops',
        title: '每天可以做的小事',
        desc: '用很小很小的動作，推動事業往前一點點。',
        subtasks: [
            { id: 't-ops-1', label: '今天花 30 分鐘整理一個案例或學習重點，寫在自己的筆記裡' },
            { id: 't-ops-2', label: '本週至少寫完一段 Landing Page 或文章的其中一小節' },
            { id: 't-ops-3', label: '每週檢查一次「行動清單」，勾掉完成的、刪掉不重要的' }
        ]
    }
];

async function loadTasks() {
    const { data } = await supabaseClient.from('tasks').select('*');
    const statusMap = {};
    if (data) data.forEach(item => statusMap[item.task_id] = item.completed);

    const customRaw = localStorage.getItem('custom_actions_v1');
    const customTasks = customRaw ? JSON.parse(customRaw) : [];
    const allTasks = [...tasksData, ...customTasks];
    
    const html = allTasks.map(task => {
        if (task.custom) {
            return `
                <div class="card open">
                    <div class="card-header" onclick="toggleCard(this)">
                        <span style="font-size:0.85rem">${task.title}</span>
                        <span style="font-family:monospace">→</span>
                    </div>
                    <div class="card-body">
                        <div style="font-size:0.9rem;color:var(--gray-600);margin-bottom:8px">${task.desc || ''}</div>
                        <ul style="list-style:none;padding-left:0;font-size:0.85rem;color:var(--gray-700);">
                            ${task.steps.map((s, i) => {
                                const id = `${task.id}-sub-${i}`;
                                const checked = !!statusMap[id];
                                return `
                                    <li style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                                        <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleTask('${id}', this.checked)">
                                        <span>${s}</span>
                                    </li>
                                `;
                            }).join('')}
                        </ul>
                        <button style="margin-top:8px;padding:6px 10px;font-size:0.75rem;border:1px solid var(--gray-300);background:white;cursor:pointer" onclick="deleteAction('${task.id}')">刪除這個行動</button>
                    </div>
                </div>
            `;
        }

        // 預設母任務
        return `
            <div class="card open">
                <div class="card-header" onclick="toggleCard(this)">
                    <span style="font-size:0.9rem;font-weight:500;">${task.title}</span>
                </div>
                <div class="card-body">
                    <div style="font-size:0.9rem;color:var(--gray-600);margin-bottom:10px">${task.desc}</div>
                    <ul style="list-style:none;padding-left:0;font-size:0.85rem;color:var(--gray-700);">
                        ${task.subtasks.map(sub => {
                            const checked = !!statusMap[sub.id];
                            return `
                                <li style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                                    <input type="checkbox" ${checked ? 'checked' : ''} onchange="toggleTask('${sub.id}', this.checked)">
                                    <span>${sub.label}</span>
                                </li>
                            `;
                        }).join('')}
                    </ul>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('tasks').innerHTML = html;
}

async function toggleTask(taskId, completed) {
    await supabaseClient.from('tasks').upsert({ task_id: taskId, completed: completed, updated_at: new Date() });
}

function showAddAction() {
    const title = prompt('輸入行動項目標題');
    if (!title) return;
    const desc = prompt('簡單描述這個行動');
    const stepsRaw = prompt('若要分步驟，請用換行分隔（可留空）') || '';
    const steps = stepsRaw ? stepsRaw.split('\n').filter(s => s.trim()) : ['明確下一步，安排到行事曆'];
    
    const customRaw = localStorage.getItem('custom_actions_v1');
    const customTasks = customRaw ? JSON.parse(customRaw) : [];
    const id = 'custom-' + Date.now();
    customTasks.push({ id, title, desc: desc || '', steps, custom: true });
    localStorage.setItem('custom_actions_v1', JSON.stringify(customTasks));
    loadTasks();
}

function deleteAction(id) {
    const customRaw = localStorage.getItem('custom_actions_v1');
    const customTasks = customRaw ? JSON.parse(customRaw) : [];
    const next = customTasks.filter(t => t.id !== id);
    localStorage.setItem('custom_actions_v1', JSON.stringify(next));
    loadTasks();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadJoeChecklist();
    loadClients();
    loadIncome();
    loadLearning();
    loadTasks();
});
