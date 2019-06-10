import React, {Component} from 'react';
import {withAuthorization} from "../Session";


const HomePage = () => (
    <div>
        <h1>Home</h1>
        <InsertDelegatesForm />
    </div>
);


class InsertDelegatesFormBase extends Component {
    constructor(props) {
        super(props);
        this.state = {delegates: ""}
    }

    changeDelegates = event => {
        const {delegates} = this.state;
        const names = delegates.split('\n');
        this.props.firebase
            .setDelegates(this.props.committee, names);
        event.preventDefault();
    };


    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {delegates} = this.state;
        return (
            <form onSubmit={this.changeDelegates}>
                <h3> Update Delegate List </h3>
                <textarea placeholder="I hope you know what you're doing..."
                          name="delegates"
                          value={delegates}
                          onChange={this.onChange}/>
                <button type="submit">Update </button>
            </form>
        );
    }
}

const condition = authUser => !!authUser;

const InsertDelegatesForm = withAuthorization(condition)(InsertDelegatesFormBase);
export default HomePage;

export {InsertDelegatesForm}