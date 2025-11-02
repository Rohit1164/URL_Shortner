import { useState } from "react";

export default function UrlShortener() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  async function shortenURL() {
    if (!url) return;
    setLoading(true);

    const resp = await fetch("https://url-shortner-wtkz.onrender.com/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await resp.json();
    const id = data.id || data.shortId;
    const full = `https://url-shortner-wtkz.onrender.com/url/${id}`;

    setShortUrl(full);
    fetchAnalytics(id);
    setLoading(false);
  }

  async function fetchAnalytics(id) {
    const resp = await fetch(
      `https://url-shortner-wtkz.onrender.com/url/analytics/${id}`
    );
    const data = await resp.json();

    setAnalytics(data.totalclick);
    setVisits(data.analytics.reverse());
  }

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white/80 backdrop-blur shadow-xl rounded-2xl border">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">URL Shortener</h1>
      <p className="text-sm text-slate-500 mb-5">
        Paste your long URL below to generate a short version instantly.
      </p>

      {/* Input */}
      <input
        type="url"
        className="border p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
        placeholder="https://example.com/very-long-url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={shortenURL}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>

        <button
          onClick={() => {
            setUrl("");
            setShortUrl("");
            setAnalytics(0);
            setVisits([]);
          }}
          className="px-5 py-2 rounded-lg border border-slate-200 hover:bg-slate-100"
        >
          Clear
        </button>
      </div>

      {/* Result Card */}
      {shortUrl && (
        <div className="mt-6 p-5 rounded-lg border shadow-sm bg-gradient-to-br from-white to-slate-50">
          <label className="text-xs text-slate-500">Shortened URL</label>

          <div className="flex gap-2 mt-1">
            <input
              readOnly
              value={shortUrl}
              className="w-full border rounded-md p-2 bg-slate-100 text-sm"
            />

            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="px-3 rounded bg-slate-800 text-white hover:bg-slate-900"
            >
              Copy
            </button>

            <button
              onClick={() => window.open(shortUrl, "_blank")}
              className="px-3 rounded border hover:bg-slate-200"
            >
              Open
            </button>
          </div>

          {/* Analytics */}
          <p className="mt-4 text-sm text-slate-700">
            <span className="font-semibold">{analytics}</span> total clicks
          </p>

          {/* Recent visits */}
          {visits.length > 0 && (
            <div className="mt-2">
              <label className="text-xs text-slate-500">Recent visits</label>
              <ul className="mt-1 text-sm divide-y max-h-32 overflow-auto border rounded">
                {visits.map((v, i) => (
                  <li key={i} className="p-2">
                    {new Date(v.timeStamp).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
