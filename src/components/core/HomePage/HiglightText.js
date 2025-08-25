import React from 'react'

const HighlightText = ({text}) => {
  return (
    //HW to add gradient
    <span className='font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-450 via-blue-950 to-blue-1000' >
        {text}
    </span>    
)
}

export default HighlightText