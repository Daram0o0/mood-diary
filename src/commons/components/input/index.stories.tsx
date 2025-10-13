import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Input from './index';

const meta = {
  title: 'Commons/Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Input variant 타입',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Input 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '테마 (light/dark)',
    },
    fullWidth: {
      control: 'boolean',
      description: '전체 너비 사용 여부',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    error: {
      control: 'boolean',
      description: '에러 상태',
    },
    errorMessage: {
      control: 'text',
      description: '에러 메시지',
    },
    label: {
      control: 'text',
      description: '레이블',
    },
    placeholder: {
      control: 'text',
      description: 'placeholder 텍스트',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    placeholder: '회고를 남겨보세요.',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// Primary Variants
export const PrimaryLight: Story = {
  args: {
    placeholder: 'Primary Input',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const PrimaryDark: Story = {
  args: {
    placeholder: 'Primary Input',
    variant: 'primary',
    size: 'medium',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Secondary Variants
export const SecondaryLight: Story = {
  args: {
    placeholder: 'Secondary Input',
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
  },
};

export const SecondaryDark: Story = {
  args: {
    placeholder: 'Secondary Input',
    variant: 'secondary',
    size: 'medium',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Tertiary Variants
export const TertiaryLight: Story = {
  args: {
    placeholder: 'Tertiary Input',
    variant: 'tertiary',
    size: 'medium',
    theme: 'light',
  },
};

export const TertiaryDark: Story = {
  args: {
    placeholder: 'Tertiary Input',
    variant: 'tertiary',
    size: 'medium',
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Size Variants
export const Small: Story = {
  args: {
    placeholder: 'Small Input',
    variant: 'primary',
    size: 'small',
    theme: 'light',
  },
};

export const Medium: Story = {
  args: {
    placeholder: 'Medium Input',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large Input',
    variant: 'primary',
    size: 'large',
    theme: 'light',
  },
};

// With Label
export const WithLabel: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력해주세요.',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};


// Error State
export const ErrorState: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력해주세요.',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    error: true,
    errorMessage: '올바른 이메일 형식이 아닙니다.',
  },
};

export const ErrorStateSecondary: Story = {
  args: {
    label: '비밀번호',
    placeholder: '비밀번호를 입력해주세요.',
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
    error: true,
    errorMessage: '비밀번호는 8자 이상이어야 합니다.',
  },
};

export const ErrorStateDark: Story = {
  args: {
    label: '이메일',
    placeholder: '이메일을 입력해주세요.',
    variant: 'primary',
    size: 'medium',
    theme: 'dark',
    error: true,
    errorMessage: '올바른 이메일 형식이 아닙니다.',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    label: '전체 너비 입력',
    placeholder: '전체 너비 입력 필드',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    placeholder: 'Disabled Input',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    value: 'Disabled Input with Value',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: true,
  },
};

// All Sizes Comparison
export const AllSizes: Story = {
  args: {
    placeholder: 'Input',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Input variant="primary" size="small" theme="light" placeholder="Small Input" />
      <Input variant="primary" size="medium" theme="light" placeholder="Medium Input" />
      <Input variant="primary" size="large" theme="light" placeholder="Large Input" />
    </div>
  ),
};

// All Variants Comparison (Light)
export const AllVariantsLight: Story = {
  args: {
    placeholder: 'Input',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input variant="primary" size="medium" theme="light" placeholder="Primary Input" />
      <Input variant="secondary" size="medium" theme="light" placeholder="Secondary Input" />
      <Input variant="tertiary" size="medium" theme="light" placeholder="Tertiary Input" />
    </div>
  ),
};

// All Variants Comparison (Dark)
export const AllVariantsDark: Story = {
  args: {
    placeholder: 'Input',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input variant="primary" size="medium" theme="dark" placeholder="Primary Input" />
      <Input variant="secondary" size="medium" theme="dark" placeholder="Secondary Input" />
      <Input variant="tertiary" size="medium" theme="dark" placeholder="Tertiary Input" />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Form Example
export const FormExample: Story = {
  args: {
    placeholder: 'Input',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
      <Input
        label="이름"
        placeholder="이름을 입력해주세요."
        variant="primary"
        size="medium"
        theme="light"
      />
      <Input
        label="이메일"
        placeholder="이메일을 입력해주세요."
        variant="primary"
        size="medium"
        theme="light"
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력해주세요."
        variant="secondary"
        size="medium"
        theme="light"
        error={true}
        errorMessage="비밀번호는 8자 이상이어야 합니다."
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

