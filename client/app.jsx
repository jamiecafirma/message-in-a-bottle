import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppContext from './lib/app-context';
import SenderStart from './pages/sender-start';
import SpotifyAuthRedirectWithParams from './pages/spotify-auth-redirect';
import MessageForm from './pages/message-form';
import UserActionMenu from './pages/user-action-menu';
import ViewMessageWithParams from './pages/view-message';
import SendMessage from './pages/send-message';
import RecipientStart from './pages/recipient-start';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBottleId: 0,
      accessToken: null
    };
    this.assignBottleId = this.assignBottleId.bind(this);
    this.assignToken = this.assignToken.bind(this);
  }

  assignBottleId(bottleId) {
    this.setState({ currentBottleId: bottleId });
  }

  assignToken(token) {
    this.setState({ accessToken: token });
  }

  render() {
    const { currentBottleId, accessToken } = this.state;
    const { assignBottleId, assignToken } = this;
    const contextValue = { currentBottleId, assignBottleId, accessToken, assignToken };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<SenderStart />}>
              </Route>
              <Route path="/recipient" element={<RecipientStart />}>
              </Route>
              <Route path="/callback/:user" element={<SpotifyAuthRedirectWithParams />}>
              </Route>
              <Route path="/api/messages" element={<MessageForm />}>
              </Route>
              <Route path="/menu" element={<UserActionMenu />}>
              </Route>
              <Route path="/messages/:user/:bottleId" element={<ViewMessageWithParams />}>
              </Route>
              <Route path="/send" element={<SendMessage />}>
              </Route>
            </Routes>
          </BrowserRouter>
        </>
      </AppContext.Provider>
    );
  }
}
