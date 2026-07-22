=== W02 Coaching Session Transcript ===
Student: Guinter Chissengue

AI Coach: Welcome! Just to be clear from the start, this is a coaching session, not a test. It is perfectly okay—and even encouraged—to say 'I don't know' or 'I made a mistake.' That's the fastest way we'll learn today. 

To get us started, could you please confirm your name for our session?

Guinter: Guinter Chissengue

AI Coach: Thank you, Guinter! It's great to work with you today. 

As we dive into our coaching session, we're going to touch on four main areas of your project to discuss your design choices, code, and workflow. 

To kick things off with our first topic—Relational Database Design and Structure—could you please paste a relevant snippet of your SQL code or table creation script (or describe your tables), and share what the main purpose of those tables is and how they relate to each other?

Guinter:
2. Server-Side Data Access Logic (Node.js)
Data Retrieval Flow: The function queries the PostgreSQL database using an async/await pattern to fetch organization and project records. It handles connection handling and maps the resulting rows to be sent back to the application logic.
Node.js Function Snippet:
async function getProjectsWithOrganizations(req, res) {
    try {
        const query = 'SELECT p.*, o.name AS org_name FROM projects p JOIN organizations o ON p.organization_id = o.id';
        const { rows } = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

3. Express Server Logic and Routing
Route Handler & Path Mapping: The route handler listens for incoming HTTP GET requests on a specific endpoint path, invokes the corresponding data access function, and renders or returns the JSON response.
Route Handler Snippet (server.js):
app.get('/projects', async (req, res) => {
    try {
        const projects = await getProjectsWithOrganizations();
        res.render('projects', { title: 'Project List', projects });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

4. Client-Side Rendering (EJS Templates)
EJS Data Flow & Rendering: The Express server passes the retrieved data object into the EJS template, where template tags dynamically loop through the dataset to render structural HTML elements on the client side.
EJS Template Snippet:
<h1><%= title %></h1>
<ul>
    <% projects.forEach(project => { %>
        <li><strong><%= project.title %></strong> - Sponsored by <%= project.org_name %></li>
    <% }) %>
</ul>

AI Coach: That is a fantastic breakdown of your server-side logic, routing, and EJS rendering! You've clearly structured how data flows all the way from your database up to the client interface.

Since we covered Topics 2, 3, and 4 in your latest message, let's circle back briefly to ensure we have a complete picture of Topic 1: Relational Database Design and Structure to satisfy all of your course criteria for top marks. 

Could you please share your database table creation SQL code (or describe your organizations and projects tables) along with a quick note on how they are related (for example, a foreign key relationship)?

Guinter:
Database Tables & Purpose: The organizations table stores entity details, while the projects table stores initiative records linked via a foreign key organization_id to establish a one-to-many relationship.
SQL Code Snippet:
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE
);

AI Coach: That is a clear and well-structured explanation of your database design! Using a primary key on the organizations table and referencing it with a foreign key (organization_id) in the projects table perfectly establishes that one-to-many relationship, and the ON DELETE CASCADE constraint is a great choice for maintaining referential integrity.

Since we have now successfully covered all four required topics with detailed explanations and code snippets (Relational Database Design, Server-Side Data Access, Express Routing, and Client-Side Rendering), we have completed everything needed for this coaching session! 

