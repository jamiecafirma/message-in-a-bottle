import React from 'react';
import SpotifyLogin from './spotify-login';

export default function SenderStart(props) {
  return (
    <>
      <div className="overlay position-absolute"></div>
      <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
        <h1 className="font-size-48 no-margin">Ahoy Matey!</h1>
        <h2 className="font-size-24 text-center">Click on the shell to connect your Spotify account</h2>
        <SpotifyLogin callback='http://localhost:3000/callback/sender' />
      </div>
    </>
  );
}
