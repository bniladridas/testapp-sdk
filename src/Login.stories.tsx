import type { Meta, StoryObj } from '@storybook/react-vite';
import Login from './Login';

const meta: Meta<typeof Login> = {
  title: 'Components/Login',
  component: Login,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Login form component for user authentication. Handles email/password input and form submission.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithError: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Login form showing error state after failed authentication attempt.',
      },
    },
  },
};
