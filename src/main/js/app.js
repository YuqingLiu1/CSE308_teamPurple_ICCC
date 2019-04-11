require("@babel/polyfill");
import React from 'react';
import ReactDOM from 'react-dom';

import LoginForm from './LoginForm';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: ''
        };
    }

    async componentDidMount() {
        let user = await fetch("/test");
        user = await user.json();
        this.setState({
            email: user.email
        });
    }

    render() {
        return (
            <div>
                <h1>Hello World!</h1>
                <p>Fetched email: {this.state.email}</p>
                <button type="button" className="btn btn-primary">Press me!</button>
                <LoginForm />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
);