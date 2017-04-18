import React, { Component } from 'react';
import moment from 'moment';

class NotificationsPopup extends Component {
	render() {
		if (this.props.showNotifications) {
			let PopupView;

			if (this.props.latestNotifications.length > 0) {
				PopupView = <ul className="recent-notifications">
								{this.props.latestNotifications.map(({_id, notification, type, timestamp, _upload}) => {
									let timeFromNow = moment(timestamp).fromNow();

									return (
										<li key={_id} onMouseDown={() => this.props.goToUpload(_upload._id)}>
											<h5>{notification}</h5>
											<p>{timeFromNow}</p>
										</li>
									);
								})}
							</ul>
			} else {
				PopupView = <div className="user-note">
								<div className="note-icon">
									<img src="assets/no-notifications.png" alt="no notifications" />
								</div>
								<p className="disclaimer">No notifications yet!</p>
							</div>
			}

			return (
				<div className="notifications-popup">
					<h4>Recent Notifications</h4>
					<p className="see-all-notifications" onMouseDown={this.props.goToNotifications}>See All</p>
					{PopupView}
				</div>
			);
		} else {
			return null;
		}
	}
}

export default NotificationsPopup;