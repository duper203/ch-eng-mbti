// 검색 로직 모듈
import { isValidMBTI } from '../utils/mbti-utils.js';
import { fadeTransition } from '../utils/ui-utils.js';
import { MESSAGES } from '../../shared/constants.js';

export class SearchModule {
  constructor(engineers) {
    this.engineers = engineers;
  }

  /**
   * 엔지니어 검색
   * @param {string} searchName - 검색할 이름
   * @returns {Object|null} - 찾은 엔지니어 또는 null
   */
  findEngineer(searchName) {
    const name = searchName.trim().toLowerCase();
    
    if (!name) {
      return { error: MESSAGES.ERROR.NO_NAME };
    }

    const found = this.engineers.find(e => {
      const nameMatch = e.name && e.name.toLowerCase() === name;
      const nameEngMatch = e.name_eng && e.name_eng.toLowerCase() === name;
      const nameKorMatch = e.name_kor && e.name_kor.toLowerCase() === name;
      return nameMatch || nameEngMatch || nameKorMatch;
    });

    return found || null;
  }

  /**
   * 검색 결과 렌더링
   * @param {Object|null} result - 검색 결과
   * @param {string} searchedName - 검색된 이름
   * @param {Function} onShowAddForm - 추가 폼 표시 콜백
   */
  renderSearchResult(result, searchedName, onShowAddForm) {
    const resultDiv = document.getElementById('myInfoResult');
    if (!resultDiv) return;

    fadeTransition(resultDiv, () => {
      if (result && result.error) {
        // 에러 메시지
        resultDiv.innerHTML = this.renderErrorMessage(result.error);
      } else if (result && isValidMBTI(result.mbti)) {
        // 완전한 프로필
        resultDiv.innerHTML = this.renderCompleteProfile(result);
      } else if (result) {
        // 불완전한 프로필
        resultDiv.innerHTML = this.renderIncompleteProfile(result);
        this.attachAddFormListener(result, onShowAddForm);
      } else {
        // 찾을 수 없음
        resultDiv.innerHTML = this.renderNotFound(searchedName);
        this.attachAddFormListener({ name: searchedName }, onShowAddForm);
      }
    });
  }

  /**
   * 완전한 프로필 HTML 생성
   */
  renderCompleteProfile(engineer) {
    const displayName = engineer.name_kor || engineer.name_eng || engineer.name;
    const displayNameEng = engineer.name_eng ? `${engineer.name_eng}` : '';
    
    return `
      <div class="profile-card-pinterest" style="animation: fadeInUp 0.5s ease forwards;">
        <h2 class="profile-name">${displayName}</h2>
        ${displayNameEng ? `<p style="font-size: 1.4rem; color: rgba(0,0,0,0.5); margin-top: -0.5rem; margin-bottom: 1.5rem; font-weight: 500;">${displayNameEng}</p>` : ''}
        
        <div class="profile-mbti-large">${engineer.mbti}</div>
        
        <div style="margin-top: 2rem;">
          <div class="profile-info-item">
            <i class="fas fa-users"></i>
            <span>${engineer.team}</span>
          </div>
        </div>
        
        ${engineer.welcome_url ? `
        <div style="margin-top: 2rem;">
          <a href="${engineer.welcome_url}" target="_blank" class="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-opacity-90 transition font-medium">
            <i class="fas fa-book-open"></i>
            <span>View Notion Profile</span>
          </a>
        </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * 불완전한 프로필 HTML 생성
   */
  renderIncompleteProfile(engineer) {
    const displayName = engineer.name_kor || engineer.name_eng || engineer.name;
    const displayNameEng = engineer.name_eng ? `(${engineer.name_eng})` : '';
    
    return `
      <div class="result-card" style="background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 193, 7, 0.05)); border-color: rgba(255, 193, 7, 0.4); transition: all 0.3s ease;">
        <div class="text-4xl mb-3 text-center" style="animation: shake 0.5s ease;">⚠️</div>
        <h4 class="result-title text-center" style="color: #ffc107;">Profile Incomplete</h4>
        <p class="result-text text-center mb-4">
          <strong>${displayName} ${displayNameEng}</strong>${MESSAGES.INFO.INCOMPLETE_PROFILE}<br>
          ${engineer.team}
        </p>
        <button id="showAddFormBtn" class="btn-primary">
          ✏️ Update MBTI Info
        </button>
      </div>
    `;
  }

  /**
   * 찾을 수 없음 HTML 생성
   */
  renderNotFound(searchedName) {
    return `
      <div class="result-card" style="background: linear-gradient(135deg, rgba(237, 137, 54, 0.15), rgba(237, 137, 54, 0.05)); border-color: rgba(237, 137, 54, 0.4); transition: all 0.3s ease;">
        <div class="text-4xl mb-3 text-center" style="animation: shake 0.5s ease;">🤔</div>
        <h4 class="result-title text-center" style="color: #ed8936;">Profile Not Found</h4>
        <p class="result-text text-center mb-4">${MESSAGES.INFO.NOT_FOUND} "${searchedName}"</p>
        <button id="showAddFormBtn" class="btn-primary">
          ➕ Request to Add
        </button>
      </div>
    `;
  }

  /**
   * 에러 메시지 HTML 생성
   */
  renderErrorMessage(message) {
    return `
      <div class="result-card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05)); border-color: rgba(239, 68, 68, 0.4);">
        <div class="text-4xl mb-3 text-center">⚠️</div>
        <h4 class="result-title text-center" style="color: #ef4444;">Error</h4>
        <p class="result-text text-center">${message}</p>
      </div>
    `;
  }

  /**
   * 추가 폼 버튼 리스너 추가
   */
  attachAddFormListener(engineer, onShowAddForm) {
    setTimeout(() => {
      const btn = document.getElementById('showAddFormBtn');
      if (btn) {
        btn.addEventListener('click', () => {
          onShowAddForm(
            engineer.name_eng || engineer.name_kor || engineer.name,
            engineer.team || ''
          );
        });
      }
    }, 200);
  }
}

