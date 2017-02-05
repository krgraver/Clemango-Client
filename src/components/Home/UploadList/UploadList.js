import React, { Component } from 'react';
import ListItem from './ListItem/ListItem.js';
import request from 'superagent';
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
		request.get(this.getUploadsUrl)
		.end((err, res) => {
			this.setState({
				uploads: res.body
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