import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './src/server/db';
import { askResearchRag, summarizeResearch, recommendFypTopics } from './src/server/gemini';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;


app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'KIU ResearchHub',
    institution: 'Karakoram International University (KIU), Gilgit-Baltistan',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/departments
app.get('/api/departments', (req: Request, res: Response) => {
  const facultyId = req.query.facultyId as string | undefined;
  const departments = db.getDepartments(facultyId);
  res.json({ success: true, data: departments });
});

// GET /api/faculties
app.get('/api/faculties', (_req: Request, res: Response) => {
  const faculties = db.getFaculties();
  res.json({ success: true, data: faculties });
});

// GET /api/researchers
app.get('/api/researchers', (req: Request, res: Response) => {
  const departmentId = req.query.departmentId as string | undefined;
  const researchers = db.getResearchers(departmentId);
  res.json({ success: true, data: researchers });
});

// GET /api/analytics
app.get('/api/analytics', (_req: Request, res: Response) => {
  const analytics = db.getAnalytics();
  res.json({ success: true, data: analytics });
});

// GET /api/audit-logs
app.get('/api/audit-logs', (_req: Request, res: Response) => {
  const logs = db.getAuditLogs();
  res.json({ success: true, data: logs });
});

// GET /api/research
app.get('/api/research', (req: Request, res: Response) => {
  const {
    type,
    departmentId,
    facultyId,
    year,
    search,
    topic,
    status,
    isFeatured,
    sort,
    limit,
    offset,
  } = req.query;

  const result = db.getAllResearch({
    type: type as string,
    departmentId: departmentId as string,
    facultyId: facultyId as string,
    year: year ? parseInt(year as string, 10) : undefined,
    search: search as string,
    topic: topic as string,
    status: status as string,
    isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
    sort: sort as 'recent' | 'views' | 'citations' | 'year',
    limit: limit ? parseInt(limit as string, 10) : 50,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });

  res.json({ success: true, ...result });
});

// GET /api/research/:id
app.get('/api/research/:id', (req: Request, res: Response) => {
  const item = db.getResearchById(req.params.id);
  if (!item) {
    res.status(404).json({ success: false, error: 'Research record not found in repository.' });
    return;
  }
  res.json({ success: true, data: item });
});

// POST /api/research (Upload / Submission)
app.post('/api/research', (req: Request, res: Response) => {
  try {
    const {
      title,
      type,
      abstract,
      authors,
      departmentId,
      facultyId,
      supervisorName,
      year,
      keywords,
      researchArea,
      methodology,
      technologies,
      datasetName,
      datasetDescription,
      resultsSummary,
      limitations,
      futureWork,
      documentUrl,
      sourceUrl,
      sourceType,
      submittedBy,
      fullDocumentChunks,
    } = req.body;

    if (!title || !abstract || !departmentId || !type) {
      res.status(400).json({
        success: false,
        error: 'Missing required research fields: title, abstract, department, and research type.',
      });
      return;
    }

    const dept = db.getDepartments().find((d) => d.id === departmentId);
    const departmentName = dept ? dept.name : 'Computer Science';
    const faculty = db.getFaculties().find((f) => f.id === facultyId);
    const facultyName = faculty ? faculty.name : dept?.facultyName || 'Faculty of Natural Sciences and Technology';

    const newItem = db.createResearch({
      title,
      type: type || 'FYP',
      abstract,
      authors: Array.isArray(authors) && authors.length > 0 ? authors : ['Student Researcher'],
      departmentId,
      departmentName,
      facultyId: facultyId || dept?.facultyId || 'fac-nat-sci',
      facultyName,
      supervisorName: supervisorName || undefined,
      year: year ? parseInt(year, 10) : new Date().getFullYear(),
      keywords: Array.isArray(keywords) ? keywords : [researchArea || 'Research'],
      researchArea: researchArea || 'General Computing & Applied Science',
      methodology: methodology || 'Experimental prototyping and quantitative performance testing.',
      technologies: Array.isArray(technologies) ? technologies : ['Python'],
      datasetName,
      datasetDescription,
      resultsSummary: resultsSummary || 'Evaluation underway in verification pipeline.',
      limitations: limitations || 'Initial prototype evaluation.',
      futureWork: futureWork || 'Field validation and repository archiving.',
      documentUrl,
      sourceUrl: sourceUrl || 'https://www.kiu.edu.pk/departments',
      sourceType: sourceType || 'Student Submitted',
      submittedBy: submittedBy || 'usr-anonymous',
      fullDocumentChunks: Array.isArray(fullDocumentChunks) ? fullDocumentChunks : [],
    });

    res.status(201).json({
      success: true,
      message: 'Research successfully uploaded and submitted for academic verification.',
      data: newItem,
    });
  } catch (error) {
    console.error('Error creating research:', error);
    res.status(500).json({ success: false, error: 'Internal server error while processing submission.' });
  }
});

// PUT /api/research/:id/status (Admin approval / rejection)
app.put('/api/research/:id/status', (req: Request, res: Response) => {
  const { status, adminName, rejectionReason } = req.body;
  if (!status) {
    res.status(400).json({ success: false, error: 'Target verification status required.' });
    return;
  }

  const updated = db.updateResearchStatus(
    req.params.id,
    status,
    adminName || 'KIU ASR Administrator',
    rejectionReason
  );

  if (!updated) {
    res.status(404).json({ success: false, error: 'Research record not found.' });
    return;
  }

  res.json({ success: true, data: updated });
});

// POST /api/research/:id/feature
app.post('/api/research/:id/feature', (req: Request, res: Response) => {
  const updated = db.toggleFeature(req.params.id);
  if (!updated) {
    res.status(404).json({ success: false, error: 'Research record not found.' });
    return;
  }
  res.json({ success: true, data: updated });
});

// POST /api/research/:id/view
app.post('/api/research/:id/view', (req: Request, res: Response) => {
  db.incrementViews(req.params.id);
  res.json({ success: true });
});

// POST /api/research/:id/download
app.post('/api/research/:id/download', (req: Request, res: Response) => {
  db.incrementDownloads(req.params.id);
  res.json({ success: true });
});

// GET /api/research/:id/similar
app.get('/api/research/:id/similar', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 4;
  const similar = db.getSimilarResearch(req.params.id, limit);
  res.json({ success: true, data: similar });
});

// POST /api/semantic-search
app.post('/api/semantic-search', (req: Request, res: Response) => {
  const { query, departmentId, type } = req.body;
  if (!query || typeof query !== 'string') {
    res.status(400).json({ success: false, error: 'Query string required.' });
    return;
  }

  const results = db.getAllResearch({
    search: query,
    departmentId: departmentId && departmentId !== 'all' ? departmentId : undefined,
    type: type && type !== 'all' ? type : undefined,
  });

  res.json({ success: true, query, results: results.items, total: results.total });
});

// POST /api/ai/ask (RAG document Q&A)
app.post('/api/ai/ask', async (req: Request, res: Response) => {
  try {
    const { question, researchId, departmentId } = req.body;
    if (!question || typeof question !== 'string') {
      res.status(400).json({ success: false, error: 'Question is required.' });
      return;
    }

    const result = await askResearchRag({
      question,
      researchId,
      departmentId,
    });

    res.json({
      success: true,
      answer: result.answer,
      citations: result.citations,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('AI ask route error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process AI question.',
      fallbackAnswer: "I couldn't find reliable information about this in the available KIU research sources.",
    });
  }
});

// POST /api/ai/summarize
app.post('/api/ai/summarize', async (req: Request, res: Response) => {
  try {
    const { researchId } = req.body;
    const item = db.getResearchById(researchId);
    if (!item) {
      res.status(404).json({ success: false, error: 'Research record not found.' });
      return;
    }

    const summary = await summarizeResearch(item);
    res.json({ success: true, summary, researchTitle: item.title });
  } catch (err) {
    console.error('AI summarize route error:', err);
    res.status(500).json({ success: false, error: 'Summarization failed.' });
  }
});

// POST /api/fyp/recommend
app.post('/api/fyp/recommend', async (req: Request, res: Response) => {
  try {
    const {
      department,
      skills,
      researchInterests,
      preferredTechnology,
      difficulty,
      problemArea,
    } = req.body;

    const recommendations = await recommendFypTopics({
      department: department || 'Department of Computer Science',
      skills: Array.isArray(skills) ? skills : ['Python', 'Web Development'],
      researchInterests: Array.isArray(researchInterests) ? researchInterests : ['Machine Learning'],
      preferredTechnology: preferredTechnology || 'Python',
      difficulty: difficulty || 'Intermediate',
      problemArea: problemArea || 'Agricultural Diagnostics or Environmental Monitoring',
    });

    res.json({ success: true, recommendations });
  } catch (err) {
    console.error('FYP recommend route error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate FYP recommendations.' });
  }
});

// Setup Vite in Dev or Static in Production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distDir = path.resolve(__dirname, 'dist');

  if (isProd && fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KIU ResearchHub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
