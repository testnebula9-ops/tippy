import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import useAuthStore from '../store';
import api from '../api';

const fmt = (n) => '₮' + Number(n || 0).toLocaleString('mn-MN');

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/donations/stats'),
      api.get(`/donations/history?page=${page}&limit=10`),
    ]).then(([s, d]) => {
      setStats(s.data);
      setDonations(d.data.donations);
      setTotalPages(d.data.pages);
    }).catch(e => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [page]);

  const alertUrl = `${window.location.origin}/alert/${user?.username}`;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <span className="spinner" style={{ width: 32, height: 32 }} />
    </div>
  );

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>
            Сайн уу, {user?.displayName || user?.username} 👋
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>
            Таны хуудас:{' '}
            <Link to={`/${user?.username}`} style={{ color: 'var(--purple)' }}>
              tippy.mn/{user?.username}
            </Link>
          </p>
        </div>
        <span className={`badge badge-${user?.plan === 'pro' ? 'teal' : user?.plan === 'agency' ? 'amber' : 'purple'}`}>
          {user?.plan?.toUpperCase()} план
        </span>
      </div>

      {/* Stats cards */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Нийт хүлээн авсан', value: fmt(stats?.totalReceived), sub: `${stats?.donationCount || 0} donation` },
          { label: 'Энэ сар', value: fmt(stats?.monthlyReceived) },
          { label: 'Өнөөдөр', value: fmt(stats?.dailyReceived) },
          { label: 'Топ дэмжигч', value: stats?.topDonors?.[0]?._id || '—', sub: stats?.topDonors?.[0] ? fmt(stats.topDonors[0].total) : '' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ fontSize: 20 }}>{s.value}</div>
            {s.sub && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Alert URL box */}
      <div className="card" style={{ marginBottom: 32, background: 'rgba(127,119,221,0.06)', borderColor: 'rgba(127,119,221,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>OBS Browser Source URL</div>
            <code style={{ fontSize: 13, color: 'var(--purple)', wordBreak: 'break-all' }}>{alertUrl}</code>
          </div>
          <button
            className="btn btn-outline"
            style={{ fontSize: 13, whiteSpace: 'nowrap' }}
            onClick={() => { navigator.clipboard.writeText(alertUrl); toast.success('Хуулагдлаа!'); }}
          >
            📋 Хуулах
          </button>
        </div>
      </div>

      {/* Top donors */}
      {stats?.topDonors?.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Топ дэмжигчид</h2>
          <div className="grid-3">
            {stats.topDonors.map((d, i) => (
              <div key={d._id} className="card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: 'var(--purple)', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d._id}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>{d.count} удаа · {fmt(d.total)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donation history */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Donation түүх</h2>
        {donations.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text2)', padding: 48 }}>
            Одоогоор donation байхгүй байна.<br />
            <Link to={`/${user?.username}`} style={{ color: 'var(--purple)', fontSize: 14, marginTop: 8, display: 'inline-block' }}>
              Хуудсаа хуваалц →
            </Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Дэмжигч</th>
                  <th>Мессеж</th>
                  <th>Дүн</th>
                  <th>Арга</th>
                  <th>Огноо</th>
                  <th>Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {donations.map(d => (
                  <tr key={d._id}>
                    <td style={{ fontWeight: 500 }}>{d.senderName}</td>
                    <td style={{ color: 'var(--text2)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {d.message || <span style={{ color: 'var(--text3)' }}>—</span>}
                    </td>
                    <td className="mono" style={{ color: 'var(--purple)', fontWeight: 600 }}>{fmt(d.amount)}</td>
                    <td style={{ textTransform: 'uppercase', fontSize: 12, color: 'var(--text3)' }}>{d.paymentMethod}</td>
                    <td style={{ fontSize: 13, color: 'var(--text3)' }}>
                      {new Date(d.createdAt).toLocaleDateString('mn-MN')}
                    </td>
                    <td>
                      <span className={`badge badge-${d.status === 'paid' ? 'teal' : d.status === 'pending' ? 'amber' : 'red'}`} style={{ fontSize: 11 }}>
                        {d.status === 'paid' ? 'Төлсөн' : d.status === 'pending' ? 'Хүлээгдэж буй' : 'Амжилтгүй'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 16, borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-ghost" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Өмнөх</button>
                <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: '36px' }}>{page} / {totalPages}</span>
                <button className="btn btn-ghost" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Дараах →</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
