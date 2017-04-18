import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteAccountModal = ({showDeleteModal, closeDelete, deleteUser}) => (
	<Modal show={showDeleteModal} onHide={closeDelete}>
		<Modal.Header className="modal-header" closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        	<div className="user-note">
				<div className="note-icon">
					<img src="assets/delete-upload.png" alt="delete warning" />
				</div>
				<p className="disclaimer">Hate to see you go! All of your uploads, comments, and karma will be permanently deleted if you proceed</p>
			</div>
        	<div className="centered buffer-top-md">
        		<Button className="btn-primary btn-full btn-block" onClick={deleteUser}>Yes, delete my account</Button>
        		<Button className="btn-outline btn-full btn-block" onClick={closeDelete}>Cancel</Button>
        	</div>
        </Modal.Body>
	</Modal>
);

export default DeleteAccountModal;