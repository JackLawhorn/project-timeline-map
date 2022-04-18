import React from 'react';
import TextInput from '../input/TextInput';
import NodeLabel from '../NodeLabel/NodeLabel';
import NodesList from './NodesList';
import { AiOutlineNodeCollapse, AiOutlineNodeExpand } from 'react-icons/ai';

export default class NodePanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      CTRL: props.CTRL,
      node: props.node,
    };

    this.updateData = props.updateData;
    this.handleSelect = props.handleSelect;
    this.handleHover = props.handleHover;
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props) {
    return {
      CTRL: props.CTRL,
      node: props.node,
    };
  }

  render() {
    const { CTRL, node } = this.state,
      { updateData, handleSelect, handleHover } = this;

    return (
      <details className='node-panel panel glass glass__white' open>
        <NodeLabel
          node={node}
          onChange={e => {
            const value = e.target.value;
            if (value.length === 0) return;
            updateData(
              CTRL?.updateNode(node?._ID, { label: value }),
              node?._ID,
              `Updated node #${node?._ID}`
            );
          }}
        />
        <TextInput
          longInput={true}
          initialValue={node?.info}
          layout={'long'}
          delay={2000}
          onChange={e => {
            const value = e.target.value;
            if (value.length === 0) return;
            updateData(
              CTRL?.updateNode(node?._ID, { info: value }),
              node?._ID,
              `Updated node #${node?._ID}`
            );
          }}
        />
        {CTRL.root._ID !== node?._ID && (
          <details className='child-list'>
            <summary className='child-list__label glass-button'>
              <AiOutlineNodeCollapse />
              <span>Parent node</span>
            </summary>
            <NodesList
              nodesList={[CTRL.findParentNode(node?._ID)]}
              handleSelect={handleSelect}
              handleHover={handleHover}
            />
          </details>
        )}
        {node?.descendants.length > 0 && (
          <details className='child-list'>
            <summary className='child-list__label glass-button'>
              <AiOutlineNodeExpand />
              <span>Child nodes</span>
            </summary>
            <NodesList
              nodesList={node?.descendants}
              handleSelect={handleSelect}
              handleHover={handleHover}
            />
          </details>
        )}
        <section className='node-buttons'>
          {CTRL.root._ID !== node?._ID && (
            <button className='isolate-button glass-button'>Isolate as subtree</button>
          )}
          <button
            className='delete-button glass-button'
            onClick={e => {
              updateData(CTRL.deleteNode(node?._ID), undefined, `Deleted node #${node?._ID}`);
              handleSelect();
            }}
          >
            Delete node
          </button>
        </section>
      </details>
    );
  }
}
