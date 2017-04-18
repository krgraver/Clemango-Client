import React, { Component } from 'react';
import request from 'superagent';
import constant from '../../config/constants.js';
import { browserHistory } from 'react-router';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button, Checkbox } from 'react-bootstrap';
import DeleteUploadModal from '../Modals/DeleteUploadModal.js';

class EditUpload extends Component {
	constructor() {
		super();
		this.state = {
			image: '',
			title: '',
			context: '',
			isPublic: true,
			titleValidation: null,
			contextValidation: null,
			showDeleteModal: false
		};
		this.getUploadUrl = constant.API_URL + '/uploads/getUpload';
		this.getSignatureUrl = constant.API_URL + '/uploads/signImage';
		this.saveUploadUrl = constant.API_URL + '/uploads/saveUpload';
		this.deleteUploadUrl = constant.API_URL + '/uploads/deleteUploadByUpload';
		this.deleteCommentsUrl = constant.API_URL + '/comments/deleteCommentsByUpload';
		this.deleteNotificationsUrl = constant.API_URL + '/notifications/deleteNotificationsByUpload';
		this.removeKarmaUrl = constant.API_URL + '/user/removeUploadKarma';
		this.showCommentsUrl = constant.API_URL + '/comments/makeCommentsPublic';
		this.hideCommentsUrl = constant.API_URL + '/comments/makeCommentsPrivate';

		this.changeTitle = this.changeTitle.bind(this);
		this.changeContext = this.changeContext.bind(this);
		this.togglePublic = this.togglePublic.bind(this);
		this.saveUpload = this.saveUpload.bind(this);
		this.openDelete = this.openDelete.bind(this);
		this.closeDelete = this.closeDelete.bind(this);
		this.deleteUpload = this.deleteUpload.bind(this);
	}

	componentDidMount() {
		let currentUser = localStorage.getItem('currentUser');

		request.post(this.getUploadUrl)
			.send({
				_id: this.props.params.uploadId
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						image: res.body.image,
						title: res.body.title,
						context: res.body.context,
						isPublic: res.body.isPublic,
						_createdBy: res.body._createdBy
					});

					if (res.body._createdBy._id !== currentUser) {
						browserHistory.push('/');
					}
				}
			});
	}

	changeTitle() {
		let newTitle = document.getElementById('uploadTitle').value;
		this.setState({
			title: newTitle,
			titleValidation: null
		});
	}

	changeContext() {
		let newContext = document.getElementById('uploadContext').value;
		this.setState({
			context: newContext,
			contextValidation: null
		});
	}

	togglePublic() {
		this.setState({
			isPublic: !this.state.isPublic
		});
	}

	saveUpload() {
		let token = localStorage.getItem('token');

		if (!this.state.title) {
			this.setState({
				titleValidation: 'error'
			});
		}

		if (!this.state.context) {
			this.setState({
				contextValidation: 'error'
			});
		}

		if (this.state.title && this.state.context) {
			request.put(this.saveUploadUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					upload: this.props.params.uploadId,
					title: this.state.title,
					context: this.state.context,
					isPublic: this.state.isPublic
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						browserHistory.push('/uploads/' + this.props.params.uploadId);
					}
				});

			if (this.state.isPublic) {
				request.put(this.showCommentsUrl)
					.set('Authorization', 'Bearer ' + token)
					.send({
						upload: this.props.params.uploadId
					})
					.end((err, res) => {
						if (err) {
							console.log(err);
						}
					});
			} else {
				request.put(this.hideCommentsUrl)
					.set('Authorization', 'Bearer ' + token)
					.send({
						upload: this.props.params.uploadId
					})
					.end((err, res) => {
						if (err) {
							console.log(err);
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

	deleteUpload() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		request.post(this.deleteUploadUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser,
				image: this.state.image,
				upload: this.props.params.uploadId
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					request.post(this.deleteCommentsUrl)
						.set('Authorization', 'Bearer ' + token)
						.send({
							upload: this.props.params.uploadId
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							}
						});

					request.post(this.deleteNotificationsUrl)
						.set('Authorization', 'Bearer ' + token)
						.send({
							upload: this.props.params.uploadId
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							}
						});

					request.post(this.removeKarmaUrl)
						.set('Authorization', 'Bearer ' + token)
						.send({
							user: currentUser
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							}
						});

					browserHistory.push('/');
				}
			});
	}

	render() {
		return (
			<div>
				<DeleteUploadModal 	showDeleteModal={this.state.showDeleteModal}
									closeDelete={this.closeDelete}
									deleteUpload={this.deleteUpload}
				/>
				<Row>
					<Col md={10} mdOffset={1} className="buffer-top-md">
						<Col md={8} className="upload-section">
							<div className="upload-container">
								<img src={this.state.image} alt="uploaded work" />
							</div>
						</Col>
						<Col md={4} className="column-container">
							<h2 className="buffer-bottom-md">Edit Upload</h2>
							<FormGroup validationState={this.state.titleValidation}>
								<ControlLabel>Title</ControlLabel>
								<FormControl
									id="uploadTitle"
									type="text"
									className="form-input"
									value={this.state.title}
									onChange={this.changeTitle}
									placeholder="Enter title"
								/>
							</FormGroup>
							<FormGroup validationState={this.state.contextValidation}>
								<ControlLabel>Context</ControlLabel>
				        		<FormControl
				        			id="uploadContext"
				        			componentClass="textarea"
				        			className="textbox-lg"
				        			value={this.state.context}
				        			onChange={this.changeContext}
				        			placeholder="Talk about the goals for this design, project limitations, and points to focus on"
				        		/>
				        	</FormGroup>
			        		<Checkbox className="buffer-bottom-md" checked={this.state.isPublic} onChange={this.togglePublic}>Visible to Public</Checkbox>
			        		<div className="centered buffer-bottom-sm">
								<Button className="btn-primary btn-full" onClick={this.saveUpload}>Save</Button>
							</div>
							<div className="centered">
								<Button className="btn-outline btn-full" onClick={this.openDelete}>Delete Upload</Button>
							</div>
						</Col>
					</Col>
				</Row>
			</div>
		);
	}
}

export default EditUpload;