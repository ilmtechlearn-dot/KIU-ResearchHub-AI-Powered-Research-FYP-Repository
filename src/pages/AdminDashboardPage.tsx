import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Star,
  Clock,
  AlertCircle,
  FileText,
  Search,
  Building,
  Users,
  Eye,
  Sparkles,
} from 'lucide-react';
import { ResearchItem, AuditLog, Department } from '../types';
import { api } from '../services/api';

interface AdminDashboardPageProps {
  onViewResearch: (id: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onViewResearch,
}) => {
  const [researchList, setResearchList] = useState<ResearchItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [res, logs, stats] = await Promise.all([
        api.getResearch({ limit: 100 }),
        api.getAuditLogs(),
        api.getAnalytics(),
      ]);
      setResearchList(res.items);
      setAuditLogs(logs);
      setAnalytics(stats);
    } catch (err) {
      console.error('Error loading admin panel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.updateResearchStatus(id, 'Verified Research', 'KIU ASR Administrator');
      setActionSuccess('Research successfully verified and published to repository.');
      setTimeout(() => setActionSuccess(null), 3000);
      loadData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleMarkOfficial = async (id: string) => {
    try {
      await api.updateResearchStatus(id, 'Official KIU Source', 'KIU ASR Administrator');
      setActionSuccess('Research marked as official university source document.');
      setTimeout(() => setActionSuccess(null), 3000);
      loadData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectingId) return;
    try {
      await api.updateResearchStatus(
        rejectingId,
        'Rejected',
        'KIU ASR Administrator',
        rejectReason || 'Does not meet academic rigor guidelines.'
      );
      setRejectingId(null);
      setRejectReason('');
      setActionSuccess('Submission rejected with academic revision notes.');
      setTimeout(() => setActionSuccess(null), 3000);
      loadData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleToggleFeature = async (id: string) => {
    try {
      await api.toggleFeatureResearch(id);
      loadData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const pendingItems = researchList.filter(
    (r) => r.verificationStatus === 'Pending Verification'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>KIU Directorate of Advanced Studies & Research (ASR)</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            Repository Administration & Verification Queue
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Audit incoming research submissions, approve student capstones, manage official badges, and inspect system audit logs.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded text-xs text-emerald-900 dark:text-emerald-300 font-medium">
          {actionSuccess}
        </div>
      )}

      {/* Admin Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-stone-400 font-semibold uppercase">Pending Verification</div>
          <div className="text-2xl font-serif font-bold text-amber-600 mt-1">
            {pendingItems.length}
          </div>
          <div className="text-[11px] text-stone-500">Awaiting supervisor audit</div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-stone-400 font-semibold uppercase">Total Repository Items</div>
          <div className="text-2xl font-serif font-bold text-stone-900 dark:text-white mt-1">
            {analytics.totalResearch || researchList.length}
          </div>
          <div className="text-[11px] text-stone-500">Live indexed documents</div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-stone-400 font-semibold uppercase">Departments Active</div>
          <div className="text-2xl font-serif font-bold text-emerald-800 dark:text-emerald-400 mt-1">
            {analytics.totalDepartments || 28}
          </div>
          <div className="text-[11px] text-stone-500">Undergraduate & Graduate</div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="text-stone-400 font-semibold uppercase">Audit Log Events</div>
          <div className="text-2xl font-serif font-bold text-stone-700 dark:text-stone-300 mt-1">
            {auditLogs.length}
          </div>
          <div className="text-[11px] text-stone-500">Immutable governance trail</div>
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              Pending Submissions Queue ({pendingItems.length})
            </h2>
          </div>
        </div>

        {pendingItems.length === 0 ? (
          <div className="p-8 bg-stone-50 dark:bg-stone-900/40 rounded-lg border border-dashed border-stone-300 dark:border-stone-800 text-center text-xs text-stone-500">
            <CheckCircle2 className="w-6 h-6 text-emerald-700 mx-auto mb-2" />
            All submissions are currently processed and verified. Zero pending backlog.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="p-3 font-semibold">Title & Department</th>
                  <th className="p-3 font-semibold">Author / Year</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Source</th>
                  <th className="p-3 font-semibold text-right">Verification Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {pendingItems.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 max-w-sm">
                      <div
                        onClick={() => onViewResearch(item.id)}
                        className="font-semibold text-stone-900 dark:text-stone-100 hover:text-emerald-800 cursor-pointer truncate"
                      >
                        {item.title}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">
                        {item.departmentName}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>{item.authors.join(', ')}</div>
                      <div className="text-[11px] text-stone-400">{item.year}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-emerald-800 dark:text-emerald-400">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-stone-500">
                      {item.sourceType}
                    </td>
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => onViewResearch(item.id)}
                        className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded text-xs font-medium cursor-pointer active:scale-95 transition-all"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer active:scale-95 transition-all shadow-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleMarkOfficial(item.id)}
                        className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 rounded text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                      >
                        Mark Official
                      </button>
                      <button
                        onClick={() => setRejectingId(item.id)}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 rounded text-xs font-medium cursor-pointer active:scale-95 transition-all"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* All Repository Research Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
          <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            Repository Inventory ({researchList.length})
          </h2>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 border-b border-stone-200 dark:border-stone-800">
              <tr>
                <th className="p-3 font-semibold">Title</th>
                <th className="p-3 font-semibold">Department</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {researchList.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                  <td className="p-3 max-w-sm">
                    <div
                      onClick={() => onViewResearch(item.id)}
                      className="font-medium text-stone-900 dark:text-stone-100 hover:text-emerald-800 cursor-pointer truncate"
                    >
                      {item.title}
                    </div>
                  </td>
                  <td className="p-3 truncate max-w-xs text-stone-600 dark:text-stone-400">
                    {item.departmentName}
                  </td>
                  <td className="p-3 font-semibold text-emerald-800 dark:text-emerald-400">
                    {item.type}
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] font-medium text-stone-700 dark:text-stone-300">
                      {item.verificationStatus}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeature(item.id)}
                      className={`p-1 rounded cursor-pointer active:scale-90 transition-transform ${
                        item.isFeatured
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-stone-300 hover:text-stone-500 dark:text-stone-600 dark:hover:text-stone-400'
                      }`}
                      title={item.isFeatured ? 'Unfeature' : 'Feature on homepage'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={() => onViewResearch(item.id)}
                      className="text-emerald-800 dark:text-emerald-400 font-semibold hover:underline cursor-pointer active:scale-95"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Governance & Audit Logs Trail */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-2">
          <h2 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
            System Audit Trail & Governance Log
          </h2>
          <span className="text-xs text-stone-400">{auditLogs.length} events logged</span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-stone-50 dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-800 text-xs flex items-start justify-between gap-3"
            >
              <div>
                <span className="font-mono text-emerald-800 dark:text-emerald-400 font-semibold">
                  {log.action}
                </span>{' '}
                <span className="text-stone-600 dark:text-stone-400">by {log.userName}</span>
                <div className="font-medium text-stone-800 dark:text-stone-200 mt-0.5">
                  Target: {log.targetTitle}
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">{log.details}</div>
              </div>
              <div className="text-[11px] font-mono text-stone-400 shrink-0">
                {new Date(log.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rejection Modal Dialog */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-xl p-6 space-y-4 border border-stone-200 dark:border-stone-800 shadow-xl text-xs">
            <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
              Provide Academic Revision Notes
            </h3>
            <p className="text-stone-600 dark:text-stone-400">
              Please specify the required corrections or academic deficiencies to return to the submitting scholar:
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Missing supervisor endorsement or incomplete methodology chapter..."
              className="w-full p-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                className="px-3 py-1.5 bg-rose-700 text-white rounded font-semibold"
              >
                Confirm Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
