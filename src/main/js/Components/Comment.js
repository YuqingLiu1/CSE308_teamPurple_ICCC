require('@babel/polyfill')

import React, { useState, useEffect } from 'react';

import Media from 'react-bootstrap/Media';

export default function Comment({ commentId }) {
    const [username, setUsername] = useState('');
    const [comment, setComment] = useState('');
    useEffect(() => {
        let isMounted = true;

        async function loadCommentData() {
            try {
                let res = await fetch(`/comments/info?id=${commentId}`);
                res = await res.json();
                if (res.status !== 'OK') throw new Error(`Failed to load comment info for Comment ID: ${commentId}`);

                let username = res.content.authorGeneralBase.title;
                let comment = res.content.comment.content;
                if (isMounted) {
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
        <Media>
            <Media.Body>
                <h3>{username}</h3>
                {comment}
            </Media.Body>
        </Media>
    );
}