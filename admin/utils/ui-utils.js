// UI 관련 유틸리티 함수들
import { ANIMATION } from '../../shared/constants.js';

/**
 * Toast 알림 표시
 * @param {string} icon - 이모지 아이콘
 * @param {string} message - 메시지
 * @param {number} duration - 표시 시간 (ms)
 */
export function showToast(icon, message, duration = ANIMATION.TOAST_DURATION) {
  const overlay = document.getElementById('toastOverlay');
  const toast = document.getElementById('toastNotification');
  const content = document.getElementById('toastContent');

  if (!overlay || !toast || !content) return;

  content.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
  `;

  overlay.classList.add('show');
  toast.classList.add('show');

  setTimeout(() => {
    overlay.classList.remove('show');
    toast.classList.remove('show');
  }, duration);
}

/**
 * 모달 표시
 * @param {Object} match - 매칭 정보
 */
export function showModal(match) {
  const modalContent = document.getElementById('modalContent');
  const modal = document.getElementById('detailModal');
  
  if (!modalContent || !modal) return;
  
  modalContent.innerHTML = `
    <div class="text-center">
      <div class="avatar flex items-center justify-center text-5xl mx-auto mb-4" style="width: 100px; height: 100px; background: rgba(0, 0, 0, 0.08); border-radius: 50%; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);">
        ${match.emoji}
      </div>
      <h3 style="font-size: 2.2rem; font-weight: 700; color: var(--black); margin-bottom: 1.5rem;">${match.name}</h3>
      
      <div class="mb-4">
        <span style="display: inline-block; padding: 1rem 2rem; background: rgba(255, 255, 255, 0.6); border: 2px solid rgba(0, 0, 0, 0.1); border-radius: 20px; font-size: 1.5rem; font-weight: 800; color: var(--black); letter-spacing: 0.15em; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
          ${match.mbti}
        </span>
      </div>
      
      <div style="display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; background: rgba(0,0,0,0.05); border-radius: 16px; margin-bottom: 2rem;">
        <i class="fas fa-users" style="color: rgba(0,0,0,0.6); font-size: 1.2rem;"></i>
        <span style="color: rgba(0,0,0,0.8); font-weight: 600; font-size: 1.1rem;">${match.team}</span>
      </div>

      ${match.welcome_url ? `
        <div style="margin-top: 2rem;">
          <a href="${match.welcome_url}" target="_blank" style="display: inline-flex; align-items: center; gap: 0.75rem; padding: 1rem 2rem; background: var(--black); color: white; border-radius: 14px; text-decoration: none; font-weight: 600; font-size: 1.05rem; transition: all 0.3s ease; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);">
            <i class="fas fa-book-open"></i>
            <span>View Notion Profile</span>
          </a>
        </div>
      ` : ''}
    </div>
  `;

  modal.classList.remove('hidden');
}

/**
 * 모달 숨기기
 */
export function hideModal() {
  const modal = document.getElementById('detailModal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

/**
 * 페이드 아웃 후 내용 변경하고 페이드 인
 * @param {HTMLElement} element 
 * @param {Function} updateCallback - 내용 변경 콜백
 */
export function fadeTransition(element, updateCallback) {
  if (!element) return;
  
  // 페이드 아웃
  element.style.opacity = '0';
  element.style.transform = 'translateY(-10px)';
  
  // 내용 변경
  setTimeout(() => {
    updateCallback();
    element.classList.remove('hidden');
    
    // 페이드 인
    setTimeout(() => {
      element.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, ANIMATION.FADE_IN_DELAY);
  }, ANIMATION.FADE_DELAY);
}

/**
 * 구글 캘린더 URL 생성
 * @param {Array} matches - 매칭 목록
 * @returns {string}
 */
export function createGroupCalendarUrl(matches) {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  
  // 참석자 이메일 생성
  const attendees = matches
    .map(m => m.name_eng ? `${m.name_eng.toLowerCase()}@channel.io` : null)
    .filter(Boolean)
    .join(',');
  
  // 이벤트 설명
  const description = `MBTI 기반 팀 매칭 커피챗입니다.

참석자:
${matches.map(m => `- ${m.name} (${m.mbti}, ${m.team})`).join('\n')}

서로를 알아가는 시간을 가져봐요! ☕`;

  // 기본 날짜/시간: 내일 오후 3시 ~ 3시 30분
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(15, 0, 0, 0);
  
  const endTime = new Date(tomorrow);
  endTime.setMinutes(30);
  
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };
  
  const dates = `${formatDate(tomorrow)}/${formatDate(endTime)}`;

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'MBTI커피챗 ("시간찾기"로 시간 수정)',
    details: description,
    dates: dates,
  });
  
  if (attendees) {
    params.append('add', attendees);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

