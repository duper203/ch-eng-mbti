import { getStatsData } from './supabase.js';

let statsData = [];

async function loadStatsData() {
    try {
        const data = await getStatsData();
        
        if (!data || data.length === 0) {
            alert('⚠️ 데이터를 불러올 수 없습니다.\n관리자에게 문의하세요.');
            statsData = [];
            return statsData;
        }
        
        statsData = data;
        return statsData;
    } catch (error) {
        console.error('Failed to load stats:', error);
        alert('❌ 데이터를 불러올 수 없습니다.\n관리자에게 문의하세요.');
        statsData = [];
        return statsData;
    }
}

function getMBTIDistribution(data = statsData) {
    const distribution = {};
    data.forEach(e => {
        if (!e.mbti || e.mbti === 'NULL' || e.mbti === 'null') return;
        const mbti = e.mbti.toUpperCase();
        distribution[mbti] = (distribution[mbti] || 0) + 1;
    });
    return distribution;
}

function createCharts() {
    const distribution = getMBTIDistribution();
    const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
    const validCount = statsData.length;
    const totalCountEl = document.getElementById('totalCount');
    const totalCountEl2 = document.getElementById('totalCount2');
    const mostCommonMbtiEl = document.getElementById('mostCommonMbti');
    
    if (totalCountEl) totalCountEl.textContent = validCount;
    if (totalCountEl2) totalCountEl2.textContent = validCount;
    
    if (sorted[0] && validCount > 0) {
        if (mostCommonMbtiEl) mostCommonMbtiEl.textContent = sorted[0][0];
    } else {
        if (mostCommonMbtiEl) mostCommonMbtiEl.textContent = 'N/A';
    }
    
    displayTop3Ranking();
    
    if (validCount > 0) {
        let iCount = 0, eCount = 0;
        let nCount = 0, sCount = 0;
        let tCount = 0, fCount = 0;
        let jCount = 0, pCount = 0;
        
        statsData.forEach(e => {
            if (e.mbti && e.mbti.length === 4) {
                const mbti = e.mbti.toUpperCase();
                
                if (mbti[0] === 'I') iCount++;
                else if (mbti[0] === 'E') eCount++;
                
                if (mbti[1] === 'N') nCount++;
                else if (mbti[1] === 'S') sCount++;
                
                if (mbti[2] === 'T') tCount++;
                else if (mbti[2] === 'F') fCount++;
                
                if (mbti[3] === 'J') jCount++;
                else if (mbti[3] === 'P') pCount++;
            }
        });
        
        const iPct = ((iCount / validCount) * 100).toFixed(1);
        const ePct = ((eCount / validCount) * 100).toFixed(1);
        const nPct = ((nCount / validCount) * 100).toFixed(1);
        const sPct = ((sCount / validCount) * 100).toFixed(1);
        const tPct = ((tCount / validCount) * 100).toFixed(1);
        const fPct = ((fCount / validCount) * 100).toFixed(1);
        const jPct = ((jCount / validCount) * 100).toFixed(1);
        const pPct = ((pCount / validCount) * 100).toFixed(1);
        
        updateGaugeBar('IE', 'I', iPct, 'E', ePct);
        updateGaugeBar('NS', 'N', nPct, 'S', sPct);
        updateGaugeBar('FT', 'F', fPct, 'T', tPct);
        updateGaugeBar('PJ', 'P', pPct, 'J', jPct);
    }
    
    displayMBTIDistribution();
}

function displayTop3Ranking() {
    const distribution = getMBTIDistribution();
    const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const medals = ['🥇', '🥈', '🥉'];
    const validCount = statsData.length;
    const top3El = document.getElementById('top3Ranking');
    
    if (!top3El) return;
    
    if (validCount === 0 || sorted.length === 0) {
        top3El.innerHTML = '<div class="text-center text-black text-opacity-60">No data available</div>';
        return;
    }
    
    const html = sorted.map(([mbti, count], i) => {
        const pct = ((count / validCount) * 100).toFixed(1);
        return `
            <div class="top3-item">
                <span class="rank">${medals[i]}</span>
                <span class="mbti">${mbti}</span>
                <span class="percentage">${pct}%</span>
            </div>
        `;
    }).join('');
    
    top3El.innerHTML = html;
}

function updateGaugeBar(dimension, label1, pct1, label2, pct2) {
    const [leftLabel, leftPct, rightLabel, rightPct] = parseFloat(pct1) >= parseFloat(pct2)
        ? [label1, pct1, label2, pct2]
        : [label2, pct2, label1, pct1];
    
    const gaugeLeft = document.getElementById(`gaugeLeft${dimension}`);
    const gaugeRight = document.getElementById(`gaugeRight${dimension}`);
    const valueLeft = document.getElementById(`valueLeft${dimension}`);
    const valueRight = document.getElementById(`valueRight${dimension}`);
    
    if (gaugeLeft) gaugeLeft.style.width = `${leftPct}%`;
    if (gaugeRight) gaugeRight.style.width = `${rightPct}%`;
    if (valueLeft) valueLeft.textContent = `${leftPct}%`;
    if (valueRight) valueRight.textContent = `${rightPct}%`;
}

function displayMBTIDistribution(team = 'all') {
    const teamData = team === 'all' ? statsData : statsData.filter(e => e.team === team);
    const distribution = getMBTIDistribution(teamData);
    const sorted = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
    const validCount = teamData.length;
    const listEl = document.getElementById('mbtiDistributionList');
    
    if (!listEl) return;
    
    if (validCount === 0 || sorted.length === 0) {
        listEl.innerHTML = '<div class="text-center text-black text-opacity-60 py-8">해당 팀의 데이터가 없습니다</div>';
        return;
    }
    
    const mbtiIcons = {
        'INTJ': '🧙‍♂️', 'INTP': '🤖', 'ENTJ': '👔', 'ENTP': '💡',
        'INFJ': '🌙', 'INFP': '🌱', 'ENFJ': '🌟', 'ENFP': '🎨',
        'ISTJ': '📋', 'ISFJ': '🛡️', 'ESTJ': '⚖️', 'ESFJ': '🤝',
        'ISTP': '🔧', 'ISFP': '🎭', 'ESTP': '⚡', 'ESFP': '🎉'
    };
    
    const maxCount = sorted[0][1];
    
    const topClasses = ['top1', 'top2', 'top3'];
    
    const html = sorted.map(([mbti, count], index) => {
        const pct = ((count / validCount) * 100).toFixed(1);
        const width = (count / maxCount) * 100;
        const icon = mbtiIcons[mbti] || '🔮';
        const topClass = index < 3 ? topClasses[index] : '';
        
        return `
            <div class="distribution-item ${topClass}" data-mbti="${mbti}" data-team="${team}" onclick="showMBTIPeople('${mbti}', '${team}')">
                <div class="dist-icon">${icon}</div>
                <div class="dist-mbti">${mbti}</div>
                <div class="dist-bar-wrapper">
                    <div class="dist-bar">
                        <div class="dist-bar-fill ${topClass}" style="width: ${width}%"></div>
                    </div>
                </div>
                <div class="dist-stats">
                    <div class="dist-percentage">${pct}%</div>
                    <div class="dist-count">${count}명</div>
                </div>
            </div>
        `;
    }).join('');
    
    listEl.innerHTML = html;
}

window.showMBTIPeople = function(mbti, team) {
    const teamData = team === 'all' ? statsData : statsData.filter(e => e.team === team);
    const people = teamData.filter(e => e.mbti && e.mbti.toUpperCase() === mbti.toUpperCase());
    
    if (people.length === 0) return;
    
    const mbtiIcons = {
        'INTJ': '🧙‍♂️', 'INTP': '🤖', 'ENTJ': '👔', 'ENTP': '💡',
        'INFJ': '🌙', 'INFP': '🌱', 'ENFJ': '🌟', 'ENFP': '🎨',
        'ISTJ': '📋', 'ISFJ': '🛡️', 'ESTJ': '⚖️', 'ESFJ': '🤝',
        'ISTP': '🔧', 'ISFP': '🎭', 'ESTP': '⚡', 'ESFP': '🎉'
    };
    
    const icon = mbtiIcons[mbti] || '🔮';
    const teamName = team === 'all' ? '전체 엔지니어' : team;
    
    const peopleHtml = people.map(person => `
        <div class="person-card">
            <div class="person-name">${person.name || '이름 없음'}</div>
            <div style="text-align: center;">
                <span class="person-team">${person.team || 'ETC'}</span>
            </div>
        </div>
    `).join('');
    
    const modalContent = `
        <div class="modal-people-title">${icon} ${mbti}</div>
        <div class="modal-people-subtitle">${teamName} · ${people.length}명</div>
        <div class="people-list">
            ${peopleHtml}
        </div>
    `;
    
    const modal = document.getElementById('mbtiPeopleModal');
    const modalContentEl = document.getElementById('modalPeopleContent');
    
    if (modal && modalContentEl) {
        modalContentEl.innerHTML = modalContent;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closePeopleModal() {
    const modal = document.getElementById('mbtiPeopleModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

async function init() {
    await loadStatsData();
    
    const teamSelect = document.getElementById('teamSelect');
    if (teamSelect) {
        teamSelect.addEventListener('change', (e) => displayMBTIDistribution(e.target.value));
    }
    
    const closePeopleModalBtn = document.getElementById('closePeopleModal');
    const mbtiPeopleModal = document.getElementById('mbtiPeopleModal');
    
    if (closePeopleModalBtn) {
        closePeopleModalBtn.addEventListener('click', closePeopleModal);
    }
    
    if (mbtiPeopleModal) {
        mbtiPeopleModal.addEventListener('click', (e) => {
            if (e.target === mbtiPeopleModal) closePeopleModal();
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePeopleModal();
    });
    
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    
    createCharts();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
