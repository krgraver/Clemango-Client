import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import axios from 'axios';

class Form extends Component {
	constructor() {
		super();
		this.state = {
			title: "",
			uploader: "",
			category: ""
		};
		this.uploadUrl = 'http://localhost:3001/uploads/post';

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

	submitUpload() {
		axios.post(this.uploadUrl, {
			title: this.state.title,
			uploader: this.state.uploader,
			category: this.state.category
		})
		.then((res) => {
			if (res.data) {
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
				<Button bsStyle="primary" onClick={this.submitUpload}>Submit</Button>
			</FormGroup>
		)
	}
}

export default Form;