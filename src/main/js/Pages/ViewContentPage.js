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
    const [showAddContentModal, setShowAddContentModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showContributableModal, setShowContributableModal] = useState(false);

    const [surroundingContent, setSurroundingContent] = useState({
        rightContentBaseId: '',
        leftContentBaseId: '',
        parentContentBaseId: '',
        childContentBaseId: '',
    });
    const [parentIsPublic, setParentIsPublic] = useState(false);
    const [parentIsContributable, setParentIsContributable] = useState(false);
    useEffect(() => {
        let isMounted = true;

        async function loadSurroundingContent() {
            try {
                // load the surrounding content
                let res = await fetch('/content/surroundings?id=' + contentBaseId);
                res = await res.json();
                if (res.status !== 'OK') throw new Error('Failed to load surrounding content.');
                let leftContentBaseId = res.content.leftContentBaseRef;
                let rightContentBaseId = res.content.rightContentBaseRef;
                let parentContentBaseId = res.content.parentContentBaseRef;
                let childContentBaseId = res.content.childContentBaseRef;

                // figure out if the parent is public and/or contributable
                let parentIsPublic;
                let parentIsContributable;
                if (!parentContentBaseId) {
                    // no parent means the current content is a series;
                    // series must always be allowed to be made public,
                    // and users are not "contributable"
                    parentIsPublic = true;
                    parentIsContributable = false;
                } else {
                    res = await fetch(`/content/visibility?id=${parentContentBaseId}`);
                    res = await res.json();
                    if (res.status !== 'OK') throw new Error(`Failed to load visibility of content for ContentBase ID: ${parentContentBaseId}.`);
                    parentIsPublic = res.content.public;
                    parentIsContributable = res.content.contributable;
                }

                if (isMounted) {
                    setSurroundingContent({
                        rightContentBaseId: rightContentBaseId,
                        leftContentBaseId: leftContentBaseId,
                        parentContentBaseId: parentContentBaseId,
                        childContentBaseId: childContentBaseId,
                    });
                    setParentIsPublic(parentIsPublic);
                    setParentIsContributable(parentIsContributable);
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
    const [isFirstFrame, setIsFirstFrame] = useState(false);
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
                let isFirstFrame = type === 'Frame' && !res.content.contentBase.parents.frame;

                if (isMounted) {
                    setGeneralBaseId(generalBaseId);
                    setType(type);
                    setContentThumbnail(contentThumbnail);
                    setContentData(contentData);
                    setIsPublic(isPublic);
                    setIsContributable(isContributable);
                    setSketchId(sketchId);
                    setAuthorId(authorId);
                    setIsFirstFrame(isFirstFrame);
                }
            } catch (err) {
                console.error(err);
            }
        }
        loadData();

        return () => isMounted = false;
    }, [contentBaseId]);

    function handlePublishButtonClick(event) {
        event.preventDefault();
        setShowPublishModal(true);
    }

    async function handlePublish(event) {
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

    function handleContributableButtonClick(event) {
        event.preventDefault();
        setShowContributableModal(true);
    }

    async function handleMakeContributable(event) {
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
            setShowAddContentModal(true);
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

    function createContentSameLevel(event) {
        try {
            event.preventDefault();

            // make sure the user is logged in
            if (!loggedInUserId) {
                setShowAddContentModal(true);
                return;
            }

            // make sure current content has valid type before creating new content
            switch (type) {
                case 'Series':
                case 'Episode':
                case 'Frame':
                    break;
                default:
                    console.error(`Failed to create new content due to invalid type for current content: ${type}.`);
                    return;
            }

            // go to content creation page
            changePage('newContent', {
                type: type,
                parentContentBaseId: parentContentBaseId,
                firstFrame: isFirstFrame
            });
        } catch (err) {
            console.error(err);
        }
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
                    </ButtonGroup>
                }
                {
                    generalBaseId &&
                    <Likes generalBaseId={generalBaseId} loggedInUserId={loggedInUserId}/>
                }
            </Col>
                :
            <Col xs={3}>
                <ContentInfoCard
                    contentBaseId={contentBaseId}
                    editable={true}
                />
                <ButtonGroup className='mt-3'>
                    {
                        parentIsPublic ?
                            <Button variant='primary' onClick={handlePublishButtonClick}>Publish</Button>
                                :
                            <Button variant='primary' disabled onClick={handlePublishButtonClick}>Publish</Button>
                    }
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
                                        (isContributable || userIsAuthor) &&
                                        <Fab onClick={createContent}>
                                            <i className="fas fa-plus fa-2x"/>
                                        </Fab>
                                    )
                            }
                        </Container>
                    </Col>
                    <Col xs={1} className='my-auto'>
                        {
                            rightContentBaseId ?
                                <Fab onClick={() => {changePage('viewContentPage', { contentBaseId: rightContentBaseId })}}>
                                    <i className="fas fa-arrow-right fa-2x"/>
                                </Fab>
                                    :
                                (
                                    (parentIsContributable || userIsAuthor) &&
                                    <Fab onClick={createContentSameLevel}>
                                        <i className="fas fa-plus fa-2x"/>
                                    </Fab>
                                )
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
                            rightContentBaseId ?
                                <Fab onClick={() => {changePage('viewContentPage', { contentBaseId: rightContentBaseId })}}>
                                    <i className="fas fa-arrow-right fa-2x"/>
                                </Fab>
                                    :
                                <Fab onClick={createContentSameLevel}>
                                    <i className="fas fa-plus fa-2x"/>
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

    let addContentModal = (
        <Modal show={showAddContentModal} onHide={() => {setShowAddContentModal(false)}}>
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

    let publishModal = (
        <Modal show={showPublishModal} onHide={() => {setShowPublishModal(false)}}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>{"Don't forget to save your work before publishing!\nAlso, are you sure you want to make this public? You cannot undo this action."}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {setShowPublishModal(false)}}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handlePublish}>
                    Publish
                </Button>
            </Modal.Footer>
        </Modal>
    );

    let contributableModal = (
        <Modal show={showContributableModal} onHide={() => {setShowContributableModal(false)}}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to make this contributable? You cannot undo this action.</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {setShowContributableModal(false)}}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleMakeContributable}>
                    Make Contributable
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <Container fluid className='my-3'>
            {addContentModal}
            {publishModal}
            {contributableModal}
            <Row>
                {leftColumn}
                {middleColumn}
                {rightColumn}
            </Row>
        </Container>
    );
}