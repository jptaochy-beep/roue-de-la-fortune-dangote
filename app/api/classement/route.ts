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

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

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
      
      const parts = parseCSVLine(line);
      
      // Detect category header (must be a single column with the category name)
      if (parts.length === 1 || (parts.length > 0 && parts[0].toUpperCase().includes('JUNIORS') && parts.slice(1).every(p => !p))) {
        if (parts[0].toUpperCase().includes('JUNIORS')) {
          currentCategory = 'JUNIORS';
          rank = 0;
          continue;
        }
      }
      if (parts.length === 1 || (parts.length > 0 && parts[0] === 'DAMES' && parts.slice(1).every(p => !p))) {
        if (parts[0] === 'DAMES') {
          currentCategory = 'DAMES';
          rank = 0;
          continue;
        }
      }
      if (parts.length === 1 || (parts.length > 0 && parts[0] === 'MESSIEURS' && parts.slice(1).every(p => !p))) {
        if (parts[0] === 'MESSIEURS') {
          currentCategory = 'MESSIEURS';
          rank = 0;
          continue;
        }
      }
      
      // Skip if we haven't found a category yet
      if (!currentCategory) continue;
      
      // Need at least 3 non-empty parts for: firstName, lastName, score
      const nonEmptyParts = parts.filter(p => p && p.length > 0);
      if (nonEmptyParts.length < 3) continue;
      
      const firstName = parts[0];
      const lastName = parts[1];
      const score = parts[2];
      
      // Skip header rows and invalid entries
      if (!firstName || !lastName || firstName === 'Prénom' || firstName === 'Nom' || firstName === 'CLASSEMENT' || firstName === 'Trophée') {
        continue;
      }
      
      // Skip if first name appears to be a header or category marker
      if (['JUNIORS', 'DAMES', 'MESSIEURS', 'JUNIORS SERIES'].includes(firstName.toUpperCase())) {
        continue;
      }
      
      // Skip if score is not a valid number
      if (!score || isNaN(Number(score))) {
        continue;
      }
      
      // Valid player entry
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
    console.error('Error:', error);
    return NextResponse.json({ juniors: [], dames: [], messieurs: [] });
  }
}
