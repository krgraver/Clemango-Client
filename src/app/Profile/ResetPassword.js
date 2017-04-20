import React, { Component } from 'react';
import request from 'superagent';
import constant from '../../config/constants.js';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

class ResetPassword extends Component {
	constructor() {
		super();
		this.state = {
			password: '',
			confirmPassword: '',
			passwordError: false,
			passwordLengthError: false,
			passwordChanged: false,
			newPasswordValidation: null,
			confirmPasswordValidation: null
		}
		this.resetPasswordUrl = constant.API_URL + '/user/resetPassword';

		this.changePassword = this.changePassword.bind(this);
		this.changeConfirm = this.changeConfirm.bind(this);
		this.submitPassword = this.submitPassword.bind(this);
	}

	changePassword() {
		let newPassword = document.getElementById('newPassword').value;

		this.setState({
			password: newPassword,
			newPasswordValidation: null
		});
	}

	changeConfirm() {
		let newConfirm = document.getElementById('newConfirm').value;

		this.setState({
			confirmPassword: newConfirm,
			confirmPasswordValidation: null
		});
	}

	submitPassword() {
		if (!this.state.password) {
			this.setState({
				newPasswordValidation: 'error'
			});
		}

		if (!this.state.confirmPassword) {
			this.setState({
				confirmPasswordValidation: 'error'
			});
		}

		if (this.state.password.length < 8) {
			this.setState({
				passwordLengthError: true,
				passwordError: false,
				passwordChanged: false
			});
		}

		if (this.state.password && this.state.confirmPassword && this.state.password.length >= 8) {
			if (this.state.password === this.state.confirmPassword) {
				request.post(this.resetPasswordUrl)
					.send({
						token: this.props.params.resetToken,
						newPassword: this.state.password
					})
					.end((err, res) => {
						if (err) {
							console.log(err);
						} else {
							this.setState({
								passwordError: false,
								passwordLengthError: false,
								passwordChanged: true
							});
						}
					});
			} else {
				this.setState({
					passwordChanged: false,
					passwordLengthError: false,
					passwordError: true
				});
			}
		}
	}

	render() {
		return (
			<Row>
				<Col xs={10} xsOffset={1} md={4} mdOffset={4} className="column-container buffer-top-md">
					<h2 className="buffer-bottom-md">Reset Password</h2>
			        <FormGroup validationState={this.state.newPasswordValidation}>
		        		<ControlLabel>New Password</ControlLabel>
		        		<FormControl
		        			id="newPassword"
		        			className="form-input"
		        			type="password"
		        			value={this.state.newPassword}
		        			onChange={this.changePassword}
		        			placeholder="Enter a new password"
		        		/>
		        	</FormGroup>
			        <FormGroup validationState={this.state.confirmPasswordValidation}>
		        		<ControlLabel>Confirm Password</ControlLabel>
		        		<FormControl
		        			id="newConfirm"
		        			className="form-input"
		        			type="password"
		        			value={this.state.confirmPassword}
		        			onChange={this.changeConfirm}
		        			placeholder="Confirm your new password"
		        		/>
		        	</FormGroup>
		        	{this.state.passwordChanged ? <p className="disclaimer-success">Password changed!</p> : null}
		        	{this.state.passwordError ? <p className="disclaimer-error">Password fields do not match</p> : null}
		        	{this.state.passwordLengthError ? <p className="disclaimer-error">Passwords must be at least 8 characters</p> : null}
		        	<div className="centered buffer-top-md">
		        		<Button className="btn-primary btn-full" onClick={this.submitPassword}>Update Password</Button>
		        	</div>
				</Col>
			</Row>
		);
	}
}

export default ResetPassword;