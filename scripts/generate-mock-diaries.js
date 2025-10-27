#!/usr/bin/env node

/**
 * 일기 Mock 데이터 생성 및 로컬스토리지 등록 스크립트
 * 페이지네이션 테스트를 위해 여러 개의 일기 데이터를 생성합니다.
 */

const fs = require('fs');
const path = require('path');

// EmotionType 정의
const EMOTION_TYPES = ['Happy', 'Sad', 'Angry', 'Surprise', 'Etc'];

// Mock 데이터 생성 함수
function generateMockDiaries(count = 50) {
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
    
    // 과거 날짜로 생성 (최근부터 과거로)
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
  return diaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// HTML 파일 생성 함수
function generateHTMLFile(diaries) {
  const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>일기 Mock 데이터 등록</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border-left: 4px solid #2196f3;
        }
        button {
            background: #2196f3;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 5px;
            transition: background-color 0.3s;
        }
        button:hover {
            background: #1976d2;
        }
        button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .success {
            background: #e8f5e8;
            color: #2e7d32;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #4caf50;
            display: none;
        }
        .error {
            background: #ffebee;
            color: #c62828;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #f44336;
            display: none;
        }
        .stats {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .stats h3 {
            margin-top: 0;
            color: #495057;
        }
        .stats p {
            margin: 5px 0;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📝 일기 Mock 데이터 등록</h1>
        
        <div class="info">
            <strong>📋 안내사항:</strong><br>
            • 이 페이지는 페이지네이션 테스트를 위한 Mock 데이터를 로컬스토리지에 등록합니다.<br>
            • 브라우저의 개발자 도구에서 로컬스토리지의 'diaries' 키를 확인할 수 있습니다.<br>
            • 데이터는 최신순으로 정렬되어 저장됩니다.
        </div>
        
        <div style="text-align: center;">
            <button onclick="registerMockData()" id="registerBtn">
                🚀 Mock 데이터 등록하기 (${diaries.length}개)
            </button>
            <button onclick="clearData()" id="clearBtn">
                🗑️ 기존 데이터 삭제
            </button>
            <button onclick="checkData()" id="checkBtn">
                📊 데이터 확인
            </button>
        </div>
        
        <div id="success" class="success"></div>
        <div id="error" class="error"></div>
        
        <div id="stats" class="stats" style="display: none;">
            <h3>📈 데이터 통계</h3>
            <p id="statsContent"></p>
        </div>
    </div>

    <script>
        const mockData = ${JSON.stringify(diaries, null, 2)};
        
        function showMessage(message, isError = false) {
            const successDiv = document.getElementById('success');
            const errorDiv = document.getElementById('error');
            
            if (isError) {
                successDiv.style.display = 'none';
                errorDiv.style.display = 'block';
                errorDiv.textContent = message;
            } else {
                errorDiv.style.display = 'none';
                successDiv.style.display = 'block';
                successDiv.textContent = message;
            }
        }
        
        function registerMockData() {
            try {
                localStorage.setItem('diaries', JSON.stringify(mockData));
                showMessage(\`✅ 성공적으로 \${mockData.length}개의 일기 데이터가 등록되었습니다!\`);
                updateStats();
            } catch (error) {
                showMessage(\`❌ 데이터 등록 중 오류가 발생했습니다: \${error.message}\`, true);
            }
        }
        
        function clearData() {
            try {
                localStorage.removeItem('diaries');
                showMessage('🗑️ 기존 일기 데이터가 삭제되었습니다.');
                document.getElementById('stats').style.display = 'none';
            } catch (error) {
                showMessage(\`❌ 데이터 삭제 중 오류가 발생했습니다: \${error.message}\`, true);
            }
        }
        
        function checkData() {
            try {
                const stored = localStorage.getItem('diaries');
                if (!stored) {
                    showMessage('📭 로컬스토리지에 일기 데이터가 없습니다.', true);
                    return;
                }
                
                const data = JSON.parse(stored);
                showMessage(\`📊 현재 \${data.length}개의 일기 데이터가 저장되어 있습니다.\`);
                updateStats();
            } catch (error) {
                showMessage(\`❌ 데이터 확인 중 오류가 발생했습니다: \${error.message}\`, true);
            }
        }
        
        function updateStats() {
            try {
                const stored = localStorage.getItem('diaries');
                if (!stored) return;
                
                const data = JSON.parse(stored);
                const emotionCounts = {};
                
                data.forEach(diary => {
                    emotionCounts[diary.emotion] = (emotionCounts[diary.emotion] || 0) + 1;
                });
                
                const emotionLabels = {
                    'Happy': '행복해요',
                    'Sad': '슬퍼요',
                    'Angry': '화나요',
                    'Surprise': '놀랐어요',
                    'Etc': '기타'
                };
                
                let statsContent = \`총 \${data.length}개의 일기<br>\`;
                statsContent += '감정별 분포:<br>';
                
                Object.entries(emotionCounts).forEach(([emotion, count]) => {
                    const label = emotionLabels[emotion] || emotion;
                    statsContent += \`• \${label}: \${count}개<br>\`;
                });
                
                const latestDate = new Date(data[0]?.createdAt || '');
                const oldestDate = new Date(data[data.length - 1]?.createdAt || '');
                
                statsContent += \`<br>최신 일기: \${latestDate.toLocaleDateString('ko-KR')}<br>\`;
                statsContent += \`가장 오래된 일기: \${oldestDate.toLocaleDateString('ko-KR')}\`;
                
                document.getElementById('statsContent').innerHTML = statsContent;
                document.getElementById('stats').style.display = 'block';
            } catch (error) {
                console.error('통계 업데이트 오류:', error);
            }
        }
        
        // 페이지 로드 시 기존 데이터 확인
        window.onload = function() {
            checkData();
        };
    </script>
</body>
</html>`;

  return htmlContent;
}

// 메인 실행 함수
function main() {
  const args = process.argv.slice(2);
  const count = args[0] ? parseInt(args[0]) : 50;
  
  if (isNaN(count) || count < 1) {
    console.error('❌ 잘못된 개수입니다. 1 이상의 숫자를 입력해주세요.');
    process.exit(1);
  }
  
  console.log(`🚀 ${count}개의 일기 Mock 데이터를 생성합니다...`);
  
  // Mock 데이터 생성
  const diaries = generateMockDiaries(count);
  
  // HTML 파일 생성
  const htmlContent = generateHTMLFile(diaries);
  
  // scripts 디렉토리 생성 (없는 경우)
  const scriptsDir = path.join(process.cwd(), 'scripts');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }
  
  // HTML 파일 저장
  const htmlPath = path.join(scriptsDir, 'mock-diaries.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');
  
  // JSON 파일도 저장 (참고용)
  const jsonPath = path.join(scriptsDir, 'mock-diaries.json');
  fs.writeFileSync(jsonPath, JSON.stringify(diaries, null, 2), 'utf8');
  
  console.log(`✅ Mock 데이터 생성 완료!`);
  console.log(`📁 HTML 파일: ${htmlPath}`);
  console.log(`📁 JSON 파일: ${jsonPath}`);
  console.log(`\n📋 생성된 데이터 정보:`);
  console.log(`   • 총 개수: ${diaries.length}개`);
  console.log(`   • 최신 일기: ${new Date(diaries[0].createdAt).toLocaleDateString('ko-KR')}`);
  console.log(`   • 가장 오래된 일기: ${new Date(diaries[diaries.length - 1].createdAt).toLocaleDateString('ko-KR')}`);
  
  // 감정별 분포 출력
  const emotionCounts = {};
  diaries.forEach(diary => {
    emotionCounts[diary.emotion] = (emotionCounts[diary.emotion] || 0) + 1;
  });
  
  console.log(`\n🎭 감정별 분포:`);
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    console.log(`   • ${emotion}: ${count}개`);
  });
  
  console.log(`\n🌐 사용 방법:`);
  console.log(`   1. 브라우저에서 ${htmlPath} 파일을 열기`);
  console.log(`   2. "Mock 데이터 등록하기" 버튼 클릭`);
  console.log(`   3. 개발자 도구에서 로컬스토리지 확인`);
  console.log(`   4. 일기 목록 페이지에서 페이지네이션 테스트`);
}

// 스크립트 실행
if (require.main === module) {
  main();
}

module.exports = { generateMockDiaries, generateHTMLFile };
