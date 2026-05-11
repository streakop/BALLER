-- Migration for Baller Platform Expansion

-- 1. Clubs Table
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
-- Anyone can view clubs
CREATE POLICY "Clubs are viewable by everyone" ON clubs FOR SELECT USING (true);

-- 2. Discussions Table
CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tags TEXT[]
);

ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
-- Anyone can view discussions
CREATE POLICY "Discussions are viewable by everyone" ON discussions FOR SELECT USING (true);
-- Only authenticated users can create discussions
CREATE POLICY "Authenticated users can insert discussions" ON discussions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Users can update/delete their own discussions
CREATE POLICY "Users can update own discussions" ON discussions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own discussions" ON discussions FOR DELETE USING (auth.uid() = user_id);

-- 3. Discussion Replies Table
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Replies are viewable by everyone" ON discussion_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert replies" ON discussion_replies FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own replies" ON discussion_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON discussion_replies FOR DELETE USING (auth.uid() = user_id);


-- 4. Opportunities Table
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., Internship, Full-time, Hackathon
    description TEXT,
    link TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    posted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Opportunities are viewable by everyone" ON opportunities FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert opportunities" ON opportunities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own opportunities" ON opportunities FOR UPDATE USING (auth.uid() = posted_by);
CREATE POLICY "Users can delete own opportunities" ON opportunities FOR DELETE USING (auth.uid() = posted_by);
