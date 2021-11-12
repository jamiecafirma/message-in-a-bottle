import React from 'react';
import M from 'materialize-css';
import AppContext from '../lib/app-context';
import { Link, useParams } from 'react-router-dom';

function injectUseParams(Component) {
  const InjectedUseParams = function (props) {
    const routeParams = useParams();
    return <Component {...props} routeParams={routeParams} />;
  };
  return InjectedUseParams;
}

class ViewMessage extends React.Component {
  constructor(props) {
    super(props);
    this.carousel = this.carousel.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
    this.state = {
      bottleId: 0,
      isRecipient: false,
      message: null,
      currentSlide: 0,
      currentTimer: setInterval(this.carousel, 10000)
    };
  }

  carousel() {
    if (this.state.currentSlide < this.state.message.mementos.length) {
      this.setState({ currentSlide: this.state.currentSlide + 1 });
    } else {
      clearInterval(this.currentTimer);
    }
  }

  nextSlide(event) {
    clearInterval(this.state.currentTimer);
    if (this.state.currentSlide < this.state.message.mementos.length) {
      this.setState({
        currentSlide: this.state.currentSlide + 1,
        currentTimer: setInterval(this.carousel, 10000)
      });
    }
  }

  previousSlide(event) {
    clearInterval(this.state.currentTimer);
    if (this.state.currentSlide > 0) {
      this.setState({
        currentSlide: this.state.currentSlide - 1,
        currentTimer: setInterval(this.carousel, 10000)
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.currentTimer);
  }

  componentDidMount() {
    M.AutoInit();

    const { bottleId } = this.props.routeParams;
    this.setState({ bottleId: bottleId });
    const { user } = this.props.routeParams;
    if (user === 'recipient') {
      this.setState({ isRecipient: true });
    }

    const { assignBottleId } = this.context;
    assignBottleId(parseInt(bottleId));

    fetch(`/api/messages/${bottleId}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ message: data });
      })
      .catch(error => console.error('There was an unexpected error', error));
  }

  componentDidUpdate() {
    M.AutoInit();
  }

  render() {
    if (!this.state.message) {
      return null;
    }
    const { messageTitle, recipientName, senderName, mementos } = this.state.message;
    return (
      <>
        <div className="slides-overlay position-absolute"></div>
        <div>
          <IntroSlide isRecipient={this.state.isRecipient} nextSlide={this.nextSlide} title={messageTitle} sender={senderName} recipient={recipientName} />
          <RenderList isRecipient={this.state.isRecipient} nextSlide={this.nextSlide} previousSlide={this.previousSlide} entries={mementos} currentSlide={this.state.currentSlide} />
        </div>
      </>
    );
  }
}

ViewMessage.contextType = AppContext;

function IntroSlide(props) {
  let redirect;
  if (props.isRecipient) {
    redirect = '/';
  } else {
    redirect = '/menu';
  }
  return (
    <div className="message-slide intro-slide-bg pt-75">
      <Link to={redirect}><i className="material-icons position-absolute exit-slides">close</i></Link>
      <div onClick={props.nextSlide} className="next"></div>
      <h1 className="font-size-48 text-center">{props.title}</h1>
      <h2 className="font-size-36 text-center">{`from ${props.sender}`}</h2>
      <h2 className="font-size-36 text-center">{`to ${props.recipient}`}</h2>
      <div className="row mt-40">
        <div className="column-half text-right">
          <img src="/images/parrot.png" className="width-140" />
        </div>
        <div className="column-half">
          <p className="font-size-24 text-center width-140">turn up your volume!</p>
        </div>
      </div>

    </div>
  );
}

function ContentSlide(props) {
  if (props.currentSlide !== props.slideIndex) {
    return null;
  } else {
    let redirect;
    if (props.isRecipient) {
      redirect = '/';
    } else {
      redirect = '/menu';
    }
    return (
      <div className="padding-1rem message-slide content-slide-yellow pt-75">
        <Link to={redirect}><i className="material-icons position-absolute exit-slides">close</i></Link>
        <div onClick={props.nextSlide} className="next"></div>
        <div onClick={props.previousSlide} className="previous"></div>
        <h1 className="font-size-36 text-center no-margin-top">{props.memento.title}</h1>
        <div className="row justify-center">
          <img className="materialboxed img-container" src={props.memento.image} />
        </div>
        <p className="font-size-36 text-center">{props.memento.caption}</p>
      </div>
    );
  }
}

function RenderList(props) {
  const entries = props.entries;
  const slideItems = entries.map(slide =>
    <li key={slide.slideIndex}>
      <ContentSlide nextSlide={props.nextSlide} previousSlide={props.previousSlide} memento={slide} slideIndex={slide.slideIndex} currentSlide={props.currentSlide} />
    </li>
  );
  return (
    <ul className="position-fixed">{slideItems}</ul>
  );
}

const ViewMessageWithParams = injectUseParams(ViewMessage);

export default ViewMessageWithParams;
