import React from 'react';
import DiariesDetail from '@/components/diaries-detail';

interface DiariesDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * 일기 상세 페이지
 * 
 * 다이나믹 라우팅된 [id]를 추출하여 DiariesDetail 컴포넌트에 전달합니다.
 * 
 * @param {DiariesDetailPageProps} props - 페이지 props
 * @param {string} props.params.id - 일기 ID
 */
const DiariesDetailPage: React.FC<DiariesDetailPageProps> = ({ params }) => {
  return <DiariesDetail diaryId={params.id} />;
};

export default DiariesDetailPage;
