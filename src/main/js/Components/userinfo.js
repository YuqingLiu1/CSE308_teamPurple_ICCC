require("@babel/polyfill");

import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Thumbnail from './thumbnail';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

let defaultText = `
Anyone can write user stories.
It's the product owner's responsibility to make sure a
product backlog of agile user stories exists, but that
doesn’t mean that the product owner is the one who writes
them. Over the course of a good agile project, you
should expect to have user story examples written by each team member.
`

class UserInfo extends Component {
    async componentDidMount() {
        let userInfoRes = await fetch('/user/info');
        userInfoRes = await userInfoRes.json();
        if (userInfoRes.status === 'OK') {
            // do something on OK
        } else {
            // do something on error
        }
    }

    render() {
        return (
            <Container className="mt-5">
                <Jumbotron>
                    <Container>
                        <Row>
                            <Col xs="{3}">
                                <Thumbnail src={this.props.imageUrl} />
                            </Col>
                            <Col>
                                <p className="ml-5">
                                    {this.props.description ? this.props.description : defaultText}
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </Jumbotron>
            </Container>
        );
    }
}

export default UserInfo;