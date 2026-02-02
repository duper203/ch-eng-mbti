// 공통 상수 정의

// 팀 목록
export const TEAMS = [
  'ETC',
  'FDE',
  'AI',
  'Frontend',
  'Mobile',
  'Backend'
];

// MBTI 타입 목록
export const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

// 매칭 타입 설정
export const MATCH_TYPES = {
  BESTIE: {
    emoji: '🤝',
    title: 'Bestie Match',
    description: '사고 흐름이 거의 동일해요',
    maxDistance: 1
  },
  BALANCER: {
    emoji: '⚖️',
    title: 'Balancer',
    description: '스타일은 다른데 충돌은 덜한 "좋은 보완" 조합',
    distance: 2
  },
  WILD: {
    emoji: '🎲',
    title: 'Wild Card',
    description: '관점이 달라서 회의 때 시야를 넓혀주는 타입',
    minDistance: 3
  }
};

// 이메일 설정
export const EMAIL_CONFIG = {
  endpoint: 'https://formsubmit.co/ajax/soo@channel.io',
  captcha: 'false',
  template: 'table'
};

// 메시지
export const MESSAGES = {
  ERROR: {
    NO_NAME: '이름을 입력해주세요!',
    NO_TEAM: '이름과 팀을 입력해주세요!',
    SUBMIT_FAILED: '요청 전송에 실패했습니다.<br>잠시 후 다시 시도해주세요.',
    LOAD_FAILED: '데이터를 불러올 수 없습니다.'
  },
  SUCCESS: {
    SUBMIT: '빠르게 반영하겠습니다!',
    FOUND: '프로필을 찾았습니다!'
  },
  INFO: {
    INCOMPLETE_PROFILE: '의 MBTI 정보가 없습니다.',
    NOT_FOUND: 'Request to add'
  }
};

// 애니메이션 설정
export const ANIMATION = {
  TOAST_DURATION: 2500,
  FADE_DELAY: 150,
  FADE_IN_DELAY: 50
};

// MBTI 축 이름 (한글)
export const MBTI_AXIS_NAMES = {
  EI: '에너지(E/I)',
  NS: '정보(N/S)',
  TF: '판단(T/F)',
  JP: '정리(J/P)'
};

