require('@babel/polyfill')

import React, { useState, useEffect } from 'react';

import Heart from './Heart';

export default function Likes({ generalBaseId, loggedInUserId, likedByCurrentUserColor='red', notLikedByCurrentUserColor='black' }) {
    const [likedByCurrentUser, setLikedByCurrentUser] = useState(false);
    const [numberOfLikers, setNumberOfLikers] = useState(0);
    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                // fetch number of likes for this GeneralBase
                let res = await fetch(`/likes/count?id=${generalBaseId}`);
                res = await res.json();
                if (res.status !== 'OK') throw new Error(`Failed to get number of likes for GeneralBase with ID: ${generalBaseId}`);
                let numLikes = res.content.numLikes;

                // fetch whether the current logged in user (if there is one) likes this GeneralBase
                let likedByCurrentUser;
                if (!loggedInUserId) {
                    likedByCurrentUser = true;
                } else {
                    res = await fetch(`/likes/likedByCurrentUser?id=${generalBaseId}`);
                    res = await res.json();
                    if (res.status !== 'OK') throw new Error(`Failed to determine if current user likes GeneralBase with ID: ${generalBaseId}`);
                    likedByCurrentUser = res.content.liked;
                }

                if (isMounted) {
                    setNumberOfLikers(numLikes);
                    setLikedByCurrentUser(likedByCurrentUser);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadData();

        return () => isMounted = false;
    }, [generalBaseId, likedByCurrentUser]);

    async function handleClick(event) {
        event.preventDefault();

        try {
            let res = await fetch(`/clicklike?id=${generalBaseId}`);
            res = await res.json();
            if (res.status !== 'OK') throw new Error(`Failed to (un)like/(un)subscribe to GeneralBase with ID: ${generalBaseId}.`);
            setLikedByCurrentUser(!likedByCurrentUser);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div style={{ backgroundColor: 'rgba(1,1,1,.2)', padding: '10px', borderRadius: '10px' }}>
            <Heart style={{ height: '30px' }}
                   onClick={handleClick}
                   color={likedByCurrentUser ? likedByCurrentUserColor : notLikedByCurrentUserColor}/>
            {numberOfLikers}
        </div>
    );
}