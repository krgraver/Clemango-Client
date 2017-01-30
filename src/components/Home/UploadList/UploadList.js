import React, { Component } from 'react';
import ListItem from './ListItem/ListItem.js';
import axios from 'axios';
import { Col } from 'react-bootstrap';
import constant from '../../../config/constants.js';

class UploadList extends Component {
	constructor() {
		super();
		this.state = {
			uploads: []
		};
		this.getUploadsUrl = constant.API_URL + '/uploads/getAll';
	}

	componentDidMount() {
		axios.get(this.getUploadsUrl)
		.then((res) => {
			this.setState({
				uploads: res.data
			});
		});
	}

	render() {
		return (
				<Col md={9}>
					{ this.state.uploads.map(({_id, title, uploader, category}) => <ListItem key={_id}
					 															_id={_id}
																				title={title}
																				uploader={uploader}
																				category={category} />)}
				</Col>
		)
	}
}

export default UploadList;