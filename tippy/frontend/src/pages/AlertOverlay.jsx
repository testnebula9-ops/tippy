import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const fmt = (n) => '₮' + Number(n).toLocaleString('mn-MN');

const TEMPLATES = {
  default: {
    wrapper: { background: 'linear-gradient(135deg, rgba(127,119,221,0.95), rgba(83,74,183,0.95))', borderRadius: 16, padding: '20px 28px', boxShadow: '0 8px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)' },
    name: { color: '#fff', fontWeight: 700, fontSize: 24 },
    amount: { color: '#c8f5c8', fontWeight: 700, fontSize: 28, fontFamily: 'monospace' },
    message: { color: 'rgba(255,255,255,0.85)', fontSize: 16 },
  },
  neon: {
    wrapper: { background: 'rgba(0,0,0,0.9)', borderRadius: 12, padding: '20px 28px', border: '2px solid #7F77DD', boxShadow: '0 0 30px rgba(127,119,221,0.6), inset 0 0 20px rgba(127,119,221,0.05)' },
    name: { color: '#7F77DD', fontWeight: 700, fontSize: 24, textShadow: '0 0 10px rgba(127,119,221,0.8)' },
    amount: { color: '#2dd49a', fontWeight: 700, fontSize: 28, fontFamily: 'monospace', textShadow: '0 0 10px rgba(45,212,154,0.8)' },
    message: { color: 'rgba(255,255,255,0.75)', fontSize: 16 },
  },
  minimal: {
    wrapper: { background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '16px 24px', borderLeft: '4px solid #7F77DD' },
    name: { color: '#1a1a2e', fontWeight: 600, fontSize: 22 },
    amount: { color: '#534AB7', fontWeight: 700, fontSize: 26, fontFamily: 'monospace' },
    message: { color: '#666', fontSize: 15 },
  },
  fire: {
    wrapper: { background: 'linear-gradient(135deg, rgba(200,60,20,0.95), rgba(220,120,0,0.95))', borderRadius: 16, padding: '20px 28px', boxShadow: '0 8px 40px rgba(200,60,20,0.5)' },
    name: { color: '#fff', fontWeight: 700, fontSize: 24 },
    amount: { color: '#fff176', fontWeight: 700, fontSize: 28, fontFamily: 'monospace' },
    message: { color: 'rgba(255,255,255,0.85)', fontSize: 16 },
  },
};

export default function AlertOverlay() {
  const { username } = useParams();
  const [alert, setAlert] = useState(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const poll = async () => {
    try {
      const { data } = await api.get(`/alerts/${username}`);
      if (data.alert) {
        setAlert(data.alert);
        if (data.alert.settings?.soundUrl) {
          const audio = new Audio(data.alert.settings.soundUrl);
          audio.play().catch(() => {});
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setAlert(null);
        }, data.alert.settings?.duration || 5000);
      }
    } catch {}
  };

  useEffect(() => {
    const interval = setInterval(poll, 3000);
    return () => { clearInterval(interval); if (timerRef.current) clearTimeout(timerRef.current); };
  }, [username]);

  const template = TEMPLATES[alert?.settings?.template || 'default'] || TEMPLATES.default;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: 'transparent',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      padding: 24,
      pointerEvents: 'none',
    }}>
      <AnimatePresence>
        {alert && (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{ ...template.wrapper, maxWidth: 480, width: '100%' }}
          >
            {/* Confetti dots */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {['💜', '⭐', '🎉'].map((e, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 0 }}
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ repeat: Infinity, duration: 1 + i * 0.2 }}
                  style={{ fontSize: 16 }}
                >{e}</motion.span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, gap: 12 }}>
              <span style={template.name}>{alert.senderName}</span>
              <span style={template.amount}>{fmt(alert.amount)}</span>
            </div>
            {alert.message && (
              <p style={{ ...template.message, marginTop: 4, lineHeight: 1.5 }}>"{alert.message}"</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
