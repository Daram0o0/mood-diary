'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';
import { urlPaths } from '@/commons/constants/url';

/**
 * 로그인 폼 스키마
 */
const loginSchema = z.object({
  email: z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

/**
 * 로그인 폼 데이터 타입
 */
export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * 로그인 API 응답 타입
 */
interface LoginResponse {
  accessToken: string;
}

/**
 * 사용자 정보 API 응답 타입
 */
interface UserResponse {
  _id: string;
  name: string;
}

/**
 * 로그인 API 함수
 */
const loginUser = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation LoginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            accessToken
          }
        }
      `,
      variables: {
        email: data.email,
        password: data.password,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('로그인에 실패했습니다');
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message || '로그인에 실패했습니다');
  }

  return result.data.loginUser;
};

/**
 * 사용자 정보 조회 API 함수
 */
const fetchUserLoggedIn = async (accessToken: string): Promise<UserResponse> => {
  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `
        query FetchUserLoggedIn {
          fetchUserLoggedIn {
            _id
            name
          }
        }
      `,
    }),
  });

  if (!response.ok) {
    throw new Error('사용자 정보 조회에 실패했습니다');
  }

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message || '사용자 정보 조회에 실패했습니다');
  }

  return result.data.fetchUserLoggedIn;
};

/**
 * 로그인 폼 훅
 * 
 * react-hook-form, zod, react-query를 사용하여 로그인 폼을 관리합니다.
 * 폼 검증, API 호출, 에러 처리, 모달 표시, 페이지 이동을 담당합니다.
 * 
 * @returns 로그인 폼 관련 상태와 함수들
 */
export const useLoginForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();

  // 폼 설정
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // 로그인 API 뮤테이션
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      try {
        // 사용자 정보 조회
        const userData = await fetchUserLoggedIn(data.accessToken);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 로그인 완료 모달 표시
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="로그인 완료"
            description="로그인이 완료되었습니다."
            confirmText="확인"
            onConfirm={() => {
              closeAllModals();
              router.push(urlPaths.diariesList);
            }}
          />
        );
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        // 사용자 정보 조회 실패 시에도 로그인은 성공으로 처리
        localStorage.setItem('accessToken', data.accessToken);
        
        openModal(
          <Modal
            variant="info"
            actions="single"
            title="로그인 완료"
            description="로그인이 완료되었습니다."
            confirmText="확인"
            onConfirm={() => {
              closeAllModals();
              router.push(urlPaths.diariesList);
            }}
          />
        );
      }
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      
      // 로그인 실패 모달 표시
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="로그인 실패"
          description="이메일 또는 비밀번호가 올바르지 않습니다."
          confirmText="확인"
          onConfirm={() => {
            closeAllModals();
          }}
        />
      );
    },
  });

  // 폼 제출 핸들러
  const handleSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  // Enter 키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // 폼 상태
  const isSubmitting = loginMutation.isPending;
  const isFormValid = form.formState.isValid;

  return {
    form,
    handleSubmit,
    handleKeyDown,
    isSubmitting,
    isFormValid,
    errors: form.formState.errors,
  };
};