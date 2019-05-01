require('@babel/polyfill');

import React, { Component } from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';

export default class SearchResultsPage extends Component {
    render() {
        let content = this.props.content;
        let userContent = content.users;
        let seriesContent = content.series;
        let episodeContent = content.episodes;
        let frameContent = content.frames;
        return (
            <Container className='my-5'>
                <div>
                    <h1>Users</h1>
                    {
                        userContent.length > 0 ?
                            <CardDeck>
                                {userContent.map((userContent) => {
                                    return (
                                        <Card key={userContent.user.id}>
                                            <Card.Body>
                                                <Card.Title>{userContent.generalBase.title}</Card.Title>
                                                <Card.Text>{userContent.generalBase.description}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </CardDeck>
                                :
                            <Alert variant='secondary'>No results found</Alert>
                    }
                </div>
                <div className='mt-3'>
                    <h1>Series</h1>
                    {
                        seriesContent.length > 0 ?
                            <CardDeck>
                                {seriesContent.map((seriesContent) => {
                                    return (
                                        <Card key={seriesContent.contentBase.id}>
                                            <Card.Body>
                                                <Card.Title>{seriesContent.generalBase.title}</Card.Title>
                                                <Card.Text>{seriesContent.generalBase.description}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </CardDeck>
                            :
                            <Alert variant='secondary'>No results found</Alert>
                    }
                </div>
                <div className='mt-3'>
                    <h1>Episodes</h1>
                    {
                        episodeContent.length > 0 ?
                            <CardDeck>
                                {episodeContent.map((episodeContent) => {
                                    return (
                                        <Card key={episodeContent.contentBase.id}>
                                            <Card.Body>
                                                <Card.Title>{episodeContent.generalBase.title}</Card.Title>
                                                <Card.Text>{episodeContent.generalBase.description}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </CardDeck>
                            :
                            <Alert variant='secondary'>No results found</Alert>
                    }
                </div>
                <div className='mt-3'>
                    <h1>Frames</h1>
                    {
                        frameContent.length > 0 ?
                            <CardDeck>
                                {frameContent.map((frameContent) => {
                                    return (
                                        <Card key={frameContent.contentBase.id}>
                                            <Card.Body>
                                                <Card.Title>{frameContent.generalBase.title}</Card.Title>
                                                <Card.Text>{frameContent.generalBase.description}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    );
                                })}
                            </CardDeck>
                            :
                            <Alert variant='secondary'>No results found</Alert>
                    }
                </div>
            </Container>
        );
    }
}