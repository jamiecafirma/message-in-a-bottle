import React from 'react';
import { Link } from 'react-router-dom';

export default class SpotifyAuthRedirect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorizing: true,
      signedIn: false,
      username: ''
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('code');

    const postBody = {
      client_id: process.env.SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: 'http://localhost:3000/callback',
      code_verifier: sessionStorage.getItem('spotify-code-verifier')
    };

    const checkState = params.get('state');
    if (checkState !== sessionStorage.getItem('spotify-state')) {
      return undefined;
    } else {
      const init = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;'
        },
        body: new URLSearchParams(postBody)
      };
      fetch('https://accounts.spotify.com/api/token', init)
        .then(result => {
          return result.json();
        })
        .then(entry => {
          const accessInfo = entry;
          const accessToken = accessInfo.access_token;
          const authHeader = {
            headers: { Authorization: 'Bearer ' + accessToken }
          };
          return fetch('https://api.spotify.com/v1/me', authHeader)
            .then(result => {
              return result.json();
            })
            .then(profile => {
              const username = profile.display_name;
              this.setState({ username: username });
              this.setState({ signedIn: true });
            });
        })
        .catch(error => {
          console.error('There was an unexpected error', error);
        });
    }
  }

  render() {
    let showName;
    if (!this.state.username) {
      showName = 'Matey';
    } else {
      showName = this.state.username;
    }

    let loginResult;
    if (this.state.signedIn) {
      loginResult = <LoginSuccess name={showName} />;
    } else {
      loginResult = <LoginError name={showName} />;
    }

    return (
      <div>
        {loginResult}
      </div>
    );
  }
}

function LoginSuccess(props) {
  return (
    <>
      <div className="overlay position-absolute"></div>
      <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
        <h1 className="font-size-36 no-margin text-center">Logged in as {props.name}</h1>
        <h2 className="font-size-24 text-center">Click on the parrot to create your message!</h2>
        <Link to="/api/messages"><img src="images/parrot.png" className="width-100" /></Link>
        <TestFormData />
      </div>
    </>
  );
}

function LoginError(props) {
  return (
    <>
      <div className="overlay position-absolute"></div>
      <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
        <h1 className="font-size-36 no-margin text-center">Unable to login to Spotify</h1>
        <h2 className="font-size-24 text-center">Click on the parrot to go back!</h2>
        <Link to="/"><img src="images/parrot.png" className="width-100" /></Link>
      </div>
    </>
  );
}

class TestFormData extends React.Component {
  constructor(props) {
    super(props);
    this.sendData = this.sendData.bind(this);
  }

  sendData(event) {
    // console.log('clicked');
    const newMessage = {
      mementos: {
        slides: [
          {
            content: 'thisUrl.jpg',
            slideIndex: '1',
            type: 'image'
          },
          {
            content: 'why did you do that lmao',
            slideIndex: '1',
            type: 'caption'
          }
        ]
      },
      messageTitle: 'Happy Bday',
      playlistId: '56Ns4NcqUvb6zEHNQNvIZb',
      recipientEmail: 'matey@gmail.com',
      recipientName: 'My Matey',
      senderName: 'You know who it is ;)'
    };
    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMessage)
    };
    fetch('/api/messages', init)
      .then(result => {
        return result.json();
      })
      .then(entry => {
        // console.log(entry);
      })
      .catch(error => {
        console.error('There was an unexpected error', error);
      });
  }

  render() {
    return (
      <button onClick={this.sendData}>
        Send array
      </button>
    );
  }
}
