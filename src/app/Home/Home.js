import React from 'react';
import PublicUploadList from './PublicUploadList/PublicUploadList.js';

const Home = () => (
	<div>
		<div className="banner">
			<div className="banner-text">
				<h1>Get critical feedback on your designs when you need it</h1>
				<h4>
					Share your work publicly or privately in a community trying to 
					improve designs, not show off.
				</h4>
			</div>
		</div>
		<PublicUploadList />
	</div>
);

export default Home;