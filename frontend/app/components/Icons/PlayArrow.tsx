import React from 'react';
import { BaseIcon, type IconProps } from './types';

const PlayArrow: React.FC<IconProps> = (props) => {
    return (
        <BaseIcon {...props}>
            <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
        </BaseIcon>
    );
};

export default PlayArrow;