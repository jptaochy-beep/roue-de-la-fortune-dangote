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

    const juniors: ClassementItem[] = [];
    const dames: ClassementItem[] = [];
    const messieurs: ClassementItem[] = [];

    let currentCategory: 'JUNIORS' | 'DAMES' | 'MESSIEURS' | null = null;
    let rank = 0;

    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = parseCsvLine(line);

      if (values.length < 3) continue;

      const col0 = values[0].trim();
      const col1 = values[1].trim();
      const col2 = values[2].trim();

      // Check if this is a category header line (check if col1 OR col2 are empty, not just col0)
      if ((col0 === 'JUNIORS' || col0 === 'JUNIORS SERIES') && col1 === '') {
        currentCategory = 'JUNIORS';
        rank = 0;
        continue;
      } else if (col0 === 'DAMES' && col1 === '') {
        currentCategory = 'DAMES';
        rank = 0;
        continue;
      } else if (col0 === 'MESSIEURS' && col1 === '') {
        currentCategory = 'MESSIEURS';
        rank = 0;
        continue;
      }

      // Skip if we haven't found a category yet
      if (!currentCategory) continue;

      // Skip header rows (Prénom, Nom columns)
      if (col0 === 'Prénom' || col0 === '') continue;

      // Try to parse as player data
      // Format: FirstName | LastName | Score
      const firstName = col0;
      const lastName = col1;
      const score = col2 || '0';

      // Only add if firstName and lastName are not empty and have reasonable values
      // Numeric scores should be numbers, but names should contain letters
      if (firstName && lastName && firstName !== 'Nom') {
        // Check if firstName looks like a name (not all numbers)
        if (!/^\d+$/.test(firstName)) {
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
      }
    }

    console.log('Parsed data - JUNIORS: ' + juniors.length + ', DAMES: ' + dames.length + ', MESSIEURS: ' + messieurs.length);

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
