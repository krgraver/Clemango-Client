import React, { Component } from 'react';
import request from 'superagent';
import moment from 'moment';
import TextTruncate from 'react-text-truncate';
import constant from '../../config/constants.js';
import ProfileTabs from './ProfileTabs/ProfileTabs.js';
import { Row, Col, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

class MyProfile extends Component {
	constructor() {
		super();
		this.state = {
			profilePic: '',
			firstName: '',
			lastName: '',
			credentials: '',
			karmaPoints: '',
			tabs: ['Uploads', 'Comments'],
			activeTab: 'Uploads',
			uploads: [],
			comments: [],
			uploadsSkipAmount: 12,
			commentsSkipAmount: 20
		};
		this.userInfoUrl = constant.API_URL + '/user/getUser';
		this.userFirstUploadsUrl = constant.API_URL + '/uploads/getFirstUserUploads';
		this.nextUploadsUrl = constant.API_URL + '/uploads/getNextUserUploads';
		this.userFirstCommentsUrl = constant.API_URL + '/comments/getFirstUserComments';
		this.nextCommentsUrl = constant.API_URL + '/comments/getNextUserComments';
		this.userArchivedUrl = constant.API_URL + '/uploads/getUserArchived';

		this.selectTab = this.selectTab.bind(this);
		this.loadNextUploads = this.loadNextUploads.bind(this);
		this.loadNextComments = this.loadNextComments.bind(this);
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
						firstName: res.body.firstName,
						lastName: res.body.lastName,
						credentials: res.body.credentials,
						karmaPoints: res.body.karmaPoints 
					});
				}
			});

		request.post(this.userFirstUploadsUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						uploads: res.body
					});
				}
			});

		request.post(this.userFirstCommentsUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser
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

	selectTab(tab) {
		this.setState({
			activeTab: tab
		});
	}

	loadNextUploads() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		request.post(this.nextUploadsUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser,
				skipAmount: this.state.uploadsSkipAmount
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						uploads: this.state.uploads.concat(res.body),
						uploadsSkipAmount: this.state.uploadsSkipAmount + 12
					});
				}
			});
	}

	loadNextComments() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		request.post(this.nextCommentsUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser,
				skipAmount: this.state.commentsSkipAmount
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						comments: this.state.comments.concat(res.body),
						commentsSkipAmount: this.state.commentsSkipAmount + 20
					});
				}
			});
	}

	goToUpload(uploadId) {
		browserHistory.push('/uploads/' + uploadId);
	}

	render() {
		let TabView;

		if (this.state.activeTab === 'Uploads' && this.state.uploads.length > 0) {
			TabView = 	<Row className="profile-uploads">
							{ this.state.uploads.map(({_id, image, title, timestamp, isPublic}) => {
								let timeFromNow = moment(timestamp).fromNow();

								if (isPublic) {
									return (
										<Col sm={3} key={_id} className="upload-item">
											<Link to={"/uploads/" + _id}>
												<div className="pic-container thumbnail-container">
													<img src={image} alt="work thumbnail" />
												</div>
											</Link>
											<div className="work-list-text">
												<TextTruncate
													line={1}
													truncateText="..."
													text={title}
													className="work-list-title"
												/>
												<p>Posted {timeFromNow} | Public</p>
											</div>
										</Col> 
									);
								} else {
									return (
										<Col sm={3} key={_id} className="upload-item">
											<Link to={"/uploads/" + _id}>
												<div className="pic-container thumbnail-container">
													<img src={image} alt="work thumbnail" />
												</div>
											</Link>
											<div className="work-list-text">
												<TextTruncate
													line={1}
													truncateText="..."
													text={title}
													className="work-list-title"
												/>
												<p>Posted {timeFromNow} | Private</p>
											</div>
										</Col> 
									);
								}
							})}
							<div className="centered">
								{this.state.uploads.length >= 12 ? <Button className="btn-outline btn-full buffer-top-md" onClick={this.loadNextUploads}>Load more</Button> : null}
							</div>
						</Row>
		} else if (this.state.activeTab === 'Uploads' && this.state.uploads.length === 0) {
			TabView = 	<div className="user-note">
							<div className="note-icon">
								<img src="assets/no-uploads.png" alt="no uploads" />
							</div>
							<p className="disclaimer">No uploads yet!</p>
						</div>
		} else if (this.state.activeTab === 'Comments' && this.state.comments.length > 0) {
			TabView = 	<div className="profile-comments">
							{ this.state.comments.map(({_id, comment, karma, timestamp, _upload}) => {
								let timeFromNow = moment(timestamp).fromNow();

								return (
									<div key={_id} className="profile-comment" onClick={() => this.goToUpload(_upload._id)}>
										<h3>{_upload.title}</h3>
										<pre>{comment}</pre>
										<p>Posted {timeFromNow} | {karma} karma</p>
									</div>
								);
							})}
							<div className="centered">
								{this.state.comments.length >= 20 ? <Button className="btn-outline btn-full buffer-top-md buffer-bottom-lg" onClick={this.loadNextComments}>Load more</Button> : null}
							</div>
						</div>
		} else if (this.state.activeTab === 'Comments' && this.state.comments.length === 0) {
			TabView = 	<div className="user-note">
							<div className="note-icon">
								<img src="assets/no-comments.png" alt="no comments" />
							</div>
							<p className="disclaimer">No comments yet!</p>
						</div>
		}

		let Tooltop = <Tooltip id="tooltip">Uploading gets 3 karma, comment upvotes get 1 karma</Tooltip>

		return (
			<div>
				<div className="upload-column">
					<div className="profile-summary">
						<div className="profile-container">
							<img src={this.state.profilePic} alt="profile pic" />
						</div>
						<div className="profile-info">
							<h2>{this.state.firstName} {this.state.lastName}</h2>
							<h4>{this.state.credentials}</h4>
							<OverlayTrigger placement="right" overlay={Tooltop}>
								<p className="profile-karma">{this.state.karmaPoints} Karma</p>
							</OverlayTrigger>
							<div>
								<Link to={"/profile/me/edit"}>
									<Button className="btn-outline buffer-right"><i className="fa fa-pencil inset-icon" aria-hidden="true"></i> Edit Profile</Button>
								</Link>
								<Button className="btn-outline" onClick={this.props.logOut}><i className="fa fa-sign-out inset-icon" aria-hidden="true"></i> Log Out</Button>
							</div>
						</div>
					</div>
					<ProfileTabs 	tabs={this.state.tabs}
									selectTab={this.selectTab}
									activeTab={this.state.activeTab}
					/>
					{TabView}
				</div>
			</div>
		);
	}
}

export default MyProfile;