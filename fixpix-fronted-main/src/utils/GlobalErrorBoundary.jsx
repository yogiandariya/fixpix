import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("[FixPix] Uncaught error:", error?.message);
    }

    render() {
        if (this.state.hasError) {
            const isProd = import.meta.env.PROD;

            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-primary)] p-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel max-w-lg w-full p-10 rounded-[var(--radius-3xl)] shadow-[var(--glass-shadow)] border border-[var(--border-subtle)] bg-[var(--surface-elevated)] backdrop-blur-xl"
                    >
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-[var(--radius-xl)] bg-red-500/10 flex items-center justify-center mx-auto mb-10 text-red-500">
                            <AlertTriangle size={48} strokeWidth={1.5} />
                        </div>

                        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tighter mb-4 italic">
                            NEURAL DISRUPTION
                        </h1>

                        <p className="text-[16px] font-semibold text-[var(--text-secondary)] mb-12 leading-relaxed">
                            A severe logic deviation has occurred in the neural engine. This state has been recorded for analysis.
                        </p>

                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-[var(--accent)] text-white rounded-[var(--radius-xl)] font-black uppercase text-[12px] tracking-widest shadow-xl shadow-[var(--accent-soft)] hover:scale-105 transition-all active:scale-95"
                            >
                                <RefreshCw size={16} /> Reconnect Sync
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="flex items-center justify-center gap-2 px-8 py-4 bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] font-black uppercase text-[12px] tracking-widest hover:bg-[var(--fill-secondary)] transition-all"
                            >
                                <Home size={16} /> Neural Base
                            </button>
                        </div>

                        {/* Debug details — only in development */}
                        {!isProd && this.state.error && (
                            <details className="mt-12 text-left bg-red-500/5 border border-red-500/10 rounded-[var(--radius-xl)] overflow-hidden">
                                <summary className="p-4 text-red-500 text-[11px] font-black uppercase tracking-widest cursor-pointer hover:bg-red-500/5 transition-colors">
                                    Logic Trace Terminal
                                </summary>
                                <div className="p-4 pt-0">
                                    <pre className="text-[11px] font-mono text-[var(--text-tertiary)] overflow-auto max-h-[200px] leading-relaxed">
                                        {this.state.error.toString()}
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </div>
                            </details>
                        )}
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
