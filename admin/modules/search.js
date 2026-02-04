import { isValidMBTI } from '../utils/mbti-utils.js';
import { fadeTransition } from '../utils/ui-utils.js';
import { MESSAGES } from '../../shared/constants.js';

export class SearchModule {
  constructor(engineers) {
    this.engineers = engineers;
  }

  findEngineer(searchName) {
    const name = searchName.trim().toLowerCase();
    
    if (!name) return { error: MESSAGES.ERROR.NO_NAME };

    const found = this.engineers.find(e => {
      const nameMatch = e.name && e.name.toLowerCase() === name;
      const nameEngMatch = e.name_eng && e.name_eng.toLowerCase() === name;
      const nameKorMatch = e.name_kor && e.name_kor.toLowerCase() === name;
      return nameMatch || nameEngMatch || nameKorMatch;
    });

    return found || null;
  }

  findByMBTI(mbtiType) {
    if (!mbtiType) return [];

    const type = mbtiType.toUpperCase();
    return this.engineers.filter(e => e.mbti && e.mbti.toUpperCase() === type);
  }

  renderSearchResult(result, searchedName, onShowAddForm) {
    const resultDiv = document.getElementById('myInfoResult');
    if (!resultDiv) return;

    fadeTransition(resultDiv, () => {
      if (result && result.error) {
        resultDiv.innerHTML = this.renderErrorMessage(result.error);
      } else if (result && isValidMBTI(result.mbti)) {
        resultDiv.innerHTML = this.renderCompleteProfile(result);
      } else if (result) {
        resultDiv.innerHTML = this.renderIncompleteProfile(result);
        this.attachAddFormListener(result, onShowAddForm);
      } else {
        resultDiv.innerHTML = this.renderNotFound(searchedName);
        this.attachAddFormListener({ name: searchedName }, onShowAddForm);
      }
    });
  }

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

  renderIncompleteProfile(engineer) {
    const displayName = engineer.name_kor || engineer.name_eng || engineer.name;
    const displayNameEng = engineer.name_eng ? `(${engineer.name_eng})` : '';
    
    return `
      <div class="result-card" style="background: linear-gradient(135deg, rgba(94, 86, 240, 0.15), rgba(94, 86, 240, 0.05)); border-color: rgba(94, 86, 240, 0.4); transition: all 0.3s ease;">
        <div class="text-4xl mb-3 text-center" style="animation: shake 0.5s ease;">⚠️</div>
        <h4 class="result-title text-center" style="color: #5E56F0;">Profile Incomplete</h4>
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

  renderNotFound(searchedName) {
    return `
      <div class="result-card" style="background: linear-gradient(135deg, rgba(94, 86, 240, 0.15), rgba(94, 86, 240, 0.05)); border-color: rgba(94, 86, 240, 0.4); transition: all 0.3s ease;">
        <div class="text-4xl mb-3 text-center" style="animation: shake 0.5s ease;">🤔</div>
        <h4 class="result-title text-center" style="color: #5E56F0;">Profile Not Found</h4>
        <p class="result-text text-center mb-4">${MESSAGES.INFO.NOT_FOUND} "${searchedName}"</p>
        <button id="showAddFormBtn" class="btn-primary">
          ➕ Request to Add
        </button>
      </div>
    `;
  }

  renderErrorMessage(message) {
    return `
      <div class="result-card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05)); border-color: rgba(239, 68, 68, 0.4);">
        <div class="text-4xl mb-3 text-center">⚠️</div>
        <h4 class="result-title text-center" style="color: #ef4444;">Error</h4>
        <p class="result-text text-center">${message}</p>
      </div>
    `;
  }

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

  renderMBTISearchResult(results, mbtiType) {
    const resultDiv = document.getElementById('mbtiSearchResult');
    if (!resultDiv) return;

    fadeTransition(resultDiv, () => {
      if (!mbtiType) {
        resultDiv.innerHTML = `
          <div class="result-card" style="background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05)); border-color: rgba(239, 68, 68, 0.4);">
            <div class="text-4xl mb-3 text-center">⚠️</div>
            <h4 class="result-title text-center" style="color: #ef4444;">MBTI를 선택해주세요</h4>
          </div>
        `;
        return;
      }

      if (results.length === 0) {
        resultDiv.innerHTML = `
          <div class="result-card" style="background: linear-gradient(135deg, rgba(94, 86, 240, 0.15), rgba(94, 86, 240, 0.05)); border-color: rgba(94, 86, 240, 0.4);">
            <div class="text-4xl mb-3 text-center">🤔</div>
            <h4 class="result-title text-center" style="color: #5E56F0;">No Results Found</h4>
            <p class="result-text text-center">${mbtiType} 타입을 가진 사람을 찾을 수 없습니다.</p>
          </div>
        `;
        return;
      }

      const peopleList = results.map(person => {
        const displayName = person.name_kor || person.name_eng || person.name;
        const displayNameEng = person.name_eng ? `(${person.name_eng})` : '';
        return `
          <div class="flex items-center justify-between p-4 bg-white bg-opacity-40 rounded-lg hover:bg-opacity-60 transition-all">
            <div>
              <div class="font-semibold text-black text-lg">${displayName} ${displayNameEng}</div>
              <div class="text-sm text-black text-opacity-60 mt-1">
                <i class="fas fa-users"></i> ${person.team}
              </div>
            </div>
            <div class="text-2xl font-bold text-black text-opacity-80">${person.mbti}</div>
          </div>
        `;
      }).join('');

      resultDiv.innerHTML = `
        <div class="result-card" style="background: linear-gradient(135deg, rgba(96, 213, 192, 0.15), rgba(96, 213, 192, 0.05)); border-color: rgba(96, 213, 192, 0.4); animation: fadeInUp 0.5s ease forwards;">
          <div class="text-4xl mb-3 text-center">✅</div>
          <h4 class="result-title text-center" style="color: #60d5c0;">${mbtiType} 타입 (${results.length}명)</h4>
          <div class="space-y-3 mt-6">
            ${peopleList}
          </div>
        </div>
      `;
    });
  }
}