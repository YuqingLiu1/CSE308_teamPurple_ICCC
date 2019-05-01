import React from 'react';
import Container from 'react-bootstrap/Container';
import NewSeriesForm from "../Components/NewSeriesForm";

export default function(props) {
    return <Container className='my-5'>
        <NewSeriesForm {...props} />
    </Container>
}