// 공통 통계 로직 (Supabase 연동)
import { getStatsData } from './supabase.js';

let statsData = [];
let charts = {};

// Supabase에서 통계 데이터 가져오기 (team, mbti만)
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
        // NULL 값은 무시
        if (!e.mbti || e.mbti === 'NULL' || e.mbti === 'null') return;
        
        const mbti = e.mbti.toUpperCase();
        distribution[mbti] = (distribution[mbti] || 0) + 1;
    });
    return distribution;
}

function createCharts() {
    const distribution = getMBTIDistribution();
    const sortedEntries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
    const labels = sortedEntries.map(([label]) => label);
    const data = sortedEntries.map(([, count]) => count);
    
    // Update metrics
    const totalCountEl = document.getElementById('totalCount');
    const mostCommonMbtiEl = document.getElementById('mostCommonMbti');
    const ieRatioEl = document.getElementById('ieRatio');
    const nsRatioEl = document.getElementById('nsRatio');
    const tfRatioEl = document.getElementById('tfRatio');
    const jpRatioEl = document.getElementById('jpRatio');
    
    // MBTI가 있는 사람 수로 표시
    const validCount = statsData.length;
    if (totalCountEl) totalCountEl.textContent = validCount;
    
    const sorted = Object.entries(distribution).sort((a,b) => b[1] - a[1]);
    if (sorted[0] && validCount > 0) {
        if (mostCommonMbtiEl) mostCommonMbtiEl.textContent = sorted[0][0];
    } else {
        // 데이터 없을 때
        if (mostCommonMbtiEl) mostCommonMbtiEl.textContent = 'N/A';
    }
    
    // Calculate MBTI dimension ratios
    if (validCount > 0) {
        let iCount = 0, eCount = 0;
        let nCount = 0, sCount = 0;
        let tCount = 0, fCount = 0;
        let jCount = 0, pCount = 0;
        
        statsData.forEach(e => {
            if (e.mbti && e.mbti.length === 4) {
                const mbti = e.mbti.toUpperCase();
                
                // I/E
                if (mbti[0] === 'I') iCount++;
                else if (mbti[0] === 'E') eCount++;
                
                // N/S
                if (mbti[1] === 'N') nCount++;
                else if (mbti[1] === 'S') sCount++;
                
                // T/F
                if (mbti[2] === 'T') tCount++;
                else if (mbti[2] === 'F') fCount++;
                
                // J/P
                if (mbti[3] === 'J') jCount++;
                else if (mbti[3] === 'P') pCount++;
            }
        });
        
        const iPct = ((iCount / validCount) * 100).toFixed(0);
        const ePct = ((eCount / validCount) * 100).toFixed(0);
        const nPct = ((nCount / validCount) * 100).toFixed(0);
        const sPct = ((sCount / validCount) * 100).toFixed(0);
        const tPct = ((tCount / validCount) * 100).toFixed(0);
        const fPct = ((fCount / validCount) * 100).toFixed(0);
        const jPct = ((jCount / validCount) * 100).toFixed(0);
        const pPct = ((pCount / validCount) * 100).toFixed(0);
        
        // Create beautiful ratio displays with two-line format
        const lineStyle = 'display: block; line-height: 1.3; letter-spacing: -0.01em;';
        const firstLineStyle = 'color: rgba(0,0,0,0.9); font-weight: 700; font-size: 1.6rem;';
        const secondLineStyle = 'color: rgba(0,0,0,0.5); font-weight: 500; font-size: 1.3rem;';
        
        // Helper function to display larger value on top
        const formatRatio = (label1, pct1, label2, pct2) => {
            if (parseInt(pct1) >= parseInt(pct2)) {
                return `<span style="${lineStyle}"><span style="${firstLineStyle}">${label1} ${pct1}%</span><br><span style="${secondLineStyle}">${label2} ${pct2}%</span></span>`;
            } else {
                return `<span style="${lineStyle}"><span style="${firstLineStyle}">${label2} ${pct2}%</span><br><span style="${secondLineStyle}">${label1} ${pct1}%</span></span>`;
            }
        };
        
        if (ieRatioEl) {
            ieRatioEl.innerHTML = formatRatio('I', iPct, 'E', ePct);
        }
        if (nsRatioEl) {
            nsRatioEl.innerHTML = formatRatio('N', nPct, 'S', sPct);
        }
        if (tfRatioEl) {
            tfRatioEl.innerHTML = formatRatio('T', tPct, 'F', fPct);
        }
        if (jpRatioEl) {
            jpRatioEl.innerHTML = formatRatio('J', jPct, 'P', pPct);
        }
    } else {
        if (ieRatioEl) ieRatioEl.textContent = '- / -';
        if (nsRatioEl) nsRatioEl.textContent = '- / -';
        if (tfRatioEl) tfRatioEl.textContent = '- / -';
        if (jpRatioEl) jpRatioEl.textContent = '- / -';
    }
    
    // Overall Chart
    const ctx1 = document.getElementById('overallChart');
    if (!ctx1) {
        return;
    }
    
    if (labels.length === 0) {
        ctx1.getContext('2d').font = '16px Inter';
        ctx1.getContext('2d').fillStyle = '#000000';
        ctx1.getContext('2d').textAlign = 'center';
        ctx1.getContext('2d').fillText('No data available', ctx1.width / 2, ctx1.height / 2);
        return;
    }
    
    const colors = ['#000000', '#2c2c2c', '#4a4a4a', '#696969', '#8c8c8c', '#a8a8a8', '#c4c4c4', '#d4d4d4', '#e0e0e0', '#f0f0f0', '#555555', '#777777'];
    const glassColors = colors.slice(0, labels.length).map(color => color + 'cc');
    
    try {
    charts.overall = new Chart(ctx1.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: glassColors,
                borderWidth: 1,
                spacing: 3,
                borderRadius: 4,
                hoverOffset: 6,
                borderColor: 'rgba(255, 255, 255, 0.6)',
                hoverBorderColor: 'rgba(255, 255, 255, 0.8)'
            }]
        },
        options: {
            responsive: true,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { 
                        color: 'rgba(0, 0, 0, 0.8)',
                        font: { size: 11, family: 'Inter' }
                    }
                }
            }
        }
    });
    } catch (error) {
        console.error('Error creating chart:', error);
    }
    
    // Team Chart
    updateTeamChart();
}

function updateTeamChart() {
    const team = document.getElementById('teamSelect')?.value || 'all';
    const teamData = team === 'all' ? statsData : statsData.filter(e => e.team === team);
    const distribution = getMBTIDistribution(teamData);
    const labels = Object.keys(distribution);
    const counts = Object.values(distribution);
    const total = counts.reduce((a,b) => a+b, 0);
    
    if (total === 0) return;
    
    const percentages = counts.map(d => ((d/total)*100).toFixed(1));
    
    if (charts.team) {
        charts.team.destroy();
    }
    
    const dotCount = 20;
    const buildDots = (pct) => {
        const scaled = Math.pow(pct / 100, 0.6);
        const filled = Math.max(pct > 0 ? 1 : 0, Math.round(scaled * dotCount));
        return Array.from({ length: dotCount }, (_, i) => {
            const colorClass = i < filled ? 'bg-black/70' : 'bg-black/15';
            return `<span class="inline-block w-2 h-2 rounded-full ${colorClass}"></span>`;
        }).join('');
    };
    
    // Update team stats
    const statsHtml = `
        <div class="grid grid-cols-1 gap-2">
            ${Object.entries(distribution).sort((a,b) => b[1] - a[1]).map(([mbti, count]) => {
                const pct = ((count/total)*100).toFixed(1);
                return `
                    <div class="flex items-center justify-center gap-3 text-sm bg-white bg-opacity-5 rounded-lg px-3 py-2 w-full">
                        <span class="text-black text-opacity-80 font-medium w-12">${mbti}</span>
                        <div class="flex items-center justify-center gap-1 flex-1 max-w-md">
                            ${buildDots(pct)}
                        </div>
                        <span class="font-semibold text-black w-12 text-right">${pct}%</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    const statsContainer = document.getElementById('teamStats');
    if (statsContainer) {
        statsContainer.innerHTML = statsHtml;
    }
}

function displayTopMBTI() {
    const distribution = getMBTIDistribution();
    const sorted = Object.entries(distribution).sort((a,b) => b[1] - a[1]).slice(0, 5);
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    const validCount = statsData.length;
    
    if (validCount === 0) {
        const topMbtiListEl = document.getElementById('topMbtiList');
        if (topMbtiListEl) {
            topMbtiListEl.innerHTML = '<div class="text-center text-black text-opacity-60">No data available</div>';
        }
        return;
    }
    
    const html = sorted.map(([mbti, count], i) => {
        const pct = ((count/validCount)*100).toFixed(1);
        return `
            <div class="top-mbti-item">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${medals[i]}</span>
                    <span class="mbti-badge">${mbti}</span>
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold text-black">${pct}%</div>
                    <div class="text-xs text-black text-opacity-60">${count} members</div>
                </div>
            </div>
        `;
    }).join('');
    
    const topMbtiListEl = document.getElementById('topMbtiList');
    if (topMbtiListEl) {
        topMbtiListEl.innerHTML = html;
    }
}

// Initialize
async function init() {
    // 데이터 로드
    await loadStatsData();
    
    // Team select change listener
    const teamSelect = document.getElementById('teamSelect');
    if (teamSelect) {
        teamSelect.addEventListener('change', updateTeamChart);
    }
    
    // 애니메이션
    document.querySelectorAll('.fade-in').forEach(el => {
        el.classList.add('visible');
    });
    
    createCharts();
    displayTopMBTI();
}

// DOM이 로드되었으면 즉시 실행, 아니면 대기
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOMContentLoaded가 이미 발생했으면 즉시 실행
    init();
}

