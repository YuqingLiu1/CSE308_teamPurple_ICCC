require("@babel/polyfill");
import React, { Component } from 'react';

class CreateAccount extends Component{
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            image: '',
            errors: false,
            badCredentials: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    async onImageChange(event){
        event.preventDefault();
        if (event.target.files && event.target.files[0]){
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({image: e.target.result});
            };

            console.log(event.target.files);
            console.log(event.target.files[0].type);
            console.log(event.target.files[0].type.startsWith("image/"));

            if (event.target.files[0].type.startsWith("image/")){
                console.log("send");
                reader.readAsDataURL(event.target.files[0]);
                //sending the file
                try{
                    let res = await fetch('/frame/upload', {
                        method: 'POST',
                        headers: {
                            'Content-Type': event.target.files[0].type
                        },
                        body: this.state.image
                    });
                    res = await res.json();
                    if (res.status == 'OK'){
                        console.log("Success");
                    }
                    else{
                        this.setState({badCredentials: true});
                    }
                } catch(error){
                    this.setState({errors: true});
                }


            }
            else{
                alert("You should only upload image");
            }
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        let res = await fetch('/user/add', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state)
        });
        res = await res.json();
        console.log(res);
    }

    render(){
        return(
            <div className="form2">
                <form action="/user/add" method="POST">
                    <h3 style={{"textAlign":"center", "color":"black", "fontFamily":"Comic Sans MS, cursive, sans-serif"}}>Create Your Account</h3>
                    <div className="form-group createDiv">
                        <label className="createLabel">User Name</label>
                        <br/>
                        <input type="text" className="form-control createInput" value={this.state.username} placeholder="e.g:user123" onChange={(e) => {this.setState({username: e.target.value})}}/>
                    </div>
                    <div className="form-group createDiv">
                        <label className="createLabel">Email</label>
                        <br></br>
                        <input type="email" className="form-control createInput" value={this.state.email} placeholder="e.g:user123@mail.com" onChange={(e) => {this.setState({email: e.target.value})}}/>
                    </div>
                    <div className="form-group createDiv">
                        <label className="createLabel">Password</label>
                        <br/>
                        <input type="password" className="form-control createInput" value={this.state.password} onChange={(e) => {this.setState({password: e.target.value})}}/>
                    </div>
                    <div className="form-group createDiv">
                        <label className="createLabel">Enter password again</label>
                        <br/>
                        <input type="password" className="form-control createInput" value={this.state.password} onChange={(e) => {this.setState({password: e.target.value})}}/>
                    </div>
                    <br/>
                    <button type="submit" className="btn btn-primary createButton" style={{"textAlign":"center"}} onClick={this.handleSubmit}>create</button>
                    <input type="file" onChange={this.onImageChange} className="filetype" id="group_image"/>

                </form>
            </div>
        );
    }
}

export default CreateAccount;