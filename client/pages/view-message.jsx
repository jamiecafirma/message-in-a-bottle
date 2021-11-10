import React from 'react';
import M from 'materialize-css';

export default class ViewMessage extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const instance = M.Carousel.getInstance(this.Carousel);
    instance.next();
  }

  componentDidMount() {
    M.AutoInit();
  }

  componentDidUpdate() {
    M.AutoInit();
  }

  render() {
    return (
      <>
        <div className="overlay position-absolute"></div>
        <IntroSlide />
        <RenderList entries={mementos} />
      </>
    );
  }
}

function IntroSlide(props) {
  return (
    <div className="message-slide intro-slide-bg pt-75">
      <h1 className="font-size-48 text-center">Title of Message is super long</h1>
      <h2 className="font-size-36 text-center">from Sender</h2>
      <h2 className="font-size-36 text-center">to Recipient</h2>
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
  return (
    <div className="padding-1rem message-slide content-slide-blue pt-75">
      <h1 className="font-size-36 text-center no-margin-top">{props.memento.title}</h1>
      <div className="row justify-center">
        <img className="materialboxed img-container" src={props.memento.image} />
      </div>
      <p className="font-size-24 text-center">{props.memento.caption}</p>
    </div>
  );
}

function RenderList(props) {
  const entries = props.entries;
  const slideItems = entries.map(slide =>
    <li key={slide.slideIndex}>
      <ContentSlide memento={slide} />
    </li>
  );
  return (
    <ul className="position-fixed">{slideItems}</ul>
  );
}

const mementos = [
  {
    caption: 'me and the besties',
    image: '/images/image-1636492462766.jpeg',
    slideIndex: 1,
    song: '5Apl955QftdfReNESDmJhR',
    title: 'title uno'
  },
  {
    caption: 'jellyfish jam',
    image: '/images/image-1636492531131.png',
    slideIndex: 2,
    song: '5E91lFuxUUIGTnsO18VbS8',
    title: 'another one'
  },
  {
    caption: 'mr. krabs??????',
    image: '/images/image-1636492614585.png',
    slideIndex: 3,
    song: '7qPlIgFSsb48lbRXmmi9NB',
    title: 'slide trois'
  }
];
