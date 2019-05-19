require('@babel/polyfill');

import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Image from 'react-bootstrap/Image';

import Fab from '@material-ui/core/Fab';

import TestFrameEditor from '../Components/TestFrameEditor';
import ContentInfoCard from '../Components/ContentInfoCard';
import AddComment from '../Components/AddComment';


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
            contentThumbnail: '',
            contentData: {},
            comments: [],
            isPublic: false,
            isContributable: false,
            reload: true
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

            let contentData = JSON.parse(contentRes.content.sketch.data);
            let contentThumbnail = contentRes.content.sketch.thumbnail;
            let isPublic = contentRes.content.contentBase.public;
            let isContributable = contentRes.content.contentBase.contributable;
            let type = contentRes.content.contentBase.type;

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
                isPublic: isPublic,
                isContributable: isContributable,
            });
        } catch (err) {
            console.error(err);
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        try {
            // only re-fetch data if explicitly told to or if the ContentBase ID has changed (i.e. navigation)
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
                let isPublic = contentRes.content.contentBase.public;
                let isContributable = contentRes.content.contentBase.contributable;
                let type = contentRes.content.contentBase.type;

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
                    isPublic: isPublic,
                    isContributable: isContributable,
                    reload: false,
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    changeContent = (newContentBaseId) => {
        this.setState({
            contentBaseId: newContentBaseId,
            reload: true
        });
    }

    handlePublishButtonClick = async (e) => {
        try {
            e.preventDefault();

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

            if (publishRes.status !== 'OK') throw new Error('Could not make sketch public.');

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

    handleContributableButtonClick = async (e) => {
        try {
            e.preventDefault();

            let contentBaseId = this.state.contentBaseId;
            let res = await fetch('/content/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: contentBaseId,
                    contributable: true
                })
            });
            res = await res.json();
            if (res.status !== 'OK') throw new Error('Could not make sketch contributable.');

            let sketchId = this.state.sketchId;
            this.setState({
                reload: true
            });
            this.props.changePage('viewContentPage', {
                initialContentBaseId: contentBaseId,
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
        let reload = this.state.reload;
        let isContributable = this.state.isContributable;
        let isPublic = this.state.isPublic;
        return (
            <Container fluid className='my-3'>
                {
                    // check if we should show a public version of the content
                    !isPublic ?
                        // show the private version
                        <Row>
                            <Col xs={3}>
                                {
                                    reload ?
                                        'Loading...'
                                            :
                                        <ContentInfoCard
                                            contentBaseId={this.state.contentBaseId}
                                            editable={true}
                                        />
                                }
                                <ButtonGroup className='mt-3'>
                                    <Button variant='primary' onClick={this.handlePublishButtonClick}>Publish</Button>
                                    <Button variant='primary' disabled onClick={this.handleContributableButtonClick}>Make Contributable</Button>
                                </ButtonGroup>
                            </Col>
                            <Col xs={9} style={{ textAlign: 'center' }}>
                                <Row>
                                    <Col xs={1} className='my-auto'>
                                        {
                                            this.state.leftContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.leftContentBaseId)}}>
                                                <i className="fas fa-arrow-left fa-2x"/>
                                            </Fab>
                                        }
                                    </Col>
                                    <Col xs={10}>
                                        {
                                            this.state.parentContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.parentContentBaseId)}} className='mb-3'>
                                                <i className="fas fa-arrow-up fa-2x"/>
                                            </Fab>
                                        }
                                        <TestFrameEditor
                                            sketchData={this.state.contentData}
                                            sketchId={this.state.sketchId}
                                        />
                                        {
                                            this.state.childContentBaseId ?
                                            <Fab onClick={() => {this.changeContent(this.state.childContentBaseId)}}>
                                                <i className="fas fa-arrow-down fa-2x"/>
                                            </Fab>
                                                :
                                            <Fab onClick={this.createContent}>
                                                <i className="fas fa-plus fa-2x"/>
                                            </Fab>
                                        }
                                    </Col>
                                    <Col xs={1} className='my-auto'>
                                        {
                                            this.state.rightContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.rightContentBaseId)}}>
                                                <i className="fas fa-arrow-right fa-2x"/>
                                            </Fab>
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                            :
                        // show the public version
                        <Row>
                            <Col xs={3}>
                                <ContentInfoCard
                                    contentBaseId={this.state.contentBaseId}
                                    editable={false}
                                />
                                <ButtonGroup className='mt-3'>
                                    {
                                        !isContributable &&
                                            <Button
                                                variant='primary'
                                                onClick={this.handleContributableButtonClick}>Make Contributable</Button>
                                    }
                                </ButtonGroup>
                            </Col>
                            <Col xs={6} style={{ textAlign: 'center' }}>
                                <Row>
                                    <Col xs={1} className='my-auto'>
                                        {
                                            this.state.leftContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.leftContentBaseId)}}>
                                                <i className="fas fa-arrow-left fa-2x"/>
                                            </Fab>
                                        }
                                    </Col>
                                    <Col xs={10}>
                                        <Container>
                                            {
                                                this.state.parentContentBaseId &&
                                                <Fab onClick={() => {this.changeContent(this.state.parentContentBaseId)}} className='mb-3'>
                                                    <i className="fas fa-arrow-up fa-2x"/>
                                                </Fab>
                                            }
                                            <Image src={this.state.contentThumbnail} fluid />
                                            {
                                                this.state.childContentBaseId &&
                                                <Fab onClick={() => {this.changeContent(this.state.childContentBaseId)}}>
                                                    <i className="fas fa-arrow-down fa-2x"/>
                                                </Fab>
                                            }
                                        </Container>
                                    </Col>
                                    <Col xs={1} className='my-auto'>
                                        {
                                            this.state.rightContentBaseId &&
                                            <Fab onClick={() => {this.changeContent(this.state.rightContentBaseId)}}>
                                                <i className="fas fa-arrow-right fa-2x"/>
                                            </Fab>
                                        }
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={3}>
                                List of comments goes here
                                <AddComment />
                            </Col>
                        </Row>
                }
            </Container>
        );
    }
}