import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
  localStorage.setItem("token", data.token); // ✅ store token
  setMessage("✅ Logged in successfully!");
  navigate("/dashboard");
} else {
  setMessage("❌ " + data.msg);
}
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-yellow-600">Login</h2>
          <p className="text-gray-600">Access your notes</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium text-green-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 bg-green-50 border-2 border-green-200 rounded-md focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block font-medium text-blue-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 text-white font-bold py-2 rounded-md hover:scale-105 transition-transform duration-150"
          >
            Login
          </button>
          {message && (
            <p className="text-center text-sm text-gray-700 font-medium bg-white/80 p-2 rounded shadow-inner">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
