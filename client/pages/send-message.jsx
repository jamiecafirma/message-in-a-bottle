import React from 'react';
// import { Link, useParams } from 'react-router-dom';

export default class SendMessage extends React.Component {
  render() {
    return (
      <>
        <div className="overlay position-absolute"></div>
        <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
          <h1 className="font-size-48 no-margin">Send message to</h1>
          <h2 className="font-size-36 text-center">recipient@email.com?</h2>
          <a><img src="/images/wave.png" className="width-120" /></a>
          <h1 className="font-size-36 no-margin text-center">Click the wave to confirm</h1>
        </div>
      </>
    );
  }
}
