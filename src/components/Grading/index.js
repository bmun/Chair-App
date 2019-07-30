import React, {Component} from 'react';
import Select from 'react-select';
import {withAuthorization} from "../Session";

const INITIAL_STATE = {
    refreshed: false,
    delList: [],
    choice: ""
};

class GradingPage extends Component {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    getOptions = () => {
        this.setState({refreshed: true});
        let that = this;
        this.props.firebase
        .getDelegates(this.props.committee)
        .then(function(snapshot) {
            let delList = snapshot.docs.map(doc => {return {value: doc.data()["name"], label: doc.data()["name"]}});
            that.setState({delList})
        })};

    submitFeedback = () => {
        const {choice} = this.state
        //TODO: Store Feedback in firebase

    };

    render() {
        const {refreshed, delList, choice}  = this.state;
        return (
            <div>
                <h1>Grading</h1>
                <button hidden={refreshed} onClick={this.getOptions}>grade sum kids</button>
                <form onSubmit={this.submitFeedback}>
                    <div className="form-group">
                    <Select options={delList} value={choice}/>
                    </div>
                    <div className="form-group">
                        <textarea className="form-control" id="feedback" rows="3"/>
                    </div>
                    <button type="submit" className="btn btn-success">Submit Feedback</button>
                </form>
            </div>
        )
    }

}
const condition = authUser => !!authUser;

export default withAuthorization(condition)(GradingPage);