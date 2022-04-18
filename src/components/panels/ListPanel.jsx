import React from 'react';
import { RiSearchLine } from 'react-icons/ri';
import TextInput from '../input/TextInput';
import NodesList from './NodesList';

export default class ListPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      CTRL: props.CTRL,
      searchQuery: '',
    };

    this.handleSelect = props.handleSelect;
    this.handleHover = props.handleHover;
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props) {
    return {
      CTRL: props.CTRL,
    };
  }

  render() {
    const nodesList = this.state.CTRL.toArray(),
      { handleSelect, handleHover } = this;

    const searchFilter = node =>
      node.id.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
      node.label.toLowerCase().includes(this.state.searchQuery.toLowerCase()) ||
      node.info.toLowerCase().includes(this.state.searchQuery.toLowerCase());

    return (
      <div open className='list-panel panel glass glass__white'>
        <label className='panel__header glass-input-label glass-button' htmlFor='search__inner'>
          <RiSearchLine />
          <TextInput
            id={'search'}
            htmlFor='search__inner'
            initialValue=''
            placeholder='Type to search...'
            layout='single'
            delay={0}
            onChange={e => {
              const value = e.target.value;
              this.setState({
                searchQuery: value,
              });
            }}
          />
        </label>
        <NodesList
          nodesList={nodesList.filter(searchFilter)}
          handleSelect={handleSelect}
          handleHover={handleHover}
        />
      </div>
    );
  }
}
