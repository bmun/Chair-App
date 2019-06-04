import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const INITIAL_STATE = {
    content: '',
    type: 'Moderated',
    topic: '',
    del: '',
    time: '',
    sp_time: '',
    data: [{
        type: "moderated",
        topic: "Pharmaceutical Crime",
        del: "Rwanda",
        time: "5:00",
        sp_time: "1:00",
    }],
    error: null,
};

var caucus = [{
    type: "Moderated",
    topic: "Pharmaceutical Crime",
    del: "Rwanda",
    time: "5:00",
    sp_time: "1:00",
    click: null,
}];

var caucusCols = [
    {Header: "Caucus Type", accessor: "type"},
    {Header: "Topic", accessor: "topic"},
    {Header: "Delegate Title", accessor: "del"},
    {Header: "Total Time", accessor: "time"},
    {Header: "Speaking Time", accessor: "sp_time"},
    {Header: "", accessor: 'click', Cell: row => (<button onClick={(e) => console.log(row["row"])}>Click Me</button>)}
    ];

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
        this.setState({
            type: 'Moderated',
            topic: '',
            del: '',
            time: '',
            sp_time: '',
        });
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    broadcast = event => {
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



        this.setState({data: that});


        event.preventDefault();
    };

    render() {
        const {content, type, topic, del, time, sp_time, data, error} = this.state;
        const isInvalid = content === '';
        const isInvalid2 = topic === '' || del === '' || time === '' || sp_time === '';
        return (
            <div>
            <form onSubmit={this.onSubmit}>
                <textarea name="content"
                       value={content}
                       onChange={this.onChange}
                       placeholder="StuffHere"
                       />
                <button disabled={isInvalid} type="submit">
                    Post
                </button>
                {error && <p>{error.message}</p>}
            </form>

            <form onSubmit={this.broadcast}>
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
                <div>
            <ReactTable data={data}
                        columns={caucusCols}
                        showPageSizeOptions={false}
                        defaultPageSize={5}
                        showPageJump={false}/>
                </div>
            </div>
        );
    }
}

const PostForm = compose(
    withRouter,
    withFirebase
)(PostFormBase);

export default PostPage;

export {PostForm}