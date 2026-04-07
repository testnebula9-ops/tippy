// Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store';

export function Login() {
  const [form, setForm] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.login, form.password);
      toast.success('Амжилттай нэвтэрлээ!');
      nav('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="page-sm">
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <Link to="/" className="nav-logo" style={{ fontSize: 22 }}>tippy<span style={{ color: 'var(--purple)' }}>.mn</span></Link>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>Нэвтрэх</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Эсвэл <Link to="/register" style={{ color: 'var(--purple)' }}>бүртгүүлэх</Link></p>
      </div>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Username эсвэл email</label>
            <input className="form-input" value={form.login} onChange={e => setForm(p => ({...p, login: e.target.value}))} required placeholder="streamer123" />
          </div>
          <div className="form-group">
            <label className="form-label">Нууц үг</label>
            <input className="form-input" type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required placeholder="••••••••" />
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Нэвтрэх'}
          </button>
        </form>
      </div>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.username, form.email, form.password, form.displayName);
      toast.success('Бүртгэл амжилттай!');
      nav('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm(p => ({...p, [k]: e.target.value}));

  return (
    <div className="page-sm">
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <Link to="/" className="nav-logo" style={{ fontSize: 22 }}>tippy<span style={{ color: 'var(--purple)' }}>.mn</span></Link>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginTop: 24, marginBottom: 8 }}>Бүртгүүлэх</h1>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Эсвэл <Link to="/login" style={{ color: 'var(--purple)' }}>нэвтрэх</Link></p>
      </div>
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Username <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(tippy.mn/username)</span></label>
            <input className="form-input" value={form.username} onChange={set('username')} required placeholder="streamer123" pattern="[a-z0-9_]{3,30}" />
            <span className="form-hint">Зөвхөн a-z, 0-9, _ тэмдэгт. 3–30 тэмдэгт.</span>
          </div>
          <div className="form-group">
            <label className="form-label">Дэлгэцийн нэр</label>
            <input className="form-input" value={form.displayName} onChange={set('displayName')} placeholder="Монгол нэр ч болно" />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Нууц үг</label>
            <input className="form-input" type="password" value={form.password} onChange={set('password')} required placeholder="••••••••" minLength={8} />
            <span className="form-hint">Хамгийн багадаа 8 тэмдэгт</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Бүртгүүлэх — үнэгүй'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
