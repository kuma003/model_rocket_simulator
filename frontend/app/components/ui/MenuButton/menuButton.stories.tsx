import type { Meta, StoryObj } from "@storybook/react";
import { MenuButton } from "./index";
import { PlayArrow } from "../Icons";

const meta = {
  title: "Components/MenuButton", // Storybook上での表示パス
  component: MenuButton,
  parameters: {
    layout: "centered", // コンポーネントを中央に配置
  },
  tags: ["autodocs"], // ドキュメントを自動生成
  argTypes: {
    buttons: {
      description:
        "ボタンの配列。各ボタンにはlabel、任意でleftIcon、rightIcon、onClickを持てます。",
      control: "object",
    },
  },
} satisfies Meta<typeof MenuButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    buttons: [
      {
        label: "ホーム",
        onClick: () => alert("ホームがクリックされました！"),
      },
      {
        label: "設定",
        onClick: () => alert("設定がクリックされました！"),
      },
      {
        label: "プロフィール",
        onClick: () => alert("プロフィールがクリックされました！"),
      },
    ],
  },
};

export const WithIcons: Story = {
  args: {
    buttons: [
      {
        label: "ホーム",
        leftIcon: <PlayArrow color={"blue"} />,
        onClick: () => alert("ホームがクリックされました！"),
      },
      {
        label: "設定",
        leftIcon: <PlayArrow color={"blue"} />,
        onClick: () => alert("設定がクリックされました！"),
      },
      {
        label: "ログアウト",
        rightIcon: <PlayArrow color={"blue"} />, // 右側にアイコンを配置する例
        onClick: () => alert("ログアウトがクリックされました！"),
      },
    ],
  },
};

export const SingleButton: Story = {
  args: {
    buttons: [
      {
        label: "閉じる",
        onClick: () => alert("閉じるがクリックされました！"),
      },
    ],
  },
};
