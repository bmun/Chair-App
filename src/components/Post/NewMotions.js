import React, { Component } from 'react';
import styled from 'styled-components'
import {SpeakingTimes, Times} from "../../constants/times";

const Styles = styled.div`
  padding: 1rem;
  margin-bottom: 200px;
  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`

class NewMotions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "Moderated",
            topic: "",
            del: "",
            time: "5m",
            sp_time: "1m",
        }

    }

    onChange = event => {
      this.setState({ [event.target.name]: event.target.value });
    }

    render () {
      const {type, topic, del, time, sp_time} = this.state
      const isInvalid = topic === '' || del === '' || time === '' || sp_time === '' || Times[time] % SpeakingTimes[sp_time] !== 0;
        return (
          <Styles>
              <div className="box">
                  <h3>New Motion</h3>
                  <form onSubmit={event => this.props.broadcast(event, type, topic, del, time, sp_time)}>
                  <div className="form-group">
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
                          {Object.keys(SpeakingTimes).map((key, index) => (<option value={key} key={key}>{key}</option>))}
                      </select>

                      <button disabled={isInvalid} type="submit"> Broadcast </button>
                      </div>
                  </form>
              </div>
            </Styles>
        );
    }
}

export default NewMotions
