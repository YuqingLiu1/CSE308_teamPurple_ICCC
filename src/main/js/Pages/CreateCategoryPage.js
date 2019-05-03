import React from 'react';
import Container from "react-bootstrap/Container";
import CreateCategoryForm from "../Components/CreateCategoryForm";

export default function(props) {
    return <Container className='mt-5'>
        <h1 className='mb-3'>Create Category</h1>
        <CreateCategoryForm {...props} />
    </Container>
}