import { NextResponse } from 'next/server';

const SHEET_ID = '1Gt6AOK-_Yzgw0vA2fDI449hQYdZtWiueWM67cLEQC7A';
const SHEET_GID = '0'; // Utiliser l'ID de feuille pour JSON

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
  try {
    // Utiliser l'API JSON de Google Sheets
    const SHEET_JSON_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Feuil1?key=AIzaSyDeyf7Rc4l3OMy8rP7V5HCr-lUXHVrKKzI`;
    
    const response = await fetch(SHEET_JSON_URL, { cache: 'no-store' });
    if (!response.ok) {
      return NextResponse.json({ juniors: [], dames: [], messieurs: [] });
    }
    
    const data = await response.json();
    const values = data.values || [];
    
    const juniors: ClassementItem[] = [];
    const dames: ClassementItem[] = [];
    const messieurs: ClassementItem[] = [];
    
    let currentCategory: 'JUNIORS' | 'DAMES' | 'MESSIEURS' | null = null;
    let rank = 0;
    
    for (const row of values) {
      if (!row || row.length === 0) continue;
      
      const firstCol = (row[0] || '').trim();
      const secondCol = (row[1] || '').trim();
      const thirdCol = (row[2] || '').trim();
      
      // Détection des catégories
      if (firstCol.toUpperCase().includes('JUNIORS')) {
        currentCategory = 'JUNIORS';
        rank = 0;
        continue;
      }
      if (firstCol === 'DAMES') {
        currentCategory = 'DAMES';
        rank = 0;
        continue;
      }
      if (firstCol === 'MESSIEURS') {
        currentCategory = 'MESSIEURS';
        rank = 0;
        continue;
      }
      
      // Sauter si pas de catégorie sélectionnée
      if (!currentCategory) continue;
      
      // Validation: on a besoin de firstName, lastName, et score
      if (!firstCol || !secondCol || !thirdCol) continue;
      
      const firstName = firstCol;
      const lastName = secondCol;
      const score = thirdCol;
      
      // Sauter les headers
      if (firstName === 'Prénom' || firstName === 'CLASSEMENT' || firstName === 'Trophée') {
        continue;
      }
      
      // Sauter si les noms ressemblent à des headers
      if (['JUNIORS', 'DAMES', 'MESSIEURS', 'Sport'].includes(firstName)) {
        continue;
      }
      
      // Valider le score
      if (isNaN(Number(score))) {
        continue;
      }
      
      // Entrée valide!
      rank += 1;
      const item: ClassementItem = {
        category: currentCategory,
        rank: rank.toString(),
        name: `${firstName} ${lastName}`,
        score: score,
        status: 'Actif'
      };
      
      if (currentCategory === 'JUNIORS') {
        juniors.push(item);
      } else if (currentCategory === 'DAMES') {
        dames.push(item);
      } else if (currentCategory === 'MESSIEURS') {
        messieurs.push(item);
      }
    }
    
    return NextResponse.json({
      juniors,
      dames,
      messieurs
    } satisfies ClassementResponse);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ juniors: [], dames: [], messieurs: [] });
  }
}
