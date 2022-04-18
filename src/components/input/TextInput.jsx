import React from 'react';

export default class TextInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      className: props.className,
      htmlFor: props.htmlFor,

      initialValue: props.initialValue,
      currentValue: props.initialValue,
      placeholder: props.placeholder,

      layout: props.layout ?? 'single',

      delay: props.delay,
    };

    this.onChange = props.onChange;
  }

  static getDerivedStateFromProps(props, state) {
    if (props.initialValue !== state.initialValue)
      return {
        initialValue: props.initialValue,
        currentValue: props.initialValue,
        placeholder: props.placeholder,
        layout: props.layout ?? 'single',
      };

    return {
      initialValue: state.initialValue,
      currentValue: state.currentValue,
      layout: props.layout ?? 'single',
    };
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { id, className, htmlFor, initialValue, currentValue, placeholder, layout, delay } =
        this.state,
      onChange = this.onChange;

    let rows = 1,
      cols = 24,
      maxLength = 24;
    if (layout === 'multi') {
      rows = 2;
      maxLength = 48;
    }
    if (layout === 'long') {
      rows = undefined;
      maxLength = undefined;
    }

    return (
      <div className={`glass-input ${className ?? ``}`} id={id}>
        <div className='glass-input__inner-bounds'>{`${currentValue}`}</div>
        <textarea
          id={htmlFor}
          className='glass-input__inner'
          placeholder={placeholder}
          readOnly={onChange === undefined ? 'readonly' : undefined}
          layout={layout ?? 'long'}
          cols={cols}
          rows={rows}
          maxLength={maxLength}
          value={currentValue}
          onChange={e => {
            clearTimeout(this.timeout);
            this.setState(
              {
                currentValue:
                  layout === 'long' ? e.target.value : e.target.value.replace(/\n/g, ''),
              },
              () => {
                this.timeout = setTimeout(() => {
                  onChange(e);
                }, delay);
              }
            );
          }}
          onBlur={e => {
            if (currentValue === initialValue) return;
            if (currentValue.length === 0) {
              this.setState({
                currentValue: initialValue,
              });
            }

            onChange(e);
          }}
          onKeyPress={e => {
            if (e.key === 'Enter') onChange(e);
          }}
        ></textarea>
      </div>
    );
  }
}
