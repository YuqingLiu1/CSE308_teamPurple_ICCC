require('@babel/polyfill')

import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

export default function ChangePassword({ }) {
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');
	const [passwordMismatch, setPasswordMismatch] = useState(false);

	async function handleSubmit(event) {
		try {
			event.preventDefault();

			// make sure password and password2 match
			if (password !== password2) {
				setPasswordMismatch(true);
				return;
			} else {
				setPasswordMismatch(false);
			}

			let res = await fetch('/user/edit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					password: password
				})
			});
			res = await res.json();
			if (res.status !== 'OK') throw new Error('Failed to change password.');
		} catch (err) {
			console.error(err);
		}
	}

	// rendering logic
	return (
		<Container>
			<div className="form1">
				<form>
					<h3 style={{textAlign: "center", color: "black"}}>Change Password</h3>
					{
						passwordMismatch &&
						<Alert variant='danger'>Password do not match</Alert>
					}
					<div className="changePasswordDiv">
						<label className="changePasswordLabel">Password</label>
						<br/>
						<input
							type="password"
							className="form-control changePasswordInput"
							onChange={(e) => {setPassword(e.target.value)}}/>
					</div>
					<div className="editDiv">
						<label className="changePasswordLabel">Enter Password Again</label>
						<br/>
						<input
							type="password"
							className="form-control changePasswordInput"
							onChange={(e) => {setPassword2(e.target.value)}}/>
					</div>
					<br/>
					<button type="submit" className="btn btn-primary" className="changePasswordBtn" onClick={handleSubmit}>
						change
					</button>
				</form>
			</div>
		</Container>
	);
}