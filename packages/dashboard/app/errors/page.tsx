"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export default function ErrorsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchErrors = () => {
    fetch('/api/proxy/errors')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  const resolveError = async (id: string) => {
    try {
      await fetch(`/api/proxy/errors/${id}/resolve`, { method: 'PATCH' });
      fetchErrors();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-10 text-slate-400">Loading errors...</div>;
  }

  if (!data || data.error) {
    return <div className="p-10 text-red-400">Failed to load errors.</div>;
  }

  return (
    <div className="p-10 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Error Logs</h1>
          <p className="text-slate-400">Recent upstream failures and proxy exceptions.</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="font-medium text-sm">{data.total} Total Logged</span>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-900/50 border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Timestamp</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Upstream</th>
              <th className="px-6 py-4 font-medium">Status Code</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {data.items?.map((error: any) => (
              <tr key={error.id} className={`hover:bg-slate-800/20 transition-colors ${error.resolved ? 'opacity-50' : ''}`}>
                <td className="px-6 py-4 font-mono text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(error.ts).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
                    {error.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-slate-300">
                  {error.upstream}
                </td>
                <td className="px-6 py-4 text-slate-300 font-mono">
                  {error.httpStatus}
                </td>
                <td className="px-6 py-4 text-right">
                  {error.resolved ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                      <CheckCircle className="w-4 h-4" />
                      Resolved
                    </span>
                  ) : (
                    <button 
                      onClick={() => resolveError(error.id)}
                      className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                    >
                      Mark Resolved
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {data.items?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-emerald-500/50" />
                    <p>No errors found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
