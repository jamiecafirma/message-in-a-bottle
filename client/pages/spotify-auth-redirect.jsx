import React from 'react';

export default class SpotifyAuthRedirect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthorizing: true
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const formData = new FormData();
    params.forEach((value, key) => {
      formData.append(key, value);
    });
  }

  render() {
    return (
      <>
        <div className="overlay position-absolute"></div>
        <div className="row align-center flex-column position-absolute padding-3rem desktop-style">
          <h1 className="font-size-36 no-margin">Logged in as User</h1>
          <h2 className="font-size-24 text-center">Click on the parrot to create your message!</h2>
          <a href="#"><img src="images/parrot.png" className="width-100" /></a>
        </div>
      </>
    );
  }
}
