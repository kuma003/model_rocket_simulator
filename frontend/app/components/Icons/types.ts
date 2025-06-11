import React from 'react';
import styles from "./types.module.scss";

export interface IconProps {
    className?: string;
    size?: number;
    fill?: string;
}

export interface BaseIconProps extends IconProps {
    children: React.ReactNode;
    viewBox?: string;
}

export const BaseIcon: React.FC<BaseIconProps> = ({ 
    className, 
    size, 
    viewBox = "0 -960 960 960",
    fill = "currentColor",
    children
}) => {
    return React.createElement(
        'svg',
        {
            xmlns: "http://www.w3.org/2000/svg",
            height: size,
            width: size,
            viewBox: viewBox,
            fill: fill,
            className: `${className} ${styles.icon}`,
        },
        children
    );
};
