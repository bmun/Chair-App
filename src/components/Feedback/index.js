import React, {Component} from 'react';
import {withAuthorization} from "../Session";
import FeedbackTable from './FeedbackTable';

const INITIAL_STATE = {
    // loading: false,
    feedback: null,
};

class FeedbackView extends Component {
    constructor(props) {
        super(props);   
        this.state = {
            ...INITIAL_STATE,
        }
    }

    render() { 
        const feedback = this.props.firebase.getFeedback(this.props.committee);
        feedback.then(result => 
            this.setState({feedback: result})
        );
        if (this.state.feedback === null || this.state.feedback === []) {
            return null;
        }
        return <FeedbackTable feedback={this.state.feedback}/>
    }
}

const condition = authUser => !!authUser;

export default withAuthorization(condition)(FeedbackView);