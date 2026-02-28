import React from 'react'

export default function Loader() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <img
        src="/videos/loading.gif"
        alt="Loading"
        className="h-24 w-24 "
      />
    </div>
  )
}
