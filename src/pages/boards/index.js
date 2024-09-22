import styles from '@/styles/Boards.module.scss'
import Image from "next/image";
import {ListItem} from "@/components/ListItem/ListItem";
import React from "react";

const bg = '/backgrounds/leaderboardBG.png'

export default function Page() {
    const friends = [
        {
            nickname: 'Tupacshakur',
            sum: '15M',
            image: '/listItemsBG/1grbg.png'
        },
        {
            nickname: 'Jhonnycash',
            sum: '14.1M',
            image: '/listItemsBG/3yfbg.png'
        },
        {
            nickname: 'missyelliot',
            sum: '70K',
            image: '/listItemsBG/2bvbg.png'
        },
        {
            nickname: 'missyelliot',
            sum: '70K',
            image: '/listItemsBG/3yfbg.png'
        },
        {
            nickname: 'missyelliot',
            sum: '70K',
            image: '/listItemsBG/2bvbg.png'
        },
        {
            nickname: 'missyelliot',
            sum: '70K',
            image: '/listItemsBG/4rrbg.png'
        }
    ]

    return(
        <div className={styles.root}>
            <Image src={bg} alt={''} className={styles.bg} width={450} height={1000} />
            <div className={styles.container}>
                {friends.map((item, index) => <ListItem key={index} item={item} index={index+1} />)}
            </div>
        </div>
    )
}