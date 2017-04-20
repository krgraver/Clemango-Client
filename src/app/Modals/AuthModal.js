import React, { Component } from 'react';
import { Modal, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class AuthModal extends Component {
	constructor() {
		super();
		this.state = {
			imagePreviewUrl: 'https://s3.amazonaws.com/clemango/assets/avatar.png'
		}

		this.handleImageChange = this.handleImageChange.bind(this);
	}

	handleImageChange(e) {
		e.preventDefault();

		let reader = new FileReader(),
			file = e.target.files[0];

		reader.onloadend = () => {
			this.setState({
				imagePreviewUrl: reader.result
			});
		}

		reader.readAsDataURL(file);
	}

	render() {
		let ModalView;

		if (this.props.showLogin) {
			ModalView = <div>
							<Modal.Header closeButton>
					            <div className="modal-logo">
					        		<img src="assets/logo-color-sm.png" alt="Clemango Logo Orange" />
					        	</div>
					        </Modal.Header>
					        <Modal.Body>
					        	<h3 className="centered">Log In</h3>
					        	<FormGroup validationState={this.props.loginEmailValidation} className="form-input">
					        		<ControlLabel>Email</ControlLabel>
					        		<FormControl
					        			id="userEmail"
					        			className="form-input"
					        			type="text"
					        			value={this.props.email}
					        			onChange={this.props.changeEmail}
					        			placeholder="Enter email"
					        		/>
					        	</FormGroup>
					        	<FormGroup validationState={this.props.loginPasswordValidation}>
					        		<ControlLabel>Password</ControlLabel>
					        		<FormControl
					        			id="userPassword"
					        			className="form-input"
					        			type="password"
					        			value={this.props.password}
					        			onChange={this.props.changePassword}
					        			placeholder="Enter password"
					        		/>
					        	</FormGroup>
					        	{this.props.loginError ? <p className="disclaimer-error">Incorrect email or password</p> : null}
					        	<div className="centered buffer-top-md">
					        		<Button className="btn-clear buffer-bottom-sm" onClick={this.props.showResetModal}>Forgot Password?</Button>
					        		<Button className="btn-primary btn-full btn-block" onClick={this.props.logIn}>Log in</Button>
					        		<Button className="btn-outline btn-full btn-block" onClick={this.props.showSignupModal}>Create an account</Button>
					        	</div>
					        </Modal.Body>
				        </div>
		} else if (this.props.showReset) {
			ModalView = <div>
							<Modal.Header closeButton>
					            <div className="modal-logo">
					        		<img src="assets/logo-color-sm.png" alt="Clemango Logo Orange" />
					        	</div>
					        </Modal.Header>
					        <Modal.Body>
					       		<div className="centered buffer-bottom-md">
						        	<h3>Reset Password</h3>
						        	<p>Enter the email you used to set up your account and we will email you a link to reset your password.</p>
						        </div>
					        	<FormGroup validationState={this.props.resetEmailValidation}>
					        		<ControlLabel>Account Email</ControlLabel>
					        		<FormControl
					        			id="userEmail"
					        			className="form-input"
					        			type="text"
					        			value={this.props.email}
					        			onChange={this.props.changeEmail}
					        			placeholder="Enter your email address"
					        		/>
					        	</FormGroup>
					        	{this.props.resetError ? <p className="disclaimer-error">We don't have this email in our system</p> : null}
					        	<div className="centered buffer-top-md">
					        		<Button className="btn-clear" onClick={this.props.showLoginModal}>Cancel</Button>
						        	<Button className="btn-primary btn-full" onClick={this.props.sendPasswordReset}>Send password reset</Button>
						        </div>
					        </Modal.Body>
				        </div>
		} else if (this.props.showSignup) {
			ModalView = <div>
							<Modal.Header className="modal-header" closeButton>
					            <div className="modal-logo">
					        		<img src="assets/logo-color-sm.png" alt="Clemango Logo Orange" />
					        	</div>
					        </Modal.Header>
					        <Modal.Body>
					        	<h3 className="centered">Sign Up</h3>
					        	<FormGroup validationState={this.props.signupEmailValidation} className="form-input">
					        		<ControlLabel>Email</ControlLabel>
					        		<FormControl
					        			id="userEmail"
					        			className="form-input"
					        			type="text"
					        			value={this.props.email}
					        			onChange={this.props.changeEmail}
					        			placeholder="Enter your email address"
					        		/>
					        	</FormGroup>
					        	<FormGroup validationState={this.props.signupPasswordValidation}>
					        		<ControlLabel>Password</ControlLabel>
					        		<FormControl
					        			id="userPassword"
					        			className="form-input"
					        			type="password"
					        			value={this.props.password}
					        			onChange={this.props.changePassword}
					        			placeholder="Enter a secure password"
					        		/>
					        	</FormGroup>
					        	{this.props.signupError ? <p className="disclaimer-error">There is already an account for this email</p> : null}
					        	{this.props.passwordLengthError ? <p className="disclaimer-error">Passwords must be at least 8 characters</p> : null}
					        	<div className="centered buffer-top-md">
					        		<Button className="btn-clear buffer-bottom-sm" onClick={this.props.showLoginModal}>I have an account</Button>
						        	<Button className="btn-primary btn-full" onClick={this.props.showSetupModal}>Next</Button>
						        </div>
					        </Modal.Body>
				        </div>
		} else {
			ModalView = <div>
							<Modal.Header className="modal-header" closeButton>
					            <div className="modal-logo">
					        		<img src="assets/logo-color-sm.png" alt="Clemango Logo Orange" />
					        	</div>
					        </Modal.Header>
					        <Modal.Body>
					        	<div className="edit-profile-pic">
						        	<h3 className="centered">Account Setup</h3>
						        	<FormGroup>
						        		<div className="profile-container">
						        			<img src={this.state.imagePreviewUrl} id="profilePreview" alt="profile preview" />
						        		</div>
						        		<FormControl
						        			type="file"
						        			accept="image/jpeg, image/png"
						        			id="profilePic"
						        			onChange={(e) => this.handleImageChange(e)}
						        		/>
						        	</FormGroup>
						        </div>
					        	<FormGroup className="form-input" validationState={this.props.signupFirstNameValidation}>
					        		<ControlLabel>First Name</ControlLabel>
					        		<FormControl
					        			id="newFirst"
					        			className="form-input"
					        			type="text"
					        			value={this.props.firstName}
					        			onChange={this.props.changeFirst}
					        			placeholder="George"
					        		/>
					        	</FormGroup>
					        	<FormGroup className="form-input" validationState={this.props.signupLastNameValidation}>
					        		<ControlLabel>Last Name</ControlLabel>
					        		<FormControl
					        			id="newLast"
					        			className="form-input"
					        			type="text"
					        			value={this.props.lastName}
					        			onChange={this.props.changeLast}
					        			placeholder="Costanza"
					        		/>
					        	</FormGroup>
					        	<FormGroup className="form-input" validationState={this.props.signupCredentialsValidation}>
					        		<ControlLabel>Credentials</ControlLabel>
					        		<FormControl
					        			id="newCredentials"
					        			className="form-input"
					        			type="text"
					        			value={this.props.credentials}
					        			onChange={this.props.changeCredentials}
					        			placeholder="Designer at Vandelay Industries"
					        		/>
					        	</FormGroup>
					        	<div className="centered buffer-top-md">
					        		<Button className="btn-clear" onClick={this.props.showSignupModal}>Back</Button>
						        	<Button className="btn-primary btn-full" onClick={this.props.completeRegistration}>Complete Registration</Button>
						        </div>
					        </Modal.Body>
				        </div>
		}

		return (
			<Modal show={this.props.showAuthModal} onHide={this.props.closeAuthentication}>
				{ModalView}
			</Modal>
		);
	}
}

export default AuthModal;

