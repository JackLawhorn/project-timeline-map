import React from 'react';
import NodeControls from './NodeControls';

export default class NodeLabel extends React.Component {
  constructor(props) {
    super(props);

    const node = props.node;
    this.state = {
      node: node,
      nodeID: node._ID,
      nodeLabel: node.label,

      standaloneContext: props.standaloneContext,
      controls: props.controls,
    };
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props) {
    const node = props.node;
    return {
      node: node,
      nodeID: node._ID,
      nodeLabel: node.label,

      standaloneContext: props.standaloneContext,
      controls: props.controls,
    };
  }

  render() {
    const { node, standaloneContext, controls } = this.state;

    return (
      <summary
        className={`node-label ${standaloneContext ? `glass` : ``}`}
        style={standaloneContext}
      >
        <svg className='node-label__icon'>
          <rect className='event-node' x='50%' y='50%' />
        </svg>
        <div className='node-label__title'>
          <div className='node-label__type'>{`#${node.id}`}</div>
          <div className='node-label__editor'>{node.label}</div>
        </div>
        {controls && <NodeControls controls={controls} />}
      </summary>
    );
  }
}
