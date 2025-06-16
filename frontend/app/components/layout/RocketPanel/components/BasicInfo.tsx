import React from "react";
import { Stack, TextInput } from "@mantine/core";
import type { RocketParams } from "../../../features/Rocket/types";

interface BasicInfoProps {
  params: RocketParams;
  updateParams: (newParams: Partial<RocketParams>) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ params, updateParams }) => {
  return (
    <Stack gap="xs">
      <TextInput
        label="ロケット名"
        value={params.name}
        onChange={(event) => updateParams({ name: event.currentTarget.value })}
        placeholder="ロケット名を入力"
      />
      <TextInput
        label="設計者"
        value={params.designer}
        onChange={(event) => updateParams({ designer: event.currentTarget.value })}
        placeholder="設計者名を入力"
      />
    </Stack>
  );
};

export default BasicInfo;