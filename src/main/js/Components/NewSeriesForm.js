require('@babel/polyfill')

import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class NewSeriesForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: props.type,
            title: '',
            description: '',
        }
    }

    handleChange(id, event) {
        this.setState({ [id]: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let type = this.state.type;
            let newContentRes;

            switch (type) {
                case 'Series':
                    newContentRes = await fetch('/content/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            type: 'Series',
                            title: this.state.title,
                            description: this.state.description,
                        })
                    });
                    break;
                case 'Episode':
                    newContentRes = await fetch('/content/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            type: 'Episode',
                            title: this.state.title,
                            description: this.state.description,
                            parentSeries: this.props.parentContentBaseId
                        })
                    });
                    break;
                case 'Frame':
                    if (this.props.firstFrame) {
                        newContentRes = await fetch('/content/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                type: 'Frame',
                                title: this.state.title,
                                description: this.state.description,
                                parentEpisode: this.props.parentContentBaseId
                            })
                        });
                    } else {
                        newContentRes = await fetch('/content/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                type: 'Frame',
                                title: this.state.title,
                                description: this.state.description,
                                parentFrame: this.props.parentContentBaseId
                            })
                        });
                    }
                    break;
                default:
                    throw new Error('Invalid content type: ' + type);
            }

            newContentRes = await newContentRes.json();
            if (newContentRes.status !== 'OK') throw new Error('Failed to create new content');
            this.props.changePage('viewContentPage', {
                initialContentBaseId: newContentRes.content.contentBase.id,
                initialSketchId: newContentRes.content.sketch.id
            });
        } catch (err) {
            console.error(err);
        }
    }

    render() {
        return (
            <>
                <h1>Create a New {this.state.type}</h1>
                <Form>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='My Title'
                            onChange={(e) => {this.handleChange('title', e)}}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as='textarea'
                            rows={10}
                            placeholder='My Description'
                            onChange={(e) => {this.handleChange('description', e)}}
                        />
                    </Form.Group>
                    <Button variant='primary' type='submit' onClick={this.handleSubmit}>
                        Create
                    </Button>
                </Form>
            </>
        );
    }
}

export default NewSeriesForm;