require('@babel/polyfill')

import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import DBAwareEdiText from "./DBAwareEdiText";

export default class ContentCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contentBaseId: props.contentBaseId,
            // title: props.initialTitle,
            // description: props.initialDescription
        }
    }

    async componentDidMount() {
        try {
            let contentBaseId = this.state.contentBaseId;
            let contentRes = await fetch('/content/info?id=' + contentBaseId);
            contentRes = await contentRes.json();
            if (contentRes.status !== 'OK') throw new Error('Could not fetch ContentBase by ID: ' + contentBaseId);

            let title = contentRes.content.generalBase.title;
            let description = contentRes.content.generalBase.description;

            this.setState({
                title: title,
                description: description
            });
        } catch (err) {
            console.error(err);
        }
    }

    onSaveTitle = async (val) => {
        try {
            let contentBaseId = this.state.contentBaseId;
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
    }

    onSaveDescription = async (val) => {
        try {
            let contentBaseId = this.state.contentBaseId;
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
    }

    render() {
        let editable = this.props.editable;
        let title = this.props.title;
        let description = this.props.description;
        return (
            <Card>
                <Card.Header>
                    {
                        editable ?
                            <DBAwareEdiText type='text' value={title} onSave={this.onSaveTitle} />
                                :
                            <>{title}</>
                    }
                </Card.Header>
                <Card.Body>
                    {
                        editable ?
                            <DBAwareEdiText type='textarea' value={description} onSave={this.onSaveDescription} />
                                :
                            <>{description}</>
                    }
                </Card.Body>
            </Card>
        );
    }
}