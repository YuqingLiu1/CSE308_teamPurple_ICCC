require('@babel/polyfill');

import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TestFrameEditor from '../Components/TestFrameEditor';
import Fab from '@material-ui/core/Fab';
import Image from 'react-bootstrap/Image';
import ContentCard from '../Components/ContentCard';
import Button from 'react-bootstrap/Button';

export default class ViewContentPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            contentBaseId: props.initialContentBaseId,
            sketchId: props.initialSketchId,
            type: '',
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
            description: '',
            reload: false
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
            let type = contentRes.content.contentBase.type;
            let title = contentRes.content.generalBase.title;
            let description = contentRes.content.generalBase.description;

            let leftContentBaseId = surroundingsRes.content.leftContentBaseRef;
            let rightContentBaseId = surroundingsRes.content.rightContentBaseRef;
            let parentContentBaseId = surroundingsRes.content.parentContentBaseRef;
            let childContentBaseId = surroundingsRes.content.childContentBaseRef;

            this.setState({
                type: type,
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
            if (this.state.reload || this.state.contentBaseId !== prevState.contentBaseId) {
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
                let type = contentRes.content.contentBase.type;
                let title = contentRes.content.generalBase.title;
                let description = contentRes.content.generalBase.description;

                let leftContentBaseId = surroundingsRes.content.leftContentBaseRef;
                let rightContentBaseId = surroundingsRes.content.rightContentBaseRef;
                let parentContentBaseId = surroundingsRes.content.parentContentBaseRef;
                let childContentBaseId = surroundingsRes.content.childContentBaseRef;

                this.setState({
                    sketchId: sketchId,
                    type: type,
                    contentThumbnail: contentThumbnail,
                    contentData: contentData,
                    rightContentBaseId: rightContentBaseId,
                    leftContentBaseId: leftContentBaseId,
                    parentContentBaseId: parentContentBaseId,
                    childContentBaseId: childContentBaseId,
                    editable: editable,
                    title: title,
                    description: description,
                    reload: false
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

    handlePublishButtonClick = async (e) => {
        e.preventDefault();

        try {
            let id = this.state.contentBaseId;

            let publishRes = await fetch('/content/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    public: true
                })
            });
            publishRes = await publishRes.json();

            if (publishRes.status !== 'OK') throw new Error('Could not make sketch public');

            let sketchId = this.state.sketchId;

            this.setState({
                reload: true
            });
            this.props.changePage('viewContentPage', {
                initialContentBaseId: id,
                initialSketchId: sketchId
            });
        } catch (err) {
            console.error(err);
        }
    }

    createContent = (e) => {
        e.preventDefault();

        let parentContentBaseId = this.state.contentBaseId;
        let currentContentType = this.state.type;
        let newContentType = '';
        let firstFrame = true;
        switch (currentContentType) {
            case 'Series':
                newContentType = 'Episode';
                break;
            case 'Episode':
                newContentType = 'Frame';
                break;
            case 'Frame':
                newContentType = 'Frame';
                firstFrame = false;
                break;
            default:
                console.error('Failed to create new content');
                return;
        }
        this.props.changePage('newContent', {
            type: newContentType,
            parentContentBaseId: parentContentBaseId,
            firstFrame: firstFrame
        });
    }

    render() {
        return (
            <Container fluid className='my-3'>
                {
                    // check if we should show an editable version of the content
                    this.state.editable ?
                        <Row>
                            <Col xs={3}>
                                <ContentCard
                                    contentBaseId={this.state.contentBaseId}
                                    editable={true}
                                    title={this.state.title}
                                    description={this.state.description}
                                />
                                <Button variant='primary' onClick={this.handlePublishButtonClick} className='mt-3'>Publish</Button>
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
                                            this.state.childContentBaseId ?
                                            <Fab onClick={() => {this.changeContent(this.state.childContentBaseId)}}>
                                                <i className="fas fa-arrow-down fa-2x"></i>
                                            </Fab>
                                                :
                                            <Fab onClick={this.createContent}>
                                                <i className="fas fa-plus fa-2x"></i>
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
                        // non-editable version
                        <Row>
                            <Col xs={3}>
                                <ContentCard
                                    contentBaseId={this.state.contentBaseId}
                                    editable={false}
                                    title={this.state.title}
                                    description={this.state.description}
                                />
                            </Col>
                            <Col xs={6} style={{ textAlign: 'center' }}>
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
                                        <Container>
                                            {
                                                this.state.parentContentBaseId &&
                                                <Fab onClick={() => {this.changeContent(this.state.parentContentBaseId)}} className='mb-3'>
                                                    <i className="fas fa-arrow-up fa-2x"></i>
                                                </Fab>
                                            }
                                            <Image src={this.state.contentThumbnail} fluid />
                                            {
                                                this.state.childContentBaseId &&
                                                <Fab onClick={() => {this.changeContent(this.state.childContentBaseId)}}>
                                                    <i className="fas fa-arrow-down fa-2x"></i>
                                                </Fab>
                                            }
                                        </Container>
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
                            <Col xs={3}>
                                This is where the comments will go
                            </Col>
                        </Row>
                }
            </Container>
        );
    }
}