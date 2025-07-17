import type { Meta, StoryObj } from "@storybook/react";
import { CenterOfGravityMarker, CenterOfPressureMarker, CenterMarker } from "./index";

const meta: Meta<typeof CenterOfGravityMarker> = {
  title: "UI/CenterMarkers",
  component: CenterOfGravityMarker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Engineering standard center markers for rocket design visualization.",
      },
    },
  },
  decorators: [
    (Story) => (
      <svg width="100" height="100" viewBox="0 0 100 100">
        <g transform="translate(50, 50)">
          <Story />
        </g>
      </svg>
    ),
  ],
};

export default meta;
type CGStory = StoryObj<typeof CenterOfGravityMarker>;
type CPStory = StoryObj<typeof CenterOfPressureMarker>;
type GenericStory = StoryObj<typeof CenterMarker>;

export const CenterOfGravityDefault: CGStory = {
  render: (args) => <CenterOfGravityMarker {...args} />,
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default center of gravity marker with red color and standard size.",
      },
    },
  },
};

export const CenterOfGravityLarge: CGStory = {
  render: (args) => <CenterOfGravityMarker {...args} />,
  args: {
    size: 12,
  },
  parameters: {
    docs: {
      description: {
        story: "Larger center of gravity marker for better visibility.",
      },
    },
  },
};

export const CenterOfGravityNoLabel: CGStory = {
  render: (args) => <CenterOfGravityMarker {...args} />,
  args: {
    showLabel: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Center of gravity marker without label.",
      },
    },
  },
};

export const CenterOfGravityCustomColor: CGStory = {
  render: (args) => <CenterOfGravityMarker {...args} />,
  args: {
    color: "#FF6600",
  },
  parameters: {
    docs: {
      description: {
        story: "Center of gravity marker with custom orange color.",
      },
    },
  },
};

export const CenterOfPressureDefault: CPStory = {
  render: (args) => <CenterOfPressureMarker {...args} />,
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default center of pressure marker with blue color and standard size.",
      },
    },
  },
};

export const CenterOfPressureLarge: CPStory = {
  render: (args) => <CenterOfPressureMarker {...args} />,
  args: {
    size: 12,
  },
  parameters: {
    docs: {
      description: {
        story: "Larger center of pressure marker for better visibility.",
      },
    },
  },
};

export const CenterOfPressureNoLabel: CPStory = {
  render: (args) => <CenterOfPressureMarker {...args} />,
  args: {
    showLabel: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Center of pressure marker without label.",
      },
    },
  },
};

export const GenericCenterMarker: GenericStory = {
  render: (args) => <CenterMarker {...args} />,
  args: {
    label: "CM",
    color: "#00AA00",
  },
  parameters: {
    docs: {
      description: {
        story: "Generic center marker with custom label and color.",
      },
    },
  },
};

export const Comparison: StoryObj = {
  render: () => (
    <svg width="300" height="100" viewBox="0 0 300 100">
      <g transform="translate(50, 50)">
        <CenterOfGravityMarker />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Center of Gravity
        </text>
      </g>
      <g transform="translate(150, 50)">
        <CenterOfPressureMarker />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Center of Pressure
        </text>
      </g>
      <g transform="translate(250, 50)">
        <CenterMarker label="CM" color="#00AA00" />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Generic Center
        </text>
      </g>
    </svg>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparison of all center marker types side by side.",
      },
    },
  },
};

export const SizeComparison: StoryObj = {
  render: () => (
    <svg width="200" height="100" viewBox="0 0 200 100">
      <g transform="translate(40, 50)">
        <CenterOfGravityMarker size={6} />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Small (6px)
        </text>
      </g>
      <g transform="translate(100, 50)">
        <CenterOfGravityMarker size={8} />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Default (8px)
        </text>
      </g>
      <g transform="translate(160, 50)">
        <CenterOfGravityMarker size={12} />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Large (12px)
        </text>
      </g>
    </svg>
  ),
  parameters: {
    docs: {
      description: {
        story: "Different sizes of center markers for various use cases.",
      },
    },
  },
};