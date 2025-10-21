'use client';

import React from 'react';

/**
 * Pictures 컴포넌트 Props
 */
export interface PicturesProps {
  /**
   * 추가 CSS 클래스명
   */
  className?: string;
}

/**
 * Pictures 컴포넌트
 * 
 * 사진 갤러리를 표시하는 컴포넌트입니다.
 * 
 * @param {PicturesProps} props - 컴포넌트 props
 * @param {string} [props.className] - 추가 CSS 클래스
 * 
 * @example
 * ```tsx
 * <Pictures className="custom-gallery" />
 * ```
 */
const Pictures: React.FC<PicturesProps> = ({ className = '' }) => {
  return (
    <div className={`pictures-container ${className}`} data-testid="pictures-container">
      <h1>Pictures Gallery</h1>
      <p>사진 갤러리 페이지입니다.</p>
    </div>
  );
};

export default Pictures;