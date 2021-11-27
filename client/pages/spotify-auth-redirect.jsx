import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AppContext from '../lib/app-context';

function injectUseParams(Component) {
  const InjectedUseParams = function (props) {
    const routeParams = useParams();
    return <Component {...props} routeParams={routeParams} />;
  };
  return InjectedUseParams;
}

class SpotifyAuthRedirect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorizing: true,
      signedIn: false,
      username: '',
      user: ''
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('code');
    const { user } = this.props.routeParams;
    this.setState({ user: user });

    let redirect;
    if (user === 'sender') {
      redirect = process.env.SPOTIFY_AUTH_CALLBACK_SENDER;
    } else if (user === 'recipient') {
      redirect = process.env.SPOTIFY_AUTH_CALLBACK_RECIPIENT;
    }

    const postBody = {
      client_id: process.env.SPOTIFY_CLIENT_ID,
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirect,
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
          this.context.assignToken(accessToken);
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
              this.setState({ isAuthorizing: false });
            });
        })
        .catch(error => {
          console.error('There was an unexpected error', error);
          this.setState({ isAuthorizing: false });
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
    if (this.state.isAuthorizing) {
      loginResult = <LoadingSpinner />;
    } else if (this.state.signedIn) {
      loginResult = <LoginSuccess name={showName} user={this.state.user} />;
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

SpotifyAuthRedirect.contextType = AppContext;

const SpotifyAuthRedirectWithParams = injectUseParams(SpotifyAuthRedirect);

export default SpotifyAuthRedirectWithParams;

function LoginSuccess(props) {
  let action;
  if (props.user === 'sender') {
    action = <SendToCreate />;
  } else if (props.user === 'recipient') {
    action = <SendToMessageWithNavigate />;
  }
  return (
    <>
      <div className="overlay position-absolute"></div>
      <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
        <h1 className="font-size-36 no-margin text-center">Logged in as {props.name}</h1>
        {action}
      </div>
    </>
  );
}

function SendToCreate(props) {
  return (
    <>
      <h2 className="font-size-24 text-center">Click on the parrot to create your message!</h2>
      <Link to="/api/messages"><img src="/images/parrot.png" className="width-100" /></Link>
    </>
  );
}

function injectNavigate(Component) {
  const InjectedNavigate = function (props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
  return InjectedNavigate;
}

class SendToMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottleId: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ bottleId: parseInt(event.target.value) });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.context.assignBottleId(this.state.bottleId);
    this.props.navigate(`/messages/recipient/${this.state.bottleId}`);
  }

  render() {
    return (
      <>
        <h2 className="font-size-24 text-center">Enter your bottle id to find your message!</h2>
        <form onSubmit={this.handleSubmit} className="full-width justify-center">
          <div className="non-static search-container">
            <input onChange={this.handleChange} name="bottle-id" value={this.state.bottleId} id="search-input" type="text" placeholder="your bottle id"></input>
            <i onClick={this.handleSubmit} id="search-icon" className="material-icons">search</i>
          </div>
        </form>
      </>
    );
  }
}

SendToMessage.contextType = AppContext;

const SendToMessageWithNavigate = injectNavigate(SendToMessage);

function LoginError(props) {
  return (
    <>
      <div className="overlay position-absolute"></div>
      <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
        <h1 className="font-size-36 no-margin text-center">Unable to login to Spotify</h1>
        <h2 className="font-size-24 text-center">Click on the parrot to go back!</h2>
        <Link to="/"><img src="/images/parrot.png" className="width-100" /></Link>
      </div>
    </>
  );
}

function LoadingSpinner(props) {
  return (
    <>
      <div className="overlay position-absolute"></div>
      <div className="row align-center flex-column position-absolute padding-3rem desktop-style absolute-center">
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
      </div>
    </>
  );
}
