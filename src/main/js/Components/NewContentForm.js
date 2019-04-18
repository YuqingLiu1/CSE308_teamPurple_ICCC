import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function({typeOptions}) {
    return <Form>
        <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Control as='select'>
                {typeOptions.map(option => <option key={option}>{option}</option>)}
            </Form.Control>
        </Form.Group>
        <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control type='text' placeholder='My Title' />
        </Form.Group>
        <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control as='textarea' rows={10} placeholder='My Description' />
        </Form.Group>
        <Button variant='primary' type='submit'>
            Create
        </Button>
    </Form>
}