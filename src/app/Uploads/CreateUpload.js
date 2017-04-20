import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import request from 'superagent';
import constant from '../../config/constants.js';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import { Row, Col, FormGroup, ControlLabel, FormControl, Button, Checkbox } from 'react-bootstrap';

class CreateUpload extends Component {
	constructor() {
		super();
		this.state = {
			userFirst: '',
			userLast: '',
			isPublic: true,
			imagePreview: '',
			title: '',
			context: '',
			_createdBy: '',
			imageValidation: false,
			titleValidation: null,
			contextValidation: null
		};
		this.userInfoUrl = constant.API_URL + '/user/getUser';
		this.getSignatureUrl = constant.API_URL + '/uploads/signUpload';
		this.postUploadUrl = constant.API_URL + '/uploads/postUpload';
		this.postUploadKarmaUrl = constant.API_URL + '/user/postUploadKarma';

		this.onDrop = this.onDrop.bind(this);
		this.changeTitle = this.changeTitle.bind(this);
		this.changeContext = this.changeContext.bind(this);
		this.togglePublic = this.togglePublic.bind(this);
		this.submitUpload = this.submitUpload.bind(this);
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
						userFirst: res.body.firstName,
						userLast: res.body.lastName
					});
				}
			});
	}

	onDrop(files) {
		this.upload = files[0];
		this.setState({
			imagePreview: this.upload.preview,
			imageValidation: false
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

	submitUpload() {
		if (!this.state.imagePreview) {
			this.setState({
				imageValidation: true
			});
		}

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

		if (this.state.imagePreview && this.state.title && this.state.context) {
			let token = localStorage.getItem('token'),
				currentUser = localStorage.getItem('currentUser');

			request.post(this.getSignatureUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					user: currentUser,
					imageType: this.upload.type
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						let signedData = res.body;
						request.put(signedData.signedUrl)
							.send(this.upload)
							.end((err, res) => {
								if (err) {
									console.log(err);
								} else if (this.state.isPublic) {
									request.post(this.postUploadUrl)
										.set('Authorization', 'Bearer ' + token)
										.send({
											image: signedData.url,
											title: this.state.title,
											context: this.state.context,
											isPublic: true,
											_createdBy: currentUser
										})
										.end((err, res) => {
											if (err) {
												console.log(err);
											} else {
												browserHistory.push('/uploads/' + res.body._id);
											}
										});
								} else {
									request.post(this.postUploadUrl)
										.set('Authorization', 'Bearer ' + token)
										.send({
											image: signedData.url,
											title: this.state.title,
											context: this.state.context,
											isPublic: false,
											_createdBy: currentUser
										})
										.end((err, res) => {
											if (err) {
												console.log(err);
											} else {
												browserHistory.push('/uploads/' + res.body._id);
											}
										});
								}

								request.post(this.postUploadKarmaUrl)
									.set('Authorization', 'Bearer ' + token)
									.send({
										currentUser: currentUser
									})
									.end((err, res) => {
										if (err) {
											console.log(err);
										}
									});
							});
					}
				});
		}
	}

	render() {
		let ImagePreview;

		if (this.state.imagePreview) {
			ImagePreview = 	<div className="image-preview buffer-top-md">
								<h3>Upload Preview</h3>
								<div className="upload-container">
									<img src={this.state.imagePreview} alt="Upload preview" />
								</div>
							</div>
		} else {
			ImagePreview = <div></div>
		}

		let dropzoneClass = classNames(
			'dropzone',
			{'dropzone-empty': this.state.imageValidation}
		);

		return (
			<Row>
				<Col md={10} mdOffset={1} className="buffer-top-md">
					<Col md={8}>
						<Dropzone 	className={dropzoneClass}
									onDrop={this.onDrop}
									accept="image/jpeg, image/png"
									maxSize={1048576}
						>
							<div>Drop an image of your work (JPG or PNG, max size 1MB)</div>
						</Dropzone>
						{ImagePreview}
					</Col>
					<Col md={4} className="column-container">
						<h2 className="buffer-bottom-md">Upload Work</h2>
						<FormGroup validationState={this.state.titleValidation} className="form-input">
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
						<FormGroup validationState={this.state.contextValidation} className="form-input">
							<ControlLabel>Context</ControlLabel>
			        		<FormControl
			        			id="uploadContext"
			        			componentClass="textarea"
			        			className="textbox-lg"
			        			value={this.state.context}
			        			onChange={this.changeContext}
			        			placeholder="Talk about the goals for this design, any limitations, and points to focus on"
			        		/>
			        	</FormGroup>
		        		<Checkbox checked={this.state.isPublic} onChange={this.togglePublic}>Post to Public (You can change visibility at any time)</Checkbox>
						<div className="centered buffer-top-md">
							<Button className="btn-primary btn-full buffer-bottom-md" onClick={this.submitUpload}>Submit Upload</Button>
							<p className="disclaimer">You'll be able to invite individuals to view your work once uploaded</p>
						</div>
					</Col>
				</Col>
			</Row>
		);
	}
}

export default CreateUpload;