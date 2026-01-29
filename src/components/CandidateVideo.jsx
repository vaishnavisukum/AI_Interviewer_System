import { useEffect, useRef } from 'react'

function CandidateVideo({ stream }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    if (stream) {
      videoEl.srcObject = stream
      videoEl.play().catch(() => {})
    } else {
      videoEl.srcObject = null
    }

    return () => {
      if (videoEl) {
        videoEl.srcObject = null
      }
    }
  }, [stream])

  return (
    <video
      ref={videoRef}
      className="video-element"
      autoPlay
      muted
      playsInline
    />
  )
}

export default CandidateVideo
