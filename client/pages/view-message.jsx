import React from 'react';
import M from 'materialize-css';
import AppContext from '../lib/app-context';
import { Link } from 'react-router-dom';

export default class ViewMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottleId: 3,
      message: {},
      currentSlide: 0
    };
    this.carousel = this.carousel.bind(this);
  }

  carousel() {
    const intervalId = setInterval(() => {
      if (this.state.currentSlide >= 3) {
        clearInterval(intervalId);
      } else {
        this.setState({ currentSlide: this.state.currentSlide + 1 });
      }
    }, 10000);
  }

  componentDidMount() {
    M.AutoInit();

    const paths = window.location.pathname.split('/');
    const bottleId = parseInt(paths[4]);
    this.setState({ bottleId: bottleId });

    // this.carousel();

    fetch(`/api/messages/${this.state.bottleId}`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        // console.log(data);
        this.setState({ message: data });
      })
      .catch(error => console.error('There was an unexpected error', error));
  }

  componentDidUpdate() {
    M.AutoInit();
  }

  render() {
    const { messageTitle, recipientName, senderName } = this.state.message;
    return (
      <>
        <div className="slides-overlay position-absolute"></div>
        <div>
          <IntroSlide title={messageTitle} sender={senderName} recipient={recipientName} />
          <RenderList entries={mementos} currentSlide={this.state.currentSlide} />
        </div>
      </>
    );
  }
}

ViewMessage.contextType = AppContext;

function IntroSlide(props) {
  return (
    <div className="message-slide intro-slide-bg pt-75">
      <Link to="/menu"><i className="material-icons position-absolute exit-slides">close</i></Link>
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
    return (
      <div className="padding-1rem message-slide content-slide-yellow pt-75">
        <Link to="/menu"><i className="material-icons position-absolute exit-slides">close</i></Link>
        <h1 className="font-size-36 text-center no-margin-top">{props.memento.title}</h1>
        <div className="row justify-center">
          <img className="materialboxed img-container" src={props.memento.image} />
        </div>
        <p className="font-size-24 text-center">{props.memento.caption}</p>
      </div>
    );
  }
}

function RenderList(props) {
  const entries = props.entries;
  const slideItems = entries.map(slide =>
    <li key={slide.slideIndex}>
      <ContentSlide memento={slide} slideIndex={slide.slideIndex} currentSlide={props.currentSlide} />
    </li>
  );
  return (
    <ul className="position-fixed">{slideItems}</ul>
  );
}

const mementos = [
  {
    caption: 'please work',
    image: '/images/image-1636588944759.gif',
    slideIndex: 1,
    song: '5E91lFuxUUIGTnsO18VbS8',
    title: 'un'
  },
  {
    caption: 'so tired',
    image: '/images/image-1636588975983.png',
    slideIndex: 2,
    song: '7E1boGBVKRPqbHuEDXXZ7D',
    title: 'deux'
  },
  {
    caption: 'wow it worked',
    image: '/images/image-1636589004467.jpg',
    slideIndex: 3,
    song: '6qz8wrOej4MNian3TFofgD',
    title: 'trois'
  }
];
