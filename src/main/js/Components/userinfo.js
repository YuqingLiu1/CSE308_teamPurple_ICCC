require("@babel/polyfill");

import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Thumbnail from './thumbnail';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DBAwareEdiText from "./DBAwareEdiText";

class UserInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: false
        };
    }

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
                                    <Thumbnail src={this.props.imageUrl} title={this.props.username}/>
                                </Col>
                                <Col>
                                    <DBAwareEdiText
                                        inputProps={{
                                            rows: 5
                                        }}
                                        type="textarea"
                                        name="bio"
                                        value={this.props.bio}
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