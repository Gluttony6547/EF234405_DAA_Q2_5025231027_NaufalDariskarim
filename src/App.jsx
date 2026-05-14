import React, { useState, useMemo } from 'react';
import {
  Trash2,
  Plus,
  ArrowRight,
  Wallet,
  Receipt,
  RefreshCw,
} from 'lucide-react';

/**
 * Komponen Utama: Cash Flow Minimizer
 * Menggunakan Algoritma Greedy untuk meminimalkan jumlah transaksi
 * antar anggota dalam sebuah grup.
 */
export default function App() {
  const [members, setMembers] = useState(['Andi', 'Budi', 'Caca']);
  const [newMember, setNewMember] = useState('');
  const [transactions, setTransactions] = useState([
    { from: 'Andi', to: 'Budi', amount: 50000 },
    { from: 'Budi', to: 'Caca', amount: 30000 },
  ]);
  const [inputTransaction, setInputTransaction] = useState({
    from: 'Andi',
    to: 'Budi',
    amount: '',
  });

  // --- LOGIKA ALGORITMA ---

  /**
   * Fungsi untuk menghitung penyelesaian utang minimum
   * Strategi: Hitung saldo bersih, lalu pasangkan debitur terbesar dengan kreditur terbesar.
   */
  const simplifiedTransactions = useMemo(() => {
    const netBalances = {};
    members.forEach((m) => (netBalances[m] = 0));

    // 1. Hitung saldo bersih tiap orang
    transactions.forEach(({ from, to, amount }) => {
      const val = parseFloat(amount) || 0;
      netBalances[from] -= val;
      netBalances[to] += val;
    });

    // 2. Pisahkan pengutang (debitur) dan penerima (kreditur)
    let creditors = []; // Saldo positif
    let debtors = []; // Saldo negatif

    Object.keys(netBalances).forEach((name) => {
      if (netBalances[name] > 0.01) {
        creditors.push({ name, amount: netBalances[name] });
      } else if (netBalances[name] < -0.01) {
        debtors.push({ name, amount: Math.abs(netBalances[name]) });
      }
    });

    const result = [];

    // 3. Greedy Match
    // Urutkan untuk selalu mengambil nilai terbesar (Heuristic)
    let i = 0,
      j = 0;
    const tempDebtors = [...debtors].sort((a, b) => b.amount - a.amount);
    const tempCreditors = [...creditors].sort((a, b) => b.amount - a.amount);

    while (i < tempDebtors.length && j < tempCreditors.length) {
      const d = tempDebtors[i];
      const c = tempCreditors[j];
      const settlement = Math.min(d.amount, c.amount);

      result.push({
        from: d.name,
        to: c.name,
        amount: settlement,
      });

      tempDebtors[i].amount -= settlement;
      tempCreditors[j].amount -= settlement;

      if (tempDebtors[i].amount < 0.01) i++;
      if (tempCreditors[j].amount < 0.01) j++;
    }

    return result;
  }, [transactions, members]);

  // --- HANDLERS ---

  const addMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember]);
      setNewMember('');
    }
  };

  const removeMember = (name) => {
    setMembers(members.filter((m) => m !== name));
    setTransactions(
      transactions.filter((t) => t.from !== name && t.to !== name)
    );
  };

  const addTransaction = () => {
    if (
      inputTransaction.from !== inputTransaction.to &&
      inputTransaction.amount > 0
    ) {
      setTransactions([
        ...transactions,
        { ...inputTransaction, amount: parseFloat(inputTransaction.amount) },
      ]);
      setInputTransaction({ ...inputTransaction, amount: '' });
    }
  };

  const deleteTransaction = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#eef0f8', padding: '32px 20px', fontFamily: "'Segoe UI', system-ui, sans-serif" },
    inner: { maxWidth: '1080px', margin: '0 auto' },
    header: { textAlign: 'center', marginBottom: '32px' },
    h1: { fontSize: '2rem', fontWeight: '700', color: '#4338ca', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', margin: '0 0 8px' },
    subtitle: { color: '#6b7280', fontSize: '0.95rem', margin: 0 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' },
    cardDark: { backgroundColor: '#3730a3', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 24px rgba(55,48,163,0.4)' },
    cardTitle: { fontSize: '1.05rem', fontWeight: '600', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: '#111827', margin: '0 0 18px' },
    cardTitleWhite: { fontSize: '1.05rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', margin: '0 0 18px' },
    inputRow: { display: 'flex', gap: '8px', marginBottom: '14px' },
    input: { flex: 1, padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#111827', backgroundColor: '#fff' },
    inputFull: { width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', color: '#111827', backgroundColor: '#fff', boxSizing: 'border-box' },
    btnPrimary: { backgroundColor: '#4338ca', color: '#fff', padding: '10px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap' },
    btnGreen: { width: '100%', backgroundColor: '#16a34a', color: '#fff', padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', marginTop: '4px' },
    memberRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '10px 13px', borderRadius: '8px', border: '1px solid #f3f4f6', marginBottom: '8px' },
    label: { fontSize: '0.7rem', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' },
    select: { width: '100%', padding: '10px 13px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', backgroundColor: '#fff', color: '#111827' },
    historyLabel: { fontSize: '0.85rem', fontWeight: '700', color: '#4338ca', margin: '0 0 10px' },
    historyItem: { fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 10px', backgroundColor: '#f9fafb', borderRadius: '6px', fontStyle: 'italic', color: '#6b7280', marginBottom: '4px' },
    resultCard: { backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.12)', padding: '14px 16px', borderRadius: '12px', marginBottom: '10px' },
    resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
    infoBox: { padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.7rem', color: '#c7d2fe', lineHeight: '1.6', marginTop: '4px' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', padding: '2px' },
  };

  return (
    <div style={s.page}>
      <div style={s.inner}>
        <header style={s.header}>
          <h1 style={s.h1}>
            <Wallet style={{ width: '34px', height: '34px' }} />
            Penyederhana Kas (Greedy)
          </h1>
          <p style={s.subtitle}>Optimasi transaksi utang-piutang grup agar lebih efisien.</p>
        </header>

        <div style={s.grid}>
          {/* Kolom 1: Anggota Grup */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>
              <Plus style={{ width: '18px', height: '18px', color: '#4338ca' }} /> Anggota Grup
            </h2>
            <div style={s.inputRow}>
              <input
                type="text"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMember()}
                placeholder="Nama..."
                style={s.input}
              />
              <button onClick={addMember} style={s.btnPrimary}>Tambah</button>
            </div>
            <div>
              {members.map((m) => (
                <div key={m} style={s.memberRow}>
                  <span style={{ fontSize: '0.9rem', color: '#111827' }}>{m}</span>
                  <button onClick={() => removeMember(m)} style={s.iconBtn}>
                    <Trash2 style={{ width: '15px', height: '15px' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom 2: Catat Utang */}
          <div style={s.card}>
            <h2 style={s.cardTitle}>
              <Receipt style={{ width: '18px', height: '18px', color: '#4338ca' }} /> Catat Utang
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={s.label}>Siapa yang Berutang?</label>
                <select style={s.select} value={inputTransaction.from}
                  onChange={(e) => setInputTransaction({ ...inputTransaction, from: e.target.value })}>
                  {members.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Berutang Kepada?</label>
                <select style={s.select} value={inputTransaction.to}
                  onChange={(e) => setInputTransaction({ ...inputTransaction, to: e.target.value })}>
                  {members.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Jumlah (Rp)</label>
                <input type="number" value={inputTransaction.amount} placeholder="0"
                  onChange={(e) => setInputTransaction({ ...inputTransaction, amount: e.target.value })}
                  style={s.inputFull} />
              </div>
              <button onClick={addTransaction} style={s.btnGreen}>Catat Transaksi</button>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid #f3f4f6', paddingTop: '14px' }}>
              <p style={s.historyLabel}>Riwayat Input:</p>
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {transactions.map((t, i) => (
                  <div key={i} style={s.historyItem}>
                    <span>{t.from} → {t.to}: {t.amount.toLocaleString()}</span>
                    <button onClick={() => deleteTransaction(i)} style={s.iconBtn}>
                      <Trash2 style={{ width: '12px', height: '12px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom 3: Hasil */}
          <div style={s.cardDark}>
            <h2 style={s.cardTitleWhite}>
              <RefreshCw style={{ width: '18px', height: '18px', color: '#a5b4fc' }} /> Hasil Penyederhanaan
            </h2>

            {simplifiedTransactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 0', color: '#a5b4fc', fontStyle: 'italic', opacity: 0.6, fontSize: '0.9rem' }}>
                Belum ada transaksi yang perlu diselesaikan.
              </div>
            ) : (
              <div>
                {simplifiedTransactions.map((t, i) => (
                  <div key={i} style={s.resultCard}>
                    <div style={s.resultRow}>
                      <span style={{ fontWeight: '700', color: '#fca5a5', fontSize: '1rem' }}>{t.from}</span>
                      <ArrowRight style={{ width: '15px', height: '15px', color: 'rgba(255,255,255,0.35)' }} />
                      <span style={{ fontWeight: '700', color: '#6ee7b7', fontSize: '1rem' }}>{t.to}</span>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '1.15rem', fontFamily: 'monospace', fontWeight: '700', color: '#fff' }}>
                      Rp {t.amount.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
                <div style={s.infoBox}>
                  <strong>Info Algoritma:</strong> Menggunakan pendekatan Greedy dengan mencocokkan debitur terbesar ke kreditur terbesar pada setiap langkah. Kompleksitas: O(N log N).
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
