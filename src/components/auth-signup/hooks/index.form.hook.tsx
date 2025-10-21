'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useModal } from '@/commons/providers/modal/modal.provider';
import Modal from '@/commons/components/modal';
import { urlPaths } from '@/commons/constants/url';

/**
 * 회원가입 폼 데이터 타입
 */
export interface SignupFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
}

/**
 * 회원가입 API 응답 타입
 */
export interface CreateUserResponse {
  _id: string;
}

/**
 * 회원가입 폼 검증 스키마
 */
const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식이 아닙니다')
    .refine((email) => email.includes('@'), '이메일에는 @가 포함되어야 합니다'),
  password: z
    .string()
    .min(8, '비밀번호는 8자리 이상이어야 합니다')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, '비밀번호는 영문과 숫자를 포함해야 합니다'),
  passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .min(1, '이름은 최소 1글자 이상이어야 합니다'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
});

/**
 * 회원가입 API 호출 함수
 * 
 * GraphQL API를 통해 사용자 회원가입을 처리합니다.
 * 
 * @param {Omit<SignupFormData, 'passwordConfirm'>} input - 회원가입 입력 데이터
 * @param {string} input.email - 사용자 이메일
 * @param {string} input.password - 사용자 비밀번호
 * @param {string} input.name - 사용자 이름
 * @returns {Promise<CreateUserResponse>} 회원가입 결과 (_id 포함)
 * @throws {Error} API 호출 실패 시 에러 발생
 * 
 * @example
 * ```typescript
 * const result = await createUser({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   name: '홍길동'
 * });
 * console.log(result._id); // 생성된 사용자 ID
 * ```
 */
const createUser = async (input: Omit<SignupFormData, 'passwordConfirm'>): Promise<CreateUserResponse> => {
  const response = await fetch('https://main-practice.codebootcamp.co.kr/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation CreateUser($createUserInput: CreateUserInput!) {
          createUser(createUserInput: $createUserInput) {
            _id
          }
        }
      `,
      variables: {
        createUserInput: {
          email: input.email,
          password: input.password,
          name: input.name,
        },
      },
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.createUser;
};

/**
 * 회원가입 폼 훅
 * 
 * react-hook-form, zod, react-query를 사용하여 회원가입 폼을 관리합니다.
 * 폼 검증, API 호출, 모달 표시, 페이지 이동을 처리합니다.
 * 
 * @returns 회원가입 폼 관련 상태와 함수들
 */
export const useSignupForm = () => {
  const router = useRouter();
  const { openModal, closeAllModals } = useModal();

  // 폼 설정
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
      name: '',
    },
    mode: 'onChange',
  });

  // 회원가입 API 뮤테이션
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // 성공 모달 표시
      openModal(
        <Modal
          variant="info"
          actions="single"
          title="회원가입 완료"
          description="회원가입이 성공적으로 완료되었습니다."
          confirmText="확인"
          onConfirm={() => {
            closeAllModals();
            router.push(urlPaths.authLogin);
          }}
        />
      );
    },
    onError: (error) => {
      // 실패 모달 표시
      openModal(
        <Modal
          variant="danger"
          actions="single"
          title="회원가입 실패"
          description={error.message || '회원가입에 실패했습니다. 다시 시도해주세요.'}
          confirmText="확인"
          onConfirm={() => {
            closeAllModals();
          }}
        />
      );
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (data: SignupFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordConfirm, ...userData } = data;
    createUserMutation.mutate(userData);
  };

  // 모든 필드가 입력되었는지 확인
  const isFormValid = form.formState.isValid && 
    form.watch('email') && 
    form.watch('password') && 
    form.watch('passwordConfirm') && 
    form.watch('name');

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: createUserMutation.isPending,
    isFormValid,
    errors: form.formState.errors,
  };
};
