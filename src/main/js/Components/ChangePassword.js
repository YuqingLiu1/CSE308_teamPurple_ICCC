import React, {Component} from 'react'
import '../../resources/static/css/App.css'

class ChangePassword extends Component
{
	render()
	{
		return (
			<div className="form1">
				<form>
					<h3 style={{"text-align": "center", "color": "black"}}>Change Password</h3>
					<div className="changePasswordDiv">
						<label className="changePasswordLabel">Password</label>
						<br/>
						<input type="password" className="form-control" className="changePasswordInput"/>
					</div>
					<div className="editDiv">
						<label className="changePasswordLabel">Enter Password Again</label>
						<br/>
						<input type="password" className="form-control" className="changePasswordInput"/>
					</div>
					<br/>
					<button type="submit" className="btn btn-primary" className="changePasswordBtn">change</button>
				</form>
			</div>
		)
	}
}

export default ChangePassword