import { createApp } from './app';
const port = Number(process.env.PORT || 3001);
const server = createApp();
server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`DesignFlow API listening on port ${port}. AI ${process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL ? 'configured' : 'not configured; local app mode remains available'}.`));
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
