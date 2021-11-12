import React from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../lib/app-context';

export default class SendMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottleId: 0,
      recipientEmail: null
    };
  }

  componentDidMount() {
    this.setState({ bottleId: this.context.currentBottleId });

    fetch(`/api/messages/${this.state.bottleId}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        // console.log(data);
        const { recipientEmail } = data;
        this.setState({ recipientEmail: recipientEmail });
      })
      .catch(error => console.error('There was an unexpected error', error));
  }

  render() {
    if (!this.state.recipientEmail) {
      return null;
    }
    return (
      <>
        <div className="overlay position-absolute"></div>
        <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
          <h1 className="font-size-48 no-margin">Send message to</h1>
          <h2 className="font-size-36 text-center">{`${this.state.recipientEmail}?`}</h2>
          <a><img src="/images/wave.png" className="width-120" /></a>
          <h1 className="font-size-36 no-margin text-center mb-24">Click the wave to confirm</h1>
          <Link to="/menu"><img src="/images/parrot.png" className="width-120" /></Link>
          <h1 className="font-size-36 no-margin text-center">Go back?</h1>
        </div>
      </>
    );
  }
}

SendMessage.contextType = AppContext;
