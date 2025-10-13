import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import Pagination from './index';

const meta = {
  title: 'Commons/Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
      description: 'Pagination variant 타입',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Pagination 크기',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '테마 (light/dark)',
    },
    currentPage: {
      control: 'number',
      description: '현재 페이지 번호 (1부터 시작)',
    },
    totalPages: {
      control: 'number',
      description: '전체 페이지 수',
    },
    visiblePages: {
      control: 'number',
      description: '한 번에 표시할 페이지 버튼 수',
    },
    showArrows: {
      control: 'boolean',
      description: '이전/다음 버튼 표시 여부',
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// Primary Variants
export const PrimaryLight: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const PrimaryDark: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
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
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'secondary',
    size: 'medium',
    theme: 'light',
  },
};

export const SecondaryDark: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
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
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'tertiary',
    size: 'medium',
    theme: 'light',
  },
};

export const TertiaryDark: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
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
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'small',
    theme: 'light',
  },
};

export const Medium: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const Large: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'large',
    theme: 'light',
  },
};

// Without Arrows
export const WithoutArrows: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    showArrows: false,
  },
};

// Different Visible Pages
export const ThreeVisiblePages: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    visiblePages: 3,
  },
};

export const SevenVisiblePages: Story = {
  args: {
    currentPage: 5,
    totalPages: 20,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
    visiblePages: 7,
  },
};

// Edge Cases
export const FirstPage: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const MiddlePage: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const FewPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 3,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

export const ManyPages: Story = {
  args: {
    currentPage: 15,
    totalPages: 50,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
};

// All Sizes Comparison
export const AllSizes: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
  render: () => {
    const [smallPage, setSmallPage] = useState(1);
    const [mediumPage, setMediumPage] = useState(1);
    const [largePage, setLargePage] = useState(1);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
        <Pagination
          currentPage={smallPage}
          totalPages={10}
          onPageChange={setSmallPage}
          variant="primary"
          size="small"
          theme="light"
        />
        <Pagination
          currentPage={mediumPage}
          totalPages={10}
          onPageChange={setMediumPage}
          variant="primary"
          size="medium"
          theme="light"
        />
        <Pagination
          currentPage={largePage}
          totalPages={10}
          onPageChange={setLargePage}
          variant="primary"
          size="large"
          theme="light"
        />
      </div>
    );
  },
};

// All Variants Comparison (Light)
export const AllVariantsLight: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'light',
  },
  render: () => {
    const [primaryPage, setPrimaryPage] = useState(1);
    const [secondaryPage, setSecondaryPage] = useState(1);
    const [tertiaryPage, setTertiaryPage] = useState(1);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Pagination
          currentPage={primaryPage}
          totalPages={10}
          onPageChange={setPrimaryPage}
          variant="primary"
          size="medium"
          theme="light"
        />
        <Pagination
          currentPage={secondaryPage}
          totalPages={10}
          onPageChange={setSecondaryPage}
          variant="secondary"
          size="medium"
          theme="light"
        />
        <Pagination
          currentPage={tertiaryPage}
          totalPages={10}
          onPageChange={setTertiaryPage}
          variant="tertiary"
          size="medium"
          theme="light"
        />
      </div>
    );
  },
};

// All Variants Comparison (Dark)
export const AllVariantsDark: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page: number) => console.log('Page changed to:', page),
    variant: 'primary',
    size: 'medium',
    theme: 'dark',
  },
  render: () => {
    const [primaryPage, setPrimaryPage] = useState(1);
    const [secondaryPage, setSecondaryPage] = useState(1);
    const [tertiaryPage, setTertiaryPage] = useState(1);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Pagination
          currentPage={primaryPage}
          totalPages={10}
          onPageChange={setPrimaryPage}
          variant="primary"
          size="medium"
          theme="dark"
        />
        <Pagination
          currentPage={secondaryPage}
          totalPages={10}
          onPageChange={setSecondaryPage}
          variant="secondary"
          size="medium"
          theme="dark"
        />
        <Pagination
          currentPage={tertiaryPage}
          totalPages={10}
          onPageChange={setTertiaryPage}
          variant="tertiary"
          size="medium"
          theme="dark"
        />
      </div>
    );
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

