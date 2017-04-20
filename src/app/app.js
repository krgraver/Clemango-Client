import React, { Component } from 'react';
import request from 'superagent';
import TopNav from './Navigation/TopNav.js';
import AuthModal from './Modals/AuthModal.js';
import NotificationsPopup from './Notifications/NotificationsPopup.js';
import Footer from './Navigation/Footer.js';
import { browserHistory } from 'react-router';
import constant from '../config/constants.js';

class App extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			profilePic: '',
			firstName: '',
			lastName: '',
			credentials: '',
			newNotifications: [],
			latestNotifications: [],
			showNotifications: false,
			userAuthenticated: false,
			showAuthModal: false,
			showLogin: true,
			showReset: false,
			showSignup: false,
			showSetup: false,
			loginEmailValidation: null,
			loginPasswordValidation: null,
			resetEmailValidation: null,
			signupEmailValidation: null,
			signupPasswordValidation: null,
			signupFirstNameValidation: null,
			signupLastNameValidation: null,
			signupCredentialsValidation: null,
			loginError: false,
			resetError: false,
			signupError: false,
			passwordLengthError: false
		};
		this.userInfoUrl = constant.API_URL + '/user/getUser';
		this.loginUrl = constant.API_URL + '/user/login';
		this.signupUrl = constant.API_URL + '/user/signup';
		this.getSignatureUrl = constant.API_URL + '/user/signUser';
		this.saveSetupUrl = constant.API_URL + '/user/saveSetup';
		this.getUserUrl = constant.API_URL + '/user/getInfoByEmail';
		this.sendResetUrl = constant.API_URL + '/user/sendPasswordReset';
		this.checkEmailUrl = constant.API_URL + '/user/checkEmail';
		this.getNewNotificationsUrl = constant.API_URL + '/notifications/getNewNotifications';
		this.clearNotificationsUrl = constant.API_URL + '/notifications/clearNewNotifications';
		this.latestNotificationsUrl = constant.API_URL + '/notifications/getLatestNotifications';

		this.openAuthentication = this.openAuthentication.bind(this);
		this.closeAuthentication = this.closeAuthentication.bind(this);
		this.changeEmail = this.changeEmail.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.changeFirst = this.changeFirst.bind(this);
		this.changeLast = this.changeLast.bind(this);
		this.changeCredentials = this.changeCredentials.bind(this);
		this.showSignupModal = this.showSignupModal.bind(this);
		this.showSetupModal = this.showSetupModal.bind(this);
		this.showLoginModal = this.showLoginModal.bind(this);
		this.showResetModal = this.showResetModal.bind(this);
		this.logIn = this.logIn.bind(this);
		this.sendPasswordReset = this.sendPasswordReset.bind(this);
		this.logOut = this.logOut.bind(this);
		this.completeRegistration = this.completeRegistration.bind(this);
		this.showNotifications = this.showNotifications.bind(this);
		this.hideNotifications = this.hideNotifications.bind(this);
		this.clearNotificationsCollapsed = this.clearNotificationsCollapsed.bind(this);
		this.goToNotifications = this.goToNotifications.bind(this);
		this.goToUpload = this.goToUpload.bind(this);
	}

	componentDidMount() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		if (token) {
			this.setState({
				userAuthenticated: true
			});

			request.post(this.userInfoUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					user: currentUser
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						this.setState({
							profilePic: res.body.profilePic,
							karmaPoints: res.body.karmaPoints
						});
					}
				});

			request.post(this.getNewNotificationsUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					user: currentUser
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						this.setState({
							newNotifications: res.body
						});
					}
				});

			request.post(this.latestNotificationsUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					user: currentUser
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						this.setState({
							latestNotifications: res.body
						});
					}
				});
		}
	}

	openAuthentication() {
		this.setState({
			showAuthModal: true
		});
	}

	closeAuthentication() {
		this.setState({
			showAuthModal: false,
			showLogin: true,
			showReset: false,
			showSignup: false,
			showSetup: false,
			email: '',
			password: '',
			profilePic: '',
			firstName: '',
			lastName: '',
			jobTitle: '',
			credentials: '',
			loginEmailValidation: null,
			loginPasswordValidation: null,
			resetEmailValidation: null,
			signupEmailValidation: null,
			signupPasswordValidation: null,
			signupFirstNameValidation: null,
			signupLastNameValidation: null,
			signupCredentialsValidation: null,
			loginError: false,
			resetError: false,
			signupError: false,
			passwordLengthError: false
		});
	}

	changeEmail() {
		let newEmail = document.getElementById('userEmail').value;
		this.setState({
			email: newEmail,
			loginEmailValidation: null,
			resetEmailValidation: null,
			signupEmailValidation: null
		});
	}

	changePassword() {
		let newPassword = document.getElementById('userPassword').value;
		this.setState({
			password: newPassword,
			loginPasswordValidation: null,
			signupPasswordValidation: null
		});
	}

	changeFirst() {
		let newFirst = document.getElementById('newFirst').value;
		this.setState({
			firstName: newFirst,
			signupFirstNameValidation: null
		});
	}

	changeLast() {
		let newLast = document.getElementById('newLast').value;
		this.setState({
			lastName: newLast,
			signupLastNameValidation: null
		});
	}

	changeCredentials() {
		let newCredentials = document.getElementById('newCredentials').value;
		this.setState({
			credentials: newCredentials,
			signupCredentialsValidation: null
		});
	}

	showSignupModal() {
		this.setState({
			showSignup: true,
			showLogin: false,
			showReset: false
		});
	}

	showLoginModal() {
		this.setState({
			showSignup: false,
			showLogin: true,
			showReset: false
		});
	}

	showResetModal() {
		this.setState({
			showSignup: false,
			showLogin: false,
			showReset: true
		});
	}

	showSetupModal() {
		if (!this.state.email) {
			this.setState({
				signupEmailValidation: 'error'
			})
		}

		if (!this.state.password) {
			this.setState({
				signupPasswordValidation: 'error'
			});
		}

		if (this.state.password.length < 8) {
			this.setState({
				passwordLengthError: true
			});
		}

		if (this.state.email && this.state.password.length >= 8){
			request.post(this.checkEmailUrl)
				.send({
					email: this.state.email
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else if (res.body.error === 'user exists') {
						this.setState({
							signupError: true
						});
					} else {
						this.setState({
							showSetup: true,
							showSignup: false,
							signupError: false,
							passwordLengthError: false
						});
					}
				});
		}
	}

	logIn() {
		if (!this.state.email) {
			this.setState({
				loginEmailValidation: 'error'
			});
		}

		if (!this.state.password) {
			this.setState({
				loginPasswordValidation: 'error'
			});
		}

		if (this.state.email && this.state.password) {
			request.post(this.loginUrl)
				.send({
					email: this.state.email,
					password: this.state.password
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else if (res.body.error === 'invalid') {
						this.setState({
							loginError: true
						});
					} else {
						localStorage.setItem('token', res.body.token);
						localStorage.setItem('currentUser', res.body._id);
						localStorage.setItem('userEmail', res.body.email);

						this.setState({
							userAuthenticated: true,
							showAuthModal: false,
							password: '',
							loginError: false
						});

						let token = localStorage.getItem('token'),
							currentUser = localStorage.getItem('currentUser');

						request.post(this.userInfoUrl)
							.set('Authorization', 'Bearer ' + token)
							.send({
								user: currentUser
							})
							.end((err, res) => {
								if (err) {
									console.log(err);
								} else {
									this.setState({
										profilePic: res.body.profilePic,
										karmaPoints: res.body.karmaPoints
									});
								}
							});

						request.post(this.getNewNotificationsUrl)
							.set('Authorization', 'Bearer ' + token)
							.send({
								user: currentUser
							})
							.end((err, res) => {
								if (err) {
									console.log(err);
								} else {
									this.setState({
										newNotifications: res.body
									});
								}
							});

						request.post(this.latestNotificationsUrl)
							.set('Authorization', 'Bearer ' + token)
							.send({
								user: currentUser
							})
							.end((err, res) => {
								if (err) {
									console.log(err);
								} else {
									this.setState({
										latestNotifications: res.body
									});
								}
							});
					}
				});
		}
	}

	sendPasswordReset() {
		if (!this.state.email) {
			this.setState({
				resetEmailValidation: 'error'
			});
		} else {
			let accountEmail = document.getElementById('userEmail').value;

			request.post(this.getUserUrl)
				.send({
					email: accountEmail
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else if (res.body.error === 'invalid') {
						this.setState({
							resetError: true
						});
					} else {
						request.post(this.sendResetUrl)
							.send({
								userId: res.body._id,
								email: res.body.email,
								firstName: res.body.firstName
							})
							.end((err, res) => {
								if (err) {
									console.log(err);
								} else {
									this.setState({
										showAuthModal: false,
										resetError: false
									});
								}
							});
					}
				});
		}
	}

	logOut() {
		localStorage.removeItem('token');
		localStorage.removeItem('currentUser');
		localStorage.removeItem('userEmail');

		this.setState({
				userAuthenticated: false
			});

		browserHistory.push('/');
	}

	completeRegistration() {
		if (!this.state.firstName) {
			this.setState({
				signupFirstNameValidation: 'error'
			});
		}

		if (!this.state.lastName) {
			this.setState({
				signupLastNameValidation: 'error'
			});
		}

		if (!this.state.credentials) {
			this.setState({
				signupCredentialsValidation: 'error'
			});
		}

		if (this.state.firstName && this.state.lastName) {
			let uploadedPic = document.getElementById('profilePic').files[0];

			if (uploadedPic) {
				request.post(this.signupUrl)
					.send({
						email: this.state.email,
						password: this.state.password
					})
					.end((err, res) => {
						if (err) {
							console.log(err);
						} else {
							localStorage.setItem('token', res.body.token);
							localStorage.setItem('currentUser', res.body._id);

							let token = res.body.token,
								currentUser = res.body._id;

							request.post(this.getSignatureUrl)
								.set('Authorization', 'Bearer ' + token)
								.send({
									user: currentUser,
									imageName: uploadedPic.name,
									imageType: uploadedPic.type
								})
								.end((err, res) => {
									let signedData = res.body;

									request.put(signedData.signedUrl)
										.send(uploadedPic)
										.end((err, res) => {
											if (err) {
												console.log(err);
											} else {
												this.setState({
													profilePic: signedData.url
												});

												request.put(this.saveSetupUrl)
													.set('Authorization', 'Bearer ' + token)
													.send({
														currentUser: currentUser,
														profilePic: signedData.url,
														firstName: this.state.firstName,
														lastName: this.state.lastName,
														credentials: this.state.credentials
													})
													.end((err, res) => {
														if (err) {
															console.log(err);
														} else {
															this.setState({
																userAuthenticated: true,
																showAuthModal: false,
																showLogin: true,
																showReset: false,
																showSignup: false,
																showSetup: false,
																email: '',
																password: '',
																profilePic: signedData.url,
																firstName: '',
																lastName: '',
																credentials: ''
															});
														}
													});
											}
										});
								});
						}
					});
				} else {
					request.post(this.signupUrl)
						.send({
							email: this.state.email,
							password: this.state.password
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							} else {
								localStorage.setItem('token', res.body.token);
								localStorage.setItem('currentUser', res.body._id);

								let token = res.body.token,
									currentUser = res.body._id;

								request.put(this.saveSetupUrl)
									.set('Authorization', 'Bearer ' + token)
									.send({
										currentUser: currentUser,
										profilePic: 'https://s3.amazonaws.com/clemango/assets/avatar.png',
										firstName: this.state.firstName,
										lastName: this.state.lastName,
										credentials: this.state.credentials
									})
									.end((err, res) => {
										if (err) {
											console.log(err);
										} else {
											this.setState({
												userAuthenticated: true,
												showAuthModal: false,
												showLogin: true,
												showReset: false,
												showSignup: false,
												showSetup: false,
												email: '',
												password: '',
												profilePic: 'https://s3.amazonaws.com/clemango/assets/avatar.png',
												firstName: '',
												lastName: '',
												credentials: ''
											});
										}
									});
							}
						});
				}
		}
	}

	showNotifications() {
		this.setState({
			showNotifications: true
		});

		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		request.post(this.clearNotificationsUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						newNotifications: []
					});
				}
			});
	}

	clearNotificationsCollapsed() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		request.post(this.clearNotificationsUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						newNotifications: []
					});
				}
			});
	}

	hideNotifications() {
		this.setState({
			showNotifications: false
		});
	}

	goToNotifications() {
		this.setState({
			showNotifications: false
		});

		browserHistory.push('/notifications');
	}

	goToUpload(uploadId) {
		this.setState({
			showNotifications: false
		});

		browserHistory.push('/uploads/' + uploadId);
	}

	render() {
		return (
			<div>
				<AuthModal 	showLogin={this.state.showLogin}
							email={this.state.email}
							changeEmail={this.changeEmail}
							password={this.state.password}
							changePassword={this.changePassword}
							showResetModal={this.showResetModal}
							logIn={this.logIn}
							showSignupModal={this.showSignupModal}
							showReset={this.state.showReset}
							sendPasswordReset={this.sendPasswordReset}
							showLoginModal={this.showLoginModal}
							showSignup={this.state.showSignup}
							showSetupModal={this.showSetupModal}
							firstName={this.state.firstName}
							changeFirst={this.changeFirst}
							lastName={this.state.lastName}
							changeLast={this.changeLast}
							credentials={this.state.credentials}
							changeCredentials={this.changeCredentials}
							completeRegistration={this.completeRegistration}
							showAuthModal={this.state.showAuthModal}
							closeAuthentication={this.closeAuthentication}
							loginEmailValidation={this.state.loginEmailValidation}
							loginPasswordValidation={this.state.loginPasswordValidation}
							resetEmailValidation={this.state.resetEmailValidation}
							signupEmailValidation={this.state.signupEmailValidation}
							signupPasswordValidation={this.state.signupPasswordValidation}
							signupFirstNameValidation={this.state.signupFirstNameValidation}
							signupLastNameValidation={this.state.signupLastNameValidation}
							signupCredentialsValidation={this.state.signupCredentialsValidation}
							loginError={this.state.loginError}
							resetError={this.state.resetError}
							signupError={this.state.signupError}
							passwordLengthError={this.state.passwordLengthError}
				/>
				<TopNav userAuthenticated={this.state.userAuthenticated}
						showNotifications={this.showNotifications}
						hideNotifications={this.hideNotifications}
						newNotifications={this.state.newNotifications}
						profilePic={this.state.profilePic}
						openAuthentication={this.openAuthentication}
						clearNotificationsCollapsed={this.clearNotificationsCollapsed}
				/>
				<NotificationsPopup showNotifications={this.state.showNotifications}
									goToNotifications={this.goToNotifications}
									latestNotifications={this.state.latestNotifications}
									goToUpload={this.goToUpload}
				/>
				<div>
					{React.cloneElement(this.props.children, 	{logOut: this.logOut,
																authenticateUser: this.authenticateUser,
																email: this.state.email,
																password: this.state.password,
																openShare: this.openShare,
																closeShare: this.closeShare,
																setCurrentUpload: this.setCurrentUpload})
					}
				</div>
				<Footer />
			</div>
		);
	}
}

export default App;