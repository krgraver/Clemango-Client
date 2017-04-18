import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteUploadModal = ({showDeleteModal, closeDelete, deleteUpload}) => (
	<Modal show={showDeleteModal} onHide={closeDelete}>
		<Modal.Header className="modal-header" closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        	<div className="user-note">
				<div className="note-icon">
					<img src="assets/delete-upload.png" alt="delete warning" />
				</div>
				<p className="disclaimer">This upload will be permanently deleted and you will lose 3 karma points</p>
			</div>
        	<div className="centered buffer-top-md">
        		<Button className="btn-primary btn-full btn-block" onClick={deleteUpload}>Yes, delete upload</Button>
        		<Button className="btn-outline btn-full btn-block" onClick={closeDelete}>Cancel</Button>
        	</div>
        </Modal.Body>
	</Modal>
);

export default DeleteUploadModal;