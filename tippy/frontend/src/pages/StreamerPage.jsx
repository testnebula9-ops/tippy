import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

const PAYMENT_METHODS = [
  { id: 'qpay', label: 'QPay', icon: '🔵' },
  { id: 'socialpay', label: 'SocialPay', icon: '🟠' },
  { id: 'card', label: 'Карт', icon: '💳' },
];

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000, 50000];

const fmt = (n) => '₮' + Number(n).toLocaleString('mn-MN');

export default function StreamerPage() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [form, setForm] = useState({
    senderName: '',
    message: '',
    amount: '',
    paymentMethod: 'qpay',
  });
  const [sending, setSending] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  useEffect(() => {
    api.get(`/streamers/${username}`)
      .then(r => setData(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  const setF = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) < 1000) {
      return toast.error('Хамгийн бага дүн: ₮1,000');
    }
    setSending(true);
    try {
      const { data: res } = await api.post('/donations', {
        streamerUsername: username,
        senderName: form.senderName,
        message: form.message,
        amount: Number(form.amount),
        paymentMethod: form.paymentMethod,
      });
      setPaymentUrl(res.paymentUrl);
      toast.success('Donation үүслээ! Төлбөр хийнэ үү.');
    } catch (err) {
      toast.error(err.message);
    } finally { setSending(false); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <span className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  if (notFound) return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Стример олдсонгүй</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 24 }}>tippy.mn/{username} хаяг бүртгэлгүй байна</p>
      <Link to="/" className="btn btn-primary">Нүүр хуудас</Link>
    </div>
  );

  const { streamer, goal, recentDonations } = data;

  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,360px)', gap: 32, alignItems: 'start' }}>

        {/* Left: Profile + recent */}
        <div>
          {/* Profile card */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--purple), #3f37b7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {(streamer.displayName || streamer.username)[0].toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 2 }}>
                  {streamer.displayName || streamer.username}
                </h1>
                <span style={{ fontSize: 13, color: 'var(--text3)' }}>@{streamer.username}</span>
              </div>
            </div>
            {streamer.bio && (
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{streamer.bio}</p>
            )}
            <div style={{ borderTop: '1px solid var(--border)', marginTop: 16, paddingTop: 16, display: 'flex', gap: 24 }}>
              <div>
                <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--purple)' }}>
                  {fmt(streamer.totalReceived)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>Нийт хүлээн авсан</div>
              </div>
            </div>
          </div>

          {/* Goal */}
          {goal && (
            <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(29,158,117,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>🎯 {goal.title}</span>
                <span className="mono" style={{ fontSize: 13, color: 'var(--text2)' }}>
                  {fmt(goal.currentAmount)} / {fmt(goal.targetAmount)}
                </span>
              </div>
              <div style={{ background: 'var(--bg3)', borderRadius: 8, height: 10, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--teal), #2dd49a)',
                  borderRadius: 8,
                  transition: 'width 0.5s ease',
                }} />
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6, textAlign: 'right' }}>
                {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% дууссан
              </div>
            </div>
          )}

          {/* Recent donations */}
          {recentDonations?.length > 0 && (
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12, color: 'var(--text2)' }}>Сүүлийн дэмжлэгүүд</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {recentDonations.map(d => (
                  <div key={d._id} className="card-sm" style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text2)', flexShrink: 0 }}>
                      {d.senderName[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{d.senderName}</span>
                        <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: 'var(--purple)', flexShrink: 0 }}>{fmt(d.amount)}</span>
                      </div>
                      {d.message && <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{d.message}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Donation form */}
        <div style={{ position: 'sticky', top: 76 }}>
          {paymentUrl ? (
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Donation бэлэн!</h2>
              <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 24 }}>
                Доорх товч дээр дарж төлбөрөө хийнэ үү.
              </p>
              <a href={paymentUrl} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ width: '100%', display: 'block', marginBottom: 12 }}>
                Төлбөр хийх →
              </a>
              <button className="btn btn-ghost" style={{ width: '100%', fontSize: 13 }} onClick={() => { setPaymentUrl(null); setForm({ senderName: '', message: '', amount: '', paymentMethod: 'qpay' }); }}>
                Буцах
              </button>
            </div>
          ) : (
            <div className="card">
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                {streamer.displayName || streamer.username}-г дэмжих
              </h2>
              <form onSubmit={submit}>
                <div className="form-group">
                  <label className="form-label">Таны нэр</label>
                  <input className="form-input" value={form.senderName} onChange={setF('senderName')} required placeholder="Нэрээ оруул" maxLength={50} />
                </div>
                <div className="form-group">
                  <label className="form-label">Дүн</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                    {QUICK_AMOUNTS.map(a => (
                      <button
                        type="button"
                        key={a}
                        onClick={() => setForm(p => ({ ...p, amount: a }))}
                        className="btn"
                        style={{
                          fontSize: 12,
                          padding: '5px 10px',
                          background: Number(form.amount) === a ? 'var(--purple)' : 'var(--bg3)',
                          color: Number(form.amount) === a ? '#fff' : 'var(--text2)',
                          border: `1px solid ${Number(form.amount) === a ? 'var(--purple)' : 'var(--border)'}`,
                        }}
                      >
                        {fmt(a)}
                      </button>
                    ))}
                  </div>
                  <input
                    className="form-input"
                    type="number"
                    min={1000}
                    step={100}
                    value={form.amount}
                    onChange={setF('amount')}
                    placeholder="Дурын дүн оруул..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Мессеж (заавал биш)</label>
                  <textarea className="form-input" value={form.message} onChange={setF('message')} maxLength={300} rows={2} placeholder="Стримерт зориулсан мессеж..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Төлбөрийн арга</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {PAYMENT_METHODS.map(m => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setForm(p => ({ ...p, paymentMethod: m.id }))}
                        className="btn"
                        style={{
                          flex: 1,
                          fontSize: 13,
                          flexDirection: 'column',
                          gap: 2,
                          padding: '10px 8px',
                          background: form.paymentMethod === m.id ? 'rgba(127,119,221,0.12)' : 'var(--bg3)',
                          color: form.paymentMethod === m.id ? 'var(--purple)' : 'var(--text2)',
                          border: `1px solid ${form.paymentMethod === m.id ? 'var(--purple)' : 'var(--border)'}`,
                        }}
                      >
                        <span style={{ fontSize: 18 }}>{m.icon}</span>
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: 4, padding: '13px', fontSize: 15 }}
                  disabled={sending}
                >
                  {sending
                    ? <span className="spinner" style={{ width: 16, height: 16 }} />
                    : `💜 Дэмжих${form.amount ? ' · ' + fmt(form.amount) : ''}`}
                </button>
              </form>
            </div>
          )}
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', marginTop: 12 }}>
            Powered by <Link to="/" style={{ color: 'var(--purple)' }}>tippy.mn</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
