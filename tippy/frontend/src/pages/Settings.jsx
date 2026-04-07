import { useState } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../store';
import api from '../api';

const TEMPLATES = [
  { id: 'default', label: 'Үндсэн' },
  { id: 'neon', label: 'Neon' },
  { id: 'minimal', label: 'Минималист' },
  { id: 'fire', label: '🔥 Fire' },
];

export default function Settings() {
  const { user, updateProfile } = useAuthStore();

  const [profile, setProfile] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
  });

  const [alert, setAlert] = useState({
    duration: user?.alertSettings?.duration || 5000,
    minAmount: user?.alertSettings?.minAmount || 0,
    template: user?.alertSettings?.template || 'default',
    textColor: user?.alertSettings?.textColor || '#ffffff',
    fontSize: user?.alertSettings?.fontSize || 24,
    soundUrl: user?.alertSettings?.soundUrl || '',
  });

  const [goal, setGoal] = useState({ title: '', targetAmount: '' });
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ displayName: profile.displayName, bio: profile.bio });
      toast.success('Профайл хадгалагдлаа');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const saveAlert = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ alertSettings: alert });
      toast.success('Alert тохиргоо хадгалагдлаа');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const saveGoal = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/streamers/goal', {
        title: goal.title,
        targetAmount: Number(goal.targetAmount),
      });
      toast.success('Goal тавигдлаа!');
      setGoal({ title: '', targetAmount: '' });
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  const setA = (k) => (e) => setAlert(p => ({ ...p, [k]: e.target.value }));
  const setP = (k) => (e) => setProfile(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 32 }}>Тохиргоо</h1>

      {/* Profile */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 16, color: 'var(--text2)' }}>Профайл</h2>
        <div className="card">
          <form onSubmit={saveProfile}>
            <div className="form-group">
              <label className="form-label">Дэлгэцийн нэр</label>
              <input className="form-input" value={profile.displayName} onChange={setP('displayName')} />
            </div>
            <div className="form-group">
              <label className="form-label">Товч танилцуулга</label>
              <textarea className="form-input" value={profile.bio} onChange={setP('bio')} maxLength={300} placeholder="Өөрийгөө товч танилцуул..." />
              <span className="form-hint">{profile.bio.length}/300</span>
            </div>
            <div className="form-group">
              <label className="form-label">Таны donation хуудас</label>
              <input className="form-input" value={`tippy.mn/${user?.username}`} readOnly style={{ color: 'var(--text3)' }} />
            </div>
            <button className="btn btn-primary" disabled={saving}>Хадгалах</button>
          </form>
        </div>
      </section>

      {/* Alert settings */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 16, color: 'var(--text2)' }}>Alert тохиргоо</h2>
        <div className="card">
          <form onSubmit={saveAlert}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Хамгийн бага дүн (₮)</label>
                <input className="form-input" type="number" min={0} value={alert.minAmount} onChange={setA('minAmount')} />
                <span className="form-hint">Эндээс доош alert гарахгүй</span>
              </div>
              <div className="form-group">
                <label className="form-label">Alert харагдах хугацаа (мс)</label>
                <input className="form-input" type="number" min={2000} max={30000} step={500} value={alert.duration} onChange={setA('duration')} />
              </div>
              <div className="form-group">
                <label className="form-label">Текстийн өнгө</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="color" value={alert.textColor} onChange={setA('textColor')}
                    style={{ width: 40, height: 36, border: '1px solid var(--border)', borderRadius: 6, background: 'none', cursor: 'pointer' }} />
                  <input className="form-input" value={alert.textColor} onChange={setA('textColor')} style={{ flex: 1 }} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Текстийн хэмжээ (px)</label>
                <input className="form-input" type="number" min={14} max={60} value={alert.fontSize} onChange={setA('fontSize')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Alert загвар</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {TEMPLATES.map(t => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => setAlert(p => ({ ...p, template: t.id }))}
                    className="btn"
                    style={{
                      fontSize: 13,
                      padding: '7px 14px',
                      background: alert.template === t.id ? 'var(--purple)' : 'var(--bg3)',
                      color: alert.template === t.id ? '#fff' : 'var(--text2)',
                      border: `1px solid ${alert.template === t.id ? 'var(--purple)' : 'var(--border)'}`,
                    }}
                  >{t.label}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Дуу (URL, .mp3)</label>
              <input className="form-input" value={alert.soundUrl} onChange={setA('soundUrl')} placeholder="https://..." />
            </div>
            <button className="btn btn-primary" disabled={saving}>Alert тохиргоо хадгалах</button>
          </form>
        </div>
      </section>

      {/* Goal */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 16, color: 'var(--text2)' }}>Donation зорилго</h2>
        <div className="card">
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16 }}>
            Шинэ зорилго тавихад өмнөх нь автоматаар хаагдана.
          </p>
          <form onSubmit={saveGoal}>
            <div className="form-group">
              <label className="form-label">Зорилгын нэр</label>
              <input className="form-input" value={goal.title} onChange={e => setGoal(p => ({ ...p, title: e.target.value }))} required placeholder="Шинэ микрофон авах" />
            </div>
            <div className="form-group">
              <label className="form-label">Зорилтот дүн (₮)</label>
              <input className="form-input" type="number" min={1000} step={1000} value={goal.targetAmount} onChange={e => setGoal(p => ({ ...p, targetAmount: e.target.value }))} required placeholder="500000" />
            </div>
            <button className="btn btn-primary" disabled={saving}>Зорилго тавих</button>
          </form>
        </div>
      </section>

      {/* OBS info */}
      <section>
        <h2 style={{ fontSize: 17, fontWeight: 500, marginBottom: 16, color: 'var(--text2)' }}>OBS тохируулга</h2>
        <div className="card" style={{ background: 'rgba(127,119,221,0.05)', borderColor: 'rgba(127,119,221,0.2)' }}>
          <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: 'var(--text2)' }}>
            <li>OBS → <strong style={{ color: 'var(--text)' }}>Sources</strong> → <strong style={{ color: 'var(--text)' }}>+</strong> → <strong style={{ color: 'var(--text)' }}>Browser</strong></li>
            <li>URL талбарт дараах хаягийг оруул:</li>
            <li>
              <code style={{ display: 'block', background: 'var(--bg3)', padding: '8px 12px', borderRadius: 8, color: 'var(--purple)', fontSize: 13, wordBreak: 'break-all', marginTop: 4 }}>
                {window.location.origin}/alert/{user?.username}
              </code>
            </li>
            <li>Width: <strong style={{ color: 'var(--text)' }}>800</strong>, Height: <strong style={{ color: 'var(--text)' }}>300</strong></li>
            <li>Custom CSS: <code style={{ color: 'var(--text3)' }}>body {'{ background: transparent; }'}</code></li>
          </ol>
        </div>
      </section>
    </div>
  );
}
