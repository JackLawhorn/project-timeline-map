import React from 'react';
import NodeLabel from '../NodeLabel/NodeLabel';

export default class NodePanel extends React.Component {
  constructor(props) {
    super(props);

    const node = props.node;
    this.state = {
      node: node,
      nodeLabel: node.label,
      nodeInfo: node.info,
    };
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props) {
    const node = props.node;
    return {
      node: node,
      nodeLabel: node.label,
      nodeInfo: node.info,
    };
  }

  render() {
    const { node, nodeLabel, nodeInfo } = this.state;

    return (
      <details className='node-panel panel glass' open>
        <NodeLabel node={node} />
        <div className='node-panel__info glass-button'>
          {nodeInfo ?? `This is the description for node "${nodeLabel}".`}
        </div>
      </details>
    );
  }
}
