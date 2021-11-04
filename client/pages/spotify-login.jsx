import React from 'react';

export default class SpotifyLogin extends React.Component {
  constructor(props) {
    super(props);
    this.makeid = this.makeid.bind(this);
    this.getRandomInt = this.getRandomInt.bind(this);
    this.initiateSpotifyLogin = this.initiateSpotifyLogin.bind(this);
    this.sha256 = this.sha256.bind(this);
    this.base64urlencode = this.base64urlencode.bind(this);
  }

  makeid(length) {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
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

  sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  }

  base64urlencode(a) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(a)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  initiateSpotifyLogin() {
    const codeVerifier = this.makeid(this.getRandomInt(43, 128));
    this
      .sha256(codeVerifier)
      .then(hash => {
        const codeChallenge = this.base64urlencode(hash);
        const authState = this.makeid(12);
        sessionStorage.setItem('spotify-code-verifier', codeVerifier);
        sessionStorage.setItem('spotify-state', authState);
        const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&redirect_uri=http://localhost:3000/callback&state=${authState}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
        window.open(authURL);
      });
  }

  render() {
    return (
      <>
      <div className="overlay position-absolute"></div>
        <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
        <h1 className="font-size-48 no-margin">Ahoy Matey!</h1>
          <h2 className="font-size-24 text-center">Click on the shell to connect your Spotify account</h2>
        <a onClick={this.initiateSpotifyLogin}><img src="images/shell.png" className="width-80" /></a>
      </div>
      </>
    );
  }
}
