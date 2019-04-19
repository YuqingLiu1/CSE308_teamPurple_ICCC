import React, { Component } from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import NavButton from './NavButtons/NavButton'

class Content extends Component {
    render() {
        return (
            <Container style={{ textAlign: 'center' }}>
                <Row>
                    <Col xs={3} />
                    <Col xs={6}>
                        <NavButton type='up'/>
                    </Col>
                    <Col xs={3} />
                </Row>
                <Row>
                    <Col xs={3} className='my-auto' style={{ textAlign: 'right' }}>
                        <NavButton type='none'/>
                    </Col>
                    <Col xs={6}>
                        <Image src='https://imgs.xkcd.com/comics/add_2x.png' rounded fluid />
                    </Col>
                    <Col xs={3} className='my-auto' style={{ textAlign: 'left' }}>
                        <NavButton type='right'/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ span: 6, offset: 3}}>
                        <NavButton type='down'/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Content;