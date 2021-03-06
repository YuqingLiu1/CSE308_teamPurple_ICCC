require('@babel/polyfill')

//TODO Refactor this code - Ryan
import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

/**
 * A card to be used within categories for displaying info about a piece of content or a user. Exactly one (e.g. not
 * both) of userId and contentBaseId must be provided so that this card can fetch data. An onClick function must also
 * be provided, to let this card know what to do when it is clicked.
 * @param userId User ID of user this card displays info about; semi-required (see description above)
 * @param contentBaseId ContentBase ID of content this card displays info about; semi-required (see description above)
 * @param onClick Function to be called when this card is clicked; required
 * @param extraStyles Any extra styles to be applied to this card; optional
 */
export default function CategoryCard({ userId, contentBaseId, onClick, extraStyles }) {
    const [thumbnail, setThumbnail] = useState('');
    const [title, setTitle] = useState('');
    const [authorTitle, setAuthorTitle] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [contentType, setContentType] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                // load either content info or user info
                let res;
                if (userId) {
                    res = await fetch(`/user/info?id=${userId}`);
                    res = await res.json();
                    if (res.status !== 'OK') throw new Error(`Failed to load data for User ID: ${userId}`);
                } else {
                    res = await fetch(`/content/info?id=${contentBaseId}`);
                    res = await res.json();
                    if (res.status !== 'OK') throw new Error(`Failed to load data for ContentBase ID: ${contentBaseId}`);
                }
                let thumbnail = res.content.sketch.thumbnail;
                let title = res.content.generalBase.title;
                let authorId//Will be undefined unless set
                if(contentBaseId)//Authors don't have authors; prevent an error here
                    authorId=res.content.contentBase.author;

                if (isMounted) {
                    setThumbnail(thumbnail);
                    setTitle(title);
                    try {
                        setContentType(res.content.contentBase.type)
                    } catch {
                    }
                    if(contentBaseId) {
                        setAuthorId(authorId);
                        setAuthorTitle(await window.getUserTitle(authorId));
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadData();

        return () => isMounted = false;
    }, []);

    // rendering logic
    if (loading) {
        return (
            <Spinner animation='border'/>
        );
    } else {
        return (
            <Card style={{...{ width: '18rem', cursor: 'pointer' }, ...extraStyles}}>
                <Card.Img variant='top' src={thumbnail}  onClick={onClick}/>
                <Card.Footer style={{ textAlign: 'center' }}  onClick={onClick}>
                    {title}
                    {
                        userId ?
                            <>
                                <br/>{"Type: User"}
                            </>//Don't show the author field if we're looking at a user
                                :
                            <>
                                <br/>
                                {"Author: "+authorTitle}
                                <br/>
                                {"Type: "+contentType}
                            </>
                    }
                </Card.Footer>
            </Card>
        );
    }
};