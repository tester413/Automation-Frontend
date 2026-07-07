import React, { useState } from "react";

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const runProfileTest = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch(
        "http://localhost:5000/api/run-profile-test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Test execution failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        background: "#fff",
      }}
    >
      <h2>Profile Automation Test</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Name</label>

        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Phone</label>

        <input
          type="text"
          name="phone"
          placeholder="Enter Phone Number"
          value={formData.phone}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>Date of Birth</label>

        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          style={{ width: "100%", padding: "10px", marginTop: "5px" }}
        />
      </div>

      <button
        onClick={runProfileTest}
        disabled={loading}
        style={{
          padding: "12px 25px",
          cursor: "pointer",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
        }}
      >
        {loading ? "Running Test..." : "Run Profile Test"}
      </button>

      {error && (
        <div
          style={{
            marginTop: "20px",
            color: "red",
            fontWeight: "bold",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h2>Automation Result</h2>

          <p>
            <strong>Message:</strong> {result.message}
          </p>

          <hr />

          <h3>Submitted Data</h3>

          <p>
            <strong>Name:</strong> {result.testData.name}
          </p>

          <p>
            <strong>Phone:</strong> {result.testData.phone}
          </p>

          <p>
            <strong>DOB:</strong> {result.testData.dob}
          </p>

          <hr />

          <h3>Execution Details</h3>

          <p>
            <strong>Test Name:</strong> {result.result.testName}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color:
                  result.result.status === "PASSED"
                    ? "green"
                    : "red",
                fontWeight: "bold",
              }}
            >
              {result.result.status}
            </span>
          </p>

          <p>
            <strong>Execution Time:</strong>{" "}
            {result.result.executionTime} seconds
          </p>

          <p>
            <strong>Executed At:</strong>{" "}
            {new Date(result.result.executedAt).toLocaleString()}
          </p>

          <hr />

          <h3>Console Output</h3>

          <pre
            style={{
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            {result.stdout}
          </pre>

<hr />

<h2>Test Report</h2>

{result.result.report && (
  <>
    <h3>Summary</h3>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px",
      }}
    >
      <tbody>
        <tr>
          <td><strong>Total Tests</strong></td>
          <td>{result.result.report.summary.total}</td>
        </tr>

        <tr>
          <td><strong>Passed</strong></td>
          <td style={{ color: "green" }}>
            {result.result.report.summary.passed}
          </td>
        </tr>

        <tr>
          <td><strong>Failed</strong></td>
          <td style={{ color: "red" }}>
            {result.result.report.summary.failed}
          </td>
        </tr>

        <tr>
          <td><strong>Skipped</strong></td>
          <td>{result.result.report.summary.skipped}</td>
        </tr>

        <tr>
          <td><strong>Total Duration</strong></td>
          <td>{result.result.report.summary.totalDuration} ms</td>
        </tr>
      </tbody>
    </table>

    <h3>Test Cases</h3>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
      border="1"
    >
      <thead
        style={{
          background: "#1976d2",
          color: "#fff",
        }}
      >
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Module</th>
          <th>Status</th>
          <th>Duration</th>
          <th>Date</th>
          <th>Time</th>
          <th>File</th>
        </tr>
      </thead>

      <tbody>
        {result.result.report.tests.map((test, index) => (
          <tr key={index}>
            <td>{test.id}</td>

            <td>{test.title}</td>

            <td>{test.module}</td>

            <td
              style={{
                color:
                  test.status === "passed"
                    ? "green"
                    : "red",
                fontWeight: "bold",
              }}
            >
              {test.status.toUpperCase()}
            </td>

            <td>{test.duration}</td>

            <td>{test.date}</td>

            <td>{test.time}</td>

            <td>{test.file}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)}
          <hr />

          <h2>Automation Screenshots</h2>

          {result.result.screenshots &&
          result.result.screenshots.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(350px,1fr))",
                gap: "20px",
                marginTop: "20px",
              }}
            >
              {result.result.screenshots.map((image, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "10px",
                    background: "#fafafa",
                  }}
                >
                  <h4>Step {index + 1}</h4>

                  <img
                    src={image}
                    alt={`Step ${index + 1}`}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No screenshots available.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;