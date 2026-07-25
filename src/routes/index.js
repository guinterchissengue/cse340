// src/routes/index.js
import { Router } from 'express';
import homeController from '../controllers/homeController.js';
import organizationController from '../controllers/organizationController.js';
import projectController from '../controllers/projectController.js';
import categoryController from '../controllers/categoryController.js';

const router = Router();

// ==========================================
// Home Route
// ==========================================
router.get('/', homeController.getHome);

// ==========================================
// Organization Routes
// ==========================================
router.get('/organizations', organizationController.getOrganizations);
router.get('/organization/:id', organizationController.getOrganizationDetails);
router.get('/new-organization', organizationController.getNewOrganizationForm);
router.post('/new-organization', organizationController.postNewOrganization);
router.get('/edit-organization/:id', organizationController.getEditOrganizationForm);
router.post('/edit-organization/:id', organizationController.postEditOrganization);

// ==========================================
// Service Project Routes
// ==========================================
router.get('/projects', projectController.getProjects);
router.get('/project/:id', projectController.getProjectDetails);
router.get('/new-project', projectController.getNewProjectForm);
router.post('/new-project', projectController.postNewProject);
router.get('/edit-project/:id', projectController.getEditProjectForm);
router.post('/edit-project/:id', projectController.postEditProject);
router.get('/project/:id/categories', projectController.getAssignCategoriesForm);
router.post('/project/:id/categories', projectController.postAssignCategories);

// ==========================================
// Category Routes
// ==========================================
router.get('/categories', categoryController.getCategories);
router.get('/category/:id', categoryController.getCategoryDetails);
router.get('/new-category', categoryController.getNewCategoryForm);
router.post('/new-category', categoryController.postNewCategory);
router.get('/edit-category/:id', categoryController.getEditCategoryForm);
router.post('/edit-category/:id', categoryController.postEditCategory);

export default router;
