// src/routes/index.js
import { Router } from 'express';
import organizationModel from '../models/organizations.js';
import projectModel from '../models/projects.js';
import categoryModel from '../models/categories.js';

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
router.get('/organizations', async (req, res) => {
    try {
        const organizationsList = await organizationModel.getAllOrganizations();
        res.render('organizations', {
            title: 'Organizations',
            organizations: organizationsList
        });
    } catch (error) {
        console.error('Route Error on GET /organizations:', error);
        res.status(500).send('Something went wrong while fetching organizations. Please check server logs.');
    }
});

// ==========================================
// Service Project Routes
// ==========================================
router.get('/projects', async (req, res) => {
    try {
        const projectsList = await projectModel.getAllProjects();
        res.render('projects', {
            title: 'Service Projects',
            projects: projectsList
        });
    } catch (error) {
        console.error('Route Error on GET /projects:', error);
        res.status(500).send('Something went wrong while fetching projects. Please check server logs.');
    }
});

// ==========================================
// Category Routes
// ==========================================
router.get('/categories', async (req, res) => {
    try {
        const categoriesList = await categoryModel.getAllCategories();
        res.render('categories', {
            title: 'Project Categories',
            categories: categoriesList
        });
    } catch (error) {
        console.error('Route Error on GET /categories:', error);
        res.status(500).send('Something went wrong while fetching categories. Please check server logs.');
    }
});

export default router;
