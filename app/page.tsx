'use client';

import { useEffect, useState } from 'react';

type EventScore = { date: string; score: number };

type ClassementItem = {
  category: 'JUNIORS' | 'DAMES' | 'MESSIEURS';
  rank: string;
  name: string;
  scores: EventScore[];
  total: number;
};

type ClassementResponse = {
  events: string[];
  juniors: ClassementItem[];
  dames: ClassementItem[];
  messieurs: ClassementItem[];
};

export default function Home() {
const [items, setItems] = useState<{ juniors: ClassementItem[]; dames: ClassementItem[]; messieurs: ClassementItem[] }>({ juniors: [], dames: [], messieurs: [] });  const [events, setEvents] = useState([]);
const [selectedCategory, setSelectedCategory] = useState<'JUNIORS' | 'DAMES' | 'MESSIEURS'>('JUNIORS');
  useEffect(() => {
    fetch('/api/classement', { cache: 'no-store' }).then(r => r.json()).then(data => {
      setEvents(data.events);
      setItems(data);
      setLoading(false);
    });
  }, []);

  const currentItems = items[selectedCategory.toLowerCase()] || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 p-8">
      <div className="max-w-full mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">Resultat Trophee AS 2026</h1>
          <p className="text-green-100 text-lg">Golf du Sauternais</p>
        </div>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {['JUNIORS', 'DAMES', 'MESSIEURS'].map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
              selectedCategory === cat ? 'bg-white text-green-900 shadow-lg scale-105' : 'bg-green-700 text-white'
            }`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-x-auto">
          <div className="bg-green-700 px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center">{selectedCategory}</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center"><p className="text-gray-600">Loading...</p></div>
          ) : currentItems.length === 0 ? (
            <div className="p-8 text-center"><p className="text-gray-600">No participants.</p></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-green-200">
                  <th className="px-6 py-4 text-left font-semibold">Rank</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  {events.map(e => <th key={e} className="px-6 py-4 text-center font-semibold">{e}</th>)}
                  <th className="px-6 py-4 text-center font-semibold bg-green-50">Total</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-green-900">{item.rank}</td>
                    <td className="px-6 py-4 text-gray-800">{item.name}</td>
                    {events.map(e => {
                      const s = item.scores.find(sc => sc.date === e);
                      return <td key={e} className="px-6 py-4 text-center">{s ? s.score : '-'}</td>;
                    })}
                    <td className="px-6 py-4 text-center font-bold text-green-900 bg-green-50">{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
