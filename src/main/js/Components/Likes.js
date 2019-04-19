import React, {Component} from 'react'
import HeartCheckbox from 'react-heart-checkbox';

class Demo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: false
		};
	}

	onClick = (evnet, props) => {
		this.setState({ checked: !this.state.checked });
	}

	render() {
		const { checked } = this.state;

		return (
			<>
				<h1>{checked ? 'checked' : 'unchecked'}</h1>
				<HeartCheckbox checked={checked} onClick={this.onClick} />
			</>
		);
	}
}

export default Demo