import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';


const INITIAL_STATE = {
    content: '',
    error: null,
};

const PostPage = () => (
    <div>
        <h1>Post</h1>
        <PostForm />
    </div>
);



class PostFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE};
    }

    onSubmit = event => {
        const {content} = this.state;

        this.props.firebase
            .createPost(content)
        .catch(error => {
            this.setState({error})
        });
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {content, error} = this.state;
        const isInvalid = content === '';

        return (
            <form onSubmit={this.onSubmit}>
                <input name="content"
                       value={content}
                       onChange={this.onChange}
                       type={"text"}
                       placeholder="StuffHere"
                       />
                <button disabled={isInvalid} type="submit">
                    Post
                </button>
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const PostForm = compose(
    withRouter,
    withFirebase
)(PostFormBase);

export default PostPage;

export {PostForm}