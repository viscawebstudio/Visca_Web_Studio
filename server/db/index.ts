import * as schema from './schema.ts';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// Parse conditions from Drizzle EQ/InArray
function parseSQLCondition(cond: any) {
  if (!cond || !cond.queryChunks || !Array.isArray(cond.queryChunks)) {
    return { field: '', value: null, operator: 'all' };
  }
  
  const chunks = cond.queryChunks;
  const columnChunk = chunks.find((c: any) => c && typeof c === 'object' && c.name && c.dataType);
  if (!columnChunk) {
    return { field: '', value: null, operator: 'all' };
  }
  
  const field = columnChunk.name;
  
  const operatorChunk = chunks.find((c: any) => c && typeof c === 'object' && c.value && Array.isArray(c.value) && typeof c.value[0] === 'string' && (c.value[0].includes(' = ') || c.value[0].includes(' in ')));
  let operator = 'eq';
  if (operatorChunk) {
    const opStr = operatorChunk.value[0];
    if (opStr.includes(' in ')) {
      operator = 'in';
    }
  }
  
  let value: any = null;
  if (operator === 'in') {
    const arrayChunk = chunks.find((c: any) => Array.isArray(c));
    if (arrayChunk) {
      value = arrayChunk.map((p: any) => p && p.value !== undefined ? p.value : p);
    } else {
      const paramChunk = chunks.find((c: any) => c && typeof c === 'object' && c.value !== undefined);
      if (paramChunk) {
        value = Array.isArray(paramChunk.value) ? paramChunk.value : [paramChunk.value];
      }
    }
  } else {
    const paramChunk = chunks.find((c: any) => c && typeof c === 'object' && c.value !== undefined && c.constructor && c.constructor.name === 'Param');
    if (paramChunk) {
      value = paramChunk.value;
    }
  }
  
  return { field, value, operator };
}

class JsonDatabase {
  private filePath: string;

  constructor() {
    // In Vercel serverless environments, write to /tmp/submissions.json
    if (process.env.VERCEL) {
      this.filePath = path.join('/tmp', 'submissions.json');
      const srcPath = path.join(process.cwd(), 'submissions.json');
      if (!fs.existsSync(this.filePath)) {
        try {
          if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, this.filePath);
            console.log('submissions.json copied to /tmp successfully');
          } else {
            fs.writeFileSync(this.filePath, '[]', 'utf8');
            console.log('No submissions.json found, starting with empty array in /tmp');
          }
        } catch (err) {
          console.error('Error copying/initializing submissions.json in /tmp:', err);
        }
      }
    } else {
      this.filePath = path.join(process.cwd(), 'submissions.json');
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, '[]', 'utf8');
      }
    }
  }

  private readData(): any[] {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf8');
        return JSON.parse(content);
      }
    } catch (e) {
      console.error('Error reading json database:', e);
    }
    return [];
  }

  private writeData(data: any[]) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Error writing to json database:', e);
    }
  }

  insert(table: any) {
    return {
      values: async (record: any) => {
        const data = this.readData();
        const normalizedRecord = { ...record };
        if (record.submittedAt !== undefined) {
          normalizedRecord.submittedAt = record.submittedAt;
        }
        data.push(normalizedRecord);
        this.writeData(data);
        return { lastInsertRowid: data.length };
      }
    };
  }

  select() {
    return {
      from: (table: any) => {
        const data = this.readData();
        let filtered = [...data];
        
        const builder: any = {
          where: (condition: any) => {
            const { field, value, operator } = parseSQLCondition(condition);
            if (field) {
              if (operator === 'eq') {
                filtered = filtered.filter(item => {
                  const itemVal = item[field] !== undefined ? item[field] : (field === 'submitted_at' ? item.submittedAt : undefined);
                  return String(itemVal) === String(value);
                });
              } else if (operator === 'in' && Array.isArray(value)) {
                filtered = filtered.filter(item => {
                  const itemVal = item[field] !== undefined ? item[field] : (field === 'submitted_at' ? item.submittedAt : undefined);
                  return value.map(String).includes(String(itemVal));
                });
              }
            }
            return builder;
          },
          limit: (n: number) => {
            filtered = filtered.slice(0, n);
            return builder;
          },
          then: (resolve: any, reject: any) => {
            const mapped = filtered.map(item => ({
              ...item,
              submittedAt: item.submittedAt || item.submitted_at || ''
            }));
            return Promise.resolve(mapped).then(resolve, reject);
          }
        };

        return builder;
      }
    };
  }

  update(table: any) {
    return {
      set: (updateValues: any) => {
        return {
          where: async (condition: any) => {
            const data = this.readData();
            const { field, value, operator } = parseSQLCondition(condition);
            let updatedCount = 0;
            if (field) {
              const updatedData = data.map(item => {
                const itemVal = item[field] !== undefined ? item[field] : (field === 'submitted_at' ? item.submittedAt : undefined);
                let matches = false;
                if (operator === 'eq') {
                  matches = String(itemVal) === String(value);
                } else if (operator === 'in' && Array.isArray(value)) {
                  matches = value.map(String).includes(String(itemVal));
                }
                if (matches) {
                  updatedCount++;
                  return { ...item, ...updateValues };
                }
                return item;
              });
              if (updatedCount > 0) {
                this.writeData(updatedData);
              }
            }
            return { changes: updatedCount };
          }
        };
      }
    };
  }

  delete(table: any) {
    return {
      where: async (condition: any) => {
        const data = this.readData();
        const { field, value, operator } = parseSQLCondition(condition);
        let deletedCount = 0;
        if (field) {
          const filteredData = data.filter(item => {
            const itemVal = item[field] !== undefined ? item[field] : (field === 'submitted_at' ? item.submittedAt : undefined);
            let matches = false;
            if (operator === 'eq') {
              matches = String(itemVal) === String(value);
            } else if (operator === 'in' && Array.isArray(value)) {
              matches = value.map(String).includes(String(itemVal));
            }
            if (matches) {
              deletedCount++;
              return false;
            }
            return true;
          });
          if (deletedCount > 0) {
            this.writeData(filteredData);
          }
        }
        return { changes: deletedCount };
      }
    };
  }
}

let db: any;
let isJsonDb = false;

try {
  const Database = require('better-sqlite3');
  const { drizzle } = require('drizzle-orm/better-sqlite3');
  
  let dbPath = path.join(process.cwd(), 'sqlite.db');

  if (process.env.VERCEL) {
    const tmpPath = path.join('/tmp', 'sqlite.db');
    if (!fs.existsSync(tmpPath)) {
      if (fs.existsSync(dbPath)) {
        fs.copyFileSync(dbPath, tmpPath);
      }
    }
    dbPath = tmpPath;
  }

  const sqlite = new Database(dbPath);
  db = drizzle(sqlite, { schema });
  console.log('Initialized drizzle with better-sqlite3 successfully');
} catch (err: any) {
  console.log('Failed to load better-sqlite3, falling back to JsonDatabase:', err.message);
  db = new JsonDatabase();
  isJsonDb = true;
}

export { db, isJsonDb };
