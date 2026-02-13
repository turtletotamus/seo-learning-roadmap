-- SEO Learning Roadmap - Supabase Database Schema
-- 執行步驟：
-- 1. 登入 Supabase Dashboard
-- 2. 進入 SQL Editor
-- 3. 複製貼上這整個檔案
-- 4. 點擊 Run

-- 1. Joe's Checklist Status
CREATE TABLE IF NOT EXISTS joe_checklist (
    id SERIAL PRIMARY KEY,
    item_id VARCHAR(20) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT '',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Learning Progress
CREATE TABLE IF NOT EXISTS learning_progress (
    id SERIAL PRIMARY KEY,
    item_key VARCHAR(100) UNIQUE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Clients
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(200) NOT NULL,
    project_name VARCHAR(200) NOT NULL,
    monthly_fee INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Extra Income
CREATE TABLE IF NOT EXISTS extra_income (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(200) NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT,
    income_month VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(20) UNIQUE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default Joe's checklist items
INSERT INTO joe_checklist (item_id, status)
VALUES 
    ('joe-1', ''),
    ('joe-2', ''),
    ('joe-3', ''),
    ('joe-4', ''),
    ('joe-5', ''),
    ('joe-6', ''),
    ('joe-7', ''),
    ('joe-8', ''),
    ('joe-9', ''),
    ('joe-10', '')
ON CONFLICT (item_id) DO NOTHING;

-- Insert default task items
INSERT INTO tasks (task_id, completed)
VALUES 
    ('task1-done', FALSE),
    ('task2-done', FALSE),
    ('task3-done', FALSE)
ON CONFLICT (task_id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE joe_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE extra_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable all for joe_checklist" ON joe_checklist;
DROP POLICY IF EXISTS "Enable all for learning_progress" ON learning_progress;
DROP POLICY IF EXISTS "Enable all for clients" ON clients;
DROP POLICY IF EXISTS "Enable all for extra_income" ON extra_income;
DROP POLICY IF EXISTS "Enable all for tasks" ON tasks;

-- Create policies (allow all operations)
CREATE POLICY "Enable all for joe_checklist" ON joe_checklist FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for learning_progress" ON learning_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for extra_income" ON extra_income FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
