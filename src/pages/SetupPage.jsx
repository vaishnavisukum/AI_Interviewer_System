import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SetupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [resumeName, setResumeName] = useState('No file chosen')
  const [resumeFile, setResumeFile] = useState(null)
  const [cameraAllowed, setCameraAllowed] = useState(false)
  const [micAllowed, setMicAllowed] = useState(false)
  const [recAllowed, setRecAllowed] = useState(false)
  const [mediaStream, setMediaStream] = useState(null)
  const navigate = useNavigate()

  const handleResumeSelect = (event) => {
    const file = event.target.files?.[0]
    setResumeName(file ? file.name : 'No file chosen')
    setResumeFile(file || null)
  }

  const handleCameraToggle = async () => {
    if (cameraAllowed) {
      // Turn off camera
      if (mediaStream) {
        mediaStream.getVideoTracks().forEach(track => track.stop())
      }
      setCameraAllowed(false)
    } else {
      // Request camera permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        setMediaStream(stream)
        setCameraAllowed(true)
      } catch (err) {
        console.error('Camera permission error:', err)
        alert('Camera permission denied. Please allow camera access to continue.')
        setCameraAllowed(false)
      }
    }
  }

  const handleMicToggle = async () => {
    if (micAllowed) {
      // Turn off microphone
      if (mediaStream) {
        mediaStream.getAudioTracks().forEach(track => track.stop())
      }
      setMicAllowed(false)
    } else {
      // Request microphone permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setMediaStream(prevStream => {
          if (prevStream) {
            stream.getAudioTracks().forEach(track => prevStream.addTrack(track))
            return prevStream
          }
          return stream
        })
        setMicAllowed(true)
      } catch (err) {
        console.error('Microphone permission error:', err)
        alert('Microphone permission denied. Please allow microphone access to continue.')
        setMicAllowed(false)
      }
    }
  }

  const handleRecordingToggle = () => {
    setRecAllowed(prev => !prev)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!isFormValid) {
      alert('Please fill in all required fields and enable all permissions.')
      return
    }

    // Stop all media tracks before navigating
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
    }

    // Navigate to interview page
    navigate('/interview', {
      state: { 
        fullName, 
        email, 
        cameraAllowed, 
        micAllowed, 
        recAllowed 
      }
    })
  }

  const isFormValid = fullName.trim() !== '' && 
                      email.trim() !== '' && 
                      resumeFile !== null &&
                      cameraAllowed && 
                      micAllowed && 
                      recAllowed

  return (
    <main className="page setup-page">
      <section className="setup-card">
        <div className="setup-grid">
          <div className="setup-left">
            <img className="setup-logo" src="/AIIS-logo.png" alt="logo" />
            <h1>Welcome to AI Interview</h1>
            
          </div>
          
          <div className="setup-form">
            <label className="field">
              <span>Full Name</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
              />
            </label>

            <label className="field resume-field">
              <span>Resume (PDF or DOCX)</span>
              <div className="resume-input">
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeSelect} required />
                <div className="resume-label">
                  <div className="resume-title">Upload Resume</div>
                  <div className="resume-name">{resumeName}</div>
                </div>
              </div>
            </label>

            <div className="permission-panel">
            <h3>Permissions</h3>
            <div className="permission-row">
              <div>
                <div className="perm-label">Camera permission</div>
                <div className="perm-note">Required during interview</div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${cameraAllowed ? 'on' : 'off'}`}
                onClick={handleCameraToggle}
                aria-label={`Camera ${cameraAllowed ? 'allowed' : 'blocked'}`}
              >
                <span className="toggle-slider">
                  <span className="toggle-knob" />
                  <span className="toggle-text">{cameraAllowed ? 'ON' : 'OFF'}</span>
                </span>
              </button>
            </div>

            <div className="permission-row">
              <div>
                <div className="perm-label">Microphone permission</div>
                <div className="perm-note">Required during interview</div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${micAllowed ? 'on' : 'off'}`}
                onClick={handleMicToggle}
                aria-label={`Microphone ${micAllowed ? 'allowed' : 'blocked'}`}
              >
                <span className="toggle-slider">
                  <span className="toggle-knob" />
                  <span className="toggle-text">{micAllowed ? 'ON' : 'OFF'}</span>
                </span>
              </button>
            </div>

            <div className="permission-row">
              <div>
                <div className="perm-label">Recording permission</div>
                <div className="perm-note">Required during interview</div>
              </div>
              <button
                type="button"
                className={`toggle-switch ${recAllowed ? 'on' : 'off'}`}
                onClick={handleRecordingToggle}
                aria-label={`Recording ${recAllowed ? 'allowed' : 'blocked'}`}
              >
                <span className="toggle-slider">
                  <span className="toggle-knob" />
                  <span className="toggle-text">{recAllowed ? 'ON' : 'OFF'}</span>
                </span>
              </button>
            </div>
          </div>

          <div className="setup-actions">
            <button 
              type="button"
              onClick={handleSubmit}
              className={`btn primary ${!isFormValid ? 'disabled' : ''}`}
            >
              Submit
            </button>
          </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default SetupPage
