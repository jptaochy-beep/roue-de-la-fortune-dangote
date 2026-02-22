// Parse all participants from Feuil1
import { NextResponse } from 'next/server';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1Gt6AOK-_Yzgw0vA2fDI449hQYdZtWiueWM67cLEQC7A/export?format=csv&gid=183397719';
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

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

export async function GET() {
  try {
    const response = await fetch(SHEET_URL, { cache: 'no-store' });
    
    if (!response.ok) {
      return NextResponse.json({ juniors: [], dames: [], messieurs: [] });
    }
    
    const csv = await response.text();
    const lines = csv.trim().split(/\r?\n/);
    
    const juniors: ClassementItem[] = [];
    const dames: ClassementItem[] = [];
    const messieurs: ClassementItem[] = [];
    
    let currentCategory = '';
    let rank = 0;
    
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i].trim();
      
      // Check if line contains category header
      if (line.includes('JUNIORS')) {
        currentCategory = 'JUNIORS';
        rank = 0;
        continue;
      } else if (line.includes('DAMES')) {
        currentCategory = 'DAMES';
        rank = 0;
        continue;
      } else if (line.includes('MESSIEURS')) {
        currentCategory = 'MESSIEURS';
        rank = 0;
        continue;
      }
      
      // Skip empty lines and header lines
      if (!line || line.includes('CLASSEMENT') || line.includes('Dimanche') || line.includes('Stop') || line.includes('Classement :')) {
        continue;
      }
      
      const values = parseCsvLine(line);
      
      // Skip rows that don't have at least 3 columns (prenom, nom, initial score)
      if (values.length < 3) {
        continue;
      }
      
      // Skip header rows
      if (values[0].toLowerCase().includes('prenom') || values[0].toLowerCase().includes('nom')) {
        continue;
      }
      
      const prenom = values[0]?.trim() || '';
      const nom = values[1]?.trim() || '';
      const scoreStr = values[2]?.trim() || '0';
      
      // Skip if no name
      if (!prenom && !nom) {
        continue;
      }
      
      if (currentCategory && (prenom || nom)) {
        rank += 1;
        const item: ClassementItem = {
          category: currentCategory as 'JUNIORS' | 'DAMES' | 'MESSIEURS',
          rank: rank.toString(),
          name: `${prenom} ${nom}`.trim(),
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
    }
    
    return NextResponse.json({
      juniors,
      dames,
      messieurs
    } satisfies ClassementResponse);
  } catch (error) {
    console.log('Error fetching data:', error);
    return NextResponse.json({ juniors: [], dames: [], messieurs: [] });
  }
}
