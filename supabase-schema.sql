-- ============================================
-- Channel MBTI Analytics - Supabase Schema
-- ============================================
-- 실제 DB 테이블 구조에 맞게 업데이트됨
-- 이미 데이터가 있다면 이 스크립트는 실행하지 않아도 됩니다.
-- ============================================

-- 1. engineers 테이블 생성
CREATE TABLE IF NOT EXISTS engineers (
  pk SERIAL PRIMARY KEY,
  name_eng TEXT NOT NULL,
  name_kor TEXT,
  team TEXT NOT NULL,
  mbti TEXT,
  welcome_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_engineers_name_eng ON engineers(name_eng);
CREATE INDEX IF NOT EXISTS idx_engineers_name_kor ON engineers(name_kor);
CREATE INDEX IF NOT EXISTS idx_engineers_team ON engineers(team);
CREATE INDEX IF NOT EXISTS idx_engineers_mbti ON engineers(mbti);

-- 2. 외부 공개용 집계 뷰 생성
CREATE OR REPLACE VIEW public_mbti_stats AS
SELECT 
  team,
  mbti,
  COUNT(*)::INTEGER as count
FROM engineers
WHERE mbti IS NOT NULL AND mbti != 'NULL'
GROUP BY team, mbti
ORDER BY team, mbti;

-- 3. RLS (Row Level Security) 활성화
ALTER TABLE engineers ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 설정

-- anon 사용자: 집계 뷰만 읽기 가능 (engineers 테이블 직접 접근 불가)
DROP POLICY IF EXISTS "Allow anon to read engineers" ON engineers;
CREATE POLICY "Deny anon direct access to engineers"
  ON engineers
  FOR SELECT
  TO anon
  USING (false);

-- authenticated 사용자: 전체 데이터 읽기 가능 (내부 사용자)
DROP POLICY IF EXISTS "Allow authenticated users to read engineers" ON engineers;
CREATE POLICY "Allow authenticated users to read engineers"
  ON engineers
  FOR SELECT
  TO authenticated
  USING (true);

-- anon 사용자: 데이터 추가 가능 (프로필 추가 기능용)
DROP POLICY IF EXISTS "Allow anon to insert engineers" ON engineers;
CREATE POLICY "Allow anon to insert engineers"
  ON engineers
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. 집계 뷰 권한 설정
GRANT SELECT ON public_mbti_stats TO anon, authenticated;

-- 6. 자동 updated_at 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_engineers_updated_at ON engineers;
CREATE TRIGGER update_engineers_updated_at 
  BEFORE UPDATE ON engineers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 완료!
-- ============================================
-- 
-- 이제 Supabase Table Editor에서 직접 데이터를 추가하거나
-- 내부 페이지의 "Find Profile" 기능을 사용하세요.
--
