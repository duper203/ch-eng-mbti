// Supabase 클라이언트 설정
import { config, isSupabaseConfigured } from './config.js'

// Supabase 사용 가능 여부
const USE_SUPABASE = isSupabaseConfigured()

// Supabase 클라이언트 초기화
let supabase = null
if (USE_SUPABASE) {
    try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
        supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)
    } catch (error) {
        console.error('Failed to initialize Supabase:', error)
    }
}

// Supabase 클라이언트 export (auth.js에서 사용)
export { supabase }

/**
 * 전체 엔지니어 데이터 가져오기 (admin용)
 * - admin/search.js: 검색 & 매칭 (이름, 프로필 필요)
 */
export async function getEngineers() {
  if (!USE_SUPABASE) {
    return []
  }
  
  const { data, error } = await supabase
    .from('ch-eng-mbti')
    .select('*')
    .order('name_eng')
  
  if (error) {
    console.error('Error fetching data:', error)
    return []
  }
  
  // 데이터 변환
  return data.map(engineer => ({
    pk: engineer.Pk,
    name: engineer.name_kor || engineer.name_eng,
    name_eng: engineer.name_eng,
    name_kor: engineer.name_kor,
    team: engineer.team,
    mbti: engineer.mbti,
    welcome_url: engineer.welcome_url
  }))
}

/**
 * 통계용 데이터 가져오기 (공개 페이지용)
 * - index.html: 통계 차트 (team, mbti만 필요)
 * - 이름 등 민감한 정보 제외, 최소한의 데이터만 전송
 */
export async function getStatsData() {
  if (!USE_SUPABASE) {
    return []
  }
  
  const { data, error } = await supabase
    .from('ch-eng-mbti')
    .select('team, mbti')  // 필요한 컬럼만 선택
  
  if (error) {
    console.error('Error fetching stats:', error)
    return []
  }
  
  // NULL 필터링
  return data.filter(row => row.mbti && row.mbti !== 'NULL' && row.mbti.length === 4)
}

