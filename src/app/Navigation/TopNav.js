import React, { Component } from 'react';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';

class TopNav extends Component {
	render() {
		let NavItems;

		if (this.props.userAuthenticated && this.props.newNotifications.length > 0) {
			NavItems = 	<Navbar.Collapse>
							<Nav pullRight id="navItems">
						    	<LinkContainer to="/uploads/create">
						    		<NavItem eventKey={1}>
						    			<Button className="upload-expanded btn-primary"><i className="fa fa-cloud-upload inset-icon" aria-hidden="true"></i> Upload work</Button>
						    			<div className="upload-collapsed">Upload work</div>
						    		</NavItem>
						    	</LinkContainer>
					    		<LinkContainer to="#" className="notifications-expanded">
					    			<NavItem eventKey={2} role="tab" tabIndex="2" onFocus={this.props.showNotifications} onBlur={this.props.hideNotifications}>
						    			<Button id="notification-icon" className="btn-clear">
						    				<span className="notifications-badge">{this.props.newNotifications.length}</span> <i className="fa fa-bell-o" aria-hidden="true"></i>
						    			</Button>
				    				</NavItem>
				    			</LinkContainer>
				    			<LinkContainer to="/notifications" className="notifications-collapsed" onClick={this.props.clearNotificationsCollapsed}>
					    			<NavItem eventKey={3}>
					    				<div>Notifications <span className="notifications-badge">({this.props.newNotifications.length})</span></div>
				    				</NavItem>
				    			</LinkContainer>
						    	<LinkContainer to={"/profile/me"}>
						    		<NavItem eventKey={4}>
						    			<div>
						    				<div className="profile-expanded profile-small">
						    					<img src={this.props.profilePic} alt="profile thumbnail" />
						    				</div>
						    			</div>
						    			<div className="profile-collapsed">Profile</div>
						    		</NavItem>
						    	</LinkContainer>
						    </Nav>
						</Navbar.Collapse> 	
		} else if (this.props.userAuthenticated && this.props.newNotifications.length === 0) {
			NavItems = 	<Navbar.Collapse>
							<Nav pullRight id="navItems">
						    	<LinkContainer to="/uploads/create">
						    		<NavItem eventKey={1}>
						    			<Button className="upload-expanded btn-primary"><i className="fa fa-cloud-upload inset-icon" aria-hidden="true"></i> Upload work</Button>
						    			<div className="upload-collapsed">Upload work</div>
						    		</NavItem>
						    	</LinkContainer>
					    		<LinkContainer to="#" className="notifications-expanded">
					    			<NavItem eventKey={2} role="tab" tabIndex="2" onFocus={this.props.showNotifications} onBlur={this.props.hideNotifications}>
						    			<Button id="notification-icon" className="notifications-expanded btn-clear">
						    				<i className="fa fa-bell-o" aria-hidden="true"></i>
						    			</Button>
				    				</NavItem>
				    			</LinkContainer>
				    			<LinkContainer to="/notifications" className="notifications-collapsed">
					    			<NavItem eventKey={3}>
					    				<div>Notifications</div>
				    				</NavItem>
				    			</LinkContainer>
						    	<LinkContainer to={"/profile/me"}>
						    		<NavItem eventKey={4}>
						    			<div>
						    				<div className="profile-expanded profile-small">
						    					<img src={this.props.profilePic} alt="profile thumbnail" />
						    				</div>
						    			</div>
						    			<div className="profile-collapsed">Profile</div>
						    		</NavItem>
						    	</LinkContainer>
						    </Nav>
						</Navbar.Collapse> 
		} else {
			NavItems = 	<Navbar.Collapse>	
							<Nav pullRight>
						    	<NavItem eventKey={1} onClick={this.props.openAuthentication}>
						    		<Button className="login-expanded btn-primary">Log in / Sign up</Button>
						    		<div className="login-collapsed">Log in / Sign up</div>
						    	</NavItem>
						    </Nav>
						</Navbar.Collapse>
		};

		return (
			<Navbar fixedTop fluid collapseOnSelect>
			    <Navbar.Header>
			      	<Navbar.Brand>
			        	<Link to="/" className="logo">
			        		<img src="assets/logo-color-sm.png" alt="Clemango Logo Orange" />
			        	</Link>
			      	</Navbar.Brand>
			      	<Navbar.Toggle />
			    </Navbar.Header>
			    {NavItems}
			</Navbar>
		);
	}
};

export default TopNav;

