// src/routes/index.js
import { Router } from 'express';
import homeController from '../controllers/homeController.js';
import organizationController from '../controllers/organizationController.js';
import projectController from '../controllers/projectController.js';
import categoryController from '../controllers/categoryController.js';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';
import { requireLogin, requireRole } from '../middleware/auth.js';

const router = Router();

// ==========================================
// Home Route
// ==========================================
router.get('/', homeController.getHome);

// ==========================================
// Auth Routes (register / login / logout / dashboard)
// ==========================================
router.get('/register', authController.getRegisterForm);
router.post('/register', authController.postRegister);
router.get('/login', authController.getLoginForm);
router.post('/login', authController.postLogin);
router.get('/logout', authController.getLogout);
router.get('/dashboard', requireLogin, authController.getDashboard);

// ==========================================
// Users Route (admin only)
// ==========================================
router.get('/users', requireLogin, requireRole('admin'), userController.getUsers);

// ==========================================
// Organization Routes
// (list/detail pages stay public; create & edit require an admin)
// ==========================================
router.get('/organizations', organizationController.getOrganizations);
router.get('/organization/:id', organizationController.getOrganizationDetails);
router.get('/new-organization', requireLogin, requireRole('admin'), organizationController.getNewOrganizationForm);
router.post('/new-organization', requireLogin, requireRole('admin'), organizationController.postNewOrganization);
router.get('/edit-organization/:id', requireLogin, requireRole('admin'), organizationController.getEditOrganizationForm);
router.post('/edit-organization/:id', requireLogin, requireRole('admin'), organizationController.postEditOrganization);

// ==========================================
// Service Project Routes
// (list/detail pages stay public; create & edit require an admin)
// ==========================================
router.get('/projects', projectController.getProjects);
router.get('/project/:id', projectController.getProjectDetails);
router.get('/new-project', requireLogin, requireRole('admin'), projectController.getNewProjectForm);
router.post('/new-project', requireLogin, requireRole('admin'), projectController.postNewProject);
router.get('/edit-project/:id', requireLogin, requireRole('admin'), projectController.getEditProjectForm);
router.post('/edit-project/:id', requireLogin, requireRole('admin'), projectController.postEditProject);
router.get('/project/:id/categories', requireLogin, requireRole('admin'), projectController.getAssignCategoriesForm);
router.post('/project/:id/categories', requireLogin, requireRole('admin'), projectController.postAssignCategories);

// ==========================================
// Category Routes
// (list/detail pages stay public; create & edit require an admin)
// ==========================================
router.get('/categories', categoryController.getCategories);
router.get('/category/:id', categoryController.getCategoryDetails);
router.get('/new-category', requireLogin, requireRole('admin'), categoryController.getNewCategoryForm);
router.post('/new-category', requireLogin, requireRole('admin'), categoryController.postNewCategory);
router.get('/edit-category/:id', requireLogin, requireRole('admin'), categoryController.getEditCategoryForm);
router.post('/edit-category/:id', requireLogin, requireRole('admin'), categoryController.postEditCategory);

export default router;
