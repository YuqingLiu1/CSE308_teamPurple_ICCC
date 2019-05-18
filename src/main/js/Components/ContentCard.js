require('@babel/polyfill')

import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import DBAwareEdiText from "./DBAwareEdiText";

export default function ContentCard({ contentBaseId, editable, titleInit, descriptionInit }) {
    const [title, setTitle] = useState(titleInit);
    const [description, setDescription] = useState(descriptionInit);
    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                let contentRes = await fetch('/content/info?id=' + contentBaseId);
                contentRes = await contentRes.json();
                if (contentRes.status !== 'OK') throw new Error('Could not fetch ContentBase by ID: ' + contentBaseId);

                let title = contentRes.content.generalBase.title;
                let description = contentRes.content.generalBase.description;

                if (isMounted) {
                    setTitle(title);
                    setDescription(description);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadData();

        return () => isMounted = false;
    }, [contentBaseId]);

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

    // rendering logic
    if (title && description) {
        if (editable) {
            return (
                <Card>
                    <Card.Header>
                        <DBAwareEdiText type='text' value={title} onSave={onSaveTitle}/>
                    </Card.Header>
                    <Card.Body>
                        <DBAwareEdiText type='text' value={description} onSave={onSaveDescription}/>
                    </Card.Body>
                </Card>
            );
        } else {
            return (
                <Card>
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
            <Card>
                Loading...
            </Card>
        );
    }
}