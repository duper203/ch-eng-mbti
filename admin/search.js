// Search & Matching Page - Refactored
import { getEngineers } from '../shared/supabase.js';
import { MBTIMatcher } from './modules/matcher.js';
import { SearchModule } from './modules/search.js';
import { UIModule } from './modules/ui.js';
import { showToast, hideModal } from './utils/ui-utils.js';
import { EMAIL_CONFIG, MESSAGES } from '../shared/constants.js';

class SearchPage {
  constructor() {
    this.engineers = [];
    this.currentUser = null;
    this.matcher = null;
    this.searchModule = null;
    this.uiModule = new UIModule();
    this.init();
  }

  async init() {
    await this.loadEngineerData();
    this.setupEventListeners();
  }

  /**
   * 엔지니어 데이터 로드
   */
  async loadEngineerData() {
    try {
      const data = await getEngineers();
      this.engineers = data;
      this.matcher = new MBTIMatcher(data);
      this.searchModule = new SearchModule(data);
    } catch (error) {
      console.error('Failed to load engineer data:', error);
      this.engineers = [];
      showToast('⚠️', MESSAGES.ERROR.LOAD_FAILED);
    }
  }

  /**
   * 이벤트 리스너 설정
   */
  setupEventListeners() {
    // 검색 버튼
    const searchBtn = document.getElementById('findMyInfoBtn');
    const searchInput = document.getElementById('searchNameInput');
    
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.handleSearch());
    }
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleSearch();
      });
    }

    // 제출 버튼
    const submitBtn = document.getElementById('submitAddRequestBtn');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => this.handleSubmit());
    }

    // 모달 닫기
    const closeModal = document.getElementById('closeModal');
    const modal = document.getElementById('detailModal');
    
    if (closeModal && modal) {
      closeModal.addEventListener('click', () => hideModal());
      modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
      });
    }
  }

  /**
   * 검색 핸들러
   */
  handleSearch() {
    const searchInput = document.getElementById('searchNameInput');
    if (!searchInput) return;

    const searchName = searchInput.value.trim();
    const result = this.searchModule.findEngineer(searchName);

    if (result && result.error) {
      showToast('⚠️', result.error);
      return;
    }

    // 검색 결과 렌더링
    this.searchModule.renderSearchResult(
      result,
      searchName,
      (name, team) => this.uiModule.showRequestForm(name, team)
    );

    // 완전한 프로필이면 매칭 계산
    if (result && result.mbti && result.mbti !== 'NULL' && result.mbti.length === 4) {
      this.currentUser = result;
      const matches = this.matcher.calculateMatches(result);
      this.uiModule.displayMatches(matches);
      this.uiModule.hideRequestForm();
    } else {
      this.uiModule.hideMatchingSection();
    }
  }

  /**
   * 제출 핸들러
   */
  async handleSubmit() {
    const name = document.getElementById('addName')?.value.trim();
    const team = document.getElementById('addTeam')?.value;
    const mbti = document.getElementById('addMbti')?.value;

    if (!name || !team) {
      showToast('⚠️', MESSAGES.ERROR.NO_TEAM);
      return;
    }

    try {
      // FormSubmit으로 이메일 전송
      const formData = new FormData();
      formData.append('name', name);
      formData.append('team', team);
      formData.append('mbti', mbti || '(입력 안 함)');
      formData.append('timestamp', new Date().toLocaleString('ko-KR'));
      formData.append('_subject', `[MBTI 채널] 프로필 업데이트 요청 - ${name}`);
      formData.append('_template', EMAIL_CONFIG.template);
      formData.append('_captcha', EMAIL_CONFIG.captcha);
      
      const response = await fetch(EMAIL_CONFIG.endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        showToast('✅', MESSAGES.SUCCESS.SUBMIT);
        this.uiModule.resetUI();
      } else {
        throw new Error('전송 실패');
      }
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      showToast('⚠️', MESSAGES.ERROR.SUBMIT_FAILED);
    }
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SearchPage();
  });
} else {
  // DOM이 이미 로드됨 (dynamic import로 늦게 로드된 경우)
  new SearchPage();
}
