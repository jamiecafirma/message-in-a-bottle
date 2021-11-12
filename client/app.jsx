import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppContext from './lib/app-context';
import SpotifyLogin from './pages/spotify-login';
import SpotifyAuthRedirect from './pages/spotify-auth-redirect';
import MessageForm from './pages/message-form';
import UserActionMenu from './pages/user-action-menu';
import ViewMessageWithParams from './pages/view-message';
import SendMessage from './pages/send-message';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBottleId: 0
    };
    this.assignBottleId = this.assignBottleId.bind(this);
  }

  assignBottleId(bottleId) {
    this.setState({ currentBottleId: bottleId });
  }

  render() {
    const { currentBottleId } = this.state;
    const { assignBottleId } = this;
    const contextValue = { currentBottleId, assignBottleId };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<SpotifyLogin />}>
              </Route>
              <Route path="/callback" element={<SpotifyAuthRedirect />}>
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
