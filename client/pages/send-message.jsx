import React from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../lib/app-context';

export default class SendMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottleId: 0,
      recipientEmail: null,
      emailSent: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const bottleId = this.context.currentBottleId;
    this.setState({ bottleId: bottleId });

    fetch(`/api/messages/${bottleId}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const { recipientEmail } = data;
        this.setState({ recipientEmail: recipientEmail });
      })
      .catch(error => console.error('There was an unexpected error', error));
  }

  handleClick(event) {
    const sendId = { bottleId: this.state.bottleId };
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendId)
    };
    fetch('/api/send', myInit)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ emailSent: true });
      })
      .catch(error => {
        console.error('There was an unexpected error', error);
      });
  }

  render() {
    if (!this.state.recipientEmail) {
      return null;
    } else if (!this.state.emailSent) {
      return (
        <>
          <div className="overlay position-absolute"></div>
          <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
            <h1 className="font-size-48 no-margin">Send message to</h1>
            <h2 className="font-size-36 text-center">{`${this.state.recipientEmail}?`}</h2>
            <button onClick={this.handleClick}><img src="/images/wave.png" className="width-120" /></button>
            <h1 className="font-size-36 no-margin text-center mb-24">Click the wave to confirm</h1>
            <Link to="/menu"><img src="/images/parrot.png" className="width-120" /></Link>
            <h1 className="font-size-36 no-margin text-center">Go back?</h1>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="overlay position-absolute"></div>
          <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
            <h1 className="font-size-48 no-margin">Email Sent!</h1>
            <h2 className="font-size-36 text-center">{`${this.state.recipientEmail}?`}</h2>
            <Link to="/"><img src="/images/parrot.png" className="width-120" /></Link>
            <h1 className="font-size-36 no-margin text-center">Make another Bottle?</h1>
          </div>
        </>
      );
    }
  }
}

SendMessage.contextType = AppContext;
