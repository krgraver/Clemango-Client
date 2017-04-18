import React, { Component } from 'react';
import request from 'superagent';
import moment from 'moment';
import TextTruncate from 'react-text-truncate';
import constant from '../../config/constants.js';
import ProfileTabs from './ProfileTabs/ProfileTabs.js';
import { Row, Col, Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router';

class Profile extends Component {
	constructor() {
		super();
		this.state = {
			profilePic: '',
			firstName: '',
			lastName: '',
			credentials: '',
			karmaPoints: '',
			tabs: ['Public Uploads', 'Public Comments'],
			activeTab: 'Public Uploads',
			publicUploads: [],
			publicComments: [],
			uploadsSkipAmount: 12,
			commentsSkipAmount: 20
		};
		this.checkUserUrl = constant.API_URL + '/user/checkUser';
		this.userInfoUrl = constant.API_URL + '/user/getUser';
		this.userFirstUploadsUrl = constant.API_URL + '/uploads/getFirstUserPublicUploads';
		this.nextUploadsUrl = constant.API_URL + '/uploads/getNextUserPublicUploads';
		this.userFirstCommentsUrl = constant.API_URL + '/comments/getFirstUserPublicComments';
		this.nextCommentsUrl = constant.API_URL + '/comments/getNextUserPublicComments';

		this.selectTab = this.selectTab.bind(this);
		this.goToUpload = this.goToUpload.bind(this);
		this.loadNextUploads = this.loadNextUploads.bind(this);
		this.loadNextComments = this.loadNextComments.bind(this);
	}

	componentDidMount() {
		request.post(this.checkUserUrl)
			.send({
				user: this.props.params.userId
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else if (res.body.error === 'invalid user') {
					browserHistory.push('/');
				} else {
					request.post(this.userInfoUrl)
						.send({
							user: this.props.params.userId
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
						.send({
							user: this.props.params.userId
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							} else {
								this.setState({
									publicUploads: res.body
								});
							}
						});

					request.post(this.userFirstCommentsUrl)
						.send({
							user: this.props.params.userId
						})
						.end((err, res) => {
							if (err) {
								console.log(err);
							} else {
								this.setState({
									publicComments: res.body
								});
							}
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
		request.post(this.nextUploadsUrl)
			.send({
				user: this.props.params.userId,
				skipAmount: this.state.uploadsSkipAmount
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						publicUploads: this.state.publicUploads.concat(res.body),
						uploadsSkipAmount: this.state.uploadsSkipAmount + 12
					});
				}
			});
	}

	loadNextComments() {
		request.post(this.nextCommentsUrl)
			.send({
				user: this.props.params.userId,
				skipAmount: this.state.commentsSkipAmount
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						publicComments: this.state.publicComments.concat(res.body),
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

		if (this.state.activeTab === 'Public Uploads' && this.state.publicUploads.length > 0) {
			TabView = 	<Row className="profile-uploads">
							{ this.state.publicUploads.map(({_id, image, title, timestamp}) => {
								let timeFromNow = moment(timestamp).fromNow();

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
											<p>Posted {timeFromNow}</p>
										</div>
									</Col>
								);
							})}
							<div className="centered">
								{this.state.publicUploads.length >= 12 ? <Button className="btn-outline btn-full buffer-top-md" onClick={this.loadNextUploads}>Load more</Button> : null}
							</div>
						</Row>
		} else if (this.state.activeTab === 'Public Uploads' && this.state.publicUploads.length === 0) {
			TabView = 	<div className="user-note">
							<div className="note-icon">
								<img src="assets/no-uploads.png" alt="no uploads" />
							</div>
							<p className="disclaimer">No uploads yet!</p>
						</div>
		} else if (this.state.activeTab === 'Public Comments' && this.state.publicComments.length > 0) {
			TabView = 	<div className="profile-comments">
							{ this.state.publicComments.map(({_id, comment, karma, timestamp, _upload}) => {
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
								{this.state.publicComments.length >= 20 ? <Button className="btn-outline btn-full buffer-top-md buffer-bottom-lg" onClick={this.loadNextComments}>Load more</Button> : null}
							</div>
						</div>
		} else if (this.state.activeTab === 'Public Comments' && this.state.publicComments.length === 0) {
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

export default Profile;