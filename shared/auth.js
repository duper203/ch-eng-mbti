// 추후에 추가 예정
// Google OAuth 인증
import { supabase } from './supabase.js';

/**
 * @channel.io 이메일로 Google 로그인 필수
 */
export async function requireAuth() {
  // 현재 세션 확인
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Auth error:', error);
    return false;
  }
  
  // 이미 로그인되어 있으면
  if (session?.user) {
    const email = session.user.email;
    
    // @channel.io 도메인 체크
    if (email && email.endsWith('@channel.io')) {
      return true;
    } else {
      alert('❌ Only @channel.io emails are allowed');
      await supabase.auth.signOut();
      window.location.href = '/';
      return false;
    }
  }
  
  // 로그인 안 되어 있으면 Google OAuth로 리다이렉트
  const { error: signInError } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.href,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account'
      }
    }
  });
  
  if (signInError) {
    console.error('Sign in error:', signInError);
    alert('❌ Login failed. Please try again.');
    return false;
  }
  
  return false; // 리다이렉트 중이므로 false 반환
}

/**
 * 로그아웃
 */
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = '/';
}

/**
 * 현재 사용자 정보 가져오기
 */
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

