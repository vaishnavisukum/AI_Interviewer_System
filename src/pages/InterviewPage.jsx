import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import CandidateVideo from '../components/CandidateVideo'

function InterviewPage() {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState('')
  const [isStarting, setIsStarting] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(2 * 60)
  const [timerStarted, setTimerStarted] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  const { cameraAllowed = true, micAllowed = true } = location.state || {}

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [stream])

  useEffect(() => {
    if (!timerStarted) return
    
    const id = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [timerStarted])

  const startInterview = async () => {
    if (isStarting) return
    setError('')

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera or microphone not supported in this browser.')
      return
    }

    if (!cameraAllowed || !micAllowed) {
      setError('Camera and microphone permissions are required. Please go back to setup and enable them.')
      return
    }

    if (stream) {
      setTimerStarted(true)
      return
    }

    try {
      setIsStarting(true)
      const constraints = {
        video: cameraAllowed,
        audio: micAllowed
      }
      setTimerStarted(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
    } catch (err) {
      const message = err?.name === 'NotAllowedError'
        ? 'Permission denied. Please allow camera and microphone access.'
        : 'Unable to start camera. Please check device settings.'
      setError(message)
    } finally {
      setIsStarting(false)
    }
  }

  useEffect(() => {
    // Automatically start camera when page loads if permissions are granted
    if (cameraAllowed && micAllowed && !stream && !isStarting) {
      const autoStartCamera = async () => {
        try {
          const constraints = {
            video: cameraAllowed,
            audio: micAllowed
          }
          const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
          setStream(mediaStream)
        } catch (err) {
          console.error('Auto-start camera error:', err)
        }
      }
      autoStartCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFinish = () => {
    stopStream()
    navigate('/result')
  }

  const timerLabel = useMemo(() => {
    const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
    const seconds = String(secondsLeft % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  }, [secondsLeft])

  const isRecording = true

  return (
    <main className="page interview-page">
      <section className="interview-card">
        <header className="interview-header">
          <div className="brand">
            <img className="logo-img" src="/AIIS-logo.png" alt="logo" />
            <h1>AI Interviewer</h1>
          </div>
          <div className="header-actions">
            <Link to="/" className="link">Back to setup</Link>
            <div className="avatar-circle" aria-label="User">V</div>
          </div>
        </header>

        <section className="question-block">
          <p className="question">
            Q1) You are in charge of a small team. Two of your best performers strongly disagree on how to solve a critical
            problem. Both solutions could work, but they are incompatible and the deadline is tomorrow. What do you do?
          </p>
        </section>

        <section className="interview-grid">
          <div className="video-card">
            <div className="video-frame ai-frame">
              <div className="ai-placeholder">
                <span>AI</span>
              </div>
            </div>
          </div>

          <div className="video-card">
            <div className="video-frame">
              {stream ? (
                <CandidateVideo stream={stream} />
              ) : (
                <div className="video-placeholder">Camera is off</div>
              )}
            </div>
          </div>
        </section>

        <section className="controls">
          <div className="control-left">
            <button className="btn primary" onClick={startInterview} disabled={isStarting}>
              {isStarting ? 'Starting...' : 'Start Interview'}
            </button>
          </div>

          <div className="control-right">
            <button className="btn success" onClick={handleFinish}>
              I am Done
            </button>
            {isRecording ? (
              <div className="recording-indicator" aria-live="polite">
                <span className="recording-dot" />
                <span>REC</span>
              </div>
            ) : null}
            <div className="timer-chip" aria-live="polite">{timerLabel}</div>
          </div>
        </section>

        {error ? <p className="error" role="alert">{error}</p> : null}
      </section>
    </main>
  )
}

export default InterviewPage
