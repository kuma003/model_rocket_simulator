import React from "react";
import { Button, Stack } from "@mantine/core";
import styles from "./menuButton.module.scss";


export interface MenuButtonProps {
    buttons: {
        leftIcon?: React.ReactNode;
        rightIcon?: React.ReactNode;
        label: string;
        onClick?: () => void;
    }[];
}

const MenuButton: React.FC<MenuButtonProps> = ({ buttons }) => {
    return (
        <Stack className={styles.stack}>
            {buttons.map((button, index) => (
                <Button
                    className={`${styles.menuButton} ${index === 0 ? styles.primary : styles.secondary}`}
                    variant="default"
                    leftSection={button.leftIcon}
                    rightSection={button.rightIcon}
                    onClick={button.onClick}
                    id={index.toString()}
                >
                    {button.label}
                </Button>
            ))}
        </Stack>
    );
}

export default MenuButton;