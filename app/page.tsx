'use client';

import { useEffect, useState } from 'react';

type ClassementItem = {
  category: 'JUNIORS' | 'DAMES' | 'MESSIEURS';
  rank: string;
  name: string;
  score: string;
  status: string;
};

export default function Home() {
  const [items, setItems] = useState<{
    juniors: ClassementItem[];
    dames: ClassementItem[];
    messieurs: ClassementItem[];
  }>({ juniors: [], dames: [], messieurs: [] });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'JUNIORS' | 'DAMES' | 'MESSIEURS'>('JUNIORS');

  useEffect(() => {
    fetch('/api/classement', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getCurrentItems = () => {
    return items[selectedCategory.toLowerCase() as keyof typeof items] || [];
  };

  const currentItems = getCurrentItems();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">Résultat Trophée AS 2026</h1>
          <p className="text-green-100 text-lg">Golf du Sauternais</p>
        </div>

        {/* Category Selection Buttons */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {(['JUNIORS', 'DAMES', 'MESSIEURS'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-white text-green-900 shadow-lg scale-105'
                  : 'bg-green-700 text-white hover:bg-green-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-green-700 px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center">{selectedCategory}</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">Loading rankings...</p>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">No participants available.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-green-200">
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Rank</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Score</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-800">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={`${item.category}-${item.rank}-${index}`} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-green-900">{item.rank}</td>
                    <td className="px-6 py-4 text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 text-gray-800">{item.score}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {item.status}
                      </span>
                    </td>
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
