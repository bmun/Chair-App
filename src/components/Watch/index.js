import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import './index.css'
import ReactMarkdown from 'react-markdown'

const WatchPage = () => (
    <div>
        <h1>Watch</h1>
        <WatchBox />
    </div>
);

var caucusCols = [
    {Header: "Caucus Type", accessor: "type"},
    {Header: "Topic", accessor: "topic"},
    {Header: "Delegate Title", accessor: "del"},
    {Header: "Total Time", accessor: "time"},
    {Header: "Speaking Time", accessor: "sp_time"},
];


class WatchBoxBase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "",
            caucus: [],
            channel: "",
            channelList: [],
            listening: false,
        };
        this.c_list = [];
        let that = this;
        this.props.firebase.users()
            .once('value').then(function(snapshot) {
            let array = snapshot.val();
            that.c_list = [];
            for (let x in array) {
                that.c_list.push(array[x]["username"])
            }
            that.setState({channelList: that.c_list})
        });

    }



    initListener = () => {
        const {content, caucus, channel, channelList, listening} = this.state;
        console.log(channel);
        const db = this.props.firebase.database;
        let that = this;
        this.setState({listening: true});

        db.collection(channel).doc("billboard")
            .onSnapshot(function(doc) {
                if (doc.exists) {
                    that.setState({content: doc.data()["currPost"]})
                }
            });

        db.collection(channel).doc("caucus")
           .onSnapshot( function(doc) {
               if (doc.exists) {
                   that.setState({caucus: doc.data()["table"]})
               }
           })
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {content, caucus, channel, channelList, listening} = this.state;

        return (
            <div>
                {listening && <div><ReactMarkdown source={content} />
                <ReactTable data={caucus}
                            columns={caucusCols}
                            showPageSizeOptions={false}
                            defaultPageSize={5}
                            showPageJump={false}/></div>}
                {!listening && <div>
                    <select name="channel" value={channel} onChange={this.onChange}>
                        <option value="">
                            Select one...
                        </option>
                        {channelList.map(function (currentValue, index) {
                            return (<option key={index} value={currentValue}>
                                {currentValue}
                            </option>);
                        })}
                    </select>
                    <button onClick={this.initListener}> Tune In </button></div>}
            </div>



        )
    }
}

const WatchBox = compose(
    withRouter,
    withFirebase,
)(WatchBoxBase);

export default(WatchPage);

export {WatchBox};