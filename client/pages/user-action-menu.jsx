import React from 'react';

export default class UserActionMenu extends React.Component {
  render() {
    return (
      <>
        <div className="overlay position-absolute"></div>
        <div className="row align-center flex-column position-absolute padding-3rem absolute-center-horizontal">
          <h1 className="font-size-36 no-margin text-center">What would you like to do?</h1>
        </div>
        <div className="row">
          <div className="column-half">
            <h1 className="font-size-36 no-margin text-center">View</h1>
            <img src="/images/message-in-a-bottle.png" className="width-140" />
          </div>
        </div>
      </>
    );
  }
}
