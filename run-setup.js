import fs from 'fs';
import path from 'path';
import pool from './src/database/connection.js';

async function runSetup() {
    try {
        console.log('A ligar à base de dados do Render e a executar o setup...');
        
        // Caminho apontando corretamente para dentro de src/routes
        const sqlPath = path.resolve('src/routes/setup.sql'); 
        const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

        await pool.query(sqlQuery);
        console.log('✅ Tabelas criadas e populadas com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao executar o setup:', error);
        process.exit(1);
    }
}

runSetup();