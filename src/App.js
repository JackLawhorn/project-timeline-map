import './style.css';
import React from 'react';

import { RiLayoutLeftLine, RiCloseLine, RiInformationLine } from 'react-icons/ri';

import TreeMap from './components/TreeMap';
import ListPanel from './components/panels/ListPanel';
import NodePanel from './components/panels/NodePanel';
import ControlsPanel from './components/panels/ControlsPanel';

import TreeController from './data-classes/TreeController';
import HistoryPanel from './components/panels/HistoryPanel';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const CTRL = new TreeController();

    this.state = {
      CTRL: CTRL,
      history: [{ updateLabel: 'Initial state', CTRL: CTRL }],
      historyIndex: 0,

      selected: undefined,
      hovered: undefined,

      modal: undefined,

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
    this.openModal = this.openModal.bind(this);

    this.restoreState = this.restoreState.bind(this);

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

  updateData(
    updatedController,
    newSelected = this.state.selected,
    updateLabel = 'Untitled update'
  ) {
    this.setState({
      CTRL: updatedController,
      history: [
        { updateLabel: updateLabel, CTRL: updatedController },
        ...this.state.history.slice(this.state.historyIndex),
      ],
      historyIndex: 0,
      selected: newSelected,
    });
  }

  openModal(component) {
    this.setState({
      modal: component,
    });
  }

  restoreState(i = 0) {
    const { CTRL } = this.state.history[i];
    this.setState(
      {
        CTRL: CTRL,
        historyIndex: i,
      },
      console.log(this.state.CTRL.toArray().length)
    );
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
    this.setState(
      {
        scrollPosn: 0,
        zoom: oldZoom === 1 ? 2 : 1,
      },
      () => {
        this.openModal();
      }
    );
  }

  toggleListPanel() {
    const prev = this.state.showListPanel;

    this.setState({
      showListPanel: !prev,
    });
  }

  render() {
    const { CTRL, selected, hovered, modal } = this.state,
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
      <>
        {modal !== undefined && modal}
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
              handleDragToScroll={handleDragToScroll}
              handleClearState={handleClearState}
            />
            <this.LeftTrayLayer />
            <this.RightTrayLayer />
          </div>
        </div>
      </>
    );
  }

  // Top nav bar of the page
  NavBarLayer = () => {
    const toggleListPanel = this.toggleListPanel,
      openModal = this.openModal;

    return (
      <div className='nav-bar glass'>
        <button
          className='glass-button fade-to-right show-list-panel-button'
          onClick={toggleListPanel}
          onBlur={() => {
            setTimeout(() => {
              this.setState({
                // showListPanel: false,
              });
            }, 0);
          }}
        >
          {this.state.showListPanel ? (
            <>
              <RiCloseLine />
              <span>Hide menu</span>
            </>
          ) : (
            <>
              <RiLayoutLeftLine />
              <span>Show menu</span>
            </>
          )}
        </button>
        <div>Project Storyline</div>
        <button
          className='glass-button fade-to-left'
          onClick={() => {
            openModal(
              <ControlsPanel
                closeModal={() => {
                  openModal(undefined);
                }}
              />
            );
          }}
        >
          <RiInformationLine />
          <span>Help</span>
        </button>
      </div>
    );
  };

  // Left tray containing ListPanel
  LeftTrayLayer = () => {
    const { CTRL, history, historyIndex, showListPanel } = this.state,
      { handleSelect, handleHover, toggleListPanel, restoreState } = this;

    return (
      <div className='main-content__tray left' open={showListPanel ? 'open' : undefined}>
        <ListPanel
          CTRL={CTRL}
          toggleListPanel={toggleListPanel}
          handleSelect={handleSelect}
          handleHover={handleHover}
        />
        <HistoryPanel
          updatesList={history}
          historyIndex={historyIndex}
          restoreState={restoreState}
        />
      </div>
    );
  };

  // Right tray containing NodePanel
  RightTrayLayer = () => {
    const { CTRL, selected } = this.state,
      { updateData, handleSelect, handleHover } = this;
    const selectedNode = CTRL?.searchByID(selected);

    return (
      <div className='main-content__tray right' open={selected ? 'open' : undefined}>
        {selected && (
          <NodePanel
            CTRL={CTRL}
            node={selectedNode}
            updateData={updateData}
            handleSelect={handleSelect}
            handleHover={handleHover}
          />
        )}
      </div>
    );
  };
}
