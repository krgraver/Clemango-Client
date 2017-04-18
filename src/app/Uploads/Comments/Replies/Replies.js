import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';

class Replies extends Component {
	render() {
		let expanded = false;

		for (let i = 0; i < this.props.commentsToExpand.length; i++) {
			if (this.props.commentsToExpand[i] === this.props.commentId) {
				expanded = true;
				break;
			}
		}

		return (
			<div className="comment-replies">
				<ul>
					{this.props.replies.map(({_id, reply, _user}) => {
						let replyClass = classNames({
							'expanded-reply': expanded
						});

						return (
							<li key={_id} className={replyClass}>
								<div>
									<div className="user-info">
										<div className="profile-small">
					    					<img src={_user.profilePic} alt="profile thumbnail" />
					    				</div>
										<Link to={"/profile/" + _user._id}>
											<h4>{_user.firstName} {_user.lastName}</h4>
										</Link>
									</div>
									<pre>{reply}</pre>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
}

export default Replies;