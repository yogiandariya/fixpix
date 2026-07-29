import React from "react";
import { ExternalLink, ShieldCheck, AlertTriangle, ShieldAlert, Globe } from "lucide-react";

interface SourceCardProps {
  name: string;
  title: string;
  url: string;
  trust: "High" | "Medium" | "Low" | "number";
  snippet?: string;
}

export default function SourceCard({ name, title, url, trust, snippet }: SourceCardProps) {
  const getTrustConfig = () => {
    const trustVal = typeof trust === 'number' ? 
      (trust > 80 ? 'High' : trust > 50 ? 'Medium' : 'Low') : trust;

    switch (trustVal) {
      case "High":
        return { color: '#34C759', bg: 'rgba(52,199,89,0.1)', icon: <ShieldCheck size={12} />, label: "High Trust" };
      case "Medium":
        return { color: '#FF9500', bg: 'rgba(255,149,0,0.1)', icon: <AlertTriangle size={12} />, label: "Medium Trust" };
      default:
        return { color: '#FF3B30', bg: 'rgba(255,59,48,0.1)', icon: <ShieldAlert size={12} />, label: "Low Trust" };
    }
  };

  const config = getTrustConfig();

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      style={{
        display: 'block', backgroundColor: 'var(--surface)',
        border: '1px solid var(--border-subtle)', borderRadius: 24,
        padding: 24, transition: 'all 300ms ease', textDecoration: 'none',
      }}
      className="group hover:shadow-lg"
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 12,
              backgroundColor: 'var(--fill-tertiary)', border: '1px solid var(--border-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 200ms ease',
            }}>
              <Globe size={14} style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>{name}</span>
          </div>
          
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 12px', borderRadius: 999,
            backgroundColor: config.bg, color: config.color,
            border: `1px solid ${config.color}22`,
          }}>
            {config.icon}
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{config.label}</span>
          </div>
        </div>

        <div style={{ flex: 1 }} className="space-y-2">
          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
            {title}
          </h4>
          {snippet && (
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 500, lineHeight: 1.5, opacity: 0.8 }}>
              "{snippet}"
            </p>
          )}
        </div>

        <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-quaternary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Visit Official Source</span>
          <ExternalLink size={12} style={{ color: 'var(--text-quaternary)' }} />
        </div>
      </div>
    </a>
  );
}
