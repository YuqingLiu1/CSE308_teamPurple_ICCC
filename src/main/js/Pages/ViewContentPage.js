require('@babel/polyfill');

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TestFrameEditor from '../Components/TestFrameEditor';
import Fab from '@material-ui/core/Fab';
import Image from 'react-bootstrap/Image';
import ContentCard from '../Components/ContentCard';

export default class ViewContentPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contentBaseId: props.initialContentBaseId,
            sketchId: props.initialSketchId,
            rightContentBaseId: '',
            leftContentBaseId: '',
            parentContentBaseId: '',
            childContentBaseId: '',
            authorName: '',
            authorBio: '',
            authorThumbnail: '',
            contentThumbnail: '',
            contentData: {},
            comments: [],
            editable: false,
            title: '',
            description: ''
        }
    }

    async componentDidMount() {
        try {
            let contentRes = await fetch('/content/info?id=' + this.state.contentBaseId);
            contentRes = await contentRes.json();
            if (contentRes.status !== 'OK') throw new Error();
            let surroundingsRes = await fetch('/content/surroundings?id=' + this.state.contentBaseId);
            surroundingsRes = await surroundingsRes.json();
            if (surroundingsRes.status !== 'OK') throw new Error('Something went wrong fetching surrounding content');

            // TODO: fetch author info
            // TODO: fetch comment info

            let contentData = JSON.parse(contentRes.content.sketch.data);
            let contentThumbnail = contentRes.content.sketch.thumbnail;
            let editable = !contentRes.content.contentBase.public;
            let title = contentRes.content.generalBase.title;
            let description = contentRes.content.generalBase.description;

            let leftContentBaseId = surroundingsRes.content.leftContentBaseRef;
            let rightContentBaseId = surroundingsRes.content.rightContentBaseRef;
            let parentContentBaseId = surroundingsRes.content.parentContentBaseRef;
            let childContentBaseId = surroundingsRes.content.childContentBaseRef;

            this.setState({
                contentThumbnail: contentThumbnail,
                contentData: contentData,
                rightContentBaseId: rightContentBaseId,
                leftContentBaseId: leftContentBaseId,
                parentContentBaseId: parentContentBaseId,
                childContentBaseId: childContentBaseId,
                editable: editable,
                title: title,
                description: description
            });
        }

        catch (err) {
            console.error(err);
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        try {
            // only re-fetch data if the ContentBase ID has changed
            if (this.state.contentBaseId !== prevState.contentBaseId) {
                let contentRes = await fetch('/content/info?id=' + this.state.contentBaseId);
                contentRes = await contentRes.json();
                if (contentRes.status !== 'OK') throw new Error('Something went wrong fetching content info');
                let surroundingsRes = await fetch('/content/surroundings?id=' + this.state.contentBaseId);
                surroundingsRes = await surroundingsRes.json();
                if (surroundingsRes.status !== 'OK') throw new Error('Something went wrong fetching surrounding content');

                let contentData = JSON.parse(contentRes.content.sketch.data);
                let contentThumbnail = contentRes.content.sketch.thumbnail;
                let sketchId = contentRes.content.sketch.id;
                let editable = !contentRes.content.contentBase.public;
                let title = contentRes.content.generalBase.title;
                let description = contentRes.content.generalBase.description;

                let leftContentBaseId = surroundingsRes.content.leftContentBaseRef;
                let rightContentBaseId = surroundingsRes.content.rightContentBaseRef;
                let parentContentBaseId = surroundingsRes.content.parentContentBaseRef;
                let childContentBaseId = surroundingsRes.content.childContentBaseRef;

                this.setState({
                    sketchId: sketchId,
                    contentThumbnail: contentThumbnail,
                    contentData: contentData,
                    rightContentBaseId: rightContentBaseId,
                    leftContentBaseId: leftContentBaseId,
                    parentContentBaseId: parentContentBaseId,
                    childContentBaseId: childContentBaseId,
                    editable: editable,
                    title: title,
                    description: description
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    changeContent = (newContentBaseId) => {
        this.setState({
            contentBaseId: newContentBaseId
        });
    }

    render() {
        return (
            <Container fluid className='my-3'>
                {
                    // check if we should show an editable version of the content
                    this.state.editable ? // note: this check needs to change because it's not really what we want
                        <Row>
                            <Col xs={3}>
                                <ContentCard
                                    contentBaseId={this.state.contentBaseId}
                                    editable={true}
                                    title={this.state.title}
                                    description={this.state.description}
                                />
                            </Col>
                            <Col xs={9} style={{ textAlign: 'center' }}>
                                <Row>
                                    <Col xs={1} className='my-auto'>
                                        {
                                            this.state.leftContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.leftContentBaseId)}}>
                                                <i className="fas fa-arrow-left fa-2x"></i>
                                            </Fab>
                                        }
                                    </Col>
                                    <Col xs={10}>
                                        {
                                            this.state.parentContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.parentContentBaseId)}} className='mb-3'>
                                                <i className="fas fa-arrow-up fa-2x"></i>
                                            </Fab>
                                        }
                                        <TestFrameEditor
                                            sketchData={this.state.contentData}
                                            sketchId={this.state.sketchId}
                                        />
                                        {
                                            this.state.childContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.childContentBaseId)}}>
                                                <i className="fas fa-arrow-down fa-2x"></i>
                                            </Fab>
                                        }
                                    </Col>
                                    <Col xs={1} className='my-auto'>
                                        {
                                            this.state.rightContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.rightContentBaseId)}}>
                                                <i className="fas fa-arrow-right fa-2x"></i>
                                            </Fab>
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                            :
                        <Row>
                            <Col>
                                This is where the author info will go
                            </Col>
                            <Col>
                                <Row>
                                    <Col xs={1} className='my-auto'>
                                        {
                                            this.state.leftContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.leftContentBaseId)}}>
                                                <i className="fas fa-arrow-left fa-2x"></i>
                                            </Fab>
                                        }
                                    </Col>
                                    <Col xs={10}>
                                        {
                                            this.state.parentContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.parentContentBaseId)}} className='mb-3'>
                                                <i className="fas fa-arrow-up fa-2x"></i>
                                            </Fab>
                                        }
                                        <Image src={this.state.contentThumbnail} />
                                        {
                                            this.state.childContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.childContentBaseId)}}>
                                                <i className="fas fa-arrow-down fa-2x"></i>
                                            </Fab>
                                        }
                                    </Col>
                                    <Col xs={1} className='my-auto'>
                                        {
                                            this.state.rightContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.rightContentBaseId)}}>
                                                <i className="fas fa-arrow-right fa-2x"></i>
                                            </Fab>
                                        }
                                    </Col>
                                </Row>
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