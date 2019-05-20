require('@babel/polyfill');

import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Image from 'react-bootstrap/Image';
import Modal from "react-bootstrap/Modal";

import Fab from '@material-ui/core/Fab';

import TestFrameEditor from '../Components/TestFrameEditor';
import ContentInfoCard from '../Components/ContentInfoCard';
import Comments from '../Components/Comments';
import Likes from '../Components/Likes';

export default function ViewContentPage({ contentBaseId, loggedInUserId, changePage }) {
    const [showModal, setShowModal] = useState(false);

    const [surroundingContent, setSurroundingContent] = useState({
        rightContentBaseId: '',
        leftContentBaseId: '',
        parentContentBaseId: '',
        childContentBaseId: '',
    });
    useEffect(() => {
        let isMounted = true;

        async function loadSurroundingContent() {
            try {
                let res = await fetch('/content/surroundings?id=' + contentBaseId);
                res = await res.json();
                if (res.status !== 'OK') throw new Error('Failed to load surrounding content.');
                let leftContentBaseId = res.content.leftContentBaseRef;
                let rightContentBaseId = res.content.rightContentBaseRef;
                let parentContentBaseId = res.content.parentContentBaseRef;
                let childContentBaseId = res.content.childContentBaseRef;

                if (isMounted) {
                    setSurroundingContent({
                        rightContentBaseId: rightContentBaseId,
                        leftContentBaseId: leftContentBaseId,
                        parentContentBaseId: parentContentBaseId,
                        childContentBaseId: childContentBaseId,
                    });
                }
            } catch (err) {
                console.log(err);
            }
        }
        loadSurroundingContent();

        return () => isMounted = false;
    }, [contentBaseId]);

    const [generalBaseId, setGeneralBaseId] = useState('');
    const [type, setType] = useState('');
    const [contentThumbnail, setContentThumbnail] = useState('');
    const [contentData, setContentData] = useState({});
    const [isPublic, setIsPublic] = useState(true);
    const [isContributable, setIsContributable] = useState(false);
    const [sketchId, setSketchId] = useState('');
    const [authorId, setAuthorId] = useState('');
    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                let res = await fetch('/content/info?id=' + contentBaseId);
                res = await res.json();
                if (res.status !== 'OK') throw new Error('Failed to load content info.');

                let contentData = JSON.parse(res.content.sketch.data);
                let contentThumbnail = res.content.sketch.thumbnail;
                let sketchId = res.content.sketch.id;
                let isPublic = res.content.contentBase.public;
                let isContributable = res.content.contentBase.contributable;
                let type = res.content.contentBase.type;
                let generalBaseId = res.content.generalBase.id;
                let authorId = res.content.contentBase.author;

                if (isMounted) {
                    setGeneralBaseId(generalBaseId);
                    setType(type);
                    setContentThumbnail(contentThumbnail);
                    setContentData(contentData);
                    setIsPublic(isPublic);
                    setIsContributable(isContributable);
                    setSketchId(sketchId);
                    setAuthorId(authorId);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadData();

        return () => isMounted = false;
    }, [contentBaseId]);

    async function handlePublishButtonClick(event) {
        try {
            event.preventDefault();

            // attempt to make the content public
            let id = contentBaseId;
            let res = await fetch('/content/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    public: true
                })
            });
            res = await res.json();
            if (res.status !== 'OK') throw new Error('Could not make content public.');

            // content successfully made public, so refresh the page
            changePage('refresh');
        } catch (err) {
            console.error(err);
        }
    }

    async function handleContributableButtonClick(event) {
        try {
            event.preventDefault();

            // attempt to make the content contributable
            let id = contentBaseId;
            let res = await fetch('/content/edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    contributable: true
                })
            });
            res = await res.json();
            if (res.status !== 'OK') throw new Error('Could not make content contributable.');

            // content successfully made contributable, so refresh the page
            changePage('refresh');
        } catch (err) {
            console.error(err);
        }
    }

    function createContent(event) {
        event.preventDefault();

        // make sure user is logged in
        if (!loggedInUserId) {
            setShowModal(true);
            return;
        }

        let parentContentBaseId = contentBaseId;
        let currentContentType = type;
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
        changePage('newContent', {
            type: newContentType,
            parentContentBaseId: parentContentBaseId,
            firstFrame: firstFrame
        });
    }

    function closeModal() {
        setShowModal(false);
    }

    // rendering logic
    let leftContentBaseId = surroundingContent.leftContentBaseId;
    let rightContentBaseId = surroundingContent.rightContentBaseId;
    let parentContentBaseId = surroundingContent.parentContentBaseId;
    let childContentBaseId = surroundingContent.childContentBaseId;
    let userIsAuthor = loggedInUserId && (loggedInUserId === authorId);

    let leftColumn = (
        isPublic ?
            <Col xs={3}>
                <ContentInfoCard
                    contentBaseId={contentBaseId}
                    editable={false}  // TODO: figure out if this is actually not supposed to be editable
                />
                {
                    userIsAuthor &&
                    <ButtonGroup className='mt-3'>
                        {
                            !isContributable &&
                            <Button
                                variant='primary'
                                onClick={handleContributableButtonClick}>Make Contributable</Button>
                        }
                        {
                            generalBaseId &&
                            <Likes generalBaseId={generalBaseId}/>
                        }
                    </ButtonGroup>
                }
            </Col>
                :
            <Col xs={3}>
                <ContentInfoCard
                    contentBaseId={contentBaseId}
                    editable={true}
                />
                <ButtonGroup className='mt-3'>
                    <Button variant='primary' onClick={handlePublishButtonClick}>Publish</Button>
                    <Button variant='primary' disabled onClick={handleContributableButtonClick}>Make Contributable</Button>
                </ButtonGroup>
            </Col>
    );

    let middleColumn = (
        isPublic ?
            <Col xs={6} style={{ textAlign: 'center' }}>
                <Row>
                    <Col xs={1} className='my-auto'>
                        {
                            leftContentBaseId &&
                            <Fab onClick={() => {changePage('viewContentPage', { contentBaseId: leftContentBaseId })}}>
                                <i className="fas fa-arrow-left fa-2x"/>
                            </Fab>
                        }
                    </Col>
                    <Col xs={10}>
                        <Container>
                            {
                                parentContentBaseId &&
                                <Fab onClick={() => {changePage('viewContentPage', { contentBaseId: parentContentBaseId })}} className='mb-3'>
                                    <i className="fas fa-arrow-up fa-2x"/>
                                </Fab>
                            }
                            {
                                contentThumbnail &&
                                <Image src={contentThumbnail} fluid/>
                            }
                            {
                                childContentBaseId ?
                                    <Fab onClick={() => {changePage('viewContentPage', { contentBaseId: childContentBaseId })}}>
                                        <i className="fas fa-arrow-down fa-2x"/>
                                    </Fab>
                                    :
                                    (
                                        isContributable &&
                                        <Fab onClick={createContent}>
                                            <i className="fas fa-plus fa-2x"/>
                                        </Fab>
                                    )
                            }
                        </Container>
                    </Col>
                    <Col xs={1} className='my-auto'>
                        {
                            rightContentBaseId &&
                            <Fab onClick={() => {changePage('viewContentPage', { contentBaseId: rightContentBaseId })}}>
                                <i className="fas fa-arrow-right fa-2x"/>
                            </Fab>
                        }
                    </Col>
                </Row>
            </Col>
                :
            <Col xs={9} style={{ textAlign: 'center' }}>
                <Row>
                    <Col xs={1} className='my-auto'>
                        {
                            leftContentBaseId &&
                            <Fab onClick={() => {changePage('viewContentPage', { contentBaseId: leftContentBaseId })}}>
                                <i className="fas fa-arrow-left fa-2x"/>
                            </Fab>
                        }
                    </Col>
                    <Col xs={10}>
                        {
                            parentContentBaseId &&
                            <Fab onClick={() => {changePage('viewContentPage', { contentBaseId: parentContentBaseId })}} className='mb-3'>
                                <i className="fas fa-arrow-up fa-2x"/>
                            </Fab>
                        }
                        {
                            sketchId &&
                            <TestFrameEditor
                                sketchData={contentData}
                                sketchId={sketchId}
                            />
                        }
                        {
                            childContentBaseId ?
                                <Fab onClick={() => {changePage('viewContentPage', { contentBaseId: childContentBaseId })}}>
                                    <i className="fas fa-arrow-down fa-2x"/>
                                </Fab>
                                :
                                <Fab onClick={createContent}>
                                    <i className="fas fa-plus fa-2x"/>
                                </Fab>
                        }
                    </Col>
                    <Col xs={1} className='my-auto'>
                        {
                            rightContentBaseId &&
                            <Fab onClick={() => {changePage('viewContentPage', { contentBaseId: rightContentBaseId })}}>
                                <i className="fas fa-arrow-right fa-2x"/>
                            </Fab>
                        }
                    </Col>
                </Row>
            </Col>
    );

    let rightColumn = (
        isPublic &&
        <Col xs={3}>
            {
                generalBaseId &&
                <Comments
                    generalBaseId={generalBaseId}
                    contentBaseId={contentBaseId}
                    loggedInUserId={loggedInUserId}
                />
            }
        </Col>
    );

    let modal = (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Welcome!</Modal.Title>
            </Modal.Header>
            <Modal.Body>You must be logged in to add content.</Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => {changePage('login')}}>
                    Login
                </Button>
                <Button variant="primary" onClick={() => {changePage('create')}}>
                    Create Account
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <Container fluid className='my-3'>
            {modal}
            <Row>
                {leftColumn}
                {middleColumn}
                {rightColumn}
            </Row>
        </Container>
    );
}