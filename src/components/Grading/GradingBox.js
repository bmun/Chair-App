import React, {Component} from 'react';
import './styles.css';

class GradingBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            score: null,
            feedback: '',
        }
    }

    submitFeedback = (event) => {
        this.props.firebase.submitFeedback(
            this.props.committee,
            this.props.delegate,
            this.state.feedback,
            this.state.score
        )
        event.preventDefault();
    };

    render () {
        return (
            <div className="box">
                <h3>{this.props.current ? 'Current' : 'Previous'} Speaker: {this.props.delegate}</h3>
                <form onSubmit={this.submitFeedback}>
                    <div className="form-group">
                        <label>Score: <input type="number" onChange={event => this.setState({score: event.target.value})} className="form-control" id="score"/></label>
                        <br/>
                        <label>Feedback: <textarea className="form-control" onChange={event => this.setState({feedback: event.target.value})} id="feedback" rows="3"/></label>
                    </div>
                    <button type="submit" className="btn btn-success">Submit Feedback</button>
                </form>
            </div>
        );
    }
}


export default GradingBox;