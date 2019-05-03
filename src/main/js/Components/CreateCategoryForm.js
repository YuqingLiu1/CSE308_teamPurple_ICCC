import Alert from "./LoginForm";

require('@babel/polyfill');

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class CreateCategoryForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            type: 'Series',   // default to the first option in the type select
            creator: 'Me',    // default to the first option in the created by select
            searchText: '',
        };
    }

    handleChange = (event, id) => {
        event.preventDefault();

        this.setState({
            [id]: event.target.value
        });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        try {
            let location = this.props.location;
            let name = this.state.name;
            let type = this.state.type;
            let creator = null;
            switch (this.state.creator) {
                case 'Me':
                    creator = this.props.userId;
                    break;
                case 'Anyone':
                    break;
                default:
                    throw new Error('Invalid creator: ' + this.state.creator);
            }
            let searchText = this.state.searchText;

            let createCategoryRes = await fetch('/user/categories/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: location,
                    name: name,
                    type: type,
                    creator: creator,
                    searchText: searchText,
                })
            });
            createCategoryRes = await createCategoryRes.json();
            if (createCategoryRes.status !== 'OK') throw new Error('Failed to create new category');

            this.props.changePage('homepage');
        } catch (err) {
            console.error(err);
        }
    };

    render() {
        return (
            <Form>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter category name"
                        onChange={(e)=>{this.handleChange(e, 'name')}}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Control as='select' onChange={(e) => {this.handleChange(e, 'type')}}>
                        <option value='Series'>Series</option>
                        <option value='Episodes'>Episodes</option>
                        <option value='Frames'>Frames</option>
                        <option value='Content'>All Content</option>
                        <option value='Users'>Users</option>
                        <option value='All'>All Users and Content</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Created by</Form.Label>
                    <Form.Control as='select' onChange={(e) => {this.handleChange(e, 'creator')}}>
                        <option value='Me'>Me</option>
                        <option value='Anyone'>Anyone</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Show only users/content that match the following search text</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder='Search text'
                        onChange={(e) => {this.handleChange(e, 'searchText')}}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                    Submit
                </Button>
            </Form>
        )
    }
}