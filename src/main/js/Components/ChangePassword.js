import React, {Component} from 'react'
import doFetch from '../Helpers/general.js'

class ChangePassword extends Component
{
	constructor(props)
	{
		super(props)

		this.state={
			password      : '',
			passwordAgain : '',
			badCredentials: false,
			errors        : false
		}

		this.handleSubmit=this.handleSubmit.bind(this)
	}

	handlePassword(event){
		this.setState({password : event.target.value})
	}

	handlePass(event){
		this.setState({passwordAgain : event.target.value})
	}

	async handleSubmit(event){
		event.preventDefault()
		console.log("password is: " + this.state.password);
		console.log("password again is: " + this.state.passwordAgain);


		console.log("in sending password");
		let result = await doFetch('/user/setpassword', {method: 'POST', body: this.state.password})
		console.log(result);


	}

	render()
	{
		return (
			<div className="form1">
				<form>
					<h3 style={{"text-align": "center", "color": "black"}}>Change Password</h3>
					<div className="changePasswordDiv">
						<label className="changePasswordLabel">Password</label>
						<br/>
						<input type="password" className="form-control" className="changePasswordInput" onChange={this.handlePassword}/>
					</div>
					<div className="editDiv">
						<label className="changePasswordLabel">Enter Password Again</label>
						<br/>
						<input type="password" className="form-control" className="changePasswordInput" onChange={this.handlePass}/>
					</div>
					<br/>
					<button type="submit" className="btn btn-primary" className="changePasswordBtn" onClick={this.handleSubmit}>
						change
					</button>
				</form>
			</div>
		)
	}
}

export default ChangePassword