import React from 'react';
import TextInput from '../input/TextInput';
import NodeControls from './NodeControls';

export default class NodeLabel extends React.Component {
  constructor(props) {
    super(props);

    const node = props.node;
    this.state = {
      node: node,

      standaloneContext: props.standaloneContext,
      controls: props.controls,
    };

    this.onChange = props.onChange;
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props) {
    const node = props.node;
    return {
      node: node,

      standaloneContext: props.standaloneContext,
      controls: props.controls,
    };
  }

  render() {
    const { node, standaloneContext, controls } = this.state,
      onChange = this.onChange;

    return (
      <summary
        className={`node-label ${standaloneContext ? `glass` : ``}`}
        style={standaloneContext}
      >
        <svg className='node-label__icon'>
          <rect className='event-node' x='50%' y='50%' />
        </svg>
        <div className='node-label__title'>
          <div className='node-label__type'>{`#${node?._ID}`}</div>
          <TextInput
            longInput={false}
            initialValue={node?.label}
            layout='single'
            delay={2000}
            onChange={onChange}
          />
        </div>
        {controls && <NodeControls controls={controls} />}
      </summary>
    );
  }
}
