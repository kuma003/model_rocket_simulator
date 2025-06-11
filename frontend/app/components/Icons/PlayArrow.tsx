import React from 'react';

interface PlayArrowProps {
    className?: string;
    size?: number;
    fill?: string;
}

const PlayArrow: React.FC<PlayArrowProps> = ({ 
    className, 
    size = 24, 
    fill = "#FFFFFF" 
}) => {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            height={`${size}px`} 
            viewBox="0 -960 960 960" 
            width={`${size}px`} 
            fill={fill}
            className={className}
        >
            <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
        </svg>
    );
};

export default PlayArrow;