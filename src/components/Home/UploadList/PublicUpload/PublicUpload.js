import React, { Component } from 'react';
import axios from 'axios';
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
		axios.post(this.getUploadUrl, {
			_id: this.props.params._id
		}).then((res) => {
			this.setState({
				title: res.data.title,
				uploader: res.data.uploader,
				category: res.data.category
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