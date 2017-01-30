import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import App from './components/App/app.js';
import Home from './components/Home/Home.js';
import PublicUpload from './components/Home/UploadList/PublicUpload/PublicUpload.js';
import Upload from './components/Upload/Upload.js';
import Groups from './components/Groups/Groups.js';
import './index.css';


ReactDOM.render((<Router history={browserHistory}>
					<Route component={App}>
						<Route path="/" component={Home} />
						<Route path="/uploads/:_id" component={PublicUpload} />
						<Route path="/upload" component={Upload} />
						<Route path="/groups" component={Groups} />
					</Route>
				</Router>),
  				document.getElementById('root')
);
