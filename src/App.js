import './style.css';
import React from 'react';
import { HiOutlineViewList } from 'react-icons/hi';
import { VscChromeClose } from 'react-icons/vsc';

import TreeMap from './components/TreeMap';
import ListPanel from './components/panels/ListPanel';
import NodePanel from './components/panels/NodePanel';

import TreeController from './data-classes/TreeController';
import TreeNode from './data-classes/TreeNode';
import ControlsPanel from './components/panels/ControlsPanel';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const CTRL = new TreeController();
    // CTRL.addOrigin();
    // const originID = CTRL.CTRL._ID;
    // CTRL.appendChild(originID, new TreeNode('A', CTRL));
    // CTRL.appendChild(originID, new TreeNode('B', CTRL));
    // CTRL.appendChild(originID, new TreeNode('C', CTRL));
    // console.log(CTRL);

    this.state = {
      CTRL: CTRL,
      selected: undefined,
      hovered: undefined,

      scrollPosn: 0,
      zoom: 1,

      showListPanel: false,
    };

    this.updateData = this.updateData.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleHover = this.handleHover.bind(this);

    this.handleScroll = this.handleScroll.bind(this);
    this.handleZoomIn = this.handleZoomIn.bind(this);
    this.handleZoomOut = this.handleZoomOut.bind(this);
    this.handleDragToScroll = this.handleDragToScroll.bind(this);

    this.toggleListPanel = this.toggleListPanel.bind(this);

    this.handleClearState = this.handleClearState.bind(this);
  }

  componentDidMount() {
    const thisObj = this;
    this.handleDeselect = e => {
      if (e.key === 'Escape')
        thisObj.setState({
          selected: undefined,
        });
    };

    document.addEventListener('keydown', thisObj.handleDeselect);
  }
  componentWillUnmount() {
    const handleDeselect = this.handleDeselect;
    document.removeEventListener('keydown', handleDeselect);
  }

  updateData(updatedController, newSelected) {
    newSelected = newSelected ?? this.state.selected;
    this.setState({
      CTRL: updatedController,
      selected: newSelected,
    });
  }

  handleSelect(nodeID) {
    this.setState({
      selected: nodeID,
      hovered: undefined,
    });
  }

  handleHover(nodeID) {
    this.setState({
      hovered: nodeID,
    });
  }

  handleZoom(delta) {
    const { CTRL, zoom: oldZoom, scrollPosn } = this.state;
    const newZoom = Math.max(1, Math.min(2, oldZoom + delta)),
      totalDepth = CTRL.maxTreeDepth();

    this.setState({
      zoom: newZoom,
      scrollPosn: Math.max(
        0,
        Math.min(totalDepth - totalDepth / newZoom, (scrollPosn * newZoom) / oldZoom)
      ),
    });
  }
  handleZoomIn = () => this.handleZoom(0.1);
  handleZoomOut = () => this.handleZoom(-0.1);

  handleScroll(e) {
    if (e.altKey) {
      if (e.deltaY > 0) return this.handleZoomOut(e);
      else return this.handleZoomIn(e);
    }

    if (e.shiftKey) {
      if (this.state.zoom === 1) return;

      const { CTRL, scrollPosn, zoom } = this.state,
        delta = e.deltaY < 0 ? -0.125 : 0.125;
      const totalDepth = Math.max(1, CTRL.maxTreeDepth());

      return this.setState({
        scrollPosn: Math.min(totalDepth - totalDepth / zoom, Math.max(0, scrollPosn + delta)),
      });
    }
  }
  handleDragToScroll(e) {
    if (this.state.zoom === 1) return;

    const { CTRL, scrollPosn, zoom } = this.state,
      delta = (4 * e.movementX) / document.querySelector('.scale-indicator').clientWidth;
    const totalDepth = Math.max(1, CTRL.maxTreeDepth());

    return this.setState({
      scrollPosn: Math.min(totalDepth - totalDepth / zoom, Math.max(0, scrollPosn + delta)),
    });
  }

  handleClearState() {
    const oldZoom = this.state.zoom;
    this.setState({
      scrollPosn: 0,
      zoom: oldZoom === 1 ? 2 : 1,
    });
  }

  toggleListPanel() {
    const prev = this.state.showListPanel;

    this.setState({
      showListPanel: !prev,
    });
  }

  render() {
    const { CTRL, selected, hovered } = this.state,
      scrollAndZoom = {
        scrollPosn: this.state.scrollPosn,
        zoom: this.state.zoom,
      },
      {
        updateData,
        handleSelect,
        handleHover,
        handleScroll,
        handleDragToScroll,
        handleClearState,
      } = this;

    return (
      <div className='App' onWheel={handleScroll}>
        <this.NavBarLayer />
        <div className='main-content'>
          <TreeMap
            CTRL={CTRL}
            selected={selected}
            hovered={hovered}
            scrollAndZoom={scrollAndZoom}
            updateData={updateData}
            handleSelect={handleSelect}
            handleHover={handleHover}
            /*
             * Additional props needed for Controls
             */
            handleDragToScroll={handleDragToScroll}
            handleClearState={handleClearState}
          />
          <this.LeftTrayLayer />
          <this.RightTrayLayer />
        </div>
      </div>
    );
  }

  // Top nav bar of the page
  NavBarLayer = () => {
    const toggleListPanel = this.toggleListPanel,
      button = document.querySelector('.show-list-panel-button');

    return (
      <div className='nav-bar glass'>
        <button
          className='glass-button fade-to-right show-list-panel-button'
          onClick={() => {
            this.setState({
              showListPanel: true,
            });
          }}
          onBlur={() => {
            setTimeout(() => {
              toggleListPanel();
            }, 0);
          }}
        >
          {this.state.showListPanel ? (
            <>
              <VscChromeClose />
              <span>Hide menu</span>
            </>
          ) : (
            <>
              <HiOutlineViewList />
              <span>Show menu</span>
            </>
          )}
        </button>
        <div>Project Storyline</div>
        <button className='glass-button fade-to-left'>
          <span>Some button</span>
        </button>
      </div>
    );
  };

  // Left tray containing ListPanel
  LeftTrayLayer = () => {
    const { CTRL, showListPanel } = this.state,
      { handleSelect, handleHover, toggleListPanel } = this;

    return (
      <div className='main-content__tray left' open={showListPanel ? 'open' : undefined}>
        <ListPanel
          CTRL={CTRL}
          toggleListPanel={toggleListPanel}
          handleSelect={handleSelect}
          handleHover={handleHover}
        />
      </div>
    );
  };

  // Right tray containing NodePanel
  RightTrayLayer = () => {
    const { CTRL, selected } = this.state;

    return (
      <div className='main-content__tray right' open={selected ? 'open' : undefined}>
        {selected && <NodePanel node={CTRL?.searchByID(selected)} />}
      </div>
    );
  };
}
