export default function Dashboard() {
  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Welcome 👋</h1>

      <div className="card">
        <h2>Latest Resume Score</h2>
        <p>Upload a resume to see ATS score</p>
      </div>

      <div className="card">
        <h2>Tasks Progress</h2>
        <ul>
          <li>✔ Upload Resume</li>
          <li>❌ Add Job Description</li>
          <li>❌ Improve Skills</li>
        </ul>
      </div>
    </div>
  );
}