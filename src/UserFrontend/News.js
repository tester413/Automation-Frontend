import React, { useState } from "react";

function News() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runNewsletterTest = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch("http://localhost:5000/api/news/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Newsletter test failed");
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
        background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,.2)",
      }}
    >
      <h2>Newsletter Automation Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Email</label>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
          }}
        />
      </div>

      <button
        onClick={runNewsletterTest}
        disabled={loading}
        style={{
          padding: "12px 25px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        {loading ? "Running Test..." : "Run Newsletter Test"}
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
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <h2>Automation Result</h2>

          <p>
            <strong>Message:</strong> {result.message}
          </p>

          <p>
            <strong>Email:</strong> {result.email}
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
            {result.executionTime} sec
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

          <h2>Screenshots</h2>

          {result.result.screenshots &&
          result.result.screenshots.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(300px,1fr))",
                gap: "20px",
              }}
            >
              {result.result.screenshots.map((image, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  <h4>Step {index + 1}</h4>

                  <img
                    src={image}
                    alt={`Step ${index + 1}`}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
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

export default News;