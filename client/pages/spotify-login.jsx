import React from 'react';
import { sha256 } from 'js-sha256';
import { encode } from 'js-base64';

export default class SpotifyLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      codeVerifier: ''
    };
    this.makeid = this.makeid.bind(this);
    this.getRandomInt = this.getRandomInt.bind(this);
    this.initiateSpotifyLogin = this.initiateSpotifyLogin.bind(this);
  }

  makeid(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  initiateSpotifyLogin() {
    const codeVerifier = this.makeid(this.getRandomInt(43, 128));
    const hash = sha256(codeVerifier);
    const codeChallenge = encode(hash, true);
    const authState = this.makeid(12);
    const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=http://localhost:3000/callback&state=${authState}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    window.open(authURL);

  }

  render() {
    return (
      <>
      <div className="overlay position-absolute"></div>
        <div className="row align-center flex-column position-absolute padding-2rem desktop-style">
        <h1 className="font-size-48 no-margin">Ahoy Matey!</h1>
          <h2 className="font-size-24 text-center">Click on the shell to connect your Spotify account</h2>
        <a onClick={this.initiateSpotifyLogin} href="#"><img src="images/shell.png" className="width-80" /></a>
      </div>
      </>
    );
  }
}
