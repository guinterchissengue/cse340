// src/routes/index.js
import { Router } from 'express';
import organizationController from '../controllers/organizationController.js';
import projectController from '../controllers/projectController.js';
import categoryController from '../controllers/categoryController.js';

const router = Router();

// ==========================================
// Home Route
// ==========================================
router.get('/', async (req, res) => {
    res.render('index', { title: 'Home' });
});

// ==========================================
// Organization Routes
// ==========================================
router.get('/organizations', organizationController.getOrganizations);
router.get('/organization/:id', organizationController.getOrganizationDetails);

// ==========================================
// Service Project Routes
// ==========================================
router.get('/projects', projectController.getProjects);
router.get('/project/:id', projectController.getProjectDetails);

// ==========================================
// Category Routes
// ==========================================
router.get('/categories', categoryController.getCategories);
router.get('/category/:id', categoryController.getCategoryDetails);

export default router;
