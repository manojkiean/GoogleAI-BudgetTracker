import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import express from 'express';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    const saveDataMiddleware = express();
    saveDataMiddleware.use(express.json());
    saveDataMiddleware.post('/api/save-data', (req, res) => {
        fs.writeFile(path.resolve(__dirname, 'mock-data.json'), JSON.stringify(req.body, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Error saving data');
            }
            res.status(200).send('Data saved successfully');
        });
    });

    return {
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        plugins: [
            react(),
            {
                name: 'express-middleware',
                configureServer(server) {
                    server.middlewares.use(saveDataMiddleware);
                }
            }
        ],
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
});
