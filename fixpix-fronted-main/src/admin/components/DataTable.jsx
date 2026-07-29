/**
 * Admin DataTable — iOS Style with var() theme tokens
 */

import React from 'react';
import { Search } from 'lucide-react';

const DataTable = ({ columns, data, onSearch, searchPlaceholder = "Search...", loading = false, actions }) => {
    return (
        <div className="rounded-[var(--ios-radius-lg,24px)] overflow-hidden"
            style={{
                backgroundColor: 'var(--card-bg, #ffffff)',
                border: '1px solid var(--card-border, rgba(0,0,0,0.07))',
                boxShadow: 'var(--card-shadow, 0 1px 3px rgba(0,0,0,0.06))',
            }}
        >
            {/* Toolbar */}
            {(onSearch || actions) && (
                <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center"
                    style={{ borderBottom: '1px solid var(--divider, rgba(0,0,0,0.06))' }}
                >
                    {onSearch && (
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                onChange={(e) => onSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-[12px] text-[13px] font-medium outline-none transition-all"
                                style={{
                                    backgroundColor: 'var(--fill-tertiary, rgba(0,0,0,0.04))',
                                    border: '1px solid var(--card-border, rgba(0,0,0,0.07))',
                                    color: 'var(--text-primary)',
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(0,122,255,0.5)';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(0,122,255,0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--card-border, rgba(0,0,0,0.07))';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    )}
                    {actions && <div className="flex gap-2">{actions}</div>}
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr style={{ backgroundColor: 'var(--fill-tertiary, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--divider)' }}>
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest"
                                    style={{ color: 'var(--text-muted, #999)' }}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--divider, rgba(0,0,0,0.04))' }}>
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className="h-4 rounded-[8px] animate-pulse" style={{ width: `${50 + Math.random() * 50}%`, backgroundColor: 'var(--fill-tertiary, rgba(0,0,0,0.04))' }} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-[13px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                                    No results found
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIdx) => (
                                <tr key={row.id || rowIdx} className="transition-colors hover:bg-[var(--fill-tertiary)]"
                                    style={{ borderBottom: '1px solid var(--divider, rgba(0,0,0,0.04))' }}
                                >
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="px-6 py-3.5" style={{ color: 'var(--text-secondary)' }}>
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
