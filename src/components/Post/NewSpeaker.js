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

class NewSpeaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            speaker: ""
        }

    }

    onChange = event => {
      this.setState({ [event.target.name]: event.target.value });
    }

    render () {
      const {speaker} = this.state
      const isInvalid = speaker === '';
        return (
          <Styles>
              <div className="box">
                  <h3>New Speaker</h3>
                  <form onSubmit={event => this.props.addSpeaker(event, speaker)}>
                  <div className="form-group">
                      <input
                          name="speaker"
                          value={speaker}
                          onChange={this.onChange}
                          type="text"
                          placeholder="New Speaker"/>
                      </div>
                      <button disabled={isInvalid} type="submit"> Add </button>
                  </form>
              </div>
            </Styles>
        );
    }
}

export default NewSpeaker
