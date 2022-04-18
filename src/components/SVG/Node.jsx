import React from 'react';
import DragHandler from '../../data-classes/DragHandler';

export default class Node extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      CTRL: props.CTRL,
      nodeID: props.nodeID,
      nodeContext: props.nodeContext,
      spotlight: props.spotlight,
    };

    this.handleSelect = props.handleSelect;
    this.handleHover = props.handleHover;
    this.handleDrag = props.handleDrag;
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props) {
    return {
      CTRL: props.CTRL,
      nodeID: props.nodeID,
      nodeContext: props.nodeContext,
      spotlight: props.spotlight,
    };
  }

  render() {
    const { nodeID, spotlight } = this.state,
      { nodeLabel, x, y, nodeShape } = this.state.nodeContext;
    const { handleSelect, handleHover, handleDrag } = this;

    return (
      <svg
        className='event-group'
        x={x}
        y={y}
        label={nodeLabel}
        onClick={() => {
          handleSelect(nodeID);
        }}
        onMouseEnter={() => {
          if (spotlight) return;
          handleHover(nodeID);
        }}
        onMouseLeave={() => {
          handleHover();
        }}
      >
        {spotlight && <rect className='selected-outline' nodeshape={nodeShape} x='0' y='0' />}
        <rect
          className='event-node'
          onMouseDown={e => handleDrag(e, nodeID)}
          nodeshape={nodeShape}
          x='0'
          y='0'
        />
      </svg>
    );
  }
}
