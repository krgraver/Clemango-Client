import React, { Component } from 'react';
import classNames from 'classnames';
import { Col } from 'react-bootstrap';

class ProfileTabs extends Component {
	render() {
		return (
			<Col xs={12} className="profile-tabs">
				<ul className="ProfileTabs">
					{this.props.tabs.map((tab) => {
						let tabClass = classNames({
							'active-profile-tab': this.props.activeTab === tab
						});

						return (
							<Col xs={6} md={3} key={tab}>
								<li className={tabClass} onClick={() => this.props.selectTab(tab)}>{tab}</li>
							</Col>
						);
					})}
				</ul>
			</Col>
		);
	}
}

export default ProfileTabs;