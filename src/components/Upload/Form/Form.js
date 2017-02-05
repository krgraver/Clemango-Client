import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import request from 'superagent';
import constant from '../../../config/constants.js';
import Dropzone from 'react-dropzone';

class Form extends Component {
	constructor() {
		super();
		this.state = {
			title: '',
			uploader: '',
			category: ''
		};
		this.uploadUrl = constant.API_URL + '/uploads/post';

		this.changeTitle = this.changeTitle.bind(this);
		this.changeUploader = this.changeUploader.bind(this);
		this.changeCategory = this.changeCategory.bind(this);
		this.submitUpload = this.submitUpload.bind(this);
	}

	changeTitle() {
		let newTitle = document.getElementById('uploadTitle').value;
		this.setState({
			title: newTitle
		});
	}

	changeUploader() {
		let newUploader = document.getElementById('uploaderName').value;
		this.setState({
			uploader: newUploader
		});
	}

	changeCategory() {
		let newCategory = document.getElementById('uploadCategory').value;
		this.setState({
			category: newCategory
		});
	}

	onDrop(files) {
		var image = new FormData();
		image.append('image', files[0]);

		request.post(constant.API_URL + '/uploads/image')
			.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
			.send(image)
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					console.log(res);
				}
			});
	}

	submitUpload() {
		request.post(this.uploadUrl)
			.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
			.send({
				title: this.state.title,
				uploader: this.state.uploader,
				category: this.state.category
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					browserHistory.push('/');
				}
			});
	}

	render() {
		return (
			<FormGroup>
				<ControlLabel>Upload Title</ControlLabel>
				<FormControl
					id="uploadTitle"
					type="text"
					value={this.state.title}
					onChange={this.changeTitle}
					placeholder="Enter title"
				/>
				<ControlLabel>Uploader Name</ControlLabel>
				<FormControl
					id="uploaderName"
					type="text"
					value={this.state.uploader}
					onChange={this.changeUploader}
					placeholder="Enter name"
				/>
				<ControlLabel>Upload Category</ControlLabel>
				<FormControl
					id="uploadCategory"
					type="text"
					value={this.state.category}
					onChange={this.changeCategory}
					placeholder="Enter category"
				/>
				<Dropzone onDrop={this.onDrop}>
					<div>Drop your file here or click to upload</div>
				</Dropzone>
				<Button bsStyle="primary" onClick={this.submitUpload}>Submit</Button>
			</FormGroup>
		)
	}
}

export default Form;