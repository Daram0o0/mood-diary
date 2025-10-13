import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Toggle from './index';

const meta = {
  title: 'Commons/Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: '토글 variant 타입',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '토글 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '테마 (light/dark)',
    },
    checked: {
      control: 'boolean',
      description: '체크 상태',
    },
    defaultChecked: {
      control: 'boolean',
      description: '기본 체크 상태 (비제어 컴포넌트용)',
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
    },
    label: {
      control: 'text',
      description: '레이블',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: '레이블 위치',
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    defaultChecked: false,
  },
};

// Primary Variants
export const PrimaryLight: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    defaultChecked: true,
  },
};

export const PrimaryDark: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'dark',
    defaultChecked: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Secondary Variants
export const SecondaryLight: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
    defaultChecked: true,
  },
};

export const SecondaryDark: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    theme: 'dark',
    defaultChecked: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Tertiary Variants
export const TertiaryLight: Story = {
  args: {
    variant: 'tertiary',
    size: 'medium',
    theme: 'light',
    defaultChecked: true,
  },
};

export const TertiaryDark: Story = {
  args: {
    variant: 'tertiary',
    size: 'medium',
    theme: 'dark',
    defaultChecked: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Size Variants
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    theme: 'light',
    defaultChecked: true,
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    defaultChecked: true,
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    theme: 'light',
    defaultChecked: true,
  },
};

// With Label
export const WithLabelRight: Story = {
  args: {
    label: '알림 받기',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    labelPosition: 'right',
    defaultChecked: true,
  },
};

export const WithLabelLeft: Story = {
  args: {
    label: '알림 받기',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    labelPosition: 'left',
    defaultChecked: true,
  },
};

// Checked/Unchecked States
export const Checked: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    defaultChecked: true,
  },
};

export const Unchecked: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    defaultChecked: false,
  },
};

// Disabled States
export const DisabledChecked: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    defaultChecked: true,
    disabled: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    defaultChecked: false,
    disabled: true,
  },
};

export const DisabledWithLabel: Story = {
  args: {
    label: '알림 받기',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    labelPosition: 'right',
    defaultChecked: true,
    disabled: true,
  },
};

// All Sizes Comparison
export const AllSizes: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Toggle variant="primary" size="small" theme="light" defaultChecked={true} label="Small" />
      <Toggle variant="primary" size="medium" theme="light" defaultChecked={true} label="Medium" />
      <Toggle variant="primary" size="large" theme="light" defaultChecked={true} label="Large" />
    </div>
  ),
};

// All Variants Comparison (Light)
export const AllVariantsLight: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Toggle variant="primary" size="medium" theme="light" defaultChecked={true} label="Primary" />
      <Toggle variant="secondary" size="medium" theme="light" defaultChecked={true} label="Secondary" />
      <Toggle variant="tertiary" size="medium" theme="light" defaultChecked={true} label="Tertiary" />
    </div>
  ),
};

// All Variants Comparison (Dark)
export const AllVariantsDark: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Toggle variant="primary" size="medium" theme="dark" defaultChecked={true} label="Primary" />
      <Toggle variant="secondary" size="medium" theme="dark" defaultChecked={true} label="Secondary" />
      <Toggle variant="tertiary" size="medium" theme="dark" defaultChecked={true} label="Tertiary" />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// Interactive Example
export const InteractiveExample: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>설정</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Toggle
          label="이메일 알림 받기"
          variant="primary"
          size="medium"
          theme="light"
          labelPosition="right"
          defaultChecked={true}
        />
        <Toggle
          label="푸시 알림 받기"
          variant="primary"
          size="medium"
          theme="light"
          labelPosition="right"
          defaultChecked={false}
        />
        <Toggle
          label="마케팅 정보 수신"
          variant="secondary"
          size="medium"
          theme="light"
          labelPosition="right"
          defaultChecked={false}
        />
        <Toggle
          label="자동 로그인"
          variant="tertiary"
          size="medium"
          theme="light"
          labelPosition="right"
          defaultChecked={true}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// State Comparison
export const StateComparison: Story = {
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Checked States</h4>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Toggle variant="primary" size="medium" theme="light" defaultChecked={true} label="Primary" />
          <Toggle variant="secondary" size="medium" theme="light" defaultChecked={true} label="Secondary" />
          <Toggle variant="tertiary" size="medium" theme="light" defaultChecked={true} label="Tertiary" />
        </div>
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Unchecked States</h4>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Toggle variant="primary" size="medium" theme="light" defaultChecked={false} label="Primary" />
          <Toggle variant="secondary" size="medium" theme="light" defaultChecked={false} label="Secondary" />
          <Toggle variant="tertiary" size="medium" theme="light" defaultChecked={false} label="Tertiary" />
        </div>
      </div>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600 }}>Disabled States</h4>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Toggle variant="primary" size="medium" theme="light" defaultChecked={true} disabled label="Checked" />
          <Toggle variant="primary" size="medium" theme="light" defaultChecked={false} disabled label="Unchecked" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

