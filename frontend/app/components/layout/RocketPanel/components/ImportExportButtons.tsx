import React from "react";
import { Button, Group } from "@mantine/core";
import styles from "./ImportExportButtons.module.scss";

interface ImportExportButtonsProps {
  onImport: () => void;
  onExport: () => void;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({
  onImport,
  onExport,
}) => {
  return (
    <Group className={styles.buttonGroup}>
      <Button onClick={onImport}>インポート</Button>
      <Button onClick={onExport}>エクスポート</Button>
    </Group>
  );
};

export default ImportExportButtons;
