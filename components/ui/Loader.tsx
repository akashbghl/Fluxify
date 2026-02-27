import React from 'react'

const Loader = () => {
  return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
  )
}

export default Loader
