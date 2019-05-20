require('@babel/polyfill');

import React, { Component } from 'react';

import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

import CategoryCard from "../Components/CategoryCard";


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
                            <div style={{ overflowX: 'scroll', overflowY: 'hidden', whiteSpace: 'nowrap', backgroundColor: 'lightgray' }}>
                                {userContent.map(userContent => {
                                    return (
                                        <CategoryCard
                                            key={userContent.user.id}
                                            userId={userContent.user.id}
                                            onClick={() => {
                                                this.props.changePage('userInfo', {
                                                    userId: userContent.user.id
                                                })
                                            }}
                                            extraStyles={{ display: 'inline-block', marginLeft: '10px', marginRight: '10px' }}
                                        />
                                    );
                                })}
                            </div>
                                :
                            <Alert variant='secondary'>No results found</Alert>
                    }
                </div>
                <div className='mt-3'>
                    <h1>Series</h1>
                    {
                        seriesContent.length > 0 ?
                            <div style={{ overflowX: 'scroll', overflowY: 'hidden', whiteSpace: 'nowrap', backgroundColor: 'lightgray' }}>
                                {seriesContent.map(series => {
                                    return (
                                        <CategoryCard
                                            key={series.contentBase.id}
                                            contentBaseId={series.contentBase.id}
                                            onClick={() => {
                                                this.props.changePage('viewContentPage', {
                                                    contentBaseId: series.contentBase.id,
                                                })
                                            }}
                                            extraStyles={{ display: 'inline-block', marginLeft: '10px', marginRight: '10px' }}
                                        />
                                    );
                                })}
                            </div>
                                :
                            <Alert variant='secondary'>No results found</Alert>
                    }
                </div>
                <div className='mt-3'>
                    <h1>Episodes</h1>
                    {
                        episodeContent.length > 0 ?
                            <div style={{ overflowX: 'scroll', overflowY: 'hidden', whiteSpace: 'nowrap', backgroundColor: 'lightgray' }}>
                                {episodeContent.map(episode => {
                                    return (
                                        <CategoryCard
                                            key={episode.contentBase.id}
                                            contentBaseId={episode.contentBase.id}
                                            onClick={() => {
                                                this.props.changePage('viewContentPage', {
                                                    contentBaseId: episode.contentBase.id,
                                                })
                                            }}
                                            extraStyles={{ display: 'inline-block', marginLeft: '10px', marginRight: '10px' }}
                                        />
                                    );
                                })}
                            </div>
                                :
                            <Alert variant='secondary'>No results found</Alert>
                    }
                </div>
                <div className='mt-3'>
                    <h1>Frames</h1>
                    {
                        frameContent.length > 0 ?
                            <div style={{ overflowX: 'scroll', overflowY: 'hidden', whiteSpace: 'nowrap', backgroundColor: 'lightgray' }}>
                                {frameContent.map(frame => {
                                    return (
                                        <CategoryCard
                                            key={frame.contentBase.id}
                                            contentBaseId={frame.contentBase.id}
                                            onClick={() => {
                                                this.props.changePage('viewContentPage', {
                                                    contentBaseId: frame.contentBase.id,
                                                })
                                            }}
                                            extraStyles={{ display: 'inline-block', marginLeft: '10px', marginRight: '10px' }}
                                        />
                                    );
                                })}
                            </div>
                                :
                            <Alert variant='secondary'>No results found</Alert>
                    }
                </div>
            </Container>
        );
    }
}