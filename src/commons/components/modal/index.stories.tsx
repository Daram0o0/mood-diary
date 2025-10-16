import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Modal from './index';

const meta: Meta<typeof Modal> = {
  title: 'Commons/Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Figma 디자인 기반의 재사용 가능한 모달 컴포넌트입니다. variant, actions, theme를 조합하여 다양한 스타일을 지원합니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['info', 'danger'],
      description: '모달 variant 타입 (info: 정보성, danger: 경고성)',
    },
    actions: {
      control: { type: 'select' },
      options: ['single', 'dual'],
      description: '액션 버튼 개수 (single: 확인 버튼 하나, dual: 취소/확인 버튼 두 개)',
    },
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: '테마 (light/dark)',
    },
    title: {
      control: { type: 'text' },
      description: '모달 제목',
    },
    description: {
      control: { type: 'text' },
      description: '모달 내용',
    },
    confirmText: {
      control: { type: 'text' },
      description: '확인 버튼 텍스트',
    },
    cancelText: {
      control: { type: 'text' },
      description: '취소 버튼 텍스트 (dual 액션일 때만 사용)',
    },
    onConfirm: { action: 'confirmed' },
    onCancel: { action: 'cancelled' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 정보성 모달 (Single Action)
 */
export const Default: Story = {
  args: {
    variant: 'info',
    actions: 'single',
    title: '일기 등록 완료',
    description: '등록이 완료 되었습니다.',
    confirmText: '확인',
  },
};

/**
 * 경고성 모달 (Single Action)
 */
export const DangerSingle: Story = {
  args: {
    variant: 'danger',
    actions: 'single',
    title: '일기 삭제',
    description: '정말로 삭제하시겠습니까?',
    confirmText: '삭제',
  },
};

/**
 * 정보성 모달 (Dual Action)
 */
export const InfoDual: Story = {
  args: {
    variant: 'info',
    actions: 'dual',
    title: '일기 수정',
    description: '수정하시겠습니까?',
    confirmText: '수정',
    cancelText: '취소',
  },
};

/**
 * 경고성 모달 (Dual Action)
 */
export const DangerDual: Story = {
  args: {
    variant: 'danger',
    actions: 'dual',
    title: '일기 삭제',
    description: '정말로 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
  },
};

/**
 * 다크 테마 정보성 모달 (Single Action)
 */
export const DarkThemeInfo: Story = {
  args: {
    variant: 'info',
    actions: 'single',
    theme: 'dark',
    title: '일기 등록 완료',
    description: '등록이 완료 되었습니다.',
    confirmText: '확인',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * 다크 테마 경고성 모달 (Dual Action)
 */
export const DarkThemeDanger: Story = {
  args: {
    variant: 'danger',
    actions: 'dual',
    theme: 'dark',
    title: '일기 삭제',
    description: '정말로 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

/**
 * 긴 텍스트 모달
 */
export const LongText: Story = {
  args: {
    variant: 'info',
    actions: 'dual',
    title: '매우 긴 제목이 있는 모달입니다. 이렇게 긴 제목도 잘 표시되는지 확인해보세요.',
    description: '이것은 매우 긴 설명 텍스트입니다. 모달의 텍스트가 길어질 때 어떻게 표시되는지 확인하기 위한 예시입니다. 여러 줄에 걸쳐 표시될 수 있는 텍스트를 포함하고 있습니다.',
    confirmText: '확인',
    cancelText: '취소',
  },
};

/**
 * 커스텀 버튼 텍스트
 */
export const CustomButtonText: Story = {
  args: {
    variant: 'info',
    actions: 'dual',
    title: '커스텀 버튼',
    description: '버튼 텍스트를 커스터마이징한 모달입니다.',
    confirmText: '저장하기',
    cancelText: '나중에',
  },
};

/**
 * 모든 Variant 비교
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <Modal
        variant="info"
        actions="single"
        title="Info Single"
        description="정보성 단일 액션"
        confirmText="확인"
      />
      <Modal
        variant="info"
        actions="dual"
        title="Info Dual"
        description="정보성 이중 액션"
        confirmText="확인"
        cancelText="취소"
      />
      <Modal
        variant="danger"
        actions="single"
        title="Danger Single"
        description="경고성 단일 액션"
        confirmText="삭제"
      />
      <Modal
        variant="danger"
        actions="dual"
        title="Danger Dual"
        description="경고성 이중 액션"
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 variant와 actions 조합을 한 번에 비교할 수 있습니다.',
      },
    },
  },
};

/**
 * 다크 테마 비교
 */
export const DarkThemeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      <Modal
        variant="info"
        actions="dual"
        theme="dark"
        title="Dark Info"
        description="다크 테마 정보성"
        confirmText="확인"
        cancelText="취소"
      />
      <Modal
        variant="danger"
        actions="dual"
        theme="dark"
        title="Dark Danger"
        description="다크 테마 경고성"
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story: '다크 테마에서의 모달 스타일을 비교할 수 있습니다.',
      },
    },
  },
};
