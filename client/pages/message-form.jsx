import React from 'react';
import M from 'materialize-css';
import { Link } from 'react-router-dom';
import SlideFormWithNavigate from './slide-form';

export default class MessageForm extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.getPlaylistId = this.getPlaylistId.bind(this);
    this.handleSlideCount = this.handleSlideCount.bind(this);
    this.handlePreviousClick = this.handlePreviousClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleMementoSaved = this.handleMementoSaved.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      currentSlide: 0,
      slideCount: '3',
      messageTitle: '',
      recipientEmail: '',
      recipientName: '',
      senderName: '',
      playlistId: '',
      slides: {
        mementos: []
      }
    };
  }

  componentDidMount() {
    M.AutoInit();
  }

  componentDidUpdate() {
    M.AutoInit();
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  getPlaylistId(event) {
    const target = event.target;
    const value = target.value;

    const splitLink = value.split('playlist/');
    const getId = splitLink[1].split('?');
    const playlistId = getId[0];

    this.setState({
      playlistId: playlistId
    });
  }

  handleMementoSaved(memento) {
    const oldMementos = this.state.slides.mementos;
    const newMementos = oldMementos.slice();
    newMementos[memento.slideIndex - 1] = memento;
    this.setState({
      slides: {
        mementos: newMementos
      }
    });
    if (this.state.currentSlide < parseInt(this.state.slideCount)) {
      this.setState({ currentSlide: this.state.currentSlide + 1 });
    }
    return newMementos;
  }

  handleSlideCount(event) {
    this.setState({ slideCount: event.target.value });
  }

  handleNextClick(event) {
    if (this.state.currentSlide >= parseInt(this.state.slideCount)) {
      return;
    }
    this.setState({ currentSlide: this.state.currentSlide + 1 });
  }

  handlePreviousClick(event) {
    this.setState({ currentSlide: this.state.currentSlide - 1 });
  }

  handleSubmit() {
    return this.state;
  }

  render() {
    const slides = [];
    for (let i = 1; i <= this.state.slideCount; i++) {
      const slide = { id: i };
      slides.push(slide);
    }
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <div className="overlay position-absolute"></div>
          <div className="row align-center flex-column position-absolute padding-3rem absolute-center-horizontal">
            <h1 className="font-size-36 no-margin text-center">New Entry</h1>
            <h2 className="font-size-24 text-center padding-1rem no-margin">Click on the parrot again to exit!</h2>
          </div>
          <div className="form-modal absolute-center-horizontal">
            <Link to="/" className="exit-parrot"><img src="/images/parrot.png" className="width-100" /></Link>
            <div className="row align-center mb-1-5rem">
              <p className="black-text no-margin font-size-24 padding-1rem">Number of Slides:</p>
                <div className="input-field col s2">
                <select value={this.state.slideCount} onChange={this.handleSlideCount}>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  </select>
                </div>
            </div>
            <div className="row space-between">
              <div className="input-field col s6">
                <input
                  id="sender-name"
                  type="text"
                  maxLength="20"
                  onChange={this.handleChange}
                  value={this.state.senderName}
                  name="senderName"
                  required
                />
                <label htmlFor="sender-name">Sender Name</label>
              </div>
              <div className="input-field col s6">
                <input
                  id="recipient-name"
                  type="text"
                  maxLength="20"
                  onChange={this.handleChange}
                  value={this.state.recipientName}
                  name="recipientName"
                  required
                />
                <label htmlFor="recipient-name">Recipient Name</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="recipient-email"
                  type="email"
                  onChange={this.handleChange}
                  value={this.state.recipientEmail}
                  name="recipientEmail"
                  required
                />
                <label htmlFor="recipient-email">Recipient Email</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="message-title"
                  type="text"
                  maxLength="30"
                  onChange={this.handleChange}
                  value={this.state.messageTitle}
                  name="messageTitle"
                  required
                />
                <label htmlFor="message-title">Message Title</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input
                  id="playlist-id"
                  type="text"
                  onChange={this.getPlaylistId}
                  name="playlistId"
                  required
                />
                <label htmlFor="playlist-id">Spotify Playlist Link</label>
              </div>
            </div>
            <div className="row justify-flex-end pr-1rem">
              <a onClick={this.handleNextClick} className="waves-effect waves-light btn-large">Next: Slides</a>
            </div>
          </div>
          <RenderList entries={slides} lastSlide={this.state.slideCount} currentSlide={this.state.currentSlide.toString()} handlePrevious={this.handlePreviousClick} handleMemento={this.handleMementoSaved} handleSubmit={this.handleSubmit} />
        </form>
      </>
    );
  }
}

function RenderList(props) {
  const entries = props.entries;
  const slideItems = entries.map(slide =>
    <li key={slide.id.toString()} id={slide.id.toString()}>
      <SlideFormWithNavigate handleMemento={props.handleMemento} handleNext={props.handleNext} handlePrevious={props.handlePrevious} handleSubmit={props.handleSubmit} slideIndex={slide.id} isLast={props.lastSlide === slide.id.toString()} currentSlide={props.currentSlide} />
    </li>
  );
  return (
    <ul className="position-fixed">{slideItems}</ul>
  );
}
