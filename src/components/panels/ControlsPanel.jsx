import React from 'react';
import { RiInformationLine } from 'react-icons/ri';

export default class ControlsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.closeModal = props.closeModal;
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {}

  handleClose(e) {
    if (e.target.className === 'modal__container') this.closeModal();
  }

  render() {
    return (
      <div className='modal__container' onClick={this.handleClose}>
        <div className='controls-panel panel glass modal' open>
          <div className='panel__header glass-button'>
            <RiInformationLine />
            <span>Keyboard Shortcuts</span>
          </div>
          <ul className='panel__list'>
            <li className='panel__list__item glass-button'>
              <kbd className='glass glass__white'>Alt</kbd> +{' '}
              <kbd className='glass glass__white'>Scroll</kbd> – Zoom in/out
            </li>
            <li className='panel__list__item glass-button'>
              <kbd className='glass glass__white'>Shift</kbd> +{' '}
              <kbd className='glass glass__white'>Scroll</kbd> – Scroll horizontally
            </li>
            <li className='panel__list__item glass-button'>
              <kbd className='glass glass__white'>Alt</kbd> +{' '}
              <kbd className='glass glass__white'>Drag</kbd> – Create new child node
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
