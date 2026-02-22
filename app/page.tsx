'use client';

import { useEffect, useState } from 'react';

type ClassementItem = {
  rank: string;
  name: string;
  score: string;
  status: string;
};

type ClassementResponse = {
  juniors: ClassementItem[];
  dames: ClassementItem[];
  messieurs: ClassementItem[];
};

function CategoryTable({ title, rows }: { title: string; rows: ClassementItem[] }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty">
                No players available.
              </td>
            </tr>
          ) : (
            rows.map((item, index) => (
              <tr key={`${item.name}-${index}`}>
                <td>{item.rank || '-'}</td>
                <td>{item.name || '-'}</td>
                <td>{item.score || '-'}</td>
                <td>{item.status || '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default function Home() {
  const [data, setData] = useState<ClassementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadClassement = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/classement', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch classement.');

        const payload = (await res.json()) as ClassementResponse;
        setData(payload);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unexpected error.');
      } finally {
        setLoading(false);
      }
    };

    void loadClassement();
  }, []);

  return (
    <main className="page">
      <h1>Golf Tournament Rankings</h1>
      <p className="subtitle">Live Google Sheets leaderboard</p>

      {loading && <p>Loading rankings…</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && data && (
        <>
          <CategoryTable title="JUNIORS" rows={data.juniors} />
          <CategoryTable title="DAMES" rows={data.dames} />
          <CategoryTable title="MESSIEURS" rows={data.messieurs} />
        </>
      )}
    </main>
  );
}
