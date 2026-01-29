import { Link } from 'react-router-dom'

function ResultPage() {
  return (
    <main className="page result-page">
      <section className="result-card">
        <p className="eyebrow">Summary</p>
        <h1>Interview Completed</h1>
        <p className="lede">Your responses have been captured. You can head back to the setup screen or review feedback once available.</p>

        <div className="feedback-placeholder">
          <div className="pill ghost">Feedback</div>
          <p>Feedback will appear here after processing.</p>
        </div>

        <div className="setup-actions">
          <Link to="/" className="btn primary">Back to Home</Link>
        </div>
      </section>
    </main>
  )
}

export default ResultPage
