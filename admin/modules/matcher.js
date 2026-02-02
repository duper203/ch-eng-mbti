// MBTI 매칭 알고리즘
import { 
  parseMBTIAxes, 
  calculateMBTIDistance, 
  getDifferentAxes,
  generateStableSeed,
  seededRandom,
  hashString,
  isValidMBTI
} from '../utils/mbti-utils.js';
import { MATCH_TYPES } from '../../shared/constants.js';

export class MBTIMatcher {
  constructor(engineers) {
    this.engineers = engineers;
  }

  /**
   * 주어진 사용자에 대한 매칭 계산
   * @param {Object} user - 현재 사용자
   * @returns {Object} - {bestie, balancer, wild}
   */
  calculateMatches(user) {
    // 유효한 엔지니어만 필터링
    const validEngineers = this.engineers.filter(e => isValidMBTI(e.mbti));
    
    // 본인 제외
    const candidates = validEngineers.filter(e => 
      e.name !== user.name && 
      e.name_eng !== user.name_eng &&
      e.name_kor !== user.name_kor
    );
    
    // 다른 팀 우선
    const otherTeam = candidates.filter(e => e.team !== user.team);
    const pool = otherTeam.length > 0 ? otherTeam : candidates;

    if (pool.length === 0) {
      return { bestie: null, balancer: null, wild: null };
    }

    const seed = generateStableSeed(user.name || user.name_eng || user.name_kor);
    
    // 거리 계산
    const withDistances = pool.map(e => ({
      ...e,
      distance: calculateMBTIDistance(user.mbti, e.mbti),
      axes: parseMBTIAxes(e.mbti)
    }));

    // 1. Bestie (distance 0-1)
    const bestie = this.findBestie(withDistances, seed);

    // 2. Balancer (distance 2, EI or JP different)
    const balancer = this.findBalancer(withDistances, user, seed);

    // 3. Wild Card (distance >= 3)
    const wild = this.findWildCard(withDistances, bestie, balancer, seed);

    return {
      bestie: bestie ? this.formatMatch(user, bestie, 'bestie') : null,
      balancer: balancer ? this.formatMatch(user, balancer, 'balancer') : null,
      wild: wild ? this.formatMatch(user, wild, 'wild') : null
    };
  }

  /**
   * Bestie 매칭 찾기 (거리 0-1)
   */
  findBestie(candidates, seed) {
    let pool = candidates.filter(e => e.distance <= MATCH_TYPES.BESTIE.maxDistance);
    pool.sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      return seededRandom(seed + hashString(a.name)) - seededRandom(seed + hashString(b.name));
    });
    return pool[0];
  }

  /**
   * Balancer 매칭 찾기 (거리 2, EI 또는 JP가 다름)
   */
  findBalancer(candidates, user, seed) {
    const userAxes = parseMBTIAxes(user.mbti);
    let pool = candidates.filter(e => 
      e.distance === MATCH_TYPES.BALANCER.distance && 
      (e.axes.EI !== userAxes.EI || e.axes.JP !== userAxes.JP)
    );
    pool.sort((a, b) => 
      seededRandom(seed + hashString(a.name)) - seededRandom(seed + hashString(b.name))
    );
    return pool[0];
  }

  /**
   * Wild Card 매칭 찾기 (거리 3 이상)
   */
  findWildCard(candidates, bestie, balancer, seed) {
    let pool = candidates.filter(e => 
      e.distance >= MATCH_TYPES.WILD.minDistance &&
      e.name !== bestie?.name &&
      e.name !== balancer?.name
    );
    
    // 사용된 팀 제외하고 다른 팀 우선
    const usedTeams = [bestie?.team, balancer?.team].filter(Boolean);
    const differentTeams = pool.filter(e => !usedTeams.includes(e.team));
    if (differentTeams.length > 0) {
      pool = differentTeams;
    }
    
    pool.sort((a, b) => 
      seededRandom(seed + hashString(a.name)) - seededRandom(seed + hashString(b.name))
    );
    return pool[0];
  }

  /**
   * 매칭 결과 포맷팅
   */
  formatMatch(user, match, type) {
    const dist = match.distance;
    const diffs = getDifferentAxes(user.mbti, match.mbti);
    
    let reason = '';
    const matchConfig = MATCH_TYPES[type.toUpperCase()];
    const emoji = matchConfig.emoji;
    const title = matchConfig.title;
    
    if (type === 'bestie') {
      reason = dist === 0 
        ? '사고 흐름이 거의 동일해요'
        : '핵심 축이 비슷해서 대화 템포가 잘 맞을 확률↑';
    } else if (type === 'balancer') {
      reason = matchConfig.description;
    } else if (type === 'wild') {
      reason = dist >= 3
        ? '관점이 달라서 회의 때 시야를 넓혀주는 타입'
        : '의외의 조합! 새로운 시각을 제공해줄 거예요';
    }

    const diffText = diffs.length > 0 ? diffs.join(', ') : '';
    const displayName = match.name_kor || match.name_eng || match.name;

    return {
      name: displayName,
      name_eng: match.name_eng,
      name_kor: match.name_kor,
      team: match.team,
      mbti: match.mbti,
      distance: dist,
      diffs: diffs,
      diffText: diffText,
      reason: reason,
      description: '',
      emoji: emoji,
      title: title,
      welcome_url: match.welcome_url
    };
  }
}

