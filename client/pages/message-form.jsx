import React from 'react';
import M from 'materialize-css';
import { Link } from 'react-router-dom';

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
            <h2 className="font-size-24 text-center">Click on the parrot again to exit!</h2>
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

class SlideForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.state = {
      title: '',
      caption: '',
      image: '',
      slideIndex: this.props.slideIndex
    };
    this.fileInputRef = React.createRef();
  }

  componentDidUpdate() {
    M.updateTextFields();
  }

  handleImageUpload(event) {
    const formData = new FormData();
    formData.append('image', this.fileInputRef.current.files[0]);

    const init = {
      method: 'POST',
      body: formData
    };
    fetch('/api/uploads', init)
      .then(result => {
        return result.json();
      })
      .then(entry => {
        this.setState({ image: entry.imageUrl });
      })
      .catch(error => {
        console.error('There was an unexpected error', error);
      });
  }

  handleClick(event) {
    event.preventDefault();
    const newMemento = this.state;
    this.props.handleMemento(newMemento);
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const newMemento = this.state;
    const mementosArr = this.props.handleMemento(newMemento);
    const previousState = this.props.handleSubmit(event);
    const messageData = Object.assign({}, previousState, { slides: { mementos: mementosArr } });

    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageData)
    };
    fetch('/api/messages', myInit)
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('There was an unexpected error', error);
      });

  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value
    });
  }

  render() {
    if (this.props.slideIndex.toString() !== this.props.currentSlide) {
      return null;
    } else {
      let nextButton = <a data-button="next" onClick={this.handleClick} className="waves-effect waves-light btn-small button-resize">Next Slide</a>;

      if (this.props.isLast) {
        nextButton = <button onClick={this.handleFormSubmit} type="submit" className="waves-effect waves-light btn-small button-resize">Done</button>;
      }
      return (
        <div className="form-modal absolute-center-horizontal">
          <p className="black-text no-margin font-size-24 padding-1rem">{`Slide ${this.props.slideIndex}`}</p>
          <div className="row">
            <div className="input-field col s12">
              <input
                onChange={this.handleChange}
                value={this.state.title}
                id="slide-title"
                type="text"
                name="title"
                required
              />
              <label htmlFor="slide-title">Slide Title</label>
            </div>
          </div>
          <div className="row">
            <div className="file-field input-field full-width padding-1rem">
              <div className="btn">
                <span>Image</span>
                <input
                  onChange={this.handleImageUpload}
                  type="file"
                  id="slide-image"
                  name="image"
                  ref={this.fileInputRef}
                  accept=".png, .jpg, .jpeg, .gif"
                  required
                />
              </div>
              <div className="file-path-wrapper col-12">
                <input className="file-path validate" type="text" />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <textarea
                onChange={this.handleChange}
                value={this.state.caption}
                id="textarea1"
                className="materialize-textarea"
                maxLength="120"
                name="caption"
                required></textarea>
              <label htmlFor="textarea1">Caption</label>
            </div>
          </div>
          <div className="row space-between padding-1rem slide-btn">
            <a data-button="previous" onClick={this.props.handlePrevious} className="waves-effect waves-light btn-small button-resize">Previous Slide</a>
            {nextButton}
          </div>
        </div>
      );
    }
  }

}

function RenderList(props) {
  const entries = props.entries;
  const slideItems = entries.map(slide =>
    <li key={slide.id.toString()} id={slide.id.toString()}>
      <SlideForm handleMemento={props.handleMemento} handleNext={props.handleNext} handlePrevious={props.handlePrevious} handleSubmit={props.handleSubmit} slideIndex={slide.id} isLast={props.lastSlide === slide.id.toString()} currentSlide={props.currentSlide} />
    </li>
  );
  return (
    <ul className="position-fixed">{slideItems}</ul>
  );
}
