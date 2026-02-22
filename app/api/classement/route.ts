import { NextResponse } from 'next/server';

const SHEET_ID = '1Gt6AOK-_Yzgw0vA2fDI449hQYdZtWiueWM67cLEQC7A';
const SHEET_GID = '1493330459'; // Feuil1
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

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
    const response = await fetch(SHEET_URL, { cache: 'no-store' });
    if (!response.ok) {
      return NextResponse.json({ juniors: [], dames: [], messieurs: [] });
    }
    const csv = await response.text();
    const lines = csv.split('\n');
    
    const juniors: ClassementItem[] = [];
    const dames: ClassementItem[] = [];
    const messieurs: ClassementItem[] = [];
    
    let currentCategory: 'JUNIORS' | 'DAMES' | 'MESSIEURS' | null = null;
    let rank = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length === 0) continue;
      
      // Check for category headers - they appear alone in a cell
      if (trimmed.toUpperCase().includes('JUNIORS')) {
        currentCategory = 'JUNIORS';
        rank = 0;
        continue;
      }
      if (trimmed === 'DAMES' || trimmed.startsWith('"DAMES"')) {
        currentCategory = 'DAMES';
        rank = 0;
        continue;
      }
      if (trimmed === 'MESSIEURS' || trimmed.startsWith('"MESSIEURS"')) {
        currentCategory = 'MESSIEURS';
        rank = 0;
        continue;
      }
      
      // Skip if no category selected yet
      if (!currentCategory) continue;
      
      // Split CSV with better handling for quoted fields
      const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      
      // Skip header rows
      if (parts[0] === 'Prénom' || parts[0] === '') continue;
      
      // Look for valid player entries
      // We expect: firstName, lastName, score, ... 
      // All three must be non-empty
      if (!parts[0] || !parts[1] || !parts[2]) continue;
      
      const firstName = parts[0];
      const lastName = parts[1];
      const scoreStr = parts[2];
      
      // Validate this looks like a player row
      // Skip rows where first name is clearly not a name
      if (firstName === 'CLASSEMENT' || firstName === 'Trophée' || firstName === 'Sport' || firstName === 'important') {
        continue;
      }
      
      // Skip if this looks like a category or header
      if (['JUNIORS', 'DAMES', 'MESSIEURS', 'JUNIORS SERIES', 'Prénom', 'Nom'].includes(firstName)) {
        continue;
      }
      
      // Try to parse score - should be a number
      const score = parseInt(scoreStr, 10);
      if (isNaN(score)) {
        continue;
      }
      
      // Skip if lastName looks like it could be a header
      if (['BLANCO', 'GORODENCO', 'JAUBERTIE'].includes(lastName) === false && lastName === lastName.toUpperCase() && lastName.length === 0) {
        continue;
      }
      
      // Valid player! Add them
      rank += 1;
      const item: ClassementItem = {
        category: currentCategory,
        rank: rank.toString(),
        name: `${firstName} ${lastName}`,
        score: scoreStr,
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
    console.error('Error:', error);
    return NextResponse.json({ juniors: [], dames: [], messieurs: [] });
  }
}
