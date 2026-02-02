// MBTI 관련 유틸리티 함수들
import { MBTI_AXIS_NAMES } from '../../shared/constants.js';

/**
 * MBTI를 4개의 축으로 분해
 * @param {string} mbti - MBTI 타입 (예: "INTJ")
 * @returns {Object} - {EI, NS, TF, JP}
 */
export function parseMBTIAxes(mbti) {
  return {
    EI: mbti[0],
    NS: mbti[1],
    TF: mbti[2],
    JP: mbti[3]
  };
}

/**
 * 두 MBTI 간의 축 거리 계산 (0-4)
 * @param {string} mbtiA 
 * @param {string} mbtiB 
 * @returns {number} - 다른 축의 개수
 */
export function calculateMBTIDistance(mbtiA, mbtiB) {
  const axesA = parseMBTIAxes(mbtiA);
  const axesB = parseMBTIAxes(mbtiB);
  
  let distance = 0;
  if (axesA.EI !== axesB.EI) distance++;
  if (axesA.NS !== axesB.NS) distance++;
  if (axesA.TF !== axesB.TF) distance++;
  if (axesA.JP !== axesB.JP) distance++;
  
  return distance;
}

/**
 * 두 MBTI 간의 다른 축 목록 반환
 * @param {string} mbtiA 
 * @param {string} mbtiB 
 * @returns {Array<string>} - 다른 축의 이름 배열
 */
export function getDifferentAxes(mbtiA, mbtiB) {
  const axesA = parseMBTIAxes(mbtiA);
  const axesB = parseMBTIAxes(mbtiB);
  const differences = [];
  
  if (axesA.EI !== axesB.EI) differences.push(MBTI_AXIS_NAMES.EI);
  if (axesA.NS !== axesB.NS) differences.push(MBTI_AXIS_NAMES.NS);
  if (axesA.TF !== axesB.TF) differences.push(MBTI_AXIS_NAMES.TF);
  if (axesA.JP !== axesB.JP) differences.push(MBTI_AXIS_NAMES.JP);
  
  return differences;
}

/**
 * MBTI 유효성 검증
 * @param {string} mbti 
 * @returns {boolean}
 */
export function isValidMBTI(mbti) {
  if (!mbti || mbti === 'NULL' || mbti.length !== 4) {
    return false;
  }
  return true;
}

/**
 * 안정적인 시드 생성 (이름 + 날짜 기반)
 * @param {string} userName 
 * @returns {number}
 */
export function generateStableSeed(userName) {
  const today = new Date().toISOString().split('T')[0];
  return hashString(userName + '|' + today);
}

/**
 * 문자열 해시 생성
 * @param {string} str 
 * @returns {number}
 */
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * 시드 기반 랜덤 함수
 * @param {number} seed 
 * @returns {number} - 0과 1 사이의 값
 */
export function seededRandom(seed) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

