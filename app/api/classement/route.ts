import { NextResponse } from 'next/server';

export const revalidate = 0;

type EventScore = {
  date: string;
  score: number;
};

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

// Dates des événements
const events = [
  'Dimanche 25 janvier',
  'Dimanche 1er Mars',
  'Samedi 28 Mars',
  'Dimanche 05 Avril',
  'Samedi 30 Mai',
  'Samedi 20 Juin',
  'Samedi 26 Septembre',
  'Samedi 24 Octobre',
  'Samedi 07 Novembre',
  'Samedi 05 Décembre',
];

export async function GET() {
  // Données hardcodées basées sur la feuille Google Sheets
  const juniors: ClassementItem[] = [
    { category: 'JUNIORS', rank: '1', name: 'Alexis Blanco', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'JUNIORS', rank: '2', name: 'Arthur Gorodenco', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'JUNIORS', rank: '3', name: 'Ambre Jaubertie', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'JUNIORS', rank: '4', name: 'Aaron Lafleur', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'JUNIORS', rank: '5', name: 'Emma Suere', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'JUNIORS', rank: '6', name: 'Jules Taochy', scores: [{ date: events[0], score: 10 }], total: 10 },
  ];

  const dames: ClassementItem[] = [
    { category: 'DAMES', rank: '1', name: 'Catherine Blanco', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'DAMES', rank: '2', name: 'Marina Dubos', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'DAMES', rank: '3', name: 'Danielle Moletta', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'DAMES', rank: '4', name: 'Déborah Suere', scores: [{ date: events[0], score: 10 }], total: 10 },
  ];

  const messieurs: ClassementItem[] = [
    { category: 'MESSIEURS', rank: '1', name: 'Thomas Bauchart', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '2', name: 'Philippe Blanco', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '3', name: 'Christophe Cambuzat', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '4', name: 'Stéphane Charretier', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '5', name: 'Alexandre Commet', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '6', name: 'Yves Cottet', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '7', name: 'Gérard Deschamps', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '8', name: 'Adrien Deschamps', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '9', name: 'Michaël Dubourg', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '10', name: 'Pascal Dumas', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '11', name: 'Fabien Verger', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '12', name: 'Aurélien Cournut', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '13', name: 'Alexandre Dubos', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '14', name: 'Tod Graham', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '15', name: 'Philippe Hequet', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '16', name: 'Manuel Jativa Hernandez', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '17', name: 'Enzo Jativa-Flores', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '18', name: 'Frédéric Paniagua', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '19', name: 'Laurent Suere', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '20', name: 'Frédéric Tach', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '21', name: 'Jean Taochy', scores: [{ date: events[0], score: 10 }], total: 10 },
    { category: 'MESSIEURS', rank: '22', name: 'Willem Van Der Wee', scores: [{ date: events[0], score: 10 }], total: 10 },
  ];

  return NextResponse.json({
    events,
    juniors,
    dames,
    messieurs
  } satisfies ClassementResponse);
}
