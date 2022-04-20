import React from 'react';

import Node from './SVG/Node';
import NodeLabel from './NodeLabel/NodeLabel';

import TreeNode from '../data-classes/TreeNode';

export default class TreeMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      CTRL: props.CTRL,
      selected: props.selected,
      hovered: props.hovered,
      scrollAndZoom: props.scrollAndZoom,

      wx: 1,
      hx: 1,
      orientation: true,
    };

    this.updateData = props.updateData;
    this.handleSelect = props.handleSelect;
    this.handleHover = props.handleHover;
    this.handleDragToScroll = props.handleDragToScroll;
    this.clearState = props.clearState;
    this.updateData = props.updateData;

    this.handleDragNode = this.handleDragNode.bind(this);
    this.getNodeLabelControls = this.getNodeLabelControls.bind(this);
  }

  // Attach a ResizeObserver to update canvas size
  componentDidMount() {
    const thisObj = this,
      canvas = document.querySelector('svg.canvas');

    const ro = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = canvas ?? {};
      thisObj.setState({
        wx: clientWidth / 100,
        hx: clientHeight / 100,
        // orientation: clientWidth > clientHeight,
        orientation: true,
      });
    });
    ro.observe(document.body);
    if (canvas !== null) ro.observe(canvas);
  }

  static getDerivedStateFromProps(props, state) {
    const canvas = document.querySelector('svg.canvas') ?? {};
    const { clientWidth, clientHeight } = canvas;

    return {
      CTRL: props.CTRL,
      selected: props.selected,
      hovered: props.hovered,
      scrollAndZoom: props.scrollAndZoom,

      wx: (clientWidth ?? 100) / 100,
      hx: (clientHeight ?? 100) / 100,
      // orientation: clientWidth > clientHeight,
      orientation: true,
    };
  }

  handleDragNode(e, nodeID) {
    if (!e.altKey) return;

    const CTRL = this.state.CTRL;
    const node = CTRL?.searchByID(nodeID),
      updateData = this.updateData,
      initial = { x: e.clientX, y: e.clientY };

    const canvas = document.querySelector('svg.canvas');
    const style = canvas.currentStyle || window.getComputedStyle(canvas);
    const ht = parseInt(style.marginTop);

    const handleMouseMove = e => {
      this.setState(
        {
          utilBranchContext: {
            parentID: node.id,
            dX: initial.x - e.clientX,
            dY: initial.y - e.clientY,
            ht: ht,
          },
        },
        () => {
          document.body.style.cursor = 'grabbing';
        }
      );
    };
    const handleMouseUp = e => {
      document.removeEventListener('mousemove', handleMouseMove);
      this.setState(
        {
          utilBranchContext: undefined,
        },
        () => {
          document.body.style = undefined;
          CTRL.appendChild(nodeID);
          updateData(CTRL, undefined, `Added node #${nodeID}`);
        }
      );
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp, { once: true });
  }

  getNodeLabelControls(node) {
    const { CTRL, selected } = this.state,
      { updateData } = this;

    return [
      () => {},
      () => {
        const newLeaf = new TreeNode(`${node.label === 'Origin' ? '' : node.label}A`, CTRL);
        updateData(CTRL.appendChild(selected, newLeaf), newLeaf._ID, `Added node #${newLeaf._ID}`);
      },
      () => {
        const newSplit = new TreeNode(`Split ${node.label}`, CTRL);
        const newLeaf1 = new TreeNode(`${node.label}A`, CTRL);
        const newLeaf2 = new TreeNode(`${node.label}B`, CTRL);
        CTRL.appendChild(newSplit._ID, newLeaf1);
        CTRL.appendChild(newSplit._ID, newLeaf2);
        updateData(
          CTRL.appendChild(selected, newSplit),
          newSplit._ID,
          `Added node #${newSplit._ID}`
        );
      },
      () => {},
    ];
  }

  render() {
    // Values from the state
    const { CTRL, orientation, utilBranchContext } = this.state,
      // Values from scrollAndZoom
      { scrollPosn, zoom } = this.state.scrollAndZoom,
      updateData = this.updateData;

    // Retrieve array of Context objects representing elements to be rendered
    let { wx, hx } = this.state;
    if (orientation) wx *= zoom ?? 1;
    else hx *= zoom ?? 1;

    const { renderedNodes, renderedConnectors, previewLayerElements } = CTRL?.getRenderedElements(
      {
        scrollPosn: scrollPosn ?? 0,
        scalars: { wx: wx ?? 1, hx: hx ?? 1 },
        translators: { wt: 0, ht: 0 },
      },
      utilBranchContext
    ) ?? { renderedNodes: [], renderedConnectors: [] };

    return (
      <div className='tree-map'>
        <svg className='canvas'>
          {/* Render for unmounted component */}
          {!CTRL?.hasRoot() && (
            <foreignObject className='init-layout' x='0' y='0' width='100%' height='100%'>
              <div className='start-button-container'>
                <button
                  className='start-button glass'
                  onClick={() => {
                    updateData(CTRL.addOrigin(), CTRL.root?.id, `Added root #${CTRL.root?.id}`);
                  }}
                >
                  Start Timeline
                </button>
              </div>
            </foreignObject>
          )}

          <this.DefsLayer />
          <this.ConnectorsLayer renderedConnectors={renderedConnectors} />
          <this.NodesLayer renderedNodes={renderedNodes} />
          <this.DragPreviewLayer previewLayerElements={previewLayerElements} />
        </svg>
        <this.OverlayLayer
          renderedNodes={renderedNodes}
          previewLayerElements={previewLayerElements}
        />
        <this.ScrollBarLayer />
      </div>
    );
  }

  // Define all SVG defs to be reused
  DefsLayer = () => (
    <defs>
      <marker
        id='arrow'
        viewBox='0 -5 10 10'
        refX='5'
        refY='0'
        markerWidth='2'
        overflow='visible'
        markerHeight='2'
        orient='auto'
      >
        <path d='M -5,-10 L 5,0 L -5,10' className='arrowHead' />
      </marker>
    </defs>
  );

  // Draw all connecting paths between nodes
  ConnectorsLayer = ({ renderedConnectors }) => (
    <g className='connectors-layer'>
      {renderedConnectors.map((connector, i) => (
        <path
          key={i}
          d={connector.line}
          markerEnd={connector.cap === true ? 'url(#arrow)' : undefined}
        />
      ))}
    </g>
  );

  // Draw all tree nodes
  NodesLayer = ({ renderedNodes }) => {
    const { CTRL, selected, hovered } = this.state,
      { handleSelect, handleHover, handleDragNode } = this;

    return (
      <g className='nodes-layer'>
        {renderedNodes.map((node, i) => (
          <Node
            key={i}
            CTRL={CTRL}
            nodeID={node.id}
            nodeContext={node}
            spotlight={(selected && selected === node.id) || hovered & (hovered === node.id)}
            handleSelect={handleSelect}
            handleHover={handleHover}
            handleDrag={handleDragNode}
          />
        ))}
      </g>
    );
  };

  // Draw all drag-preview elements
  DragPreviewLayer = ({ previewLayerElements }) => (
    <g className='preview-layer'>
      {previewLayerElements.map((el, i) => {
        if (el.type === 'line') return <path key={i} d={el.path} />;
        return <rect className='event-node' key={i} nodeshape={el.nodeShape} x={el.x} y={el.y} />;
      })}
    </g>
  );

  // Draw all overlays, including NodeLabels
  OverlayLayer = ({ renderedNodes, previewLayerElements }) => {
    const { CTRL, selected, hovered, hx } = this.state,
      { getNodeLabelControls } = this;

    return (
      <>
        {renderedNodes.map((node, i) => {
          if (node.id === selected || node.id === hovered)
            return (
              <NodeLabel
                key={i}
                node={CTRL?.searchByID(node.id)}
                standaloneContext={{
                  left: node.x,
                  top: node.y,
                }}
                controls={getNodeLabelControls(node)}
              />
            );

          return <React.Fragment key={i} />;
        })}
        {previewLayerElements &&
          previewLayerElements.map((el, i) => {
            if (el.type === 'node')
              return (
                <div
                  key={i}
                  className='node-label new-node-label glass'
                  style={{
                    left: el.x,
                    top: el.y,
                  }}
                >
                  {el.actionLabel(el.x, el.y)}
                </div>
              );

            return <React.Fragment key={i} />;
          })}
      </>
    );
  };

  // Draw the horizontal scrollbar
  ScrollBarLayer = () => {
    const CTRL = this.state.CTRL,
      { zoom, scrollPosn } = this.state.scrollAndZoom,
      handleDragToScroll = this.handleDragToScroll;

    return (
      <div className='controls'>
        <div className='scale-indicator' full={zoom === 1 ? 'full' : undefined}>
          <div
            className='scale-indicator__thumb glass glass__white'
            onDoubleClick={this.handleClearState}
            onMouseDown={e => {
              document.addEventListener('mousemove', handleDragToScroll);
              document.addEventListener(
                'mouseup',
                () => {
                  document.removeEventListener('mousemove', handleDragToScroll);
                },
                { once: true }
              );
            }}
            style={{
              width: `${100 / zoom}%`,
              left: `${(100 * scrollPosn) / Math.max(1, CTRL.maxTreeDepth())}%`,
            }}
          />
        </div>
      </div>
    );
  };
}
