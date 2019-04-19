import React, { Component } from 'react';
import Form from "react-bootstrap/Form";

class UploadImage extends Component {
    constructor(props) {
        super(props);
    }

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

        let res = await fetch('/profilePicture/upload', options);
        res = await res.json();
        if (res.status === 'OK') {
            let sketchRef = res.content;   // id of sketch object
            switch (this.props.uploadType) {
                case 'profile':
                    let setSketchRes = await fetch('/user/edit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            sketchRef: sketchRef
                        })
                    });
                    setSketchRes = await setSketchRes.json();
                    if (res.status === 'OK') {
                        // do something on okay
                        if (this.props.refresh) {
                            this.props.refresh();
                        }
                    } else {
                        alert('Failed to set image as profile picture');
                    }
                    break;
                default:
                    break;
            }
        } else {
            alert('Image failed to upload');
        }
    }

    render() {
        return (
            <Form encType='multipart/form-data'>
                <Form.Control type='file' onChange={this.handleSubmit}/>
            </Form>
        );
    }
}

export default UploadImage;