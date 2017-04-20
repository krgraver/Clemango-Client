import React, { Component } from 'react';
import request from 'superagent';
import constant from '../../config/constants.js';
import { browserHistory } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

class ChangePassword extends Component {
	constructor() {
		super();
		this.state = {
			currentPassword: '',
			newPassword: '',
			confirmPassword: '',
			currentPasswordError: false,
			newPasswordError: false,
			passwordLengthError: false,
			passwordChanged: false
		}
		this.changePasswordUrl = constant.API_URL + '/user/changePassword';

		this.changeCurrentPassword = this.changeCurrentPassword.bind(this);
		this.changeNewPassword = this.changeNewPassword.bind(this);
		this.changeConfirm = this.changeConfirm.bind(this);
		this.submitPassword = this.submitPassword.bind(this);
	}

	componentWillMount() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		if (!token || !currentUser) {
			browserHistory.push('/');
		}
	}

	changeCurrentPassword() {
		let currentPassword = document.getElementById('currentPassword').value;

		this.setState({
			currentPassword: currentPassword,
			currentPasswordValidation: null
		});
	}

	changeNewPassword() {
		let newPassword = document.getElementById('newPassword').value;

		this.setState({
			newPassword: newPassword,
			newPasswordValidation: null
		});
	}

	changeConfirm() {
		let confirmPassword = document.getElementById('confirmPassword').value;

		this.setState({
			confirmPassword: confirmPassword,
			confirmPasswordValidation: null
		});
	}

	submitPassword() {
		if (!this.state.currentPassword) {
			this.setState({
				currentPasswordValidation: 'error'
			});
		}

		if (!this.state.newPassword) {
			this.setState({
				newPasswordValidation: 'error'
			});
		}

		if (!this.state.confirmPassword) {
			this.setState({
				confirmPasswordValidation: 'error'
			});
		}

		if (this.state.newPassword.length < 8) {
			this.setState({
				passwordLengthError: true,
				currentPasswordError: false,
				newPasswordError: false,
				passwordChanged: false
			});
		}

		if (this.state.currentPassword && this.state.newPassword && this.state.confirmPassword && this.state.newPassword.length >= 8) {
			if (this.state.newPassword !== this.state.confirmPassword) {
				this.setState({
					newPasswordError: true,
					currentPasswordError: false,
					passwordLengthError: false,
					passwordChanged: false
				});
			} else {
				let token = localStorage.getItem('token'),
					currentUser = localStorage.getItem('currentUser');

				request.post(this.changePasswordUrl)
					.set('Authorization', 'Bearer ' + token)
					.send({
						currentUser: currentUser,
						currentPassword: this.state.currentPassword,
						newPassword: this.state.newPassword
					})
					.end((err, res) => {
						if (err) {
							console.log(err);
						} else if (res.body.error === 'invalid') {
							this.setState({
								currentPasswordError: true,
								newPasswordError: false,
								passwordLengthError: false,
								passwordChanged: false
							});
						} else {
							this.setState({
								passwordChanged: true,
								currentPasswordError: false,
								newPasswordError: false,
								passwordLengthError: false
							});
						}
					});
			}
		}
		
	}

	render() {
		return (
			<Row>
				<Col xs={10} xsOffset={1} md={4} mdOffset={4} className="column-container buffer-top-md">
					<h2 className="buffer-bottom-md">Change Password</h2>
			        <FormGroup validationState={this.state.currentPasswordValidation}>
		        		<ControlLabel>Current Password</ControlLabel>
		        		<FormControl
		        			id="currentPassword"
		        			className="form-input"
		        			type="password"
		        			value={this.state.currentPassword}
		        			onChange={this.changeCurrentPassword}
		        			placeholder="Enter your current password"
		        		/>
		        	</FormGroup>
		        	<FormGroup validationState={this.state.newPasswordValidation}>
		        		<ControlLabel>New Password</ControlLabel>
		        		<FormControl
		        			id="newPassword"
		        			className="form-input"
		        			type="password"
		        			value={this.state.newPassword}
		        			onChange={this.changeNewPassword}
		        			placeholder="Enter a new password"
		        		/>
		        	</FormGroup>
			        <FormGroup validationState={this.state.confirmPasswordValidation}>
		        		<ControlLabel>Confirm New Password</ControlLabel>
		        		<FormControl
		        			id="confirmPassword"
		        			className="form-input"
		        			type="password"
		        			value={this.state.confirmPassword}
		        			onChange={this.changeConfirm}
		        			placeholder="Confirm your new password"
		        		/>
		        	</FormGroup>
		        	{this.state.passwordChanged ? <p className="disclaimer-success">Password changed!</p> : null}
		        	{this.state.currentPasswordError ? <p className="disclaimer-error">Incorrect current password</p> : null}
		        	{this.state.newPasswordError ? <p className="disclaimer-error">New password fields do not match</p> : null}
		        	{this.state.passwordLengthError ? <p className="disclaimer-error">Passwords must be at least 8 characters</p> : null}
		        	<div className="centered buffer-top-md">
		        		<Button className="btn-primary btn-full" onClick={this.submitPassword}>Update Password</Button>
		        	</div>
				</Col>
			</Row>
		);
	}
}

export default ChangePassword;