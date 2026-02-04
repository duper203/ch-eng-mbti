import { config, isSupabaseConfigured } from './config.js';

const USE_SUPABASE = isSupabaseConfigured();

let supabase = null;
if (USE_SUPABASE) {
    try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
    }
}

export { supabase };

/**
 * 전체 엔지니어 데이터 가져오기 (admin용)
 */
export async function getEngineers() {
  if (!USE_SUPABASE) return [];
  
  const { data, error } = await supabase
    .from('ch-eng-mbti')
    .select('*')
    .order('name_eng');
  
  if (error) {
    console.error('Error fetching data:', error);
    return [];
  }
  
  return data.map(engineer => ({
    pk: engineer.Pk,
    name: engineer.name_kor || engineer.name_eng,
    name_eng: engineer.name_eng,
    name_kor: engineer.name_kor,
    team: engineer.team,
    mbti: engineer.mbti,
    welcome_url: engineer.welcome_url
  }));
}

/**
 * 통계용 데이터 가져오기 (공개 페이지용)
 */
export async function getStatsData() {
  if (!USE_SUPABASE) return [];
  
  const { data, error } = await supabase
    .from('ch-eng-mbti')
    .select('team, mbti, name_kor, name_eng');
  
  if (error) {
    console.error('Error fetching stats:', error);
    return [];
  }
  
  return data
    .filter(row => row.mbti && row.mbti !== 'NULL' && row.mbti.length === 4)
    .map(row => ({
      team: row.team,
      mbti: row.mbti,
      name: row.name_kor || row.name_eng || '이름 없음'
    }));
}
