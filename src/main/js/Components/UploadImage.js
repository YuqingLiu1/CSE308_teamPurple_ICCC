import CreateAccount from "./CreateAccount";

require("@babel/polyfill");
import React, { Component } from 'react';


class UploadImage extends Component{
    constructor(props) {
        super(props);

        this.state = {
            image: '',
            errors: false,
            badCredentials: false
        }

        this.onImageChange = this.onImageChange.bind(this);

    }


    onImageChange(event){
        event.preventDefault();
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            var file = event.target.files[0];
            reader.onload = async (e) => {
                console.log(e.target.result);
                console.log(typeof (e.target.result));
                this.setState({image: e.target.result});

                var a = window.btoa(this.state.image);
                console.log(a);
                var myPict = {
                    img : a
                };



                var myObjPict = JSON.stringify(myPict);

                JSON.parse(myObjPict);

                let res = await fetch('/frame/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: myObjPict
                });
                res = await res.json();
                if (res.status == 'OK') {
                    console.log("Success");
                } else {
                    this.setState({badCredentials: true});
                }

            };

            if (event.target.files[0].type.startsWith("image/")) {
                console.log("send");

                //sending the file
                console.log("in file picker box " + this.state.image);
                reader.readAsBinaryString(file);
            } else {
                alert("You should only upload image");
            }



            console.log("reach here");
        }

    }

    render{
        return (
            <div>
                <input type="file" onChange={this.onImageChange} className="filetype" id="group_image"/>
            </div>
        );
    }
}

export default UploadImage;