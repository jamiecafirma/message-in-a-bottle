import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SpotifyLogin from './pages/spotify-login';
import SpotifyAuthRedirect from './pages/spotify-auth-redirect';
import MessageForm from './pages/message-form';

export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SpotifyLogin />}>
          </Route>
          <Route path="/callback" element={<SpotifyAuthRedirect />}>
          </Route>
          <Route path="/api/messages" element={<MessageForm />}>
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}
