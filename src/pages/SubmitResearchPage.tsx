import React, { useState } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { OFFICIAL_KIU_DEPARTMENTS, OFFICIAL_KIU_FACULTIES } from '../data/kiuData';
import { useAuth } from '../context/AuthContext';
import { ResearchType } from '../types';

interface SubmitResearchPageProps {
  onSuccess: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const SubmitResearchPage: React.FC<SubmitResearchPageProps> = ({
  onSuccess,
  onNavigate,
}) => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResearchType>('FYP');
  const [departmentId, setDepartmentId] = useState('dept-cs');
  const [facultyId, setFacultyId] = useState('fac-nat-sci');
  const [authors, setAuthors] = useState(user.name);
  const [studentId, setStudentId] = useState(user.studentId || '');
  const [supervisor, setSupervisor] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [researchArea, setResearchArea] = useState('Computer Science');
  const [technologies, setTechnologies] = useState('Python, PyTorch');
  const [datasetName, setDatasetName] = useState('');
  const [datasetDescription, setDatasetDescription] = useState('');
  const [methodology, setMethodology] = useState('');
  const [resultsSummary, setResultsSummary] = useState('');
  const [limitations, setLimitations] = useState('');
  const [futureWork, setFutureWork] = useState('');

  // File upload state
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [pdfFileSize, setPdfFileSize] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submittedItem, setSubmittedItem] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setError('Only PDF documents are allowed for repository submission.');
        return;
      }
      setError(null);
      setPdfFileName(file.name);
      setPdfFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !abstract.trim()) {
      setError('Please provide a research title and abstract.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const res = await api.submitResearch({
        title,
        type,
        abstract,
        authors: authors.split(',').map((a) => a.trim()).filter(Boolean),
        departmentId,
        facultyId,
        supervisorName: supervisor.trim() || undefined,
        year: parseInt(year, 10),
        keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean),
        researchArea,
        technologies: technologies.split(',').map((t) => t.trim()).filter(Boolean),
        datasetName: datasetName.trim() || undefined,
        datasetDescription: datasetDescription.trim() || undefined,
        methodology: methodology || 'Experimental design and computational evaluation.',
        resultsSummary: resultsSummary || 'Initial evaluation completed.',
        limitations: limitations || 'To be expanded upon peer review.',
        futureWork: futureWork || 'Further field experiments.',
        sourceType: user.role === 'faculty' ? 'Faculty Submitted' : 'Student Submitted',
        submittedBy: user.id,
      });

      setSubmittedItem(res);
    } catch (err: any) {
      setError(err.message || 'Submission failed. Please check form inputs.');
    } finally {
      setUploading(false);
    }
  };

  if (submittedItem) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
          Research Submission Received!
        </h2>
        <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 text-left text-xs space-y-2">
          <div>
            <strong className="text-stone-700 dark:text-stone-300">Title:</strong>{' '}
            <span className="text-stone-900 dark:text-white font-medium">{submittedItem.title}</span>
          </div>
          <div>
            <strong className="text-stone-700 dark:text-stone-300">Reference ID:</strong>{' '}
            <span className="font-mono text-emerald-800 dark:text-emerald-400">{submittedItem.id}</span>
          </div>
          <div>
            <strong className="text-stone-700 dark:text-stone-300">Verification Status:</strong>{' '}
            <span className="text-amber-600 font-semibold">Pending Verification</span>
          </div>
        </div>
        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-md mx-auto">
          Your document has entered the academic verification queue. An authorized KIU faculty supervisor or repository administrator will audit the manuscript prior to public indexing.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={() => onSuccess(submittedItem.id)}
            className="px-4 py-2 bg-emerald-800 text-white rounded text-xs font-semibold hover:bg-emerald-700"
          >
            View Repository Record
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded text-xs font-medium"
          >
            Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
          Document Ingestion Portal
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
          Submit Research or Final Year Project
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Upload capstone FYPs, graduate theses, or conference manuscripts to the Karakoram International University repository.
        </p>
      </div>

      {/* Verification Notice Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong>Mandatory Verification Policy:</strong> All user-submitted projects enter the system with the status <em>"Pending Verification"</em>. Submissions are rigorously reviewed by KIU departmental supervisors and administrators before being certified. Never upload confidential or proprietary data.
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg text-xs text-rose-800 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 text-xs">
        {/* Core Metadata */}
        <div className="space-y-4">
          <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-2">
            01. Research Identity & Metadata
          </h3>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. IoT Sensor Networks for Rockfall Detection along the Karakoram Highway"
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Research Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ResearchType)}
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              >
                <option value="FYP">Final Year Project (FYP)</option>
                <option value="Thesis">Master's / PhD Thesis</option>
                <option value="Research Paper">Journal Research Paper</option>
                <option value="Publication">Official Publication</option>
                <option value="Project">Funded R&D Project</option>
                <option value="Conference Paper">Conference Paper</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Academic Faculty *
              </label>
              <select
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              >
                {OFFICIAL_KIU_FACULTIES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name.replace('Faculty of ', '')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Department *
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              >
                {OFFICIAL_KIU_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Authors (Student / Researchers) *
              </label>
              <input
                type="text"
                required
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="Comma-separated student names"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                KIU Student Registration ID (Optional)
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. KIU-2022-BSCS-042"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Faculty Supervisor
              </label>
              <input
                type="text"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                placeholder="e.g. Dr. Zafar Iqbal"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Abstract and Technical Details */}
        <div className="space-y-4">
          <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-2">
            02. Abstract & Methodological Specification
          </h3>

          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Structured Abstract *
            </label>
            <textarea
              required
              rows={4}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="State the regional problem, objectives, proposed methodology, and key quantitative findings..."
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Keywords
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. InSAR, GLOF, Early Warning, Karakoram"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Technologies & Tools
              </label>
              <input
                type="text"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="e.g. PyTorch, OpenCV, QGIS, FastAPI"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Methodology & System Architecture
              </label>
              <textarea
                rows={2}
                value={methodology}
                onChange={(e) => setMethodology(e.target.value)}
                placeholder="Explain the experimental protocol, hardware setup, or neural network topology..."
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Quantitative Results & Findings
              </label>
              <textarea
                rows={2}
                value={resultsSummary}
                onChange={(e) => setResultsSummary(e.target.value)}
                placeholder="Key empirical metrics, validation accuracy, F1 score, or field test outcomes..."
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Dataset Name & Origin
              </label>
              <input
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="e.g. Gilgit Orchard Pathology Dataset (2025)"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Known Limitations
              </label>
              <input
                type="text"
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
                placeholder="e.g. Sunlight glare sensitivity, small sample size"
                className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md focus:outline-none text-stone-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* PDF Document Upload Dropzone */}
        <div className="space-y-2">
          <h3 className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 border-b border-stone-100 dark:border-stone-800 pb-2">
            03. Manuscript Document (PDF Only)
          </h3>

          <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-lg p-6 text-center hover:border-emerald-700 transition-colors bg-stone-50/50 dark:bg-stone-950/40">
            <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              {pdfFileName ? (
                <span className="text-emerald-800 dark:text-emerald-400 font-mono">
                  {pdfFileName} ({pdfFileSize})
                </span>
              ) : (
                <span>Upload Final Thesis / Project PDF</span>
              )}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              PDF files up to 25MB. Must include title page, supervisor signature sheet, and references.
            </p>
            <label className="mt-3 inline-block px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded cursor-pointer text-xs font-medium">
              Browse Document
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Ingesting Document & Generating Verification Ticket...</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span>Submit for Verification</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
