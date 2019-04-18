import React from 'react';
import Container from 'react-bootstrap/Container';
import NewContentForm from '../Components/NewContentForm';

export default function() {
    return <Container className='pt-5'>
        <NewContentForm typeOptions={['Series', 'Episode', 'Frame']} />
    </Container>
}