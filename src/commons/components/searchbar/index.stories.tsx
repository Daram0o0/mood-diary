import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Searchbar from './index';

const meta = {
  title: 'Commons/Components/Searchbar',
  component: Searchbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Searchbar variant 타입',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Searchbar 크기',
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
    showSearchIcon: {
      control: 'boolean',
      description: '검색 아이콘 표시 여부',
    },
    placeholder: {
      control: 'text',
      description: 'placeholder 텍스트',
    },
  },
} satisfies Meta<typeof Searchbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    placeholder: '검색어를 입력해 주세요.',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// Primary Variants
export const PrimaryLight: Story = {
  args: {
    placeholder: '검색어를 입력해 주세요.',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const PrimaryDark: Story = {
  args: {
    placeholder: '검색어를 입력해 주세요.',
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
    placeholder: '검색어를 입력해 주세요.',
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
  },
};

export const SecondaryDark: Story = {
  args: {
    placeholder: '검색어를 입력해 주세요.',
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
    placeholder: '검색어를 입력해 주세요.',
    variant: 'tertiary',
    size: 'medium',
    theme: 'light',
  },
};

export const TertiaryDark: Story = {
  args: {
    placeholder: '검색어를 입력해 주세요.',
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
    placeholder: 'Small Searchbar',
    variant: 'primary',
    size: 'small',
    theme: 'light',
  },
};

export const Medium: Story = {
  args: {
    placeholder: 'Medium Searchbar',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large Searchbar',
    variant: 'primary',
    size: 'large',
    theme: 'light',
  },
};

// Without Search Icon
export const WithoutSearchIcon: Story = {
  args: {
    placeholder: '검색어를 입력해 주세요.',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    showSearchIcon: false,
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    placeholder: 'Full Width Searchbar',
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
    placeholder: 'Disabled Searchbar',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: true,
  },
};

export const DisabledWithValue: Story = {
  args: {
    value: 'Disabled Searchbar with Value',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    disabled: true,
  },
};

// All Sizes Comparison
export const AllSizes: Story = {
  args: {
    placeholder: 'Searchbar',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
      <Searchbar variant="primary" size="small" theme="light" placeholder="Small Searchbar" />
      <Searchbar variant="primary" size="medium" theme="light" placeholder="Medium Searchbar" />
      <Searchbar variant="primary" size="large" theme="light" placeholder="Large Searchbar" />
    </div>
  ),
};

// All Variants Comparison (Light)
export const AllVariantsLight: Story = {
  args: {
    placeholder: 'Searchbar',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Searchbar variant="primary" size="medium" theme="light" placeholder="Primary Searchbar" />
      <Searchbar variant="secondary" size="medium" theme="light" placeholder="Secondary Searchbar" />
      <Searchbar variant="tertiary" size="medium" theme="light" placeholder="Tertiary Searchbar" />
    </div>
  ),
};

// All Variants Comparison (Dark)
export const AllVariantsDark: Story = {
  args: {
    placeholder: 'Searchbar',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px' }}>
      <Searchbar variant="primary" size="medium" theme="dark" placeholder="Primary Searchbar" />
      <Searchbar variant="secondary" size="medium" theme="dark" placeholder="Secondary Searchbar" />
      <Searchbar variant="tertiary" size="medium" theme="dark" placeholder="Tertiary Searchbar" />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

// With onSearch Handler
export const WithSearchHandler: Story = {
  args: {
    placeholder: '검색어를 입력하고 Enter를 눌러주세요.',
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    onSearch: (value: string) => {
      console.log('검색어:', value);
      alert(`검색어: ${value}`);
    },
  },
};

// Search Examples
export const SearchExamples: Story = {
  args: {
    placeholder: 'Searchbar',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '400px' }}>
      <div>
        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Primary 검색바</h4>
        <Searchbar
          placeholder="상품을 검색해 주세요."
          variant="primary"
          size="medium"
          theme="light"
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Secondary 검색바</h4>
        <Searchbar
          placeholder="사용자를 검색해 주세요."
          variant="secondary"
          size="medium"
          theme="light"
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>Tertiary 검색바</h4>
        <Searchbar
          placeholder="문서를 검색해 주세요."
          variant="tertiary"
          size="medium"
          theme="light"
        />
      </div>
      <div>
        <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: '600' }}>아이콘 없는 검색바</h4>
        <Searchbar
          placeholder="아이콘 없이 검색"
          variant="primary"
          size="medium"
          theme="light"
          showSearchIcon={false}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

