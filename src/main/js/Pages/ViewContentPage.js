require('@babel/polyfill');

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TestFrameEditor from '../Components/TestFrameEditor';

import dataJson from '../Components/data.json';

export default class ViewContentPage extends Component {

    state = {
        authorName: '',
        authorBio: '',
        authorThumbnail: '',
        contentThumbnail: '',
        contentData: {},
        comments: []
    }

    async componentDidMount() {
        try {
            let contentRes = await fetch('/content/info?id=' + this.props.contentBaseId);
            contentRes = await contentRes.json();
            if (contentRes.status !== 'OK') throw new Error();

            // TODO: fetch author info

            let data = JSON.parse(contentRes.content.sketch.data);

            this.setState({
                contentThumbnail: contentRes.content.sketch.thumbnail,
                contentData: data,
            });
        }

        catch (err) {
            console.error(err);
        }
    }

    render() {
        return (
            <Container fluid className='my-3'>
                {
                    this.props.loggedIn ? // note: this check needs to change because it's not really what we want
                        <Row>
                            <Col xs={9}>
                                <TestFrameEditor sketchData={this.state.contentData} sketchId={this.props.sketchId} />
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