import type { Meta, StoryObj } from "@storybook/react";
import { RocketMascot, MascotSpeech } from "./index";

const meta: Meta<typeof RocketMascot> = {
  title: "Components/RocketMascot",
  component: RocketMascot,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: 'space',
      values: [
        { name: 'space', value: 'linear-gradient(to bottom, #5a3393, #354d8f, #403e80)' },
        { name: 'light', value: '#f0f0f0' },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    position: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
    },
    animated: {
      control: { type: 'boolean' },
    },
    showPlaceholder: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "medium",
    animated: true,
    position: "center",
    showPlaceholder: true,
  },
};

export const Small: Story = {
  args: {
    size: "small",
    animated: true,
    showPlaceholder: true,
  },
};

export const Large: Story = {
  args: {
    size: "large",
    animated: true,
    showPlaceholder: true,
  },
};

export const Static: Story = {
  args: {
    size: "medium",
    animated: false,
    showPlaceholder: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-end' }}>
      <RocketMascot size="small" showPlaceholder={true} />
      <RocketMascot size="medium" showPlaceholder={true} />
      <RocketMascot size="large" showPlaceholder={true} />
    </div>
  ),
};

export const WithSpeechBubble: Story = {
  render: () => (
    <div style={{ position: 'relative', padding: '60px 20px 20px' }}>
      <RocketMascot size="medium" animated={true} showPlaceholder={true} />
      <MascotSpeech 
        message="こんにちは！ロケットと一緒に宇宙を探検しよう！🚀" 
        visible={true} 
      />
    </div>
  ),
};

export const Positioned: Story = {
  render: () => (
    <div style={{ width: '400px', height: '200px', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <RocketMascot size="small" position="left" animated={true} showPlaceholder={true} />
      <RocketMascot size="medium" position="center" animated={true} showPlaceholder={true} />
      <RocketMascot size="small" position="right" animated={true} showPlaceholder={true} />
    </div>
  ),
};

// Speech Bubble Stories
const SpeechMeta: Meta<typeof MascotSpeech> = {
  title: "Components/RocketMascot/Speech",
  component: MascotSpeech,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: 'space',
      values: [
        { name: 'space', value: 'linear-gradient(to bottom, #5a3393, #354d8f, #403e80)' },
      ],
    },
  },
  tags: ["autodocs"],
};

export const SpeechBubble: StoryObj<typeof MascotSpeech> = {
  args: {
    message: "宇宙へようこそ！一緒に冒険しましょう！",
    visible: true,
  },
  parameters: {
    ...SpeechMeta.parameters,
  },
};