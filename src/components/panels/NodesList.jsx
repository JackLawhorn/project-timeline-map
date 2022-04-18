import React from 'react';
import NodeLabel from '../NodeLabel/NodeLabel';

export default class NodesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      className: props.className,
      nodesList: props.nodesList,
    };

    this.handleSelect = props.handleSelect;
    this.handleHover = props.handleHover;
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props) {
    return {
      nodesList: props.nodesList,
    };
  }

  render() {
    const { className, nodesList } = this.state,
      { handleSelect, handleHover } = this;

    return (
      <ul className={`panel__list ${className}`}>
        {nodesList.map((node, i) => (
          <li
            key={i}
            className='panel__list__item node-label-container glass-button fade-to-right'
            onClick={() => {
              handleSelect(node._ID ?? node.id);
            }}
            onMouseOver={() => {
              handleHover(node._ID ?? node.id);
            }}
            onMouseLeave={() => {
              handleHover();
            }}
          >
            <NodeLabel node={node} />
          </li>
        ))}
        {nodesList.length == 0 && (
          <li className='panel__list__item empty'>No nodes match the given search query.</li>
        )}
      </ul>
    );
  }
}
