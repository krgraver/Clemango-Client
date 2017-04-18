import React, { Component } from 'react';
import Replies from './Replies/Replies.js';
import { Link } from 'react-router';
import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';

class Comments extends Component {
	constructor() {
		super();
		this.state = {
			commentsToExpand: [],
			commentToReplyTo: ''
		};

		this.showHideReplies = this.showHideReplies.bind(this);
		this.replyToComment = this.replyToComment.bind(this);
	}

	showHideReplies(_id) {
		let commentsToExpand = this.state.commentsToExpand,
			isExpanded = false;

		for (let i = 0; i < commentsToExpand.length; i++) {
			if (commentsToExpand[i] === _id) {
				isExpanded = true;
				commentsToExpand.splice(i, 1);
				break;
			}
		}

		if (isExpanded) {
			this.setState({
				commentsToExpand: commentsToExpand
			});
		} else {
			this.setState({
				commentsToExpand: commentsToExpand.concat(_id)
			});
		}
	}

	replyToComment(_id) {
		if (this.state.commentToReplyTo === _id) {
			this.setState({
				commentToReplyTo: ''
			});
		} else {
			this.setState({
				commentToReplyTo: _id
			});
		}
	}

	render() {
		let CommentsList;

		if (this.props.comments.length > 0) {
			CommentsList = 	<ul>
								{this.props.comments.map(({_id, comment, karma, upvoters, replies, isPublic, _user}) => {
									let commentId = _id,
										commentUser = _user._id,
										userHasUpvoted = false,
										currentUser = localStorage.getItem('currentUser');

									let UpvoteButton;
									for (let i = 0; i < upvoters.length; i++) {
										if (upvoters[i] === currentUser) {
											userHasUpvoted = true;
										}
									}

									if (commentUser === currentUser || !currentUser) {
										UpvoteButton = <Button className="upvote-static">Upvotes | {karma}</Button>
									} else if (!userHasUpvoted && currentUser){
										UpvoteButton = <Button className="upvote-new" onClick={() => this.props.upvoteComment(commentId, commentUser)}>Upvote | {karma}</Button>
									} else if (userHasUpvoted) {
										UpvoteButton = <Button className="upvote-old" onClick={() => this.props.removeUpvote(commentId, commentUser)}>Upvoted | {karma}</Button>
									}

									let CommentOptions;
									if (replies.length === 1) {
										CommentOptions = 	<div className="comment-options">
																{UpvoteButton}
																{replies.length > 0 ? <Button className="btn-clear" onClick={() => this.showHideReplies(commentId)}>{replies.length} Reply</Button> : null}
																{currentUser ? <Button className="btn-clear" onClick={() => this.replyToComment(commentId)}>Reply</Button> : null}
															</div>
									} else {
										CommentOptions = 	<div className="comment-options">
																{UpvoteButton}
																{replies.length > 0 ? <Button className="btn-clear" onClick={() => this.showHideReplies(commentId)}>{replies.length} Replies</Button> : null}
																{currentUser ? <Button className="btn-clear" onClick={() => this.replyToComment(commentId)}>Reply</Button> : null}
															</div>
									}

									let ReplyBox;
									if (commentId === this.state.commentToReplyTo) {
										ReplyBox = 	<FormGroup>
												        <InputGroup>
												          	<FormControl 	id="replyBody"
												          					componentClass="textarea"
												          					className="textbox-sm"
										                					type="text"
										                					placeholder="Add reply here..."
										                					onChange={this.props.changeReply}
												          	/>
												          	<InputGroup.Button>
												            	<Button className="btn btn-clear btn-add" onClick={() => this.props.submitReply(commentId)}><i className="fa fa-plus-square" aria-hidden="true"></i></Button>
												          	</InputGroup.Button>
												        </InputGroup>
													</FormGroup>
									} else {
										ReplyBox = <div></div>
									}

									return (
										<li key={_id} className="upload-comment">
											<div className="user-info">
												<div className="profile-small">
							    					<img src={_user.profilePic} alt="profile thumbnail" />
							    				</div>
												<Link to={"/profile/" + _user._id}>
													<h4>{_user.firstName} {_user.lastName}</h4>
												</Link>
											</div>
											<pre>{comment}</pre>
											{CommentOptions}
											<Replies 	replies={replies}
														changeReply={this.props.changeReply}
														submitReply={this.props.submitReply}
														commentId={commentId}
														commentToReplyTo={this.state.commentToReplyTo}
														commentsToExpand={this.state.commentsToExpand}
											/>
											{ReplyBox}
										</li>
									);
								})}	
							</ul>
		} else if (this.props.comments.length === 0) {
			CommentsList = 	<div className="user-note">
								<div className="note-icon">
									<img src="assets/no-comments.png" alt="no comments" />
								</div>
								<p className="disclaimer">No comments have been made yet</p>
							</div>
		}

		return (
			<div>
				{CommentsList}
			</div>
		);
	}
}

export default Comments;