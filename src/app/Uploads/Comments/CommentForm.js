import React from 'react';
import { FormGroup, InputGroup, Button, FormControl } from 'react-bootstrap';

const CommentForm = ({changeComment, submitComment}) => (
	<FormGroup>
        <InputGroup>
          	<FormControl 	id="commentBody"
                          componentClass="textarea"
                          className="textbox-lg"
                					type="text"
                					placeholder="Add comment here..."
                					onChange={changeComment}
          	/>
          	<InputGroup.Button>
            	<Button className="btn-clear btn-add" onClick={submitComment}><i className="fa fa-plus-square" aria-hidden="true"></i></Button>
          	</InputGroup.Button>
        </InputGroup>
	</FormGroup>
);

export default CommentForm;