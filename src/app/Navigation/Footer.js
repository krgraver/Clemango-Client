import React from 'react';

const Footer = () => (
	<div className="footer">
		<div className="footer-logo">
    		<img src="assets/logo-color-sm.png" alt="Clemango Logo Orange" />
    	</div>
        <div className="social-icons">
            <a href="#">
                <i className="fa fa-facebook" aria-hidden="true"></i>
            </a>
            <a href="#">
                <i className="fa fa-twitter" aria-hidden="true"></i>
            </a>
            <a href="#">
                <i className="fa fa-medium" aria-hidden="true"></i>
            </a>
        </div>
    	<p>This site is also up for feedback! Send questions or comments to <a href="mailto:kelly@clemango.com">kelly@clemango.com</a></p>
	</div>
);

export default Footer;