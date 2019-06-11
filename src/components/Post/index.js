import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import './index.css'
import {withAuthorization} from "../Session";
import {SpeakingTimes, Times} from "../../constants/times";
import Countdown from 'react-countdown-now';
import {Motions} from "../../constants/motions";


const INITIAL_STATE = {
    content: '',
    type: 'Moderated',
    topic: '',
    del: '',
    time: '1m',
    sp_time: '15s',
    data: [],
    currentCaucus: {rem: 0},
    timerVal: 0,
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
                that.refreshData(null)
        });
        let thong = this;
        this.caucusCols = [
            {Header: "Caucus Type", accessor: "type", sortMethod: (a, b) => Motions[a] > Motions[b]},
            {Header: "Topic", accessor: "topic"},
            {Header: "Delegate Title", accessor: "del"},
            {Header: "Total Time", accessor: "time", sortMethod: (a, b) => Times[a] > Times[b]},
            {Header: "Speaking Time", accessor: "sp_time", sortMethod: (a, b) => SpeakingTimes[a] > SpeakingTimes[b]},
            {Header: "Utils", accessor: 'click', Cell: row => (
                    <div><button onClick={(e) => {
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
                        let newCaucus = {
                            type: myRow["type"],
                            topic: myRow["topic"],
                            del: myRow["del"],
                            time: myRow["time"],
                            sp_time: myRow["sp_time"],
                            rem: Times[myRow["time"]] / SpeakingTimes[myRow["sp_time"]],
                        };
                        thong.setState({currentCaucus: newCaucus});
                        thong.props.firebase
                            .setTable(thong.committee, "currCaucus", newCaucus)
                            .then(() => {thong.refreshData("nice")})
                            .catch(error => {
                                thong.setState({error})
                            });
                    }}>
                        Pass
                    </button>
                    <button onClick={() =>{
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
                    }}>Fail</button></div>)}
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
        let {time, sp_time} = this.state;
        if (event.target.name === "time") time = event.target.value;
        if (event.target.name === "sp_time") sp_time = event.target.value;
        if (Times[time] % SpeakingTimes[sp_time] !== 0) {
            this.setState({error: "Speaking Time does not divide time evenly!"});
        } else {
            this.setState({error: null});
        }

    };

    clearCaucus = event => {
        this.setState({data: []});
        let that = [];
        this.props.firebase
            .setTable(this.committee, "caucus", that)
            .catch(error => {
                this.setState({error})
            });

        this.setState(...INITIAL_STATE);
    };

    refreshData = event => {
        let that = this;
        this.props.firebase
            .getPost(this.committee).then(function(doc) {
                if (doc.exists) {
                    that.setState({content: doc.data()["currPost"]})
                }
        });

        this.props.firebase
            .getTable(this.committee, "caucus")
            .then(function(doc) {
                if (doc.exists) {
                    that.setState({data: doc.data()["table"]})
                }
            });

        this.props.firebase
            .getTable(this.committee, "currCaucus")
            .then(function(doc) {
                if (doc.exists) {
                    that.setState({currentCaucus: doc.data()["table"]})
                }
            });
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

        that.sort(function (a, b) {
            let typePriority = Motions[b["type"]] - Motions[a["type"]];
            let timePriority = Times[b["time"]] - Times[a["time"]];
            let sptimePriority = SpeakingTimes[b["sp_time"]] - SpeakingTimes[a["sp_time"]];
            if (typePriority !== 0) return typePriority;
            if (timePriority !== 0) return timePriority;
            return sptimePriority;
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
            time: '1m',
            sp_time: '15s',
            data: that
        });

        event.preventDefault();
    };

    takeSpeech = () => {
        const {currentCaucus} = this.state;
        
        this.setState({
            currentCaucus: {
                type: currentCaucus["type"],
                topic: currentCaucus["topic"],
                del: currentCaucus["del"],
                time: currentCaucus["time"],
                sp_time: currentCaucus["sp_time"],
                rem: currentCaucus["rem"] - 1,
            },
            timerVal: SpeakingTimes[currentCaucus["sp_time"]] * 1000,
        })
    };

    render() {
        const {content, type, topic, del, time, sp_time, data, currentCaucus, timerVal, error} = this.state;
        const isInvalid2 = topic === '' || del === '' || time === '' || sp_time === '';
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <form onSubmit={this.onSubmit}>
                            <textarea name="content"
                                   value={content}
                                   onChange={this.onChange}
                                   placeholder="StuffHere"
                                      className="form-controlq"
                                   />
                            <button type="submit">
                                Post
                            </button>
                            {error && <p>{error}</p>}
                        </form>
                    </div>
                    <div className="col-md-6">
                    </div>
                </div>
                <br/>
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

                <select
                    name="time"
                    value={time}
                    onChange={this.onChange}>

                    {Object.keys(Times).map((key, index) => (<option value={key} key={key}>{key}</option>))}
                </select>

                <select
                    name="sp_time"
                    value={sp_time}
                    onChange={this.onChange}>
                    {Object.keys(SpeakingTimes).map((key, index) => (<option value={key}key={key}>{key}</option>))}
                </select>

                <button disabled={isInvalid2} type="submit"> Broadcast </button>
            </form>
                    <br/>
                <div className="container">

                <ReactTable data={data}
                        columns={this.caucusCols}
                        showPageSizeOptions={false}
                        defaultPageSize={5}
                        showPageJump={false}
                        sortable={false}
                        multiSort={false}
                        resizable={false}/>
                <button onClick={this.clearCaucus}> Clear Caucus </button>
                <button onClick={this.refreshData}> Refresh Local Screen </button>
                {error && <p>{error.message}</p>}
                    <h4>Current Caucus:</h4>
                    <div className="container">
                        <p>Speeches Remaining: {currentCaucus.rem} </p> &emsp;
                        <button onClick={this.takeSpeech}> Take Speech</button> &emsp;
                        <Countdown date={Date.now() + timerVal} now={() => Date.now()}/>
                    </div>
                    <p>Speaking Time: {currentCaucus.sp_time}</p>
                    <p>Total Time: {currentCaucus.time}</p>
                    <p> Type: {currentCaucus.type} </p>
                    <p>Topic: {currentCaucus.topic}</p>
                    <p>Delegate: {currentCaucus.del}</p>
            </div>
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