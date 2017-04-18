import React, { Component } from 'react';
import request from 'superagent';
import CopyToClipboard from 'react-copy-to-clipboard';
import constant from '../../config/constants.js';
import { Modal, FormControl, InputGroup, Button } from 'react-bootstrap';

class ShareModal extends Component {
	constructor() {
		super();
		this.state = {
			searchResults: [],
			showUserResults: false,
			usersToInvite: [],
			email: '',
			emailsToInvite: [],
			showSuggestedEmails: false,
			newSuggestedEmails: [],
			copied: false
		};
		this.searchUsersUrl = constant.API_URL + '/user/searchUsers';
		this.addUsersUrl = constant.API_URL + '/uploads/addUserInvitations';
		this.addNotificationUrl = constant.API_URL + '/notifications/addNotification';
		this.addEmailsUrl = constant.API_URL + '/uploads/addEmailInvitations';
		this.emailInviteUrl = constant.API_URL + '/uploads/sendEmailInvitation';
		this.addSuggestedUserUrl = constant.API_URL + '/user/addSuggestedUser';
		this.addSuggestedEmailsUrl = constant.API_URL + '/user/addSuggestedEmails';

		this.showUserResults = this.showUserResults.bind(this);
		this.hideUserResults = this.hideUserResults.bind(this);
		this.showSuggestedEmails = this.showSuggestedEmails.bind(this);
		this.hideSuggestedEmails = this.hideSuggestedEmails.bind(this);
		this.changeSearch = this.changeSearch.bind(this);
		this.addUser = this.addUser.bind(this);
		this.removeUser = this.removeUser.bind(this);
		this.changeEmail = this.changeEmail.bind(this);
		this.addEmail = this.addEmail.bind(this);
		this.removeEmail = this.removeEmail.bind(this);
		this.sendInvitations = this.sendInvitations.bind(this);
	}

	showUserResults() {
		let userSearch = document.getElementById('userSearch').value;

		if (userSearch.length === 0){
			this.setState({
				searchResults: this.props.suggestedUsers
			});
		}

		this.setState({
			showUserResults: true
		});
	}

	hideUserResults() {
		this.setState({
			showUserResults: false
		});
	}

	showSuggestedEmails() {
		this.setState({
			showSuggestedEmails: true
		});
	}

	hideSuggestedEmails() {
		this.setState({
			showSuggestedEmails: false
		});
	}

	changeSearch() {
		let token = localStorage.getItem('token');

		request.post(this.searchUsersUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				searchValue: document.getElementById('userSearch').value
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						searchResults: res.body
					});
				}
			});
	}

	addUser(_id, firstName, lastName) {
		let currentUser = localStorage.getItem('currentUser'),
			usersInvited = this.props.usersInvited,
			usersToInvite = this.state.usersToInvite,
			alreadyAdded = false;

		for (let i = 0; i < usersInvited.length; i++) {
			if (usersInvited[i]._id === _id) {
				alreadyAdded = true;
				break;
			}
		}

		for (let i = 0; i < usersToInvite.length; i++) {
			if (usersToInvite[i]._id === _id) {
				alreadyAdded = true;
				break;
			}
		}

		if (_id !== currentUser && !alreadyAdded) {
			this.setState({
				usersToInvite: this.state.usersToInvite.concat({
					_id: _id,
					firstName: firstName,
					lastName: lastName
				}),
				searchResults: []
			});
			document.getElementById('userSearch').value = '';
		}
	}

	removeUser(_id) {
		let index,
			usersToInvite = this.state.usersToInvite;

		for (let i = 0; i < usersToInvite.length; i++) {
			if (usersToInvite[i]._id === _id) {
				index = i;
				break;
			}
		}

		usersToInvite.splice(index, 1);

		this.setState({
			usersToInvite: usersToInvite
		});
	}

	changeEmail() {
		let newEmail = document.getElementById('inviteEmail').value;

		if (newEmail.length > 0) {
			this.setState({
				email: newEmail,
				showSuggestedEmails: false
			});
		} else {
			this.setState({
				email: newEmail,
				showSuggestedEmails: true
			});
		}
	}

	addEmail() {
		let emailsInvited = this.props.emailsInvited,
			alreadyAdded = false;

		for (let i = 0; i < emailsInvited.length; i++) {
			if (emailsInvited[i] === this.state.email) {
				alreadyAdded = true;
				break;
			}
		}

		if (!alreadyAdded) {
			this.setState({
				emailsToInvite: this.state.emailsToInvite.concat(document.getElementById('inviteEmail').value),
				email: ''
			});
		}

		let suggestedEmails = this.props.suggestedEmails,
			alreadySuggested = false;

		for (let i = 0; i < suggestedEmails.length; i++) {
			if (suggestedEmails[i] === this.state.email) {
				alreadySuggested = true;
				break;
			}
		}

		if (!alreadySuggested) {
			this.setState({
				newSuggestedEmails: this.state.newSuggestedEmails.concat(document.getElementById('inviteEmail').value)
			});
		}
	}

	addSuggestedEmail(email) {
		let emailsInvited = this.props.emailsInvited,
			alreadyAdded = false;

		for (let i = 0; i < emailsInvited.length; i++) {
			if (emailsInvited[i] === email) {
				alreadyAdded = true;
				break;
			}
		}

		if (!alreadyAdded) {
			this.setState({
				emailsToInvite: this.state.emailsToInvite.concat(email),
				email: ''
			});
		}

	}

	removeEmail(email) {
		let index,
			emailsToInvite = this.state.emailsToInvite;

		for (let i = 0; i < emailsToInvite.length; i++) {
			if (emailsToInvite[i] === email) {
				index = i;
				break;
			}
		}

		emailsToInvite.splice(index, 1);

		this.setState({
			emailsToInvite: emailsToInvite
		});
	}

	sendInvitations() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser'),
			usersToInvite = this.state.usersToInvite;

		if (usersToInvite.length > 0) {
			for (let i = 0; i < usersToInvite.length; i++) {
				request.post(this.addNotificationUrl)
					.set('Authorization', 'Bearer ' + token)
					.send({
						notification: this.props.userFirst + ' ' + this.props.userLast + ' invited you to view ' + this.props.uploadTitle,
						_recipient: usersToInvite[i]._id,
						_upload: this.props.uploadId
					})
					.end((err, res) => {
						if (err) {
							console.log(err);
						}
					});

				request.post(this.addSuggestedUserUrl)
					.set('Authorization', 'Bearer ' + token)
					.send({
						user: currentUser,
						suggestedUser: usersToInvite[i]._id
					})
					.end((err, res) => {
						if (err) {
							console.log(err);
						}
					});
			}

			request.post(this.addUsersUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					upload: this.props.uploadId,
					usersToInvite: usersToInvite
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						this.setState({
							usersToInvite: []
						});

						this.props.updateUpload(res.body);
					}
				});
		}

		if (this.state.emailsToInvite.length > 0) {
			request.post(this.addSuggestedEmailsUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					user: currentUser,
					suggestedEmails: this.state.newSuggestedEmails
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					}
				});

			request.post(this.addEmailsUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					upload: this.props.uploadId,
					emails: this.state.emailsToInvite
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						let updatedUpload = res.body;

						let inviteList = this.state.emailsToInvite;

						for (let i = 0; i < inviteList.length; i++) {
							request.post(this.emailInviteUrl)
								.set('Authorization', 'Bearer ' + token)
								.send({
									email: inviteList[i],
									sender: this.props.userFirst + ' ' + this.props.userLast,
									uploadId: this.props.uploadId,
									uploadTitle: this.props.uploadTitle,
									imageUrl: this.props.imageUrl
								})
								.end((err, res) => {
									if (err) {
										console.log(err);
									} else {
										this.setState({
											emailsToInvite: []
										});

										this.props.updateUpload(updatedUpload);
									}
								});
						}
					}
				});
		}

		this.props.closeShare();
	}

	render() {
		let UserResults;

		if (this.state.showUserResults && this.state.searchResults.length > 0) {
			UserResults = 	<ul className="invite-search-results">
			        			{this.state.searchResults.map(({_id, profilePic, firstName, lastName, credentials}) =>
			        				<li key={_id} onMouseDown={() => this.addUser(_id, firstName, lastName)}>
			        					<div className="user-info">
											<div className="profile-small">
						    					<img src={profilePic} alt="profile thumbnail" />
						    				</div>
											<h4>{firstName} {lastName}</h4>
											<h5>{credentials}</h5>
										</div>
			        				</li>
			        			)}
			        		</ul>
		} else {
			UserResults = <div></div>
		}

		let SuggestedEmails;

		if (this.state.showSuggestedEmails && this.props.suggestedEmails.length > 0) {
			SuggestedEmails = 	<ul className="invite-search-results">
				        			{this.props.suggestedEmails.map((email) =>
				        				<li key={email} onMouseDown={() => this.addSuggestedEmail(email)}>
				        					<h4>{email}</h4>
				        				</li>
				        			)}
				        		</ul>
		} else {
			SuggestedEmails = <div></div>
		}

		let SubmitButton;

		if (this.state.usersToInvite.length > 0 || this.state.emailsToInvite.length > 0) {
			SubmitButton = 	<Button className="btn-primary btn-full buffer-bottom-sm" onClick={() => this.sendInvitations()}><i className="fa fa-paper-plane inset-icon" aria-hidden="true"></i> Send Invites</Button>
		} else {
			SubmitButton = 	<Button className="btn-primary btn-full btn-disabled buffer-bottom-sm"><i className="fa fa-paper-plane inset-icon" aria-hidden="true"></i> Send Invites</Button>
		}

		return (
			<Modal show={this.props.showShareModal} onHide={this.props.closeShare}>
				<Modal.Header className="modal-header" closeButton>
		            <Modal.Title>Invite people to view</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
		        	<FormControl
						id="userSearch"
						className="share-input"
			            type="text"
			            placeholder="Search Clemango users"
			            onFocus={this.showUserResults}
			            onBlur={this.hideUserResults}
			            onChange={this.changeSearch}
			      	/>
			      	{UserResults}
	        		<InputGroup className="share-input">
			          	<FormControl 	id="inviteEmail"
	                					type="text"
	                					value={this.state.email}
	                					placeholder="Invite someone by email"
	                					onFocus={this.showSuggestedEmails}
	                					onBlur={this.hideSuggestedEmails}
	                					onChange={this.changeEmail}
			          	/>
			          	<InputGroup.Button>
			            	<Button className="btn-clear" onClick={this.addEmail}><i className="fa fa-plus-square" aria-hidden="true"></i></Button>
			          	</InputGroup.Button>
			        </InputGroup>
			        {SuggestedEmails}
			        <h3 className="centered buffer-top-md">Invite List</h3>
			        <ul className="invite-list">
			        	{this.props.usersInvited.map(({_id, firstName, lastName}) =>
	        				<li key={_id}>
	        					<h4>{firstName} {lastName}</h4>
	        				</li>
	        			)}
	        			{this.state.usersToInvite.map(({_id, firstName, lastName}) =>
	        				<li key={_id} className="invite-removable">
	        					<h4>{firstName} {lastName}</h4>
	        					<Button className="btn-clear" onClick={() => this.removeUser(_id)}>
									<i className="fa fa-minus-circle" aria-hidden="true"></i>
	        					</Button>
	        				</li>
	        			)}
	        			{this.props.emailsInvited.map((email) =>
	        				<li key={email}>
	        					<h4>{email}</h4>
	        				</li>
	        			)}
	        			{this.state.emailsToInvite.map((email) =>
	        				<li key={email} className="invite-removable">
	        					<h4>{email}</h4>
	        					<Button className="btn-clear" onClick={() => this.removeEmail(email)}>
	        						<i className="fa fa-minus-circle" aria-hidden="true"></i>
	        					</Button>
	        				</li>
	        			)}
	        		</ul>
	        		<div className="centered">
	        			{SubmitButton}
		        		<div>Or share by pasting the URL</div>
		        		<CopyToClipboard text={this.props.uploadUrl} onCopy={() => this.setState({copied: true})}>
					    	<Button className="btn-outline btn-full">Copy URL to Clipboard</Button>
				        </CopyToClipboard>
				        {this.state.copied ? <span className="copied-text">Copied.</span> : null}
	        		</div>
		        </Modal.Body>
			</Modal>
		);
	}
}

export default ShareModal;

