require('@babel/polyfill')

import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class NewContentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            type: props.typeOptions[0],
            title: '',
            description: '',
        }
    }

    handleChange(id, event) {
        this.setState({ [id]: event.target.value });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        let newContentRes = await fetch('/content/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: this.state.type,
                title: this.state.title,
                description: this.state.description,
            })
        });
        newContentRes = await newContentRes.json();
        if (newContentRes.status === 'OK') {
            this.props.changePage('editor', newContentRes.content);
        } else {
            alert('Sorry, something went wrong :(');
        }
    }

    render() {
        let typeOptions = this.props.typeOptions;
        return <Form>
            <Form.Group>
                <Form.Label>Type</Form.Label>
                <Form.Control as='select' onChange={(e) => {this.handleChange('type', e)}}>
                    {
                        typeOptions.map(option =>
                            <option key={option} value={option}>{option}</option>
                        )
                    }
                </Form.Control>
            </Form.Group>
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
    }
}

export default NewContentForm;