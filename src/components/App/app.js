import React, { Component } from 'react';
import request from 'superagent';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem, Modal, Button, Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import constant from '../../config/constants.js';

class App extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			userAuthenticated: false,
			showModal: false,
			showSignup: false
		};
		this.loginUrl = constant.API_URL + '/login';
		this.signupUrl = constant.API_URL + '/signup';

		this.openAuthentication = this.openAuthentication.bind(this);
		this.closeAuthentication = this.closeAuthentication.bind(this);
		this.changeEmail = this.changeEmail.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.showSignupModal = this.showSignupModal.bind(this);
		this.showLoginModal = this.showLoginModal.bind(this);
		this.logIn = this.logIn.bind(this);
		this.logOut = this.logOut.bind(this);
		this.signUp = this.signUp.bind(this);
	}

	componentWillMount() {
		if (localStorage.getItem('token')) {
			this.setState({
				userAuthenticated: true
			});
		}
	}

	openAuthentication() {
		this.setState({
			showModal: true
		});
	}

	closeAuthentication() {
		this.setState({
			showModal: false
		});
	}

	changeEmail() {
		let newEmail = document.getElementById('userEmail').value;
		this.setState({
			email: newEmail
		});
	}

	changePassword() {
		let newPassword = document.getElementById('userPassword').value;
		this.setState({
			password: newPassword
		});
	}

	showSignupModal() {
		this.setState({
			showSignup: true
		});
	}

	showLoginModal() {
		this.setState({
			showSignup: false
		});
	}

	logIn() {
		request.post(this.loginUrl)
			.send({
				email: this.state.email,
				password: this.state.password
			})
			.end((err, res) => {
				if (res.body !== 'invalid password') {
					localStorage.setItem('token', res.body);

					this.setState({
						userAuthenticated: true,
						showModal: false
					});
				}
			});
	}

	logOut() {
		localStorage.removeItem('token');

		this.setState({
			userAuthenticated: false
		});
	}

	signUp() {
		request.post(this.signupUrl)
			.send({
				email: this.state.email,
				password: this.state.password
			})
			.end((err, res) => {
				localStorage.setItem('token', res.body);
			});

			this.setState({
				userAuthenticated: true,
				showModal: false
			});
		}

	render() {
		let navItems;
		if (this.state.userAuthenticated) {
			navItems =  <Nav pullRight>
					    	<LinkContainer to="/upload">
					    		<NavItem eventKey={1}>Upload work</NavItem>
					    	</LinkContainer>
					    	<LinkContainer to="/groups">
					    		<NavItem eventKey={2}>Groups</NavItem>
					    	</LinkContainer>
					    	<NavItem eventKey={3} onClick={this.logOut}>Log out</NavItem>
					    </Nav>
		} else {
			navItems =  <Nav pullRight>
					    	<NavItem eventKey={1} onClick={this.openAuthentication}>Log in / Sign up</NavItem>
					    </Nav>
		};

		let modalView;
		if (this.state.showSignup) {
			modalView = <div>
							<Modal.Header closeButton>
					            <Modal.Title>Sign up</Modal.Title>
					        </Modal.Header>
					        <Modal.Body>
					        	<FormGroup>
					        		<ControlLabel>Email</ControlLabel>
					        		<FormControl
					        			id="userEmail"
					        			type="text"
					        			value={this.state.email}
					        			onChange={this.changeEmail}
					        			placeholder="Enter your email address"
					        		/>
					        		<ControlLabel>Password</ControlLabel>
					        		<FormControl
					        			id="userPassword"
					        			type="password"
					        			value={this.state.password}
					        			onChange={this.changePassword}
					        			placeholder="Enter a secure password"
					        		/>
					        	</FormGroup>
					        	<Button bsStyle="primary" onClick={this.signUp}>Sign up</Button>
					        	<Button onClick={this.showLoginModal}>I have an account</Button>
					        </Modal.Body>
				        </div>
		} else {
			modalView = <div>
							<Modal.Header closeButton>
					            <Modal.Title>Log in</Modal.Title>
					        </Modal.Header>
					        <Modal.Body>
					        	<FormGroup>
					        		<ControlLabel>Email</ControlLabel>
					        		<FormControl
					        			id="userEmail"
					        			type="text"
					        			value={this.state.email}
					        			onChange={this.changeEmail}
					        			placeholder="Enter email"
					        		/>
					        		<ControlLabel>Password</ControlLabel>
					        		<FormControl
					        			id="userPassword"
					        			type="password"
					        			value={this.state.password}
					        			onChange={this.changePassword}
					        			placeholder="Enter password"
					        		/>
					        	</FormGroup>
					        	<Button bsStyle="primary" onClick={this.logIn}>Log in</Button>
					        	<Button onClick={this.showSignupModal}>Create an account</Button>
					        </Modal.Body>
				        </div>
		}

		return (
			<div>
				<Modal show={this.state.showModal} onHide={this.closeAuthentication}>
					{modalView}
				</Modal>
				<Navbar fixedTop fluid>
				    <Navbar.Header>
				      	<Navbar.Brand>
				        	<Link to="/" className="Logo">
				        		<img src="assets/logo-color.png" alt="Clemango Logo Orange" />
				        	</Link>
				      	</Navbar.Brand>
				      	<Navbar.Toggle />
				    </Navbar.Header>
				    <Navbar.Collapse>
					    {navItems}
				    </Navbar.Collapse>
				</Navbar>
				<Col md={10} mdOffset={1}>
					{this.props.children}
				</Col>
			</div>
		)
	}
}

export default App;