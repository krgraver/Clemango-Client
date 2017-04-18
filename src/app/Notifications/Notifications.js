import React, { Component } from 'react';
import request from 'superagent';
import moment from 'moment';
import constant from '../../config/constants.js';
import { Row, Col, Button } from 'react-bootstrap';
import { browserHistory } from 'react-router';

class Notifications extends Component {
	constructor() {
		super();
		this.state = {
			notifications: [],
			skipAmount: 30
		}
		this.getNotificationsUrl = constant.API_URL + '/notifications/getFirstNotifications';
		this.getNextNotificationsUrl = constant.API_URL + '/notifications/getNextNotifications';
		this.clearNotificationsUrl = constant.API_URL + '/notifications/clearNewNotifications';

		this.goToUpload = this.goToUpload.bind(this);
		this.loadNextNotifications = this.loadNextNotifications.bind(this);
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

		request.post(this.getNotificationsUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						notifications: res.body
					});
				}
			});

		request.post(this.clearNotificationsUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				}
			});
	}

	loadNextNotifications() {
		let token = localStorage.getItem('token'),
			currentUser = localStorage.getItem('currentUser');

		request.post(this.getNextNotificationsUrl)
			.set('Authorization', 'Bearer ' + token)
			.send({
				user: currentUser,
				skipAmount: this.state.skipAmount
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						notifications: this.state.notifications.concat(res.body),
						skipAmount: this.state.skipAmount + 30
					});
				}
			});
	}

	goToUpload(uploadId) {
		browserHistory.push('/uploads/' + uploadId);
	}

	render() {
		let NotificationView;

		if (this.state.notifications.length > 0) {
			NotificationView = 	<ul className="all-notifications">
									{this.state.notifications.map(({_id, notification, type, timestamp, _upload}) => {
										let timeFromNow = moment(timestamp).fromNow();

										return(
											<li key={_id} onClick={() => this.goToUpload(_upload._id)}>
												<h5>{notification}</h5>
												<p>{timeFromNow}</p>
											</li>
										);
									})}
									<div className="centered">
										{this.state.notifications.length >= 30 ? <Button className="btn-outline btn-full buffer-top-md" onClick={this.loadNextNotifications}>Load more</Button> : null}
									</div>
								</ul>
		} else {
			NotificationView = 	<div className="user-note">
									<div className="note-icon">
										<img src="assets/no-notifications.png" alt="no notifications" />
									</div>
									<p className="disclaimer">No notifications yet!</p>
								</div>
		}

		return (
			<Row>
				<Col xs={10} xsOffset={1} md={6} mdOffset={3} className="column-container buffer-top-md">
					<h2>Notifications</h2>
					{NotificationView}
				</Col>
			</Row>
		);
	}
}

export default Notifications;