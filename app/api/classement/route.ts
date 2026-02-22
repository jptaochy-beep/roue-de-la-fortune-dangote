// Force new deployment
import { NextResponse } from 'next/server';

const SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1Gt6AOK-_Yzgw0vA2fDI449hQYdZtWiueWM67cLEQC7A/export?format=csv&gid=0';

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

const MOCK_DATA: ClassementResponse = {
  juniors: [
    { category: 'JUNIORS' as const, rank: '1', name: 'Ali Konaté', score: '72', status: 'Actif' },
    { category: 'JUNIORS' as const, rank: '2', name: 'Marie Traoré', score: '75', status: 'Actif' },
    { category: 'JUNIORS' as const, rank: '3', name: 'Jean Coulibaly', score: '78', status: 'Actif' },
  ],
  dames: [
    { category: 'DAMES' as const, rank: '1', name: 'Fatou Diallo', score: '79', status: 'Actif' },
    { category: 'DAMES' as const, rank: '2', name: 'Aïssatou Ba', score: '81', status: 'Actif' },
    { category: 'DAMES' as const, rank: '3', name: 'Sophie Martin', score: '84', status: 'Actif' },
  ],
  messieurs: [
    { category: 'MESSIEURS' as const, rank: '1', name: 'Ousmane Diaworé', score: '68', status: 'Actif' },
    { category: 'MESSIEURS' as const, rank: '2', name: 'Yacine Sy', score: '70', status: 'Actif' },
    { category: 'MESSIEURS' as const, rank: '3', name: 'Ibrahim Camara', score: '72', status: 'Actif' },
  ],
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

function pick(row: Record<string, string>, candidates: string[]): string {
  for (const key of candidates) {
    if (row[key] !== undefined && row[key] !== '') return row[key];
  }
  return '';
}

function toItem(row: Record<string, string>): ClassementItem | null {
  const categoryRaw = pick(row, ['categorie', 'category', 'catégorie']).toUpperCase();

  if (!['JUNIORS', 'DAMES', 'MESSIEURS'].includes(categoryRaw)) {
    return null;
  }

  return {
    category: categoryRaw as ClassementItem['category'],
    rank: pick(row, ['rang', 'rank', 'position']),
    name: pick(row, ['nom_complet', 'name']) || `${pick(row, ['prenom', 'prénom'])} ${pick(row, ['nom', 'lastname'])}`.trim(),
    score: pick(row, ['score', 'points', 'moyenne']),
    status: pick(row, ['status', 'statut', 'etat', 'état']) || 'N/A'
  };
}

export async function GET() {
  try {
    const response = await fetch(SHEET_URL, { cache: 'no-store' });
    
    if (!response.ok) {
      console.log('Google Sheets fetch failed, using mock data');
      return NextResponse.json(MOCK_DATA);
    }

    const csv = await response.text();
    const lines = csv.trim().split(/\r?\n/);

    if (lines.length < 2) {
      return NextResponse.json(MOCK_DATA);
    }

    const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase());

    const rows = lines
      .slice(1)
      .map((line) => parseCsvLine(line))
      .map((values) =>
        Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])) as Record<string, string>
      )
      .map(toItem)
      .filter((item): item is ClassementItem => item !== null);

    return NextResponse.json({
      juniors: rows.filter((item) => item.category === 'JUNIORS'),
      dames: rows.filter((item) => item.category === 'DAMES'),
      messieurs: rows.filter((item) => item.category === 'MESSIEURS')
    } satisfies ClassementResponse);
  } catch (error) {
    console.log('Error fetching data, using mock data:', error);
    return NextResponse.json(MOCK_DATA);
  }
}
