// UI 렌더링 모듈
import { showModal, createGroupCalendarUrl } from '../utils/ui-utils.js';

export class UIModule {
  constructor() {
    this.currentMatches = null;
  }

  /**
   * 매칭 결과 표시
   * @param {Object} matches - {bestie, balancer, wild}
   */
  displayMatches(matches) {
    const matchingSection = document.getElementById('matchingSection');
    const matchCards = document.getElementById('matchCards');
    
    if (!matchingSection || !matchCards) return;
    
    this.currentMatches = matches;
    
    const items = [
      matches.bestie,
      matches.balancer,
      matches.wild
    ].filter(Boolean);

    if (items.length === 0) {
      matchCards.innerHTML = `
        <div class="col-span-full text-center text-black/60">
          추천할 수 있는 동료가 없습니다.
        </div>
      `;
      matchingSection.classList.remove('hidden');
      return;
    }

    const cardColors = ['teal', 'blue', 'purple'];
    const html = items.map((item, index) => `
      <div class="match-card-simple ${cardColors[index]}" data-name="${item.name}" style="animation: fadeInUp 0.6s ease forwards; animation-delay: ${index * 0.1}s; opacity: 0;">
        <div class="match-card-emoji">
          ${item.emoji}
        </div>
        <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--black); margin-bottom: 1.5rem;">${item.title}</h3>
        <h4 class="match-card-nickname">${item.name}</h4>
        <p class="match-card-hint">👆 Click to see details</p>
      </div>
    `).join('');

    matchCards.innerHTML = html;
    matchingSection.classList.remove('hidden');

    // 커피챗 버튼 리스너
    this.attachCoffeeChatListener(items);

    // 카드 클릭 리스너
    this.attachCardClickListeners(items);
  }

  /**
   * 커피챗 버튼 리스너 추가
   */
  attachCoffeeChatListener(items) {
    const coffeeChatBtn = document.querySelector('.coffee-btn');
    if (coffeeChatBtn && !coffeeChatBtn.hasAttribute('data-listener-added')) {
      coffeeChatBtn.setAttribute('data-listener-added', 'true');
      coffeeChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const calendarUrl = createGroupCalendarUrl(items);
        window.open(calendarUrl, '_blank');
      });
    }
  }

  /**
   * 카드 클릭 리스너 추가
   */
  attachCardClickListeners(items) {
    document.querySelectorAll('.match-card-simple').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.getAttribute('data-name');
        const match = items.find(m => m.name === name);
        if (match) {
          showModal(match);
        }
      });
    });
  }

  /**
   * 매칭 섹션 숨기기
   */
  hideMatchingSection() {
    const matchingSection = document.getElementById('matchingSection');
    const matchCards = document.getElementById('matchCards');
    if (matchingSection) {
      matchingSection.classList.add('hidden');
    }
    if (matchCards) {
      matchCards.innerHTML = '';
    }
    this.currentMatches = null;
  }

  /**
   * 추가 요청 폼 표시
   * @param {string} name 
   * @param {string} team 
   */
  showRequestForm(name = '', team = '') {
    const formSection = document.getElementById('addMeForm');
    if (!formSection) return;
    
    formSection.classList.remove('hidden');
    formSection.scrollIntoView({ behavior: 'smooth' });
    
    // 값 미리 채우기
    const nameInput = document.getElementById('addName');
    const teamSelect = document.getElementById('addTeam');
    
    if (nameInput) nameInput.value = name;
    if (teamSelect && team) teamSelect.value = team;
  }

  /**
   * 추가 요청 폼 숨기기
   */
  hideRequestForm() {
    const formSection = document.getElementById('addMeForm');
    if (!formSection) return;
    
    formSection.classList.add('hidden');
    
    // 폼 초기화
    const nameInput = document.getElementById('addName');
    const teamSelect = document.getElementById('addTeam');
    const mbtiSelect = document.getElementById('addMbti');
    
    if (nameInput) nameInput.value = '';
    if (teamSelect) teamSelect.value = '';
    if (mbtiSelect) mbtiSelect.value = '';
  }

  /**
   * 전체 UI 초기화
   */
  resetUI() {
    const searchInput = document.getElementById('searchNameInput');
    const resultDiv = document.getElementById('myInfoResult');
    
    if (searchInput) searchInput.value = '';
    if (resultDiv) resultDiv.classList.add('hidden');
    
    this.hideRequestForm();
    this.hideMatchingSection();
  }
}

