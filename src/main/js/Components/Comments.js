require('@babel/polyfill')

import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';

import Comment from './Comment';

/**
 * A component for adding/viewing comments on a piece of content.
 * @param generalBaseId The GeneralBase ID of the content being commented on.
 * @param contentBaseId The ContentBase ID of the content being commented on.
 * @param loggedInUserId The User ID of the currently logged in user.
 */
export default function Comments({ generalBaseId, contentBaseId, loggedInUserId }) {
    const [comment, setComment] = useState('');
    const [reloadCount, setReloadCount] = useState(0); // probably a better way of reloading comments

    const [commentIds, setCommentIds] = useState([]);
    useEffect(() => {
        let isMounted = true;

        async function loadComments() {
            try {
                let res = await fetch(`/content/info?id=${contentBaseId}`);
                res = await res.json();
                if (res.status !== 'OK') throw new Error(`Failed to load data for ContentBase ID: ${contentBaseId}.`);

                let commentIds = res.content.generalBase.comments;
                // show newest comments first
                commentIds.reverse();
                if (isMounted) {
                    setCommentIds(commentIds);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadComments();

        return () => isMounted = false;
    }, [generalBaseId, reloadCount]);

    function handleCommentChange(event) {
        setComment(event.target.value);
    }

    async function addComment(event) {
        try {
            event.preventDefault();

            // don't allow empty comments
            if (comment === '') return;

            let res = await fetch('/comments/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    on: generalBaseId,
                    author: loggedInUserId,
                    content: comment
                })
            });
            res = await res.json();
            if (res.status !== 'OK') throw new Error('Failed to add comment.');

            // reset the comment textarea once the comment has been added and reload the comments
            setComment('');
            setReloadCount(reloadCount + 1);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <Container>
            <Form className="AddComment">
                <Form.Group controlId="addCommentText">
                    <Form.Label style={{color:'black', padding:'0px', textShadow: '1px 1px lightgray'}}>Your Comment</Form.Label>
                    <Form.Control
                        style={{backgroundColor:'white',
                            boxShadow: '0px 0px 4px rgba(0, 0, 0, .3)',
                            color: 'black',
                            fontSize: '15px',
                            border: '1px solid rgba(206, 206, 206, .6)',
                            borderRadius: '1px'}}
                        as='textarea'
                        rows={6}
                        placeholder='Leave your comment here...'
                        value={comment}
                        onChange={handleCommentChange}
                    />
                </Form.Group>

                <Button variant='primary' className="commentSubmit" type='submit' onClick={addComment}>
                    Submit
                </Button>
            </Form>
            <ListGroup style={{ overflow: 'scroll', maxHeight: '300px' }}>
                {commentIds.map(commentId => {
                    return (
                        <Comment key={commentId} commentId={commentId}/>
                    );
                })}
            </ListGroup>
        </Container>
    );
}