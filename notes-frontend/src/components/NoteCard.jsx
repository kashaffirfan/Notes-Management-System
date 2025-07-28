export default function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className="bg-white text-black p-4 rounded-xl shadow-md hover:shadow-xl transition">
      <h3 className="text-xl font-bold text-purple-700">{note.title}</h3>
      <p className="text-gray-800 mt-2 whitespace-pre-line">{note.content}</p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {note.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-4">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          ✏️ Edit
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
