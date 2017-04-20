import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import App from './app/app.js';
import Home from './app/Home/Home.js';
import ResetPassword from './app/Profile/ResetPassword.js';
import MyProfile from './app/Profile/MyProfile.js';
import Profile from './app/Profile/Profile.js';
import EditProfile from './app/Profile/EditProfile.js';
import ChangePassword from './app/Profile/ChangePassword.js';
import CreateUpload from './app/Uploads/CreateUpload.js';
import EditUpload from './app/Uploads/EditUpload.js';
import Upload from './app/Uploads/Upload.js';
import Notifications from './app/Notifications/Notifications.js';
import '../public/css/index.css';


ReactDOM.render((<Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory}>
					<Route component={App}>
						<Route path="/" component={Home} />
						<Route path="/reset/:resetToken" component={ResetPassword} />
						<Route path="/profile/me" component={MyProfile} />
						<Route path="/profile/:userId" component={Profile} />
						<Route path="/profile/me/edit" component={EditProfile} />
						<Route path="/profile/me/password" component={ChangePassword} />
						<Route path="/uploads/create" component={CreateUpload} />
						<Route path="/uploads/:uploadId/edit" component={EditUpload} />
						<Route path="/uploads/:uploadId" component={Upload} />
						<Route path="/notifications" component={Notifications} />
					</Route>
				</Router>),
  				document.getElementById('root')
);
