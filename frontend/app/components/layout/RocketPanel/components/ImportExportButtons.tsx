import React from "react";
import { Button, Group } from "@mantine/core";

interface ImportExportButtonsProps {
  onImport: () => void;
  onExport: () => void;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({ onImport, onExport }) => {
  return (
    <Group justify="space-between">
      <Button variant="outline" size="sm" onClick={onImport}>
        インポート
      </Button>
      <Button variant="outline" size="sm" onClick={onExport}>
        エクスポート
      </Button>
    </Group>
  );
};

export default ImportExportButtons;