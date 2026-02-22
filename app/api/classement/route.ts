import { NextResponse } from 'next/server';

const SHEET_ID = '1Gt6AOK-_Yzgw0vA2fDI449hQYdZtWiueWM67cLEQC7A';
const SHEET_GID = '183397719';
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
      console.log('Failed to fetch Google Sheet:', response.status);
      return NextResponse.json({ juniors: [], dames: [], messieurs: [] });
    }
    
    const csv = await response.text();
    const lines = csv.trim().split(/\r?\n/);
    
    if (lines.length < 2) {
      console.log('CSV has less than 2 lines:', lines.length);
      return NextResponse.json({ juniors: [], dames: [], messieurs: [] });
    }
    
    const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
    const juniors: ClassementItem[] = [];
    const dames: ClassementItem[] = [];
    const messieurs: ClassementItem[] = [];
    
    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = parseCsvLine(line);
      
      if (values.length < 5) continue;
      
      const category = values[0]?.trim();
      const rank = values[1]?.trim();
      const name = values[2]?.trim();
      const score = values[3]?.trim();
      const status = values[4]?.trim();
      
      if (!category || !name) continue;
      
      const item: ClassementItem = {
        category: category as 'JUNIORS' | 'DAMES' | 'MESSIEURS',
        rank: rank || '',
        name,
        score: score || '',
        status: status || 'Actif'
      };
      
      if (category === 'JUNIORS') {
        juniors.push(item);
      } else if (category === 'DAMES') {
        dames.push(item);
      } else if (category === 'MESSIEURS') {
        messieurs.push(item);
      }
    }
    
    console.log(`Parsed data - JUNIORS: ${juniors.length}, DAMES: ${dames.length}, MESSIEURS: ${messieurs.length}`);
    
    return NextResponse.json({
      juniors,
      dames,
      messieurs
    } satisfies ClassementResponse);
  } catch (error) {
    console.log('Error fetching classement:', error);
    return NextResponse.json({ juniors: [], dames: [], messieurs: [] });
  }
}
