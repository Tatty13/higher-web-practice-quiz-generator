import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: './',
  server: {
    port: 4000,
    open: true,
  },
  build: {
    outDir: '../dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'src/index.html',
        quizzes: 'src/quizzes.html',
        quiz: 'src/quiz.html',
      },
    },
  },
  optimizeDeps: {
    include: ['idb', 'nanoid', 'zod'],
  },
});
