require('@babel/polyfill')

import React, { Component } from 'react';
import Form from "react-bootstrap/Form";

export default class UploadProfilePicture extends Component {
    handleSubmit = async (event) => {
        event.preventDefault();

        let data = new FormData();
        let file = event.target.files[0];
        data.append('file', file);

        // setting and then deleting the Content-Type header is very important for some unknown reason
        let options = {
            method: 'POST',
            body: data,
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };
        delete options.headers['Content-Type'];

        let editProfileImageRes = await fetch('/profilePicture/edit', options);
        editProfileImageRes = await editProfileImageRes.json();
        if (editProfileImageRes.status === 'OK') {
            this.props.refresh();
        } else {
            alert('Failed to set image as profile picture.');
        }
    }

    render() {
        return (

            <div style={{backgroundColor:'rgba(128,0,128,.2)',padding:10,borderRadius:20}}><Form encType='multipart/form-data'>
                Upload a profile picture:
                <br/>
                <Form.Control type='file' onChange={this.handleSubmit}/>
            </Form></div>
        );
    }
}