import React, { Component } from 'react';
import request from 'superagent';
import moment from 'moment';
import DocumentMeta from 'react-document-meta';
import constant from '../../config/constants.js';
import Comments from './Comments/Comments.js';
import CommentForm from './Comments/CommentForm.js';
import ShareModal from '../Modals/ShareModal.js';
import { Link, browserHistory } from 'react-router';
import { Row, Col, Button } from 'react-bootstrap';

class Upload extends Component {
	constructor() {
		super();
		this.state = {
			userFirst: '',
			userLast: '',
			_suggestedUsers: [],
			suggestedEmails: [],
			image: '',
			category: '',
			title: '',
			context: '',
			timestamp: '',
			isPublic: true,
			_createdBy: '',
			_usersInvited: [],
			emailsInvited: [],
			comments: [],
			comment: '',
			reply: '',
			showShareModal: false
		}
		this.checkUploadUrl = constant.API_URL + '/uploads/checkUpload';
		this.userInfoUrl = constant.API_URL + '/user/getUser';
		this.getUploadUrl = constant.API_URL + '/uploads/getUpload';
		this.getCommentsUrl = constant.API_URL + '/comments/getComments';
		this.postCommentUrl = constant.API_URL + '/comments/postComment';
		this.postReplyUrl = constant.API_URL + '/comments/postReply';
		this.giveKarmaUrl = constant.API_URL + '/user/giveKarma';
		this.removeKarmaUrl = constant.API_URL + '/user/removeUpvoteKarma';
		this.upvoteCommentUrl = constant.API_URL + '/comments/upvoteComment';
		this.removeUpvoteUrl = constant.API_URL + '/comments/removeUpvote';
		this.addNotificationUrl = constant.API_URL + '/notifications/addNotification';

		this.changeComment = this.changeComment.bind(this);
		this.submitComment = this.submitComment.bind(this);
		this.changeReply = this.changeReply.bind(this);
		this.submitReply = this.submitReply.bind(this);
		this.upvoteComment = this.upvoteComment.bind(this);
		this.removeUpvote = this.removeUpvote.bind(this);
		this.goToEdit = this.goToEdit.bind(this);
		this.openShare = this.openShare.bind(this);
		this.closeShare = this.closeShare.bind(this);
		this.updateUpload = this.updateUpload.bind(this);
	}

	componentDidMount() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		request.post(this.checkUploadUrl)
			.send({
				upload: this.props.params.uploadId
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else if (res.body.error === 'invalid upload') {
					browserHistory.push('/');
				} else {
					if (token) {
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
										userLast: res.body.lastName,
										_suggestedUsers: res.body._suggestedUsers,
										suggestedEmails: res.body.suggestedEmails
									});
								}
							});
					}

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
									timestamp: res.body.timestamp,
									isPublic: res.body.isPublic,
									_createdBy: res.body._createdBy,
									_usersInvited: res.body._usersInvited,
									emailsInvited: res.body.emailsInvited
								});
							}
						});

					request.post(this.getCommentsUrl)
						.send({
							_id: this.props.params.uploadId
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							} else {
								this.setState({
									comments: res.body
								});
							}
						});
				}
			});
	}

	componentWillReceiveProps(newProps) {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		if (token) {
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
							userLast: res.body.lastName,
							_suggestedUsers: res.body._suggestedUsers,
							suggestedEmails: res.body.suggestedEmails
						});
					}
				});
		}

		request.post(this.getUploadUrl)
			.send({
				_id: newProps.params.uploadId
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						image: res.body.image,
						title: res.body.title,
						context: res.body.context,
						timestamp: res.body.timestamp,
						isPublic: res.body.isPublic,
						_createdBy: res.body._createdBy,
						_usersInvited: res.body._usersInvited,
						emailsInvited: res.body.emailsInvited
					});
				}
			});

		request.post(this.getCommentsUrl)
			.send({
				_id: newProps.params.uploadId
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						comments: res.body
					});
				}
			});
	}

	changeComment() {
		let newComment = document.getElementById('commentBody').value;

		this.setState({
			comment: newComment
		});
	}

	submitComment() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		if (this.state.isPublic) {
			request.post(this.postCommentUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					comment: this.state.comment,
					_user: currentUser,
					_upload: this.props.params.uploadId
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						this.setState({
							comments: this.state.comments.concat(res.body)
						});

						document.getElementById('commentBody').value = '';
					}
				});
		} else {
			request.post(this.postCommentUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					comment: this.state.comment,
					isPublic: false,
					_user: currentUser,
					_upload: this.props.params.uploadId
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						this.setState({
							comments: this.state.comments.concat(res.body)
						});

						document.getElementById('commentBody').value = '';
					}
				});
		}

		if (this.state._createdBy._id !== currentUser) {
			request.post(this.addNotificationUrl)
				.set('Authorization', 'Bearer ' + token)
				.send({
					notification: this.state.userFirst + ' ' + this.state.userLast + ' commented on ' + this.state.title,
					_recipient: this.state._createdBy,
					_upload: this.props.params.uploadId
				})
				.end((err, res) => {
					if (err) {
						console.log(err);
					} else {
						console.log("Notification sent");
					}
				});
		}
	}

	changeReply() {
		let newReply = document.getElementById('replyBody').value;

		this.setState({
			reply: newReply
		});
	}

	submitReply(commentId) {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser'),
			comments = this.state.comments,
			index;

		request.post(this.postReplyUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				_id: commentId,
				reply: this.state.reply,
				_user: currentUser
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					for (let i = 0; i < comments.length; i++) {
						if (comments[i]._id === commentId) {
							index = i;
							break;
						}
					}
					comments[index] = res.body;

					this.setState({
						comments: comments
					});

					document.getElementById('replyBody').value = '';

					if (res.body._user._id !== currentUser) {
						request.post(this.addNotificationUrl)
							.set('Authorization', 'Bearer ' + token)
							.send({
								notification: this.state.userFirst + ' ' + this.state.userLast + ' replied to your comment in ' + this.state.title,
								_recipient: res.body._user._id,
								_upload: this.props.params.uploadId
							})
							.end((err, res) => {
								if (err) {
									console.log(err);
								} else {
									console.log("Notification sent");
								}
							});
					}
				}
			});
	}

	upvoteComment(commentId, commentUser) {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser'),
			comments = this.state.comments,
			index;

		request.post(this.giveKarmaUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: commentUser
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					request.post(this.upvoteCommentUrl)
						.set('Authorization', 'Bearer ' + token)
						.send({
							_id: commentId,
							upvoter: currentUser
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							} else {
								for (let i = 0; i < comments.length; i++) {
									if (comments[i]._id === commentId) {
										index = i;
										break;
									}
								}
								comments[index] = res.body;

								this.setState({
									comments: comments
								});
							}
						});
				}
			});
	}

	removeUpvote(commentId, commentUser) {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser'),
			comments = this.state.comments,
			index;

		request.post(this.removeKarmaUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: commentUser
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					request.post(this.removeUpvoteUrl)
						.set('Authorization', 'Bearer ' + token)
						.send({
							_id: commentId,
							upvoter: currentUser
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							} else {
								for (let i = 0; i < comments.length; i++) {
									if (comments[i]._id === commentId) {
										index = i;
										break;
									}
								}
								comments[index] = res.body;

								this.setState({
									comments: comments
								});
							}
						});
				}
			});
	}

	goToEdit() {
		browserHistory.push('/uploads/' + this.props.params.uploadId + '/edit');
	}

	openShare() {
		this.setState({
			showShareModal: true
		});
	}

	closeShare() {
		this.setState({
			showShareModal: false
		});
	}

	updateUpload(upload) {
		this.setState({
			_usersInvited: upload._usersInvited,
			emailsInvited: upload.emailsInvited
		});
	}

	render() {
		let currentUser = localStorage.getItem('currentUser'),
			timeFromNow = moment(this.state.timestamp).fromNow(),
			UserOptions;

		if (currentUser === this.state._createdBy._id) {
			UserOptions = 	<div className="buffer-bottom-md">
								<Button className="btn-primary btn-full-flex buffer-right" onClick={this.openShare}><i className="fa fa-share inset-icon" aria-hidden="true"></i> Share</Button>
								<Button className="btn-outline" onClick={this.goToEdit}><i className="fa fa-pencil inset-icon" aria-hidden="true"></i> Edit</Button>
							</div>
		} else {
			UserOptions = 	<div>
								<h5 className="buffer-bottom-md">Uploaded by <Link to={"/profile/" + this.state._createdBy._id}>{this.state._createdBy.firstName} {this.state._createdBy.lastName}</Link> {timeFromNow}</h5>
							</div>
		}

		const meta = {
			meta: {
				property: {
					'og:type': 'website',
					'og:title': 'Give design feedback on Clemango',
					'og:description': 'Your input is wanted on this design',
					'og:image': 'https://s3.amazonaws.com/clemango/assets/clemango-icon.png'
				}
			}
		};

		return (
			<div>
				<DocumentMeta {...meta} extend />
				<ShareModal showShareModal={this.state.showShareModal}
							closeShare={this.closeShare}
							userFirst={this.state.userFirst}
							userLast={this.state.userLast}
							suggestedUsers={this.state._suggestedUsers}
							suggestedEmails={this.state.suggestedEmails}
							uploadId={this.props.params.uploadId}
							uploadTitle={this.state.title}
							imageUrl={this.state.image}
							usersInvited={this.state._usersInvited}
							emailsInvited={this.state.emailsInvited}
							uploadUrl={"localhost:3000/uploads/" + this.props.params.uploadId}
							updateUpload={this.updateUpload}
				/>
				<Row>
					<Col md={10} mdOffset={1}>
						<Col md={8}>
							<div className="overflow-scroll">
								<h3 className="buffer-top-md">{this.state.title}</h3>
								{UserOptions}
								<h4>Context:</h4>
								<pre>{this.state.context}</pre>
								<div className="upload-container">
									<img src={this.state.image} alt="uploaded work" />
								</div>
							</div>
						</Col>
						<Col md={4}>
							<div className="overflow-scroll">
								<h3 className="buffer-top-md">Comments</h3>
								{currentUser ? <CommentForm changeComment={this.changeComment} submitComment={this.submitComment} /> : null}
								<Comments 	comments={this.state.comments}
											changeReply={this.changeReply}
											submitReply={this.submitReply}
											upvoteComment={this.upvoteComment}
											removeUpvote={this.removeUpvote}
								/>
							</div>
						</Col>
					</Col>
				</Row>
			</div>
		);
	}
}

Upload.defaultProps = {
	comments: [],
	replies: []
};

export default Upload;