export default function Resume() {
  return (
    <div>
      <div className="card">
        <h2>Upload Resume</h2>
        <input type="file" />
        <button>Upload</button>
      </div>

      <div className="card">
        <h2>Job Description</h2>
        <textarea rows="5" placeholder="Paste job description..." />
        <button>Analyze</button>
      </div>

      <div className="card">
        <h3>No analysis yet</h3>
      </div>
    </div>
  );
}