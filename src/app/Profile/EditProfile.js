import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import request from 'superagent';
import constant from '../../config/constants.js';
import DeleteAccountModal from '../Modals/DeleteAccountModal.js';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

class EditProfile extends Component {
	constructor() {
		super();
		this.state = {
			profilePic: '',
			imagePreviewUrl: '',
			firstName: '',
			lastName: '',
			credentials: '',
			firstNameValidation: null,
			lastNameValidation: null,
			credentialsValidation: null,
			showDeleteModal: false
		};
		this.userInfoUrl = constant.API_URL + '/user/getUser';
		this.getSignatureUrl = constant.API_URL + '/user/signUser';
		this.saveSetupUrl = constant.API_URL + '/user/saveSetup';
		this.deleteUserUrl = constant.API_URL + '/user/deleteUser';
		this.deleteUploadsUrl = constant.API_URL + '/uploads/deleteUploadsByUser';
		this.deleteCommentsUrl = constant.API_URL + '/comments/deleteCommentsByUser';
		this.deleteNotificationsUrl = constant.API_URL + '/notifications/deleteNotificationsByUser';

		this.handleImageChange = this.handleImageChange.bind(this);
		this.changeFirst = this.changeFirst.bind(this);
		this.changeLast = this.changeLast.bind(this);
		this.changeCredentials = this.changeCredentials.bind(this);
		this.submitChanges = this.submitChanges.bind(this);
		this.openDelete = this.openDelete.bind(this);
		this.closeDelete = this.closeDelete.bind(this);
		this.deleteUser = this.deleteUser.bind(this);
	}

	componentWillMount() {
		let token = localStorage.getItem('token');

		if (!token) {
			browserHistory.push('/');
		}
	}

	componentDidMount() {
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
						imagePreviewUrl: res.body.profilePic,
						firstName: res.body.firstName,
						lastName: res.body.lastName,
						credentials: res.body.credentials
					});

				document.getElementById('userFirst').value = this.state.firstName;
				document.getElementById('userLast').value = this.state.lastName;
				document.getElementById('userCredentials').value = this.state.credentials;	
				}
			});
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

	changeFirst() {
		let newFirst = document.getElementById('userFirst').value;
		this.setState({
			firstName: newFirst,
			firstNameValidation: null
		});
	}

	changeLast() {
		let newLast = document.getElementById('userLast').value;
		this.setState({
			lastName: newLast,
			lastNameValidation: null
		});
	}

	changeCredentials() {
		let newCredentials = document.getElementById('userCredentials').value;
		this.setState({
			credentials: newCredentials,
			lastNameValidation: null
		});
	}

	submitChanges() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser'),
			uploadedPic = document.getElementById('profilePic').files[0];

		if (!this.state.firstName) {
			this.setState({
				firstNameValidation: 'error'
			});
		}

		if (!this.state.lastName) {
			this.setState({
				lastNameValidation: 'error'
			});
		}

		if (!this.state.credentials) {
			this.setState({
				credentialsValidation: 'error'
			});
		}

		if (this.state.firstName && this.state.lastName && this.state.credentials) {
			if (uploadedPic) {
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
									request.put(this.saveSetupUrl)
										.set('Authorization', 'Bearer ' + token)
										.send({
											currentUser: currentUser,
											profilePic: signedData.url,
											firstName: this.state.firstName,
											lastName: this.state.lastName,
											credentials: this.state.credentials,
										})
										.end((err, res) => {
											if (err) {
												console.log(err);
											} else {
												browserHistory.push('/profile/me');
											}
										});
								}
							});
					});
			} else {
				request.put(this.saveSetupUrl)
					.set('Authorization', 'Bearer ' + token)
					.send({
						currentUser: currentUser,
						profilePic: this.state.profilePic,
						firstName: this.state.firstName,
						lastName: this.state.lastName,
						credentials: this.state.credentials
					})
					.end((err, res) => {
						if (err) {
							console.log(err);
						} else {
							browserHistory.push('/profile/me');
						}
					});
			}
		}
	}

	openDelete() {
		this.setState({
			showDeleteModal: true
		});
	}

	closeDelete() {
		this.setState({
			showDeleteModal: false
		});
	}

	deleteUser() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		request.post(this.deleteUploadsUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					console.log(res);
					request.post(this.deleteUserUrl)
						.set('Authorization', 'Bearer ' + token)
						.send({
							user: currentUser
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							}
						});

					request.post(this.deleteCommentsUrl)
						.set('Authorization', 'Bearer ' + token)
						.send({
							user: currentUser
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							}
						});

					request.post(this.deleteNotificationsUrl)
						.set('Authorization', 'Bearer ' + token)
						.send({
							user: currentUser
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							}
						});

					this.setState({
						showDeleteModal: false
					});

					this.props.logOut();
				}
			});
	}

	render() {
		return (
			<div>		
				<DeleteAccountModal	showDeleteModal={this.state.showDeleteModal}
									closeDelete={this.closeDelete}
									deleteUser={this.deleteUser}
				/>
				<Row>
					<Col xs={10} xsOffset={1} md={4} mdOffset={4} className="column-container buffer-top-md">
						<h2>Edit Profile</h2>
						<FormGroup>
							<div className="edit-profile-pic">
									<div className="profile-container form-input">
										<img src={this.state.imagePreviewUrl} alt="profile pic" />
									</div>
				        		<FormControl
				        			type="file"
				        			accept="image/jpeg, image/png"
				        			id="profilePic"
				        			className="form-input"
				        			onChange={(e) => {this.handleImageChange(e)}}
				        		/>
				        	</div>
				        </FormGroup>
				        <FormGroup validationState={this.state.firstNameValidation}>
			        		<ControlLabel>First Name</ControlLabel>
			        		<FormControl
			        			id="userFirst"
			        			className="form-input"
			        			type="text"
			        			value={this.state.firstName}
			        			onChange={this.changeFirst}
			        		/>
			        	</FormGroup>
				        <FormGroup validationState={this.state.lastNameValidation}>
			        		<ControlLabel>Last Name</ControlLabel>
			        		<FormControl
			        			id="userLast"
			        			className="form-input"
			        			type="text"
			        			value={this.state.lastName}
			        			onChange={this.changeLast}
			        		/>
			        	</FormGroup>
				        <FormGroup validationState={this.state.credentialsValidation}>
			        		<ControlLabel>Credentials</ControlLabel>
			        		<FormControl
			        			id="userCredentials"
			        			className="form-input"
			        			type="text"
			        			value={this.state.jobTitle}
			        			onChange={this.changeCredentials}
			        		/>
			        	</FormGroup>
			        	<div className="centered buffer-top-md">
			        		<Button className="btn-primary btn-full buffer-bottom-sm" onClick={this.submitChanges}>Save</Button>
			        	</div>
			        	<div className="centered">
			        		<Button className="btn-outline btn-full" onClick={this.openDelete}>Delete Account</Button>
			        	</div>
					</Col>
				</Row>
			</div>
		);
	}
}

export default EditProfile;