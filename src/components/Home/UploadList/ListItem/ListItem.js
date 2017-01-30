import React from 'react';
import { Link } from 'react-router';
import { Col, Panel } from 'react-bootstrap';

const UploadItem = ({_id, title, uploader, category}) => (
	<Link to={"/uploads/" + _id}>
		<Col md={4}>
			<Panel header={title}>
				<div>{uploader}</div>
				<div>{category}</div>
			</Panel>	
		</Col>
	</Link>
)

export default UploadItem;