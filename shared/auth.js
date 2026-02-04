// Google OAuth 인증 (현재 비활성화)
// Supabase RLS 정책과 함께 사용 시 활성화
import { supabase } from './supabase.js';

/**
 * @channel.io 이메일로 Google 로그인 필수
 */
export async function requireAuth() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Auth error:', error);
    return false;
  }
  
  if (session?.user) {
    const email = session.user.email;
    
    if (email && email.endsWith('@channel.io')) {
      return true;
    } else {
      alert('❌ Only @channel.io emails are allowed');
      await supabase.auth.signOut();
      window.location.href = '/';
      return false;
    }
  }
  
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
  
  return false;
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
