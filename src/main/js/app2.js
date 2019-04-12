require("@babel/polyfill");
import React from 'react';
import ReactDOM from 'react-dom';

import LoginForm from './LoginForm';

class App2 extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event) {
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        });
    }

    async handleSubmit(event) {
        event.preventDefault();

        let response = await fetch("/test/adduser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        });
        alert('response status: ' + response.status);
    }

    render() {
        return (
            <div>
                <form action="/test/adduser" method="POST">
                    <div>
                        <label>Email</label>
                        <input type="email" placeholder="Email" onChange={this.handleEmailChange}/>
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary" onClick={this.handleSubmit}>Create</button>
                </form>
                <LoginForm />
            </div>
        );
    }
}

ReactDOM.render(
    <App2 />,
    document.getElementById('react')
);