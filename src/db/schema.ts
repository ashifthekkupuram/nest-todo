import { pgTable, pgEnum, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const status = pgEnum('status', ['pending', 'completed']);

export const todos = pgTable('todos', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  task: text('task').notNull(),
  status: status().default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Todo = typeof todos.$inferSelect
export type NewTodo = typeof todos.$inferInsert

export type Status = (typeof status.enumValues)[number] 