import React from 'react';

export default class SpotifyLogin extends React.Component {
  constructor(props) {
    super(props);
    this.initiateSpotifyLogin = this.initiateSpotifyLogin.bind(this);
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
        const scope = 'user-read-playback-state user-modify-playback-state';
        const redirectUri = this.props.callback;
        sessionStorage.setItem('spotify-code-verifier', codeVerifier);
        sessionStorage.setItem('spotify-state', authState);
        const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&redirect_uri=${redirectUri}&state=${authState}&code_challenge=${codeChallenge}&code_challenge_method=S256&scope=${scope}`;
        window.open(authURL);
      });
  }

  render() {
    return (
      <a onClick={this.initiateSpotifyLogin}><img src="images/shell.png" className="width-80" /></a>
    );
  }
}
