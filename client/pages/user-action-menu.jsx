import React from 'react';
import AppContext from '../lib/app-context';
import { Link } from 'react-router-dom';

export default class UserActionMenu extends React.Component {
  render() {
    return (
      <>
        <div className="overlay position-absolute"></div>
        <div className="row align-center flex-column position-absolute padding-3rem absolute-center-horizontal">
          <h1 className="font-size-36 no-margin text-center">What would you like to do?</h1>
        </div>
        <div className="row user-action-menu position-absolute absolute-center-horizontal">
          <div className="column-half">
            <div className="row flex-column align-center">
              <h1 className="font-size-36 no-margin text-center">View</h1>
              <Link to={`/messages/${this.context.currentBottleId}`}><img src="/images/message-in-a-bottle.png" className="width-120" /></Link>
            </div>
          </div>
          <div className="column-half">
            <div className="row flex-column align-center">
              <h1 className="font-size-36 no-margin text-center">Send</h1>
              <Link to='/send'><img src="/images/wave.png" className="width-120" /></Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}

UserActionMenu.contextType = AppContext;
