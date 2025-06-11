import React from 'react';
import styles from "./toppage.module.scss";
import MenuButton from '../MenuButton';
import { PlayArrow, Score, Settings } from '../Icons';

const Top: React.FC = () => {
    return (
        <div className={styles.toppage}>
            <MenuButton
            buttons={[{
                label:"プレイ",
                leftIcon:<PlayArrow fill="white" />,
                onClick:() => console.log('Home button clicked')
            },
            {
                label: "設定",
                leftIcon: <Settings fill="white" />
            },
            {
                label: "ランキング",
                leftIcon: <Score fill="white" />
            },
        ]
            }
            />  
        </div>
    );
};

export default Top;