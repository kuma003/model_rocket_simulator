import type { Meta, StoryObj } from "@storybook/react";
import AltitudeBackground from "./index";

const meta: Meta<typeof AltitudeBackground> = {
  title: "Features/AltitudeBackground",
  component: AltitudeBackground,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    altitudeLevel: {
      control: {
        type: "range",
        min: 0,
        max: 5,
        step: 0.01,
      },
      description: "Current altitude level (0-5)",
    },
    containerHeight: {
      control: {
        type: "range",
        min: 200,
        max: 800,
        step: 50,
      },
      description: "Container height in pixels",
    },
    containerWidth: {
      control: {
        type: "range",
        min: 300,
        max: 1200,
        step: 50,
      },
      description: "Container width in pixels",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AltitudeBackground>;

// Default story
export const Default: Story = {
  args: {
    altitudeLevel: 0.5,
    containerHeight: 600,
    containerWidth: 800,
  },
};

// Ground level (0-50m)
export const GroundLevel: Story = {
  args: {
    altitudeLevel: 0.1,
    containerHeight: 600,
    containerWidth: 800,
  },
};

// Low altitude (50-100m)
export const LowAltitude: Story = {
  args: {
    altitudeLevel: 1.5,
    containerHeight: 600,
    containerWidth: 800,
  },
};

// Mid altitude (100-150m)
export const MidAltitude: Story = {
  args: {
    altitudeLevel: 2.5,
    containerHeight: 600,
    containerWidth: 800,
  },
};

// High altitude (150m+)
export const HighAltitude: Story = {
  args: {
    altitudeLevel: 3.5,
    containerHeight: 600,
    containerWidth: 800,
  },
};

// Very high altitude (300m+)
export const VeryHighAltitude: Story = {
  args: {
    altitudeLevel: 4.5,
    containerHeight: 600,
    containerWidth: 800,
  },
};

// Transition point testing (49m - just before first transition)
export const TransitionPoint1: Story = {
  args: {
    altitudeLevel: 0.98,
    containerHeight: 600,
    containerWidth: 800,
  },
};

// Transition point testing (51m - just after first transition)
export const TransitionPoint2: Story = {
  args: {
    altitudeLevel: 1.02,
    containerHeight: 600,
    containerWidth: 800,
  },
};

// Fine altitude control
export const FineAltitudeControl: Story = {
  args: {
    altitudeLevel: 1.25,
    containerHeight: 600,
    containerWidth: 800,
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates fine altitude control with decimal values",
      },
    },
  },
};

// Extreme altitude
export const ExtremeAltitude: Story = {
  args: {
    altitudeLevel: 4.8,
    containerHeight: 600,
    containerWidth: 800,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows background at extreme altitude levels",
      },
    },
  },
};

// Aurora effects visible
export const AuroraEffects: Story = {
  args: {
    altitudeLevel: 3.2,
    containerHeight: 600,
    containerWidth: 800,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows aurora effects at high altitude levels",
      },
    },
  },
};

// Smooth transitions
export const SmoothTransitions: Story = {
  args: {
    altitudeLevel: 1.0,
    containerHeight: 600,
    containerWidth: 800,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows smooth transitions between background segments at altitude level 1.0",
      },
    },
  },
};

// Small container
export const SmallContainer: Story = {
  args: {
    altitudeLevel: 2.0,
    containerHeight: 300,
    containerWidth: 400,
  },
};

// Large container
export const LargeContainer: Story = {
  args: {
    altitudeLevel: 2.0,
    containerHeight: 800,
    containerWidth: 1200,
  },
};

// Interactive playground
export const Playground: Story = {
  args: {
    altitudeLevel: 2.0,
    containerHeight: 600,
    containerWidth: 800,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground to test different altitude levels and settings. Use the controls to adjust altitude level and container size. Altitude level 0-1 shows first segment, 1-2 shows second segment, etc.",
      },
    },
  },
};
