import React from 'react';
import { RiFolderHistoryLine } from 'react-icons/ri';

export default class HistoryPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updatesList: props.updatesList ?? [],
      historyIndex: props.historyIndex ?? 0,
    };

    this.restoreState = props.restoreState;
  }

  componentDidMount() {}

  static getDerivedStateFromProps(props) {
    return {
      updatesList: props.updatesList ?? [],
      historyIndex: props.historyIndex ?? 0,
    };
  }

  render() {
    const { updatesList, historyIndex } = this.state,
      restoreState = this.restoreState;

    return (
      <details className='history-panel panel glass glass__white'>
        <summary className='panel__header glass-button'>
          <RiFolderHistoryLine />
          <span>History</span>
        </summary>
        <ul className='panel__list'>
          {updatesList.map(({ updateLabel }, i) => (
            <li
              key={i}
              className='panel__list__item history-item glass-button fade-to-right'
              current={historyIndex === i ? 'current' : undefined}
              erased={historyIndex > i ? 'erased' : undefined}
              onClick={() => {
                restoreState(i);
              }}
            >
              {updateLabel}
            </li>
          ))}
        </ul>
      </details>
    );
  }
}
