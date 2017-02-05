import React, { Component } from 'react';
import request from 'superagent';
import constant from '../../../../config/constants.js';

class PublicUpload extends Component {
	constructor() {
		super();
		this.state = {
			title: '',
			uploader: '',
			category: ''
		}

		this.getUploadUrl = constant.API_URL + '/uploads/getOne';
	}

	componentWillMount() {
		request.post(this.getUploadUrl)
			.send({
				_id: this.props.params._id
			})
			.end((err, res) => {
				this.setState({
					title: res.body.title,
					uploader: res.body.uploader,
					category: res.body.category
				});
			});
	}

	render() {
		return (
			<div>
				<h3>{this.state.title}</h3>
				<h3>{this.state.uploader}</h3>
				<h3>{this.state.category}</h3>
			</div>
		)
	}
}

export default PublicUpload;