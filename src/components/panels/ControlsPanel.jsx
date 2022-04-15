import React from 'react';
import { RiInformationLine } from 'react-icons/ri';

export default class ControlsPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props) {}

  render() {
    return (
      <details className='controls-panel panel glass'>
        <summary className='controls-panel__title'>
          <RiInformationLine />
          <span>Some controls</span>
        </summary>
        <ul className='panel__list'>
          <li className='controls-tip'>
            <kbd className='glass'>Alt</kbd> + <kbd className='glass'>Scroll</kbd> – Zoom in/out
          </li>
          <li className='controls-tip'>
            <kbd className='glass'>Shift</kbd> + <kbd className='glass'>Scroll</kbd> – Scroll
            horizontally
          </li>
          <li className='controls-tip'>
            <kbd className='glass'>Alt</kbd> + <kbd className='glass'>Drag</kbd> – Create new child
            node
          </li>
        </ul>
      </details>
    );
  }
}
