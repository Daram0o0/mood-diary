import React from 'react';
import DiariesDetail from '@/components/diaries-detail';

interface DiariesDetailPageProps {
  params: {
    id: string;
  };
}

const DiariesDetailPage: React.FC<DiariesDetailPageProps> = () => {
  return <DiariesDetail />;
};

export default DiariesDetailPage;
