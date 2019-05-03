require('@babel/polyfill')

import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class AddComment extends Component{

    constructor(props){
        super(props);

        this.state = {
            comment: '',
            generalBaseId:props
        }
    }

    handleChange(event){
        console.log("general base id is: " + this.state.generalBaseId);
        this.setState({comment:event.target.value});
    }

    async handleSubmit(event) {
        await window.fetchJson('/comment/add', {
            on: '5cc90e40aa1e9934091cb9cd',
            author: '5cc8d85a0e57322500d6ab11',
            content: this.state.comment
        });
    }


    render(){
        return(

            <Form className="AddComment">
                <Form.Group controlId="addCommentText">
                    <Form.Label style={{color:'black', padding:'0px', textShadow: '1px 1px lightgray'}}>Your Comment</Form.Label>

                    <Form.Control
                        style={{backgroundColor:'white',
                            boxShadow: '0px 0px 4px rgba(0, 0, 0, .3)',
                            color: 'black',
                            fontSize: '15px',
                            border: '1px solid rgba(206, 206, 206, .6)',
                            borderRadius: '1px'}}
                        as='textarea'
                        rows={6}

                        placeholder='Leave your comment here...'
                        onChange={(e) => {this.handleChange(e)}}
                    />
                </Form.Group>

                <Button variant='primary' className="commentSubmit" type='submit' onClick={(e) => {this.handleSubmit(e)}}>
                    Submit
                </Button>
            </Form>
        );
    }
}