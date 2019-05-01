require('@babel/polyfill');

import React, { Component } from 'react';
import CardDeck from 'react-bootstrap/CardDeck';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

export default class SearchResultsPage extends Component {
    render() {
        let content = this.props.content;
        let contentLength = content.length;
        return (
            <Container className='my-5'>
                {
                    contentLength > 0 ?
                        <CardDeck>
                            {this.props.content.map((content) => {
                                return (
                                    <Card key={content.id}>
                                        <Card.Body>
                                            <Card.Title>{content.title}</Card.Title>
                                            <Card.Text>{content.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </CardDeck>
                            :
                        <h1>No results found</h1>
                }
            </Container>
        );
    }
}