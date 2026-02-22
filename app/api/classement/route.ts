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
      
      // Split by comma and trim each part
      const parts = trimmed.split(',').map(p => p.trim());
      
      // Check for category headers - more flexible matching
      if (parts[0].toUpperCase().includes('JUNIORS') && !parts[1]) {
        currentCategory = 'JUNIORS';
        rank = 0;
        continue;
      }
      if (parts[0] === 'DAMES' && !parts[1]) {
        currentCategory = 'DAMES';
        rank = 0;
        continue;
      }
      if (parts[0] === 'MESSIEURS' && !parts[1]) {
        currentCategory = 'MESSIEURS';
        rank = 0;
        continue;
      }
      
      // Skip if we haven't detected a category yet
      if (!currentCategory) continue;
      
      // Need at least 3 parts: firstName, lastName, score
      if (parts.length < 3) continue;
      
      const firstName = parts[0];
      const lastName = parts[1];
      const score = parts[2];
      
      // Skip header rows
      if (!firstName || firstName === 'Prénom' || firstName === 'CLASSEMENT' || firstName === 'Trophée') {
        continue;
      }
      
      // Skip if no last name
      if (!lastName || lastName === 'Nom' || lastName === '') {
        continue;
      }
      
      // Skip rows where first name is a category word or decorative
      if (firstName === 'DAMES' || firstName === 'MESSIEURS' || firstName === 'JUNIORS' || firstName === 'JUNIORS SERIES') {
        continue;
      }
      
      // Valid player entry
      rank += 1;
      const item: ClassementItem = {
        category: currentCategory,
        rank: rank.toString(),
        name: `${firstName} ${lastName}`,
        score: score || '0',
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
