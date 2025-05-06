import { relations } from 'drizzle-orm';
import { text, pgTable, integer, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  plaidId: text('plaid_id'),
  userId: text('user_id').notNull(),
});
export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactionsTable),
}));
export const insertAccountSchema = createInsertSchema(accounts);

export const categoriesTable = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  plaidId: text('plaid_id'),
  userId: text('user_id').notNull(),
});
export const categoriesRelations = relations(categoriesTable, ({ many }) => ({
  transactions: many(transactionsTable),
}));
export const insertCategoriesSchema = createInsertSchema(categoriesTable);

export const transactionsTable = pgTable('transactions', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  payee: text('payee').notNull(),
  notes: text('notes'),
  date: timestamp('date', { mode: 'date' }).notNull(),
  plaidId: text('plaid_id'),
  accountId: text('account_id')
    .references(() => accounts.id, { onDelete: 'cascade' })
    .notNull(),
  categoryId: text('category_id').references(() => categoriesTable.id, { onDelete: 'set null' }),
});
export const transactionsRelations = relations(transactionsTable, ({ one }) => ({
  account: one(accounts, {
    fields: [transactionsTable.accountId],
    references: [accounts.id],
  }),
  category: one(categoriesTable, {
    fields: [transactionsTable.categoryId],
    references: [categoriesTable.id],
  }),
}));
export const insertTransactionsSchema = createInsertSchema(transactionsTable, {
  date: z.coerce.date(),
});

export const schemas = {
  accounts,
  insertAccountSchema,
};
