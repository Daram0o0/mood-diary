import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from './index';

const meta = {
  title: 'Commons/Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '버튼 variant 타입',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '버튼 크기',
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
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: '아이콘 위치',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    children: '버튼',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// Primary Variants
export const PrimaryLight: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const PrimaryDark: Story = {
  args: {
    children: 'Primary Button',
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
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
  },
};

export const SecondaryDark: Story = {
  args: {
    children: 'Secondary Button',
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
    children: 'Tertiary Button',
    variant: 'tertiary',
    size: 'medium',
    theme: 'light',
  },
};

export const TertiaryDark: Story = {
  args: {
    children: 'Tertiary Button',
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
    children: 'Small Button',
    variant: 'primary',
    size: 'small',
    theme: 'light',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'primary',
    size: 'large',
    theme: 'light',
  },
};

// With Icons
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

export const WithIconLeft: Story = {
  args: {
    children: 'Add Item',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    icon: <PlusIcon />,
    iconPosition: 'left',
  },
};

export const WithIconRight: Story = {
  args: {
    children: 'Add Item',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    icon: <PlusIcon />,
    iconPosition: 'right',
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
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
    children: 'Disabled Button',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: true,
  },
};

// All Sizes Comparison
export const AllSizes: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Button variant="primary" size="small" theme="light">
        Small Button
      </Button>
      <Button variant="primary" size="medium" theme="light">
        Medium Button
      </Button>
      <Button variant="primary" size="large" theme="light">
        Large Button
      </Button>
    </div>
  ),
};

// All Variants Comparison (Light)
export const AllVariantsLight: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button variant="primary" size="medium" theme="light">
        Primary
      </Button>
      <Button variant="secondary" size="medium" theme="light">
        Secondary
      </Button>
      <Button variant="tertiary" size="medium" theme="light">
        Tertiary
      </Button>
    </div>
  ),
};

// All Variants Comparison (Dark)
export const AllVariantsDark: Story = {
  args: {
    children: 'Button',
  },
  render: () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <Button variant="primary" size="medium" theme="dark">
        Primary
      </Button>
      <Button variant="secondary" size="medium" theme="dark">
        Secondary
      </Button>
      <Button variant="tertiary" size="medium" theme="dark">
        Tertiary
      </Button>
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

