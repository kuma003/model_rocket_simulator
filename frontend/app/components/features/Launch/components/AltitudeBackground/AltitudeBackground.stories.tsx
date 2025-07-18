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
  },
  decorators: [
    (Story) => (
      <div style={{ 
        width: "100vw", 
        height: "100vh", 
        position: "relative",
        overflow: "hidden",
        background: "#000"
      }}>
        <div style={{ 
          width: "100%", 
          height: "100%", 
          position: "absolute",
          top: 0,
          left: 0
        }}>
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AltitudeBackground>;

// Default story
export const Default: Story = {
  args: {
    altitudeLevel: 0.5,
  },
  parameters: {
    docs: {
      description: {
        story: "Default view showing background at altitude level 0.5",
      },
    },
  },
};

// Ground level (0-50m)
export const GroundLevel: Story = {
  args: {
    altitudeLevel: 0.1,
  },
};

// Low altitude (50-100m)
export const LowAltitude: Story = {
  args: {
    altitudeLevel: 1.5,
  },
};

// Mid altitude (100-150m)
export const MidAltitude: Story = {
  args: {
    altitudeLevel: 2.5,
  },
};

// High altitude (150m+)
export const HighAltitude: Story = {
  args: {
    altitudeLevel: 3.5,
  },
};

// Very high altitude (300m+)
export const VeryHighAltitude: Story = {
  args: {
    altitudeLevel: 4.5,
  },
};

// Transition point testing (49m - just before first transition)
export const TransitionPoint1: Story = {
  args: {
    altitudeLevel: 0.98,
  },
};

// Transition point testing (51m - just after first transition)
export const TransitionPoint2: Story = {
  args: {
    altitudeLevel: 1.02,
  },
};

// Fine altitude control
export const FineAltitudeControl: Story = {
  args: {
    altitudeLevel: 1.25,
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
  },
  parameters: {
    docs: {
      description: {
        story: "Shows background at extreme altitude levels",
      },
    },
  },
};

// Aurora effects visible at transition area
export const AuroraEffects: Story = {
  args: {
    altitudeLevel: 2.05,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows aurora effects at altitude level 2.05 where most aurora objects are positioned",
      },
    },
  },
};

// Smooth transitions
export const SmoothTransitions: Story = {
  args: {
    altitudeLevel: 1.0,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows smooth transitions between background segments at altitude level 1.0",
      },
    },
  },
};

// Moon visibility at high altitude
export const MoonVisibility: Story = {
  args: {
    altitudeLevel: 2.5,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the moon at altitude level 2.5",
      },
    },
  },
};

// Jupiter visibility at extreme altitude
export const JupiterVisibility: Story = {
  args: {
    altitudeLevel: 3.0,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows Jupiter at altitude level 3.0",
      },
    },
  },
};

// Aurora beginning (around 1.9)
export const AuroraBeginning: Story = {
  args: {
    altitudeLevel: 1.92,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the beginning of aurora effects at altitude level 1.92",
      },
    },
  },
};

// Aurora peak (around 2.1)
export const AuroraPeak: Story = {
  args: {
    altitudeLevel: 2.1,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows peak aurora effects at altitude level 2.1",
      },
    },
  },
};

// Aurora ending (around 2.2)
export const AuroraEnding: Story = {
  args: {
    altitudeLevel: 2.2,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows ending aurora effects at altitude level 2.2",
      },
    },
  },
};

// Interactive playground
export const Playground: Story = {
  args: {
    altitudeLevel: 2.0,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground to test different altitude levels. Aurora effects are visible around 1.9-2.2, Moon at 2.5, Jupiter at 3.0.",
      },
    },
  },
};
