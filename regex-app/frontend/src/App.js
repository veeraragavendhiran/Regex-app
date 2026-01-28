import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  Code,
  History,
  Info,
  Clipboard,
  Trash2,
  Copy,
  Search,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState("home");
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://127.0.0.1:5000/api";

  const checkRegex = async () => {
    if (!pattern || !testString) {
      toast.error("⚠️ Please enter both regex and test string");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/check`, {
        pattern,
        test_string: testString,
      });
      setResult(res.data);
      toast.success(res.data.matched ? "✅ Pattern matched" : "❌ No match");
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.error || "Error testing regex");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error("Error fetching history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("📋 Copied to clipboard!");
  };

  const clearInputs = () => {
    setPattern("");
    setTestString("");
    setResult(null);
    toast("🧹 Inputs cleared");
  };

  const highlighted = useMemo(() => {
    if (!pattern) return testString;
    try {
      const re = new RegExp(pattern, "g");
      const parts = [];
      let last = 0;
      let m;
      while ((m = re.exec(testString)) !== null) {
        parts.push(testString.slice(last, m.index));
        parts.push(
          <motion.mark
            key={m.index}
            className="bg-gradient-to-r from-pink-200 to-purple-200 rounded px-1"
            initial={{ backgroundColor: "#fef3c7" }}
            animate={{
              backgroundColor: ["#f9a8d4", "#c084fc", "#f9a8d4"],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {m[0]}
          </motion.mark>
        );
        last = m.index + m[0].length;
      }
      parts.push(testString.slice(last));
      return <>{parts}</>;
    } catch {
      return testString;
    }
  }, [pattern, testString]);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans text-gray-800">
      <Toaster position="top-right" />

      {/* Animated Background Blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ x: [0, 60, -60, 0], y: [0, -40, 40, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ x: [0, -60, 60, 0], y: [0, 40, -40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 left-1/2 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 45, -45, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50"></div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center bg-white/60 backdrop-blur-lg shadow-xl px-6 py-3 rounded-2xl mb-8 max-w-5xl mx-auto border border-white/40"
        >
          <h1 className="text-2xl font-bold flex items-center gap-2 text-purple-700 drop-shadow">
            <Code /> Regex Tester
          </h1>
          <div className="flex gap-6 text-gray-700 font-medium">
            {["home", "history", "about"].map((tab) => (
              <button
                key={tab}
                onClick={() => setPage(tab)}
                className={`relative px-2 transition ${
                  page === tab
                    ? "text-purple-700 font-semibold"
                    : "hover:text-purple-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {page === tab && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 -bottom-1 h-[3px] bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.nav>

        {/* Pages */}
        <AnimatePresence mode="wait">
          {page === "home" && (
            <motion.div
              key="home"
              className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-2xl max-w-xl mx-auto border border-white/40"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <Search className="text-purple-600" /> Test your Regex
              </h2>
              <div className="flex gap-2 flex-col sm:flex-row">
                <input
                  type="text"
                  placeholder="Regex pattern"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-purple-600 shadow-inner"
                />
                <input
                  type="text"
                  placeholder="Test string"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-purple-600 shadow-inner"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={checkRegex}
                  disabled={loading}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:opacity-90 transition disabled:from-gray-400 disabled:to-gray-500"
                >
                  {loading ? "Checking..." : "Check"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={clearInputs}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-1"
                >
                  <Trash2 size={16} /> Clear
                </motion.button>
              </div>

              {result && (
                <motion.div
                  className={`mt-4 p-4 rounded-xl flex flex-col gap-2 border shadow-inner ${
                    result.matched
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center gap-3">
                    {result.matched ? (
                      <CheckCircle className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                    <span className="font-medium text-gray-700">
                      {result.matched ? "Matched ✅" : "Not Matched ❌"}
                    </span>
                    <button
                      onClick={() => copyToClipboard(result.test_string)}
                      className="ml-auto text-sm text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <Copy size={14} /> Copy String
                    </button>
                  </div>
                  <div className="text-gray-700">
                    <b>Preview:</b>{" "}
                    <span className="font-mono break-all">{highlighted}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {page === "history" && (
            <motion.div
              key="history"
              className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-2xl max-w-5xl mx-auto border border-white/40"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                <History /> Recent History
              </h2>
              {history.length === 0 ? (
                <p className="text-gray-500">No history yet. Test a regex first!</p>
              ) : (
                <div className="overflow-y-auto max-h-[400px] border rounded-xl shadow-inner">
                  <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-gradient-to-r from-pink-100 to-purple-100 text-left">
                      <tr>
                        <th className="p-2">Pattern</th>
                        <th className="p-2">String</th>
                        <th className="p-2">Matched</th>
                        <th className="p-2">Time</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h, i) => (
                        <motion.tr
                          key={h.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`border-b ${
                            i % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-purple-50 transition`}
                        >
                          <td className="p-2 font-mono text-purple-700">
                            {h.pattern}
                          </td>
                          <td className="p-2">{h.test_string}</td>
                          <td className="p-2">
                            {h.matched ? (
                              <CheckCircle className="text-green-500 inline" />
                            ) : (
                              <XCircle className="text-red-500 inline" />
                            )}
                          </td>
                          <td className="p-2 text-gray-500 flex items-center gap-1">
                            <Clock size={16} />{" "}
                            {new Date(h.timestamp).toLocaleString()}
                          </td>
                          <td className="p-2">
                            <button
                              onClick={() => copyToClipboard(h.pattern)}
                              className="text-sm flex items-center gap-1 text-purple-600 hover:underline"
                            >
                              <Clipboard size={14} /> Copy
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {page === "about" && (
            <motion.div
              key="about"
              className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-2xl max-w-xl mx-auto text-gray-700 border border-white/40"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-700">
                <Info /> About this Project
              </h2>
              <p>
                ⚡ <b>Regex Tester</b> built with{" "}
                <span className="text-purple-600 font-medium">Flask</span> (API) +
                <span className="text-blue-600 font-medium"> React</span> (UI)
              </p>
              <p className="mt-2">
                ✨ Features: Live highlighting, regex history, copy actions,
                smooth animations, and modern glassmorphism UI with animated
                gradient backgrounds 
              </p>
              <p className="mt-2 leading-relaxed">
                👨‍💻 Developed by: <b>Veeraragavendhiran S</b> <br />
                📞 Contact: <span className="text-purple-600">+91 8122738582</span> <br />
                📧 Email:{" "}
                <span className="text-purple-600">
                  veeraragavendhiran12@gmail.com
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
