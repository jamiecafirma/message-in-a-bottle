import React from 'react';
import M from 'materialize-css';
import { Link, useNavigate } from 'react-router-dom';
import AppContext from '../lib/app-context';

function injectNavigate(Component) {
  const InjectedNavigate = function (props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
  return InjectedNavigate;
}

class SlideForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.getSongId = this.getSongId.bind(this);
    this.state = {
      error: null,
      title: '',
      caption: '',
      image: '',
      song: '',
      slideIndex: this.props.slideIndex
    };
    this.fileInputRef = React.createRef();
  }

  componentDidUpdate() {
    M.updateTextFields();
  }

  getSongId(event) {
    const target = event.target;
    const value = target.value;

    const splitLink = value.split('track/');
    const getId = splitLink[1].split('?');
    const songId = getId[0];

    this.setState({
      song: songId
    });
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
    const { assignBottleId } = this.context;
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
        if (data.error) {
          this.setState({ error: data.error });
          this.props.navigate('/error');
        } else {
          const { bottleId } = data;
          assignBottleId(bottleId);
          this.props.navigate('/menu');
        }
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
        nextButton = <Link to="/menu"><button onClick={this.handleFormSubmit} type="submit" className="waves-effect waves-light btn-small button-resize">Done</button></Link>;
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
                maxLength="30"
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
                maxLength="80"
                name="caption"
                required></textarea>
              <label htmlFor="textarea1">Caption</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s12">
              <input
                onChange={this.getSongId}
                id="song-id"
                type="text"
                name="songId"
                required
              />
              <label htmlFor="song-id">Spotify Song Link</label>
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

SlideForm.contextType = AppContext;

const SlideFormWithNavigate = injectNavigate(SlideForm);

export default SlideFormWithNavigate;
