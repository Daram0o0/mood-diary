import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Selectbox from './index';

const meta = {
  title: 'Commons/Components/Selectbox',
  component: Selectbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Selectbox variant 타입',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Selectbox 크기',
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
} satisfies Meta<typeof Selectbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 옵션 데이터
const defaultOptions = [
  { value: 'all', label: '전체' },
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
];

const categoryOptions = [
  { value: 'all', label: '전체 카테고리' },
  { value: 'tech', label: '기술' },
  { value: 'design', label: '디자인' },
  { value: 'business', label: '비즈니스' },
  { value: 'marketing', label: '마케팅' },
];

const fruitOptions = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'orange', label: '오렌지' },
  { value: 'grape', label: '포도' },
  { value: 'watermelon', label: '수박' },
];

const optionsWithDisabled = [
  { value: 'all', label: '전체' },
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2 (비활성)', disabled: true },
  { value: 'option3', label: '옵션 3' },
  { value: 'option4', label: '옵션 4 (비활성)', disabled: true },
];

// 기본 스토리
export const Default: Story = {
  args: {
    options: defaultOptions,
    placeholder: '선택하세요',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// Primary Variants
export const PrimaryLight: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Primary Selectbox',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const PrimaryDark: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Primary Selectbox',
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
    options: defaultOptions,
    placeholder: 'Secondary Selectbox',
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
  },
};

export const SecondaryDark: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Secondary Selectbox',
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
    options: defaultOptions,
    placeholder: 'Tertiary Selectbox',
    variant: 'tertiary',
    size: 'medium',
    theme: 'light',
  },
};

export const TertiaryDark: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Tertiary Selectbox',
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
    options: defaultOptions,
    placeholder: 'Small Selectbox',
    variant: 'primary',
    size: 'small',
    theme: 'light',
  },
};

export const Medium: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Medium Selectbox',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const Large: Story = {
  args: {
    options: defaultOptions,
    placeholder: 'Large Selectbox',
    variant: 'primary',
    size: 'large',
    theme: 'light',
  },
};

// With Label
export const WithLabel: Story = {
  args: {
    label: '카테고리',
    options: categoryOptions,
    placeholder: '카테고리를 선택하세요',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// With Default Value
export const WithDefaultValue: Story = {
  args: {
    label: '과일 선택',
    options: fruitOptions,
    value: 'apple',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// With Disabled Options
export const WithDisabledOptions: Story = {
  args: {
    label: '옵션 선택',
    options: optionsWithDisabled,
    placeholder: '옵션을 선택하세요',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// Error State
export const ErrorState: Story = {
  args: {
    label: '필수 선택',
    options: defaultOptions,
    placeholder: '선택하세요',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    error: true,
    errorMessage: '항목을 선택해주세요.',
  },
};

export const ErrorStateSecondary: Story = {
  args: {
    label: '카테고리',
    options: categoryOptions,
    placeholder: '카테고리를 선택하세요',
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
    error: true,
    errorMessage: '카테고리는 필수 선택 항목입니다.',
  },
};

export const ErrorStateDark: Story = {
  args: {
    label: '필수 선택',
    options: defaultOptions,
    placeholder: '선택하세요',
    variant: 'primary',
    size: 'medium',
    theme: 'dark',
    error: true,
    errorMessage: '항목을 선택해주세요.',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    label: '전체 너비 선택',
    options: defaultOptions,
    placeholder: '전체 너비 선택 필드',
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
    options: defaultOptions,
    placeholder: 'Disabled Selectbox',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    options: fruitOptions,
    value: 'apple',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: true,
  },
};

// All Sizes Comparison
export const AllSizes: Story = {
  args: {
    options: defaultOptions,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Selectbox 
        variant="primary" 
        size="small" 
        theme="light" 
        options={defaultOptions} 
        placeholder="Small Selectbox" 
      />
      <Selectbox 
        variant="primary" 
        size="medium" 
        theme="light" 
        options={defaultOptions} 
        placeholder="Medium Selectbox" 
      />
      <Selectbox 
        variant="primary" 
        size="large" 
        theme="light" 
        options={defaultOptions} 
        placeholder="Large Selectbox" 
      />
    </div>
  ),
};

// All Variants Comparison (Light)
export const AllVariantsLight: Story = {
  args: {
    options: defaultOptions,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Selectbox 
        variant="primary" 
        size="medium" 
        theme="light" 
        options={defaultOptions} 
        placeholder="Primary Selectbox" 
      />
      <Selectbox 
        variant="secondary" 
        size="medium" 
        theme="light" 
        options={defaultOptions} 
        placeholder="Secondary Selectbox" 
      />
      <Selectbox 
        variant="tertiary" 
        size="medium" 
        theme="light" 
        options={defaultOptions} 
        placeholder="Tertiary Selectbox" 
      />
    </div>
  ),
};

// All Variants Comparison (Dark)
export const AllVariantsDark: Story = {
  args: {
    options: defaultOptions,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Selectbox 
        variant="primary" 
        size="medium" 
        theme="dark" 
        options={defaultOptions} 
        placeholder="Primary Selectbox" 
      />
      <Selectbox 
        variant="secondary" 
        size="medium" 
        theme="dark" 
        options={defaultOptions} 
        placeholder="Secondary Selectbox" 
      />
      <Selectbox 
        variant="tertiary" 
        size="medium" 
        theme="dark" 
        options={defaultOptions} 
        placeholder="Tertiary Selectbox" 
      />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Form Example
export const FormExample: Story = {
  args: {
    options: defaultOptions,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
      <Selectbox
        label="카테고리"
        options={categoryOptions}
        placeholder="카테고리를 선택하세요"
        variant="primary"
        size="medium"
        theme="light"
      />
      <Selectbox
        label="과일"
        options={fruitOptions}
        value="apple"
        variant="secondary"
        size="medium"
        theme="light"
      />
      <Selectbox
        label="필수 선택"
        options={defaultOptions}
        placeholder="선택하세요"
        variant="primary"
        size="medium"
        theme="light"
        error={true}
        errorMessage="항목을 선택해주세요."
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Many Options (Scrollable)
export const ManyOptions: Story = {
  args: {
    label: '국가 선택',
    options: [
      { value: 'kr', label: '대한민국' },
      { value: 'us', label: '미국' },
      { value: 'jp', label: '일본' },
      { value: 'cn', label: '중국' },
      { value: 'uk', label: '영국' },
      { value: 'fr', label: '프랑스' },
      { value: 'de', label: '독일' },
      { value: 'it', label: '이탈리아' },
      { value: 'es', label: '스페인' },
      { value: 'ca', label: '캐나다' },
      { value: 'au', label: '호주' },
      { value: 'br', label: '브라질' },
    ],
    placeholder: '국가를 선택하세요',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

