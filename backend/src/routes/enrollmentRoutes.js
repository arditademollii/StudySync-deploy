const express    = require('express');
const router     = express.Router();
const multer     = require('multer');

const controller                        = require('../controllers/enrollmentController');
const enrollmentExportImportController  = require('../controllers/enrollmentExportImportController');
const { authenticate, authorize }       = require('../middlewares/authMiddleware');

const importStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/imports'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const uploadImport = multer({ storage: importStorage });

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollment endpoints
 */

// ── Export ────────────────────────────────────────────────────
/**
 * @swagger
 * /api/enrollments/export:
 *   get:
 *     summary: Export enrollments (csv, excel, json)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema: { type: string, enum: [csv, excel, json] }
 *     responses:
 *       200:
 *         description: File download
 */
router.get(
  '/export',
  authenticate,
  authorize('admin'),
  enrollmentExportImportController.exportEnrollments
);

// ── Import ────────────────────────────────────────────────────
/**
 * @swagger
 * /api/enrollments/import:
 *   post:
 *     summary: Import enrollments from CSV or Excel
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Import result summary
 */
router.post(
  '/import',
  authenticate,
  authorize('admin'),
  uploadImport.single('file'),
  enrollmentExportImportController.importEnrollments
);

// ── Existing ──────────────────────────────────────────────────
router.post('/:courseId', authenticate, authorize('student'), controller.enroll);
router.get('/me',         authenticate, controller.getMyEnrollments);
router.get('/check/:courseId', authenticate, controller.checkEnrollment);

module.exports = router;
