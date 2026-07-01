-- bangbang 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- =====================
-- 1. PROFILES 테이블
-- =====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'tenant' CHECK (role IN ('tenant', 'landlord')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 회원가입 시 자동으로 profiles 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, nickname, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nickname', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- =====================
-- 2. LISTINGS 테이블 (매물)
-- =====================
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('전세', '월세')),
  deposit INTEGER NOT NULL,
  monthly_rent INTEGER DEFAULT 0,
  address TEXT NOT NULL,
  address_detail TEXT,
  area FLOAT NOT NULL,
  exclusive_area FLOAT,
  floor INTEGER,
  total_floor INTEGER,
  rooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  description TEXT,
  status TEXT DEFAULT '거래중' CHECK (status IN ('거래중', '거래완료')),
  has_elevator BOOLEAN DEFAULT FALSE,
  has_parking BOOLEAN DEFAULT FALSE,
  has_balcony BOOLEAN DEFAULT FALSE,
  heating_type TEXT DEFAULT '개별난방',
  move_in_date DATE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- 3. LISTING_IMAGES 테이블
-- =====================
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- 4. BOOKMARKS 테이블 (찜)
-- =====================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- =====================
-- 5. COMMUNITY_POSTS 테이블
-- =====================
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('자유', '정보', 'Q&A', '후기')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- 6. COMMENTS 테이블
-- =====================
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- 7. LIKES 테이블
-- =====================
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- =====================
-- 8. CHAT_ROOMS 테이블
-- =====================
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
  landlord_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id, landlord_id, tenant_id)
);

-- =====================
-- 9. CHAT_MESSAGES 테이블
-- =====================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- RLS (Row Level Security) 정책
-- =====================

-- Profiles: 본인만 수정 가능, 조회는 모두 가능
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: 모두 조회 가능, 본인만 등록/수정/삭제
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
CREATE POLICY "Listings are viewable by everyone" ON listings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert listings" ON listings;
CREATE POLICY "Authenticated users can insert listings" ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings" ON listings FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own listings" ON listings;
CREATE POLICY "Users can delete own listings" ON listings FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks: 본인의 것만
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own bookmarks" ON bookmarks;
CREATE POLICY "Users can manage own bookmarks" ON bookmarks USING (auth.uid() = user_id);

-- Community Posts: 모두 조회, 로그인 사용자 등록/수정/삭제
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON community_posts;
CREATE POLICY "Posts are viewable by everyone" ON community_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert posts" ON community_posts;
CREATE POLICY "Authenticated users can insert posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
CREATE POLICY "Users can update own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
CREATE POLICY "Users can delete own posts" ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- Comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
CREATE POLICY "Authenticated users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Likes
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON likes;
CREATE POLICY "Likes are viewable by everyone" ON likes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own likes" ON likes;
CREATE POLICY "Users can manage own likes" ON likes USING (auth.uid() = user_id);

-- Chat Rooms: 참여자만 접근
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Chat rooms visible to participants" ON chat_rooms;
CREATE POLICY "Chat rooms visible to participants" ON chat_rooms FOR SELECT USING (auth.uid() = landlord_id OR auth.uid() = tenant_id);
DROP POLICY IF EXISTS "Authenticated users can create chat rooms" ON chat_rooms;
CREATE POLICY "Authenticated users can create chat rooms" ON chat_rooms FOR INSERT WITH CHECK (auth.uid() = tenant_id);

-- Chat Messages: 채팅방 참여자만
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Messages visible to room participants" ON chat_messages;
CREATE POLICY "Messages visible to room participants" ON chat_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM chat_rooms
    WHERE id = chat_messages.room_id
    AND (landlord_id = auth.uid() OR tenant_id = auth.uid())
  ));
DROP POLICY IF EXISTS "Participants can send messages" ON chat_messages;
CREATE POLICY "Participants can send messages" ON chat_messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- =====================
-- Storage 버킷 설정 (Supabase Dashboard에서 수동 생성)
-- =====================
-- 버킷 이름: listing-images (공개)
-- 버킷 이름: avatars (공개)
-- 버킷 이름: chat-images (비공개)

-- =====================
-- Realtime 활성화 (채팅용)
-- =====================
-- 이미 등록되어 있거나 다른 사유로 에러가 발생해도 전체 쿼리가 중단되지 않도록 안전 장치 적용
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
    WHEN OTHERS THEN
      NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_rooms;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
    WHEN OTHERS THEN
      NULL;
  END;
END $$;
