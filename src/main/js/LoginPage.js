require("@babel/polyfill");
import React from 'react';
import ReactDOM from 'react-dom';

import LoginForm from './LoginForm';

class LoginPage extends React.Component {
    render() {
        return (
            <div>
                <LoginForm />
            </div>
        );
    }
}

ReactDOM.render(
    <LoginPage />,
    document.getElementById('react')
);