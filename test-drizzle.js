import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { inArray, eq } from 'drizzle-orm';
const submissions = sqliteTable('submissions', { id: text('id') });
const cond = inArray(submissions.id, ['1', '2']);
console.log(cond.queryChunks);
