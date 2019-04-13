import React, { Component } from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event, id) {
        event.preventDefault();

        if (id === 'email') {
            this.setState({ email: event.target.value });
        } else if (id === 'password') {
            this.setState({ password: event.target.value });
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        try {
            let res = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            });
            res = await res.json();
            if (res.status == 'OK') {
                this.props.login();
                this.props.changePage('homepage');
            } else {
                console.log('Invalid credentials');
            }
        } catch (error) {
            alert('Error occurred during authentication.');
        }
    }

    render() {
        return (
            <Container>
                <Form>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" onChange={(e) => {this.handleChange(e, 'email')}}/>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" onChange={(e) => {this.handleChange(e, 'password')}}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={this.handleSubmit}>
                        Submit
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default LoginForm;