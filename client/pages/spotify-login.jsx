import React from 'react';

export default class SpotifyLogin extends React.Component {
  render() {
    return (
      <>
      <div className="overlay position-absolute"></div>
        <div className="row align-center flex-column position-absolute padding-2rem desktop-style">
        <h1 className="font-size-48 no-margin">Ahoy Matey!</h1>
          <h2 className="font-size-24 text-center">Click on the shell to connect your Spotify account</h2>
        <a href="#"><img src="images/shell.png" className="width-80" /></a>
      </div>
      </>
    );
  }
}
