import React, { Component } from 'react';
import request from 'superagent';
import moment from 'moment';
import TextTruncate from 'react-text-truncate';
import { Link } from 'react-router';
import { Row, Col, FormControl, Button } from 'react-bootstrap';
import constant from '../../../config/constants.js';

class PublicUploadList extends Component {
	constructor() {
		super();
		this.state = {
			uploads: [],
			searchOn: false,
			searchValue: '',
			searchResults: [],
			activeFilter: '',
			skipAmount: 24
		};
		this.getFirstUploadsUrl = constant.API_URL + '/uploads/getFirstPublicUploads';
		this.getNextUploadsUrl = constant.API_URL + '/uploads/getNextPublicUploads';
		this.searchPublicUrl = constant.API_URL + '/uploads/searchPublic';

		this.changeSearch = this.changeSearch.bind(this);
		this.runSearch = this.runSearch.bind(this);
		this.loadNextUploads = this.loadNextUploads.bind(this);
	}

	componentDidMount() {
		request.get(this.getFirstUploadsUrl)
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						uploads: res.body
					});
				}
			});
	}

	changeSearch() {
		let newSearch = document.getElementById('searchPublic').value;

		this.setState({
			searchValue: newSearch
		});
	}

	runSearch(e) {
		if (e.key === 'Enter') {
			if (this.state.searchValue === '') {
				request.get(this.getFirstUploadsUrl)
					.end((err, res) => {
						if (err) {
							console.log(err);
						} else {
							this.setState({
								searchOn: false
							});
						}
					});
			} else {
				request.post(this.searchPublicUrl)
					.send({
						searchValue: this.state.searchValue
					})
					.end((err, res) => {
						if (err) {
							console.log(err);
						} else {
							this.setState({
								searchOn: true,
								searchResults: res.body
							});
						}
					});
			}
		}
	}

	loadNextUploads() {
		request.post(this.getNextUploadsUrl)
			.send({
				skipAmount: this.state.skipAmount
			})
			.end((err, res) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({
						uploads: this.state.uploads.concat(res.body),
						skipAmount: this.state.skipAmount + 24
					});
				}
			});
	}

	render() {
		let Uploads;

		if (this.state.searchOn && this.state.searchResults.length > 0) {
			Uploads = 	<div>
							{ this.state.searchResults.map(({_id, image, title, timestamp, _createdBy}) => {
								let timeFromNow = moment(timestamp).fromNow();

								return (
									<Col sm={3} key={_id} className="upload-item">
										<Link to={"/uploads/" + _id}>
											<div className="thumbnail-container">
												<img src={image} alt="work thumbnail" />
											</div>
										</Link>
										<div className="work-list-text">
											<TextTruncate
												line={1}
												truncateText="..."
												text={title}
												className="work-list-title"
											/>
											<p><Link to={"/profile/" + _createdBy._id}>{_createdBy.firstName} {_createdBy.lastName}</Link> posted {timeFromNow}</p>
										</div>
									</Col>
								);
							})}
						</div>
		} else if (this.state.searchOn && this.state.searchResults.length === 0) {
			Uploads =	<div className="user-note">
							<div className="note-icon">
								<img src="assets/no-uploads.png" alt="no uploads" />
							</div>
							<p className="disclaimer">Ain't nobody got uploads like that</p>
						</div>
		} else {
			Uploads =	<div>
							{ this.state.uploads.map(({_id, image, title, timestamp, _createdBy}) => {
								let timeFromNow = moment(timestamp).fromNow();

								return (
									<Col sm={3} key={_id} className="upload-item">
										<Link to={"/uploads/" + _id}>
											<div className="thumbnail-container">
												<img src={image} alt="work thumbnail" />
											</div>
										</Link>
										<div className="work-list-text">
											<TextTruncate
												line={1}
												truncateText="..."
												text={title}
												className="work-list-title"
											/>
											<p><Link to={"/profile/" + _createdBy._id}>{_createdBy.firstName} {_createdBy.lastName}</Link> posted {timeFromNow}</p>
										</div>
									</Col>
								);
							})}
							<div className="centered">
								{this.state.uploads.length >= 24 ? <Button className="btn-outline btn-full buffer-top-md" onClick={this.loadNextUploads}>Load more</Button> : null}
							</div>
						</div>
		}

		return (
			<div className="upload-column">
				<div className="header-search">
					<h2>Public uploads and feedback</h2>
					<div className="search-public">
						<i className="fa fa-search" aria-hidden="true"></i>
						<FormControl
							id="searchPublic"
				            type="text"
				            placeholder="Search public uploads"
				            value={this.state.searchValue}
				            onChange={this.changeSearch}
				            onKeyUp={this.runSearch}
				      	/>
					</div>
				</div>
				<Row className="upload-list">
					{Uploads}
				</Row>
			</div>
		);
	}
}

export default PublicUploadList;