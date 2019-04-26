require('@babel/polyfill');

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TestFrameEditor from '../Components/TestFrameEditor';

export default class ViewContentPage extends Component {
    render() {
        return (
            <Container fluid className='my-3'>
                {
                    this.props.loggedIn ?
                        <Row>
                            <Col xs={9}>
                                <TestFrameEditor />
                            </Col>
                            <Col xs={3}>
                                This is where the comments will go
                            </Col>
                        </Row>
                            :
                        <Row>
                            <Col>
                                This is where the author info will go
                            </Col>
                            <Col>
                                This is where the content will go
                            </Col>
                            <Col>
                                This is where the comments will go
                            </Col>
                        </Row>
                }
            </Container>
        );
    }
}