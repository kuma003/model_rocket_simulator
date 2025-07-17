import type { Meta, StoryObj } from "@storybook/react";
import { CenterMarker, CenterOfGravityMarker, CenterOfPressureMarker } from "./index";

const meta: Meta<typeof CenterMarker> = {
  title: "UI/CenterMarkers",
  component: CenterMarker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Engineering standard center markers for rocket design visualization. The main CenterMarker component is flexible and can be used for various center points (CG, CP, etc.) with customizable colors and labels.",
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
type Story = StoryObj<typeof CenterMarker>;

export const CenterOfGravity: Story = {
  args: {
    color: "#FF0000",
    label: "CG",
  },
  parameters: {
    docs: {
      description: {
        story: "Center of gravity marker with red color and CG label.",
      },
    },
  },
};

export const CenterOfPressure: Story = {
  args: {
    color: "#0000FF",
    label: "CP",
  },
  parameters: {
    docs: {
      description: {
        story: "Center of pressure marker with blue color and CP label.",
      },
    },
  },
};

export const CustomCenter: Story = {
  args: {
    color: "#00AA00",
    label: "CM",
  },
  parameters: {
    docs: {
      description: {
        story: "Custom center marker with green color and CM label.",
      },
    },
  },
};

export const LargeMarker: Story = {
  args: {
    color: "#FF0000",
    label: "CG",
    size: 12,
  },
  parameters: {
    docs: {
      description: {
        story: "Larger center marker for better visibility.",
      },
    },
  },
};

export const NoLabel: Story = {
  args: {
    color: "#FF0000",
    label: "CG",
    showLabel: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Center marker without label.",
      },
    },
  },
};

export const CustomColor: Story = {
  args: {
    color: "#FF6600",
    label: "CC",
  },
  parameters: {
    docs: {
      description: {
        story: "Center marker with custom orange color.",
      },
    },
  },
};

export const Comparison: StoryObj = {
  render: () => (
    <svg width="300" height="100" viewBox="0 0 300 100">
      <g transform="translate(50, 50)">
        <CenterMarker color="#FF0000" label="CG" />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Center of Gravity
        </text>
      </g>
      <g transform="translate(150, 50)">
        <CenterMarker color="#0000FF" label="CP" />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Center of Pressure
        </text>
      </g>
      <g transform="translate(250, 50)">
        <CenterMarker label="CM" color="#00AA00" />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Custom Center
        </text>
      </g>
    </svg>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparison of center markers with different colors and labels.",
      },
    },
  },
};

export const SizeComparison: StoryObj = {
  render: () => (
    <svg width="200" height="100" viewBox="0 0 200 100">
      <g transform="translate(40, 50)">
        <CenterMarker color="#FF0000" label="CG" size={6} />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Small (6px)
        </text>
      </g>
      <g transform="translate(100, 50)">
        <CenterMarker color="#FF0000" label="CG" size={8} />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          Default (8px)
        </text>
      </g>
      <g transform="translate(160, 50)">
        <CenterMarker color="#FF0000" label="CG" size={12} />
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

export const ConvenienceComponents: StoryObj = {
  render: () => (
    <svg width="200" height="100" viewBox="0 0 200 100">
      <g transform="translate(50, 50)">
        <CenterOfGravityMarker />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          CenterOfGravityMarker
        </text>
      </g>
      <g transform="translate(150, 50)">
        <CenterOfPressureMarker />
        <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#666">
          CenterOfPressureMarker
        </text>
      </g>
    </svg>
  ),
  parameters: {
    docs: {
      description: {
        story: "Convenience components with predefined colors and labels.",
      },
    },
  },
};