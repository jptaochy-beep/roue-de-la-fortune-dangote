import { NextResponse } from 'next/server';

export const revalidate = 0;

type ClassementItem = {
  category: 'JUNIORS' | 'DAMES' | 'MESSIEURS';
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

export async function GET() {
  // Données hardcodées basées sur la feuille Google Sheets
  const juniors: ClassementItem[] = [
    { category: 'JUNIORS', rank: '1', name: 'Alexis Blanco', score: '10', status: 'Actif' },
    { category: 'JUNIORS', rank: '2', name: 'Arthur Gorodenco', score: '10', status: 'Actif' },
    { category: 'JUNIORS', rank: '3', name: 'Ambre Jaubertie', score: '10', status: 'Actif' },
    { category: 'JUNIORS', rank: '4', name: 'Aaron Lafleur', score: '10', status: 'Actif' },
    { category: 'JUNIORS', rank: '5', name: 'Emma Suere', score: '10', status: 'Actif' },
    { category: 'JUNIORS', rank: '6', name: 'Jules Taochy', score: '10', status: 'Actif' },
  ];

  const dames: ClassementItem[] = [
    { category: 'DAMES', rank: '1', name: 'Catherine Blanco', score: '10', status: 'Actif' },
    { category: 'DAMES', rank: '2', name: 'Marina Dubos', score: '10', status: 'Actif' },
    { category: 'DAMES', rank: '3', name: 'Danielle Moletta', score: '10', status: 'Actif' },
    { category: 'DAMES', rank: '4', name: 'Déborah Suere', score: '10', status: 'Actif' },
  ];

  const messieurs: ClassementItem[] = [
    { category: 'MESSIEURS', rank: '1', name: 'Thomas Bauchart', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '2', name: 'Philippe Blanco', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '3', name: 'Christophe Cambuzat', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '4', name: 'Stéphane Charretier', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '5', name: 'Alexandre Commet', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '6', name: 'Yves Cottet', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '7', name: 'Gérard Deschamps', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '8', name: 'Adrien Deschamps', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '9', name: 'Michaël Dubourg', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '10', name: 'Pascal Dumas', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '11', name: 'Fabien Verger', score: '10', status: 'Actif' },
        { category: 'MESSIEURS', rank: '12', name: 'Aurélien Cournut', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '13', name: 'Alexandre Dubos', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '14', name: 'Tod Graham', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '15', name: 'Philippe Hequet', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '16', name: 'Manuel Jativa Hernandez', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '17', name: 'Enzo Jativa-Flores', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '18', name: 'Frédéric Paniagua', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '19', name: 'Laurent Suere', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '20', name: 'Frédéric Tach', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '21', name: 'Jean Taochy', score: '10', status: 'Actif' },
    { category: 'MESSIEURS', rank: '22', name: 'Willem Van Der Wee', score: '10', status: 'Actif' }
  ];

  return NextResponse.json({
    juniors,
    dames,
    messieurs
  } satisfies ClassementResponse);
}
