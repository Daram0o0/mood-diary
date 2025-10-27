'use client';

import { useState } from 'react';

interface DiaryData {
  id: number;
  title: string;
  content: string;
  emotion: string;
  createdAt: string;
}

interface MockDataResponse {
  success: boolean;
  message: string;
  data?: {
    count: number;
    emotionDistribution: Record<string, number>;
    latestDate: string;
    oldestDate: string;
    mockData: DiaryData[];
  };
}

export default function MockDataAdmin() {
  const [count, setCount] = useState(50);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [currentData, setCurrentData] = useState<MockDataResponse['data'] | null>(null);

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const generateMockData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mock-diaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count }),
      });

      const result: MockDataResponse = await response.json();
      
      if (result.success && result.data) {
        // 로컬스토리지에 데이터 저장
        localStorage.setItem('diaries', JSON.stringify(result.data.mockData));
        
        setCurrentData(result.data);
        showMessage(`✅ ${result.data.count}개의 Mock 데이터가 성공적으로 생성되고 로컬스토리지에 저장되었습니다!`, 'success');
      } else {
        showMessage(`❌ ${result.message}`, 'error');
      }
    } catch (error) {
      showMessage(`❌ 데이터 생성 중 오류가 발생했습니다: ${error}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    try {
      localStorage.removeItem('diaries');
      setCurrentData(null);
      showMessage('🗑️ 로컬스토리지의 일기 데이터가 삭제되었습니다.', 'success');
    } catch (error) {
      showMessage(`❌ 데이터 삭제 중 오류가 발생했습니다: ${error}`, 'error');
    }
  };

  const checkData = () => {
    try {
      const stored = localStorage.getItem('diaries');
      if (!stored) {
        showMessage('📭 로컬스토리지에 일기 데이터가 없습니다.', 'error');
        setCurrentData(null);
        return;
      }
      
      const data: DiaryData[] = JSON.parse(stored);
      const emotionCounts: Record<string, number> = {};
      
      data.forEach((diary: DiaryData) => {
        emotionCounts[diary.emotion] = (emotionCounts[diary.emotion] || 0) + 1;
      });
      
      const stats = {
        count: data.length,
        emotionDistribution: emotionCounts,
        latestDate: data[0]?.createdAt,
        oldestDate: data[data.length - 1]?.createdAt,
        mockData: data
      };
      
      setCurrentData(stats);
      showMessage(`📊 현재 ${data.length}개의 일기 데이터가 저장되어 있습니다.`, 'success');
    } catch (error) {
      showMessage(`❌ 데이터 확인 중 오류가 발생했습니다: ${error}`, 'error');
    }
  };

  const emotionLabels: Record<string, string> = {
    'Happy': '행복해요',
    'Sad': '슬퍼요',
    'Angry': '화나요',
    'Surprise': '놀랐어요',
    'Etc': '기타'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            📝 일기 Mock 데이터 관리
          </h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>📋 안내사항:</strong><br />
                  • 이 페이지는 개발 서버에서 Mock 데이터를 생성하고 로컬스토리지에 등록합니다.<br />
                  • 페이지네이션 테스트를 위해 여러 개의 데이터를 생성할 수 있습니다.<br />
                  • 생성된 데이터는 일기 목록 페이지에서 확인할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생성할 데이터 개수
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 50)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={generateMockData}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '🔄 생성 중...' : `🚀 Mock 데이터 생성하기 (${count}개)`}
                </button>
                
                <button
                  onClick={checkData}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  📊 현재 데이터 확인
                </button>
                
                <button
                  onClick={clearData}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                  🗑️ 데이터 삭제
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">📈 데이터 통계</h3>
                {currentData ? (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>총 개수:</strong> {currentData.count}개
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>감정별 분포:</strong>
                    </p>
                    <ul className="text-sm text-gray-600 ml-4">
                      {Object.entries(currentData.emotionDistribution).map(([emotion, count]) => (
                        <li key={emotion}>
                          • {emotionLabels[emotion] || emotion}: {count}개
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>최신 일기:</strong> {new Date(currentData.latestDate).toLocaleDateString('ko-KR')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>가장 오래된 일기:</strong> {new Date(currentData.oldestDate).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-md text-center text-gray-500">
                    데이터를 확인하려면 &quot;현재 데이터 확인&quot; 버튼을 클릭하세요.
                  </div>
                )}
              </div>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-md ${
              messageType === 'success' 
                ? 'bg-green-50 border-l-4 border-green-400 text-green-700' 
                : 'bg-red-50 border-l-4 border-red-400 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">🔗 관련 링크</h3>
            <div className="space-y-2">
              <a 
                href="/diaries" 
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                📋 일기 목록 페이지로 이동
              </a>
              <a 
                href="/diaries/new" 
                className="block text-blue-600 hover:text-blue-800 underline"
              >
                ✍️ 새 일기 작성 페이지로 이동
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
