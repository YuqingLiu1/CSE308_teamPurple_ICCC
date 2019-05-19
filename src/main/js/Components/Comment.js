require('@babel/polyfill')

import React, { useState, useEffect } from 'react';

import Media from 'react-bootstrap/Media';

export default function Comment({ commentId }) {
    const [thumbnail, setThumbnail] = useState('');
    const [username, setUsername] = useState('');
    const [comment, setComment] = useState('');
    useEffect(() => {
        let isMounted = true;

        async function loadCommentData() {
            try {
                let res = await fetch(`/comments/info?id=${commentId}`);
                res = await res.json();
                if (res.status !== 'OK') throw new Error(`Failed to load comment info for Comment ID: ${commentId}`);

                let thumbnail = res.content.authorSketch.thumbnail;
                let username = res.content.authorGeneralBase.title;
                let comment = res.content.comment.content;
                if (isMounted) {
                    setThumbnail(thumbnail);
                    setUsername(username);
                    setComment(comment);
                }
            } catch (err) {
                console.error(err);
            }
        };
        loadCommentData();

        return () => isMounted = false;
    }, [commentId]);

    // rendering logic
    return (
        <Media className='my-1'>
            <img width={64} height={64} className='mr-3' src={thumbnail}/>
            <Media.Body>
                <h3>{username}</h3>
                {comment}
            </Media.Body>
        </Media>
    );
}