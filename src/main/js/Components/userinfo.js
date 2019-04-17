require("@babel/polyfill");

import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Thumbnail from './thumbnail';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import EdiText from "react-editext";

class UserInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            username: '',
            bio: ''
        }

        this.onSave = this.onSave.bind(this);
    }

    async componentDidMount() {
        let userInfoRes = await fetch('/user/info');
        userInfoRes = await userInfoRes.json();
        if (userInfoRes.status === 'OK') {
            let userInfo = userInfoRes.content;
            this.setState({
                bio: userInfo.bio,
                username: userInfo.username
            });
        } else {
            this.setState({
                error: true
            });
        }
    }

    async onSave(val) {
        let userInfoRes = await fetch('/user/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                bio: val
            }
        });
        userInfoRes = await userInfoRes.json();
        if (userInfoRes.status === 'OK') {
            // do something on good save
        } else {
            // do something on bad save
        }
    };

    render() {
        if (this.state.error) {
            return (
                <Container className="mt-5">
                    <Jumbotron>
                        <Container>
                            <Row className="justify-content-center">
                                <p>Sorry, something went wrong <i className="far fa-frown"></i></p>
                            </Row>
                        </Container>
                    </Jumbotron>
                </Container>
            );
        } else {
            return (
                <Container className="mt-5">
                    <Jumbotron>
                        <Container>
                            <Row>
                                <Col xs="{3}">
                                    <Thumbnail src={this.props.imageUrl} title={this.state.username}/>
                                </Col>
                                <Col>
                                    <EdiText
                                        type="textarea"
                                        value={this.state.bio}
                                        onSave={this.onSave}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </Jumbotron>
                </Container>
            );
        }
    }
}

export default UserInfo;