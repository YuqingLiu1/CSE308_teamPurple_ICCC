import React from 'react';
import Container from "react-bootstrap/Container";
import LoginForm from "../Components/LoginForm";

export default function(props) {
    return <Container className='mt-5'>
        <LoginForm {...props} />
    </Container>
}