import React, { useState } from "react";

function Search() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runSearchTest = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await fetch("http://localhost:5000/api/search/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchText: keyword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Search Test Failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const th = {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  };

  const td = {
    border: "1px solid #ddd",
    padding: "10px",
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
      <h2>Search Automation Test</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Search Product</label>
        <input
          type="text"
          placeholder="Enter Product Name"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
          }}
        />
      </div>

      <button
        onClick={runSearchTest}
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
        {loading ? "Running Test..." : "Run Search Test"}
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
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Keyword:</strong> {keyword}</p>
          <hr />

          <h3>Execution Details</h3>
          <p><strong>Test Name:</strong> {result.result.testName}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: result.result.status === "PASSED" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {result.result.status}
            </span>
          </p>
          <p><strong>Execution Time:</strong> {result.executionTime} sec</p>
          <p>
            <strong>Executed At:</strong>{" "}
            {new Date(result.result.executedAt).toLocaleString()}
          </p>
          <hr />

          <h2>Test Report Summary</h2>
          {result.result.report && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <tbody>
                <tr>
                  <td style={td}><strong>Total Tests</strong></td>
                  <td style={td}>{result.result.report.summary.total}</td>
                </tr>
                <tr>
                  <td style={td}><strong>Passed</strong></td>
                  <td style={{ ...td, color: "green" }}>
                    {result.result.report.summary.passed}
                  </td>
                </tr>
                <tr>
                  <td style={td}><strong>Failed</strong></td>
                  <td style={{ ...td, color: "red" }}>
                    {result.result.report.summary.failed}
                  </td>
                </tr>
                <tr>
                  <td style={td}><strong>Skipped</strong></td>
                  <td style={td}>{result.result.report.summary.skipped}</td>
                </tr>
                <tr>
                  <td style={td}><strong>Total Duration</strong></td>
                  <td style={td}>
                    {result.result.report.summary.totalDuration} ms
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          <hr />

          <h2>Test Cases</h2>
          {result.result.report?.tests?.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "20px",
                }}
              >
                <thead>
                  <tr>
                    <th style={th}>ID</th>
                    <th style={th}>Module</th>
                    <th style={th}>Title</th>
                    <th style={th}>Status</th>
                    <th style={th}>Expected Result</th>
                    <th style={th}>Actual Result</th>
                    <th style={th}>Browser</th>
                    <th style={th}>Duration</th>
                    <th style={th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {result.result.report.tests.map((test, index) => (
                    <tr key={index}>
                      <td style={td}>{test.id}</td>
                      <td style={td}>{test.module}</td>
                      <td style={td}>{test.title}</td>
                      <td
                        style={{
                          ...td,
                          color: test.status === "passed" ? "green" : "red",
                          fontWeight: "bold",
                        }}
                      >
                        {test.status.toUpperCase()}
                      </td>
                      <td style={td}>{test.expectedResult}</td>
                      <td style={td}>{test.actualResult}</td>
                      <td style={td}>{test.browser}</td>
                      <td style={td}>{test.duration} ms</td>
                      <td style={td}>
                        {test.date}
                        <br />
                        {test.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No test cases available.</p>
          )}
          <hr />

          <h3>Console Output</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "8px",
              overflowX: "auto",
            }}
          >
            {result.stdout}
          </pre>
          <hr />

          <h2>Screenshots</h2>
          {result.result.screenshots && result.result.screenshots.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
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
  ); // <-- Added closing parenthesis and semicolon for return statement
} // <-- Added closing brace for Search function

export default Search;