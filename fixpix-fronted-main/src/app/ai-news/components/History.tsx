import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FactCheckBadge } from './FactCheckBadge';
import { getBaseURL } from '../hooks/useFactCheck';

interface HistoryRecord {
  id: string;
  claim: string;
  verdict: string;
  confidence: number;
  explanation: string;
  timestamp: string;
  evidence: any[];
}

const History: React.FC = () => {
    const [records, setRecords] = useState<HistoryRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const baseURL = getBaseURL();
            const response = await fetch(`${baseURL}/api/fact-check/history/`);
            const data = await response.json();
            setRecords(data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) {
        return <div className="p-8 text-center opacity-70">Loading history...</div>;
    }

    if (records.length === 0) {
        return (
            <div className="p-12 text-center bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--border-color)]">
                <p className="opacity-60">No fact-check history found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {records.map((record, index) => (
                <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all group shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                >
                    <div className="flex justify-between items-start mb-4">
                        <FactCheckBadge status={record.verdict as any} />
                        <span className="text-xs opacity-40">{new Date(record.timestamp).toLocaleString()}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
                        {record.claim}
                    </h3>
                    
                    <p className="text-sm opacity-80 leading-relaxed mb-4">
                        {record.explanation}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <span className="px-2 py-1 bg-[var(--accent)] bg-opacity-10 text-[var(--accent)] rounded-full">
                            {record.confidence}% Confidence
                        </span>
                        <span className="opacity-40">
                            {record.evidence?.length || 0} Sources Verified
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default History;
