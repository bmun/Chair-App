import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
// import 'react-table/react-table.css'
import {SimpleTable, Styles} from '../../common/SimpleTable'
import './index.css'
import {withAuthorization} from "../Session";
import {SpeakingTimes, Times} from "../../constants/times";
import {Motions} from "../../constants/motions";
import NewMotions from './NewMotions'
import NewSpeaker from './NewSpeaker'

const INITIAL_STATE = {
    content: '',
    type: 'Moderated',
    topic: '',
    del: '',
    time: '1m',
    sp_time: '15s',
    data: [],
    currentCaucus: {rem: -1},
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
                      console.log(row)
                        let myRow = row["row"]["original"];
                        thong.state.data.splice(row["index"], 1);
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
                        console.log(newCaucus)
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
    broadcast_helper = (event, typ, topi, de, tim, sp_tim) => {
      this.setState({
        type: typ,
        topic: topi,
        del: de,
        time: tim,
        sp_time: sp_tim
      })
      this.broadcastCaucus(event);
      event.preventDefault();
    }

    broadcastCaucus = (event, type, topic, del, time, sp_time) => {
        // const {type, topic, del, time, sp_time} = this.state;
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
        if (currentCaucus["rem"] % 1 !== 0) {this.setState({error: "Error: invalid moderated caucus"}); return;}
        if (currentCaucus["rem"] !== 0) {
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
        }
    };

    addSpeaker = (event, speaker) => {
      let data = []
      let fb = this.props.firebase;
      let comm = this.committee
      fb.getTable(comm, "speakerList")
      .then(function(doc) {
          let data = []
          if (doc.exists) {
              data = doc.data()["table"]
          }
          data.push(speaker)
          fb.setTable(comm, "speakerList", data)
      })
      event.preventDefault()
    }

    render() {
        const {content, type, topic, del, time, sp_time, data, currentCaucus, timerVal, error} = this.state;
        const isInvalid2 = topic === '' || del === '' || time === '' || sp_time === '';
        return (
          <div>
          {currentCaucus.rem < 0 && <div className="container-fluid">
          	<div className="row">
          		<div className="col-md-6">
                <Styles>
                  <SimpleTable data={data}
                          columns={this.caucusCols}/>
                </Styles>
          		</div>
          		<div className="col-md-6">
                <NewMotions broadcast={this.broadcastCaucus}/>
                <NewSpeaker addSpeaker={this.addSpeaker}/>
          		</div>
              <button onClick={this.clearCaucus}> Clear Caucus </button>
              <button onClick={this.refreshData}> Refresh Screen </button>
              <button> Suspend Debate </button>
          	</div>
          </div>}
            {currentCaucus.rem >= 0 && <div className="container-fluid">
            	<div className="row">
            		<div className="col-md-7">
                <input placeholder={"Filter"}/>
                <Styles>
                <SimpleTable
                data={Array(7).fill({delegate: "Russia", times_spoken: "0"})}
                columns={[
                  {Header: "Delegate", accessor: "delegate"},
                  {Header: "Times Spoken", accessor: "times_spoken"}
                ]}/>
                </Styles>
                <button> Suspend Debate </button>
            		</div>
            		<div className="col-md-5">
            			<div className="row">
            				<div className="col-md-12">
            					<div className="row">
            						<div className="col-md-6">
                          <h2> 00:43 </h2>
                          <h3> Libya </h3>
                          <h5> Speeches Remaining: {currentCaucus.rem}</h5>
                          <h5> Speaking Time: {currentCaucus.sp_time}</h5>
                          <h5> Total Time: {currentCaucus.time}</h5>
            						</div>
            						<div className="col-md-6">
                        {currentCaucus.rem > 0 && <button onClick={this.takeSpeech}> Next Speaker </button>}
                        {currentCaucus.rem == 0 && <button onClick={()=>{
                          currentCaucus.rem = -1;
                          this.setState({currentCaucus});
                          this.props.firebase
                              .setTable(this.committee, "currCaucus", currentCaucus);
                          }
                        }> End Caucus </button>}
                          <button> Start Timer</button>
                          <button> Stop Timer </button>
            						</div>
            					</div>
            				</div>
            			</div>
            			<div className="row">
            				<div className="col-md-12">
                      <Styles>
                        <SimpleTable
                        data={Array(7).fill({delegate: "Russia"})}
                        columns={[{Header:"Delegation", accessor: "delegate"}]}/>
                      </Styles>
            				</div>
            			</div>
            		</div>
            	</div>
            </div>}
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
