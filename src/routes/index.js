// ==========================================
// Imports & Configurations
// ==========================================
// Import our newly created category model
const categoryModel = require('./src/models/categories'); 

// ... (your existing Express setup and routes) ...

// ==========================================
// Category Routes (W02 Assignment)
// ==========================================
app.get('/categories', async (req, res) => {
    try {
        // 1. Fetch categories asynchronously from the database
        const categoriesList = await categoryModel.getAllCategories();
        
        // 2. Render the template and pass down the database records
        res.render('categories', { 
            title: 'Project Categories',
            categories: categoriesList 
        });
    } catch (error) {
        // If something blows up, log it and send a clean 500 error page
        console.error('Route Error on GET /categories:', error);
        res.status(500).send('Something went wrong while fetching categories. Please check server logs.');
    }
});