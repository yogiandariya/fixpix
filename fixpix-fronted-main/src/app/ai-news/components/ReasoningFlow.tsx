import React from "react";
import { motion } from "framer-motion";
import { Search, ShieldCheck, AlertCircle, CheckCircle, ArrowDown } from "lucide-react";

interface ReasoningNode {
  type: "claim" | "evidence" | "conclusion";
  status?: "support" | "conflict";
  content: string;
}

interface ReasoningFlowProps {
  flow: ReasoningNode[];
}

export default function ReasoningFlow({ flow }: ReasoningFlowProps) {
  if (!flow || flow.length === 0) return null;

  const getNodeStyle = (node: ReasoningNode) => {
    if (node.type === "claim") return {
      bg: 'var(--surface)', border: 'var(--border-subtle)', text: 'var(--text-primary)',
      iconBg: 'var(--accent-soft)', iconColor: 'var(--accent)',
    };
    if (node.type === "conclusion") return {
      bg: 'var(--text-primary)', border: 'transparent', text: 'var(--bg-primary)',
      iconBg: 'var(--accent)', iconColor: 'white',
    };
    if (node.status === "support") return {
      bg: 'rgba(52,199,89,0.06)', border: 'rgba(52,199,89,0.15)', text: 'var(--text-primary)',
      iconBg: 'rgba(52,199,89,0.12)', iconColor: '#34C759',
    };
    return {
      bg: 'rgba(255,59,48,0.06)', border: 'rgba(255,59,48,0.15)', text: 'var(--text-primary)',
      iconBg: 'rgba(255,59,48,0.12)', iconColor: '#FF3B30',
    };
  };

  return (
    <div style={{
      padding: '48px 24px', backgroundColor: 'var(--fill-tertiary)',
      borderRadius: 24, border: '1px solid var(--border-subtle)',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }} className="space-y-12">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Logical Synthesis</h3>
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Visualizing the Intelligence Chain</p>
        </div>

        <div className="relative space-y-12">
          {flow.map((node, idx) => {
            const style = getNodeStyle(node);
            return (
            <React.Fragment key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                style={{ position: 'relative', zIndex: 10 }}
              >
                <div style={{
                  padding: '24px 32px', borderRadius: 24,
                  backgroundColor: style.bg, border: `1px solid ${style.border}`,
                  transition: 'all 300ms ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
                    <div style={{
                      padding: 12, borderRadius: 16, flexShrink: 0,
                      backgroundColor: style.iconBg, color: style.iconColor,
                    }}>
                      {node.type === "claim" && <Search size={20} />}
                      {node.type === "conclusion" && <ShieldCheck size={20} />}
                      {node.type === "evidence" && (node.status === "support" ? <CheckCircle size={20} /> : <AlertCircle size={20} />)}
                    </div>
                    <div className="space-y-2">
                       <span style={{
                         fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                         color: node.type === "conclusion" ? 'rgba(255,255,255,0.5)' : 'var(--text-tertiary)',
                       }}>
                         {node.type === "claim" && "Initial Claim"}
                         {node.type === "evidence" && (node.status === "support" ? "Supporting Evidence" : "Conflicting Signal")}
                         {node.type === "conclusion" && "Intelligence Consensus"}
                       </span>
                       <p style={{
                         fontSize: 15, fontWeight: 600, lineHeight: 1.6,
                         color: style.text,
                       }}>
                         {node.content}
                       </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {idx < flow.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '-24px 0', position: 'relative', zIndex: 0 }}>
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: 48 }}
                    viewport={{ once: true }}
                    style={{ width: 1, backgroundColor: 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ArrowDown size={14} style={{ color: 'var(--text-quaternary)', transform: 'translateY(24px)' }} />
                  </motion.div>
                </div>
              )}
            </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
