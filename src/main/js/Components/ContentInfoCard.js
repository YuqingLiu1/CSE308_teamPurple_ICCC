require('@babel/polyfill')

import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import DBAwareEdiText from "./DBAwareEdiText";

/**
 * A card to display information about a piece of content. Optionally editable.
 * @param contentBaseId The ContentBase ID of the content
 * @param editable Whether or not the displayed info should be editable
 */
export default function ContentInfoCard({ contentBaseId, editable }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [authorPic, setAuthorPic] = useState('');
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                // fetch info about content
                let contentRes = await fetch('/content/info?id=' + contentBaseId);
                contentRes = await contentRes.json();
                if (contentRes.status !== 'OK') throw new Error('Could not fetch ContentBase by ID: ' + contentBaseId);

                let title = contentRes.content.generalBase.title;
                let description = contentRes.content.generalBase.description;
                let authorId = contentRes.content.contentBase.author;

                // fetch info about the author of the content
                let authorRes = await fetch(`/user/info?id=${authorId}`);
                authorRes = await authorRes.json();
                if (authorRes.status !== 'OK') throw new Error(`Failed to fetch author info for ID: ${authorId}.`);
                let authorPic = authorRes.content.sketch.thumbnail;

                if (isMounted) {
                    setTitle(title);
                    setDescription(description);
                    setAuthorPic(authorPic);
                    setLoaded(true);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadData();

        return () => isMounted = false;
    }, [contentBaseId]);

    // called when saving edits to the title
    async function onSaveTitle(val) {
        try {
            let editContentRes = await fetch('/content/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: contentBaseId,
                    title: val
                })
            });
            editContentRes = await editContentRes.json();
            if (editContentRes.status !== 'OK') throw new Error('Could not save title');
        } catch (err) {
            console.error(err);
        }
    };

    // called when saving edits to the description
    async function onSaveDescription(val) {
        try {
            let editContentRes = await fetch('/content/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: contentBaseId,
                    description: val
                })
            });
            editContentRes = await editContentRes.json();
            if (editContentRes.status !== 'OK') throw new Error('Could not save description');
        } catch (err) {
            console.error(err);
        }
    };

    function linkToAuthor()
    {
         // console.log(await getContentAuthor(contentBaseId))
        window.goToContentAuthor(contentBaseId)
    }

    // rendering logic
    if (loaded) {
        if (editable) {
            return (
                <Card onClick={linkToAuthor}>
                    <Card.Img variant='top' src={authorPic}/>
                    <Card.Header>
                        <DBAwareEdiText type='text' value={title} onSave={onSaveTitle}/>
                    </Card.Header>
                    <Card.Body>
                        <DBAwareEdiText type='textarea' value={description} onSave={onSaveDescription}/>
                    </Card.Body>
                </Card>
            );
        } else {
            return (
                <Card onClick={linkToAuthor}>
                    <Card.Img variant='top' src={authorPic}/>
                    <Card.Header>
                        {title}
                    </Card.Header>
                    <Card.Body>
                        {description}
                    </Card.Body>
                </Card>
            );
        }
    } else {
        return (
            <Spinner animation='border'/>
        );
    }
}