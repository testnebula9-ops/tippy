import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const features = [
  { icon: '⚡', title: 'Donation alert', desc: 'OBS/Streamlabs-д шууд харагдах анимацтай мэдэгдэл' },
  { icon: '💳', title: 'QPay & SocialPay', desc: 'Монголын бүх төлбөрийн системтэй нийцтэй' },
  { icon: '🎯', title: 'Goal widget', desc: 'Стримийн зорилго тавьж, явцыг үзэгчиддээ харуул' },
  { icon: '📊', title: 'Аналитик', desc: 'Хэн хэдийг хэзээ илгээснийг нарийн харна уу' },
];

const steps = [
  { n: '01', title: 'Бүртгүүл', desc: 'tippy.mn дээр бүртгүүлж, нэвтрэх нэрээ тогтоо' },
  { n: '02', title: 'OBS-д нэм', desc: 'Alert URL-ийг Browser Source болгон OBS-д нэм' },
  { n: '03', title: 'Стримд хуваалц', desc: 'tippy.mn/чиний_нэр холбоосыг чатад тавь' },
];

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '100px 24px 80px', textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="badge badge-purple" style={{ marginBottom: 24 }}>🇲🇳 Монголын стримерүүдэд</span>
          <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 600, lineHeight: 1.15, marginBottom: 20, letterSpacing: -1.5 }}>
            Үзэгчдээс{' '}
            <span style={{ color: 'var(--purple)' }}>дэмжлэг</span>{' '}
            хүлээн авах хамгийн хялбар арга
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40 }}>
            QPay, SocialPay, карт — donation хийхэд стримд шууд alert гарна. Тохируулах нь 2 минут.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Үнэгүй эхлэх →</Link>
            <Link to="/leaderboard" className="btn btn-outline btn-lg">Топ стримерүүд</Link>
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', padding: '28px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24 }}>
          {[['1,200+', 'Идэвхтэй стример'], ['₮48M+', 'Нийт хүлээн авсан'], ['15K+', 'Дэмжигч']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div className="mono" style={{ fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>{v}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="page">
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Бүх хэрэгтэй зүйл</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 32 }}>Стримдээ анхаар, техникийн зүйлийг бид хариуцна</p>
        <div className="grid-2">
          {features.map(f => (
            <div key={f.title} className="card" style={{ display: 'flex', gap: 16 }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>{f.icon}</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '56px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Хэрхэн ажилдаг вэ?</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 40 }}>3 алхамд л бэлэн болно</p>
          <div className="grid-3">
            {steps.map(s => (
              <div key={s.n} style={{ padding: '8px 0' }}>
                <div className="mono" style={{ fontSize: 36, fontWeight: 700, color: 'var(--purple)', opacity: 0.4, marginBottom: 12 }}>{s.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 500, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="page">
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Үнийн мэдээлэл</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 32 }}>Комисс багатай, стримерт ээлтэй</p>
        <div className="grid-3">
          {[
            { plan: 'Хувийн', price: '₮0', sub: '/сар', features: ['QPay / SocialPay', 'Donation alert', '5% комисс'], color: 'var(--border2)' },
            { plan: 'Про', price: '₮9,900', sub: '/сар', features: ['Бүх үндсэн онцлог', 'Тусгай alert дизайн', 'Goal widget', '2% комисс'], color: 'var(--purple)', featured: true },
            { plan: 'Агенси', price: '₮29,900', sub: '/сар', features: ['10 стример аккаунт', 'Аналитик dashboard', '1% комисс'], color: 'var(--border2)' },
          ].map(p => (
            <div key={p.plan} className="card" style={{ border: p.featured ? `2px solid var(--purple)` : undefined }}>
              {p.featured && <span className="badge badge-purple" style={{ marginBottom: 12 }}>Хамгийн их сонгогддог</span>}
              <h3 style={{ fontSize: 17, fontWeight: 500 }}>{p.plan}</h3>
              <div style={{ margin: '12px 0 4px' }}>
                <span className="mono" style={{ fontSize: 30, fontWeight: 700 }}>{p.price}</span>
                <span style={{ fontSize: 13, color: 'var(--text2)' }}>{p.sub}</span>
              </div>
              <ul style={{ listStyle: 'none', margin: '16px 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--teal)', fontSize: 14 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className={`btn ${p.featured ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%' }}>Эхлэх</Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '80px 24px', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: 32, fontWeight: 600, marginBottom: 12 }}>Өнөөдрөөс эхэл</h2>
        <p style={{ color: 'var(--text2)', marginBottom: 32 }}>Бүртгүүлэхэд мөнгө шаардахгүй</p>
        <Link to="/register" className="btn btn-primary btn-lg">Үнэгүй бүртгүүлэх →</Link>
      </section>
    </div>
  );
}
