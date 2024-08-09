import React from 'react'

function layout({children}: {children:React.ReactNode}) {
  return (
    <div className='overflow-y-scroll'>{children}</div>
  )
}

export default layout