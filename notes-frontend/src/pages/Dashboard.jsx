import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteCard from "../components/NoteCard";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch notes
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/notes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) setNotes(data.notes);
      else console.error("Failed to fetch notes:", data.msg);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (note) => {
    setForm({
      title: note.title,
      content: note.content,
      tags: note.tags.join(", "),
    });
    setEditId(note._id);
    setMessage("Editing note...");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(editId ? "Updating note..." : "Adding note...");

    const url = editId
      ? `http://localhost:5000/api/notes/${editId}`
      : "http://localhost:5000/api/notes/create";

    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(",").map((tag) => tag.trim()),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Backend error:", data);
        return setMessage("❌ " + data.msg);
      }

      setMessage(editId ? "✅ Note updated!" : "✅ Note added!");
      setForm({ title: "", content: "", tags: "" });
      setEditId(null);
      fetchNotes();
    } catch (err) {
      console.error("❌ Network error:", err);
      setMessage("❌ Network error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) return setMessage("❌ " + data.msg);

      setMessage("🗑️ Note deleted");
      setTimeout(() => setMessage(""), 3000);
      fetchNotes();
    } catch (err) {
      console.error("Delete error:", err);
      setMessage("❌ Network error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-green-50 to-blue-50 p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/90 backdrop-blur-md z-10 py-3 px-4 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-yellow-600">📚 Your Notes</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-4 rounded"
        >
          🚪 Logout
        </button>
      </div>

      {/* Note Form */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 max-w-xl mx-auto mb-10">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          {editId ? "✏️ Edit Note" : "➕ Add Note"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="w-full p-3 border border-yellow-300 rounded-md shadow-sm focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your note here..."
            required
            rows="4"
            className="w-full p-3 border border-green-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-400"
          ></textarea>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma-separated)"
            className="w-full p-3 border border-blue-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className={`w-full ${
              editId
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            } text-white font-bold py-2 rounded-md shadow-md transition-transform hover:scale-[1.02]`}
          >
            {editId ? "Update Note" : "Add Note"}
          </button>
          {message && (
            <p className="text-sm text-center text-gray-700 mt-2">{message}</p>
          )}
        </form>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <p className="text-center text-gray-600">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="text-center text-gray-500">No notes yet. Start writing!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={handleEdit}
              onDelete={() => handleDelete(note._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
