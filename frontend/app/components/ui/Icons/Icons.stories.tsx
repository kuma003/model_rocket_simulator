import type { Meta, StoryObj } from "@storybook/react";
import { PlayArrow, Settings, SimpleRocket, Info, Rocket } from "./index";

// PlayArrow
const playArrowMeta: Meta<typeof PlayArrow> = {
  title: "Icons/PlayArrow",
  component: PlayArrow,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "number" } },
    color: { control: { type: "color" } },
    strokeWidth: { control: { type: "range", min: 0.5, max: 5, step: 0.5 } },
  },
};

export default playArrowMeta;
type PlayArrowStory = StoryObj<typeof playArrowMeta>;

export const PlayArrowDefault: PlayArrowStory = {
  args: { size: 24, color: "currentColor", strokeWidth: 2 },
};

// Settings
export const SettingsStories: Meta<typeof Settings> = {
  title: "Icons/Settings",
  component: Settings,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "number" } },
    color: { control: { type: "color" } },
    strokeWidth: { control: { type: "range", min: 0.5, max: 5, step: 0.5 } },
  },
};

export const SettingsDefault: StoryObj<typeof Settings> = {
  args: { size: 24, color: "currentColor", strokeWidth: 1.5 },
};

// SimpleRocket
export const SimpleRocketStories: Meta<typeof SimpleRocket> = {
  title: "Icons/SimpleRocket",
  component: SimpleRocket,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "number" } },
    color: { control: { type: "color" } },
    strokeWidth: { control: { type: "range", min: 0.5, max: 5, step: 0.5 } },
  },
};

export const SimpleRocketDefault: StoryObj<typeof SimpleRocket> = {
  args: { size: 24, color: "currentColor", strokeWidth: 1.5 },
};

// Info
export const InfoStories: Meta<typeof Info> = {
  title: "Icons/Info",
  component: Info,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "number" } },
    color: { control: { type: "color" } },
    strokeWidth: { control: { type: "range", min: 0.5, max: 5, step: 0.5 } },
  },
};

export const InfoDefault: StoryObj<typeof Info> = {
  args: { size: 24, color: "currentColor", strokeWidth: 1.5 },
};

// Rocket (filled icon)
export const RocketStories: Meta<typeof Rocket> = {
  title: "Icons/Rocket",
  component: Rocket,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: { type: "number" } },
    color: { control: { type: "color" } },
  },
};

export const RocketDefault: StoryObj<typeof Rocket> = {
  args: { size: 24, color: "currentColor" },
};

// All Icons showcase
export const AllIcons: StoryObj = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <PlayArrow size={32} />
        <div>PlayArrow</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Settings size={32} />
        <div>Settings</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <SimpleRocket size={32} />
        <div>SimpleRocket</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Info size={32} />
        <div>Info</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Rocket size={32} />
        <div>Rocket</div>
      </div>
    </div>
  ),
};
