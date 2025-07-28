const express = require('express');
const router = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

const authMiddleware = require('../middleware/authMiddleware'); // ✅ Use correct path (no typo)

// ✅ Apply authMiddleware to all routes
router.use(authMiddleware);

// Routes
router.get('/', getNotes);
router.post('/create', createNote);
router.put('/:id', updateNote);
router.delete("/:id", deleteNote);


module.exports = router;
