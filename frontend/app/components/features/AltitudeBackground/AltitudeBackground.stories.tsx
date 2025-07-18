import type { Meta, StoryObj } from '@storybook/react';
import AltitudeBackground from './index';
import { sampleSkyObjects } from './skyObjectUtils';
import type { SkyObject } from './types';

const meta: Meta<typeof AltitudeBackground> = {
  title: 'Features/AltitudeBackground',
  component: AltitudeBackground,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    altitude: {
      control: {
        type: 'range',
        min: 0,
        max: 500,
        step: 1,
      },
      description: 'Current altitude in meters',
    },
    stepInterval: {
      control: {
        type: 'select',
        options: [25, 50, 100],
      },
      description: 'Step interval for background transitions',
    },
    containerHeight: {
      control: {
        type: 'range',
        min: 200,
        max: 800,
        step: 50,
      },
      description: 'Container height in pixels',
    },
    containerWidth: {
      control: {
        type: 'range',
        min: 300,
        max: 1200,
        step: 50,
      },
      description: 'Container width in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AltitudeBackground>;

// Default story
export const Default: Story = {
  args: {
    altitude: 25,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
};

// Ground level (0-50m)
export const GroundLevel: Story = {
  args: {
    altitude: 10,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
};

// Low altitude (50-100m)
export const LowAltitude: Story = {
  args: {
    altitude: 75,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
};

// Mid altitude (100-150m)
export const MidAltitude: Story = {
  args: {
    altitude: 125,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
};

// High altitude (150m+)
export const HighAltitude: Story = {
  args: {
    altitude: 200,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
};

// Very high altitude (300m+)
export const VeryHighAltitude: Story = {
  args: {
    altitude: 350,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
};

// Transition point testing (49m - just before first transition)
export const TransitionPoint1: Story = {
  args: {
    altitude: 49,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
};

// Transition point testing (51m - just after first transition)
export const TransitionPoint2: Story = {
  args: {
    altitude: 51,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
};

// Different step interval (25m)
export const SmallStepInterval: Story = {
  args: {
    altitude: 60,
    stepInterval: 25,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
};

// Different step interval (100m)
export const LargeStepInterval: Story = {
  args: {
    altitude: 120,
    stepInterval: 100,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
};

// No sky objects
export const NoSkyObjects: Story = {
  args: {
    altitude: 100,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: [],
  },
};

// Custom sky objects
const customSkyObjects: SkyObject[] = [
  { type: "star", altitude: 50, x: 20, icon: "⭐", size: 2.0 },
  { type: "satellite", altitude: 150, x: 80, icon: "🛰️", size: 1.5 },
  { type: "cloud", altitude: 25, x: 50, icon: "☁️", size: 2.5 },
];

export const CustomSkyObjects: Story = {
  args: {
    altitude: 100,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: customSkyObjects,
  },
};

// Small container
export const SmallContainer: Story = {
  args: {
    altitude: 100,
    stepInterval: 50,
    containerHeight: 300,
    containerWidth: 400,
    objects: sampleSkyObjects,
  },
};

// Large container
export const LargeContainer: Story = {
  args: {
    altitude: 100,
    stepInterval: 50,
    containerHeight: 800,
    containerWidth: 1200,
    objects: sampleSkyObjects,
  },
};

// Interactive playground
export const Playground: Story = {
  args: {
    altitude: 100,
    stepInterval: 50,
    containerHeight: 600,
    containerWidth: 800,
    objects: sampleSkyObjects,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test different altitude values and settings. Use the controls to adjust altitude, step interval, and container size.',
      },
    },
  },
};