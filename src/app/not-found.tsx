import React from 'react';
import FallingText from '@/components/falling-text';

/**
 * 404 Not Found 페이지
 * 
 * 존재하지 않는 페이지에 접근했을 때 표시되는 페이지입니다.
 * Matter.js 물리 엔진을 사용한 Falling Text 애니메이션으로 사용자에게 404 에러를 시각적으로 전달합니다.
 */
export default function NotFound() {
  return (
    <FallingText 
      text="404 Not Found - The page you are looking for does not exist in our system. Please check the URL or return to the homepage."
      highlightWords={['404', 'Not', 'Found']}
      highlightClass="highlighted"
      trigger="auto"
      backgroundColor="transparent"
      wireframes={false}
      gravity={1}
      mouseConstraintStiffness={0.2}
      fontSize="3.5rem"
    />
  );
}
