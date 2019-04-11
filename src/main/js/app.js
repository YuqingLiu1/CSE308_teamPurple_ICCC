require("@babel/polyfill");
const React = require('react');
const ReactDOM = require('react-dom');

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
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
);