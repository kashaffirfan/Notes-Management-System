const Note = require("../models/Note");

// ✅ Create a new note
exports.createNote = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error("Missing req.user.id");
      return res.status(401).json({ msg: "Unauthorized - Missing user ID" });
    }

    const { title, content, tags } = req.body;

    const newNote = new Note({
      title,
      content,
      tags,
      user: req.user.id,
    });

    await newNote.save();
    res.status(201).json({ msg: "Note created successfully", note: newNote });
  } catch (err) {
    console.error("Create Note Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};




exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const notes = await Note.find({ user: userId }); // ✅ only notes of logged-in user
    res.json({ notes });
  } catch (err) {
    console.error("Get Notes Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Update note
// ✅ Update Note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      { _id: id, user: req.user.id }, // Only update user's own note
      { title, content, tags },
      { new: true }
    );

    if (!updatedNote) return res.status(404).json({ msg: "Note not found" });

    res.status(200).json({ msg: "Note updated", note: updatedNote });
  } catch (err) {
    console.error("Update note error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};


// ✅ Delete note
// ✅ Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Note.findOneAndDelete({ _id: id, user: req.user.id });

    if (!deleted) return res.status(404).json({ msg: "Note not found" });

    res.status(200).json({ msg: "Note deleted" });
  } catch (err) {
    console.error("Delete note error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

