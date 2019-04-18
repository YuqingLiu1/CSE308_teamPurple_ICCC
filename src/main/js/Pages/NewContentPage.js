import React from 'react';
import Container from 'react-bootstrap/Container';
import NewContentForm from '../Components/NewContentForm';

export default function(props) {
    return <Container className='my-5'>
        <NewContentForm typeOptions={['Series', 'Episode', 'Frame']} changePage={props.changePage}/>
    </Container>
}