import React from 'react';
import { Link } from 'react-router-dom';

export default class MessageError extends React.Component {
  render() {
    return (
      <>
        <div className="overlay position-absolute"></div>
        <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
          <h1 className="font-size-36 no-margin text-center">Unable to create message! All fields are required.</h1>
          <h2 className="font-size-24 text-center">Click on the parrot to try again!</h2>
          <Link to='/'><img src="/images/parrot.png" className="width-100" /></Link>
        </div>
      </>
    );
  }
}
