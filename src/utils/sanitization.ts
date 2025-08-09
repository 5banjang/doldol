import DOMPurify from 'dompurify';

/**
 * 사용자 입력을 안전하게 정화하는 유틸리티
 */
export const sanitizeInput = (input: string): string => {
  // 기본 trim과 DOMPurify 적용
  const trimmed = input.trim();
  
  // HTML/스크립트 태그 제거하고 텍스트만 유지
  const sanitized = DOMPurify.sanitize(trimmed, {
    ALLOWED_TAGS: [], // HTML 태그 모두 제거
    ALLOWED_ATTR: [], // 속성 모두 제거
    KEEP_CONTENT: true // 텍스트 내용은 유지
  });
  
  return sanitized;
};

/**
 * 파일명으로 사용할 수 있도록 문자열 정화
 */
export const sanitizeFileName = (input: string): string => {
  const sanitized = sanitizeInput(input);
  
  // 파일명에 사용할 수 없는 문자 제거
  return sanitized.replace(/[<>:"/\\|?*]/g, '').substring(0, 100);
};

/**
 * 길이 제한이 있는 입력 정화
 */
export const sanitizeWithLength = (input: string, maxLength: number = 255): string => {
  const sanitized = sanitizeInput(input);
  return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
};