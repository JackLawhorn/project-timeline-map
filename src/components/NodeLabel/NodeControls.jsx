export default function NodeControls(props) {
  return (
    <svg className='node-label__controls' viewBox='0 0 100 100'>
      <path className='quadrant' d='M50,50 L100,0 L0,0 L50,50 Z' onClick={props.controls[0]} />
      <path
        className='arrow'
        fill='none'
        stroke='white'
        strokeWidth='5'
        markerEnd='url(#arrow)'
        d='M50,43.75 L50,12.5 L80,12.5'
      />
      <path className='quadrant' d='M50,50 L100,100 L100,0 L50,50 Z' onClick={props.controls[1]} />
      <path
        className='arrow'
        fill='none'
        stroke='white'
        strokeWidth='5'
        markerEnd='url(#arrow)'
        d='M56.75,50 L95,50'
      />
      <path className='quadrant' d='M50,50 L0,100 L100,100 L50,50 Z' onClick={props.controls[2]} />
      <path
        className='arrow'
        fill='none'
        stroke='white'
        strokeWidth='5'
        markerEnd='url(#arrow)'
        d='M50,56.25 L50,87.5 L80,87.5'
      />
      <path className='quadrant' d='M50,50 L0,0 L0,100 L50,50 Z' onClick={props.controls[3]} />
      <path
        className='arrow'
        fill='none'
        stroke='white'
        strokeWidth='5'
        markerEnd='url(#arrow)'
        d='M43.75,50 L5,50'
      />
      <circle cx='50' cy='50' r='7.5' fill='none' stroke='white' strokeWidth='5' />
    </svg>
  );
}
