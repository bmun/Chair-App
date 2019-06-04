import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import './index.css'
import {withAuthorization} from "../Session";



const INITIAL_STATE = {
    content: '',
    type: 'Moderated',
    topic: '',
    del: '',
    time: '',
    sp_time: '',
    data: [],
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
        let that = this;
        this.props.firebase.user(this.props.firebase.auth.currentUser.uid)
            .once('value').then(function(snapshot) {
                that.committee = snapshot.val()["username"];
        });
        let thong = this;
        this.caucusCols = [
            {Header: "Caucus Type", accessor: "type"},
            {Header: "Topic", accessor: "topic"},
            {Header: "Delegate Title", accessor: "del"},
            {Header: "Total Time", accessor: "time"},
            {Header: "Speaking Time", accessor: "sp_time"},
            {Header: "Submit", accessor: 'click', Cell: row => (
                    <button onClick={(e) => {
                        console.log(row);
                        let myRow = row["row"];
                        thong.state.data.splice(myRow["_index"], 1);
                        let that = thong.state.data;
                        thong.setState({data: that});
                        thong.props.firebase
                            .setTable(thong.committee, "caucus", that)
                            .then(() => {thong.refreshData("nice")})
                            .catch(error => {
                                thong.setState({error})
                            });

                    }}>
                        Send to Docket
                    </button>)}
        ];
    }

    onSubmit = event => {
        const {content} = this.state;

        this.props.firebase
            .createPost(this.committee, content)
        .catch(error => {
            this.setState({error})
        });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    clearCaucus = event => {
        this.setState({data: []});
        let that = [];
        this.props.firebase
            .setTable(this.committee, "caucus", that)
            .catch(error => {
                this.setState({error})
            });

        this.setState({
            type: 'Moderated',
            topic: '',
            del: '',
            time: '',
            sp_time: '',
            data: that
        });
    };

    refreshData = event => {
        let that = this;
        this.props.firebase
            .getPost(this.committee).then(function(doc) {
                that.setState({content: doc.data()["currPost"]})
        })

        this.props.firebase
            .getTable(this.committee, "caucus")
            .then(function(doc) {
                that.setState({data: doc.data()["table"]})
            })
    };

    broadcastCaucus = event => {
        const {content, type, topic, del, time, sp_time, data, error} = this.state;
        let that = [ ...this.state.data ];
        that.push({
            type: type,
            topic: topic,
            del: del,
            time: time,
            sp_time: sp_time,
            click: null
        });

        this.props.firebase
            .setTable(this.committee, "caucus", that)
        .catch(error => {
            this.setState({error})
        });

        this.setState({
            type: 'Moderated',
            topic: '',
            del: '',
            time: '',
            sp_time: '',
            data: that
        });

        event.preventDefault();
    };

    render() {
        const {content, type, topic, del, time, sp_time, data, error} = this.state;
        const isInvalid2 = topic === '' || del === '' || time === '' || sp_time === '';
        return (
            <div className="container">
            <form onSubmit={this.onSubmit}>
                <textarea name="content"
                       value={content}
                       onChange={this.onChange}
                       placeholder="StuffHere"
                       />
                <button type="submit">
                    Post
                </button>
                {error && <p>{error.message}</p>}
            </form>

            <form onSubmit={this.broadcastCaucus}>
                <select name="type" value={type} onChange={this.onChange}>
                    <option value="Moderated">Mod</option>
                    <option value="Unmoderated">Unmod</option>
                    <option value="Formal">Formal</option>
                </select>
                <input
                    name="topic"
                    value={topic}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Topic"/>

                <input
                    name="del"
                    value={del}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Delegate"/>

                <input
                    name="time"
                    value={time}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Total Time"/>

                <input
                    name="sp_time"
                    value={sp_time}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Speaking Time"/>

                <button disabled={isInvalid2} type="submit"> Broadcast </button>
            </form>
            <ReactTable data={data}
                        columns={this.caucusCols}
                        showPageSizeOptions={false}
                        defaultPageSize={5}
                        showPageJump={false}
                        sortable={false}
                        resizable={false}/>
                <button onClick={this.clearCaucus}> Clear Caucus </button>
                <button onClick={this.refreshData}> Refresh Local Screen </button>
            </div>
        );
    }
}
const condition = authUser => !!authUser;

const PostForm = compose(
    withRouter,
    withFirebase
)(PostFormBase);

export default withAuthorization(condition)(PostPage);

export {PostForm}