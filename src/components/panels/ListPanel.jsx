import React from 'react';
import NodeLabel from '../NodeLabel/NodeLabel';

export default class ListPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      CTRL: props.CTRL,
    };

    this.handleSelect = props.handleSelect;
    this.handleHover = props.handleHover;
    this.toggleListPanel = props.toggleListPanel;
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props) {
    return {
      CTRL: props.CTRL,
    };
  }

  handleSelect(nodeLabel) {
    this.handleSelect(nodeLabel);
  }

  render() {
    const nodesList = this.state.CTRL.toArray(),
      { handleSelect, handleHover, toggleListPanel } = this;

    return (
      <ul className='list-panel panel glass glass__white panel__list'>
        {nodesList.map((node, i) => (
          <li
            key={i}
            className='list-panel-item'
            onClick={() => {
              handleSelect(node.id);
            }}
            onMouseOver={() => {
              handleHover(node.id);
            }}
            onMouseLeave={() => {
              handleHover();
            }}
          >
            <NodeLabel node={node} />
          </li>
        ))}
        {nodesList.length === 0 && (
          <li className='list-panel-item empty'>Click "Start Timeline" to add an Origin node.</li>
        )}
      </ul>
    );
  }
}
