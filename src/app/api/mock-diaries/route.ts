import { NextRequest, NextResponse } from 'next/server';
import { EmotionType } from '@/commons/constants/enum';

// EmotionType 정의
const EMOTION_TYPES: EmotionType[] = ['Happy', 'Sad', 'Angry', 'Surprise', 'Etc'];

// Mock 데이터 생성 함수
function generateMockDiaries(count: number) {
  const diaries = [];
  const titles = [
    '오늘의 하루',
    '기분 좋은 하루',
    '힘든 하루',
    '새로운 경험',
    '친구와의 만남',
    '가족과의 시간',
    '일상의 소소한 행복',
    '도전적인 하루',
    '평화로운 하루',
    '바쁜 하루',
    '여유로운 하루',
    '특별한 하루',
    '평범한 하루',
    '감동적인 하루',
    '재미있는 하루',
    '피곤한 하루',
    '즐거운 하루',
    '우울한 하루',
    '신나는 하루',
    '조용한 하루'
  ];

  const contents = [
    '오늘은 정말 특별한 하루였어요. 새로운 경험을 하게 되어서 기분이 좋았습니다.',
    '친구들과 함께 시간을 보내며 많은 이야기를 나누었어요. 정말 즐거웠습니다.',
    '가족과 함께 맛있는 음식을 먹으며 소중한 시간을 보냈습니다.',
    '오늘은 조금 힘들었지만, 끝까지 포기하지 않고 해냈어요.',
    '새로운 취미를 시작하게 되어서 기대가 됩니다.',
    '오랜만에 휴식을 취하며 마음의 평화를 찾았습니다.',
    '오늘은 정말 바빴지만, 많은 일을 성공적으로 마무리했습니다.',
    '예상치 못한 일이 있었지만, 잘 해결할 수 있었어요.',
    '오늘은 조금 우울했지만, 좋은 음악을 들으며 위로를 받았습니다.',
    '새로운 사람을 만나서 좋은 인상을 받았어요.',
    '오늘은 정말 감동적인 하루였습니다. 눈물이 났어요.',
    '오랜만에 운동을 하니 몸이 가벼워진 것 같아요.',
    '맛있는 음식을 먹으며 하루를 마무리했습니다.',
    '오늘은 조금 피곤했지만, 보람 있는 하루였어요.',
    '새로운 책을 읽으며 많은 것을 배웠습니다.',
    '오늘은 정말 재미있는 하루였어요. 웃음이 끊이지 않았습니다.',
    '조용한 카페에서 혼자만의 시간을 보내며 생각을 정리했습니다.',
    '오늘은 조금 화가 났지만, 곧 마음을 다잡을 수 있었어요.',
    '새로운 영화를 보며 즐거운 시간을 보냈습니다.',
    '오늘은 정말 놀라운 하루였어요. 예상치 못한 일이 많았습니다.'
  ];

  // 현재 날짜부터 시작해서 과거로 거슬러 올라가며 생성
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomContent = contents[Math.floor(Math.random() * contents.length)];
    const randomEmotion = EMOTION_TYPES[Math.floor(Math.random() * EMOTION_TYPES.length)];
    
    // 과거 날짜로 생성 (최근 1년 내)
    const daysAgo = Math.floor(Math.random() * 365); // 최근 1년 내
    const createdAt = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    const diary = {
      id: i + 1,
      title: `${randomTitle} ${i + 1}`,
      content: randomContent,
      emotion: randomEmotion,
      createdAt: createdAt.toISOString()
    };
    
    diaries.push(diary);
  }
  
  // 최신순으로 정렬 (createdAt 기준 내림차순)
  return diaries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// GET 요청: 현재 저장된 데이터 조회
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Mock 데이터 API가 정상적으로 작동합니다.',
      endpoints: {
        'POST /api/mock-diaries': 'Mock 데이터 생성 및 등록',
        'GET /api/mock-diaries': '현재 API 상태 확인',
        'DELETE /api/mock-diaries': '저장된 데이터 삭제'
      }
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'API 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST 요청: Mock 데이터 생성 및 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const count = body.count || 50;
    
    if (count < 1 || count > 1000) {
      return NextResponse.json(
        { success: false, message: '개수는 1개 이상 1000개 이하여야 합니다.' },
        { status: 400 }
      );
    }
    
    // Mock 데이터 생성
    const mockData = generateMockDiaries(count);
    
    // 감정별 분포 계산
    const emotionCounts: Record<string, number> = {};
    mockData.forEach(diary => {
      emotionCounts[diary.emotion] = (emotionCounts[diary.emotion] || 0) + 1;
    });
    
    return NextResponse.json({
      success: true,
      message: `${count}개의 Mock 데이터가 생성되었습니다.`,
      data: {
        count: mockData.length,
        emotionDistribution: emotionCounts,
        latestDate: mockData[0]?.createdAt,
        oldestDate: mockData[mockData.length - 1]?.createdAt,
        mockData: mockData
      }
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Mock 데이터 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE 요청: 저장된 데이터 삭제 (클라이언트에서 처리)
export async function DELETE() {
  try {
    return NextResponse.json({
      success: true,
      message: '데이터 삭제는 클라이언트 측에서 localStorage.removeItem("diaries")로 처리해주세요.'
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'API 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
