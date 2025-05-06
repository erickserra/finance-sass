import { Hono } from 'hono';
import { db } from '@/database/connection';
import { accounts, categoriesTable, insertTransactionsSchema, transactionsTable } from '@/database/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { subDays, parse } from 'date-fns';

export const transactionsRoutes = new Hono()
  .use(clerkMiddleware())
  .use('/*', async (c, next) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return next();
  })
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const query = c.req.valid('query');

      const to = query?.to ? parse(query.to, 'yyyy-MM-dd', new Date()) : new Date();
      const from = query?.from ? parse(query.from, 'yyyy-MM-dd', new Date()) : subDays(to, 30);

      const data = await db
        .select({
          id: transactionsTable.id,
          date: transactionsTable.date,
          payee: transactionsTable.payee,
          amount: transactionsTable.amount,
          notes: transactionsTable.notes,
          categoryId: transactionsTable.categoryId,
          accountId: transactionsTable.accountId,
          category: categoriesTable.name,
          account: accounts.name,
        })
        .from(transactionsTable)
        .innerJoin(accounts, eq(transactionsTable.accountId, accounts.id))
        .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
        .where(
          and(
            query?.accountId ? eq(transactionsTable.accountId, query.accountId) : undefined,
            eq(accounts.userId, auth!.userId!),
            gte(transactionsTable.date, from),
            lte(transactionsTable.date, to),
          ),
        )
        .orderBy(desc(transactionsTable.date));

      return c.json({ data });
    },
  )
  .get('/:id', zValidator('param', z.object({ id: z.string().optional() })), async (c) => {
    const auth = getAuth(c);
    const param = c.req.valid('param');

    if (!param.id) {
      return c.json({ error: 'id is required' }, 400);
    }

    const [data] = await db
      .select({
        id: transactionsTable.id,
        date: transactionsTable.date,
        payee: transactionsTable.payee,
        amount: transactionsTable.amount,
        notes: transactionsTable.notes,
        categoryId: transactionsTable.categoryId,
        accountId: transactionsTable.accountId,
        category: categoriesTable.name,
        accounts: accounts.name,
      })
      .from(transactionsTable)
      .innerJoin(accounts, eq(transactionsTable.accountId, accounts.id))
      .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
      .where(and(eq(accounts.userId, auth?.userId!), eq(transactionsTable.id, param.id)));

    if (!data) {
      return c.json({ error: 'Account not found' }, 404);
    }

    return c.json({ data });
  })
  .post('/', zValidator('json', insertTransactionsSchema.omit({ id: true })), async (c) => {
    const reqBody = c.req.valid('json');

    const [data] = await db
      .insert(transactionsTable)
      .values({
        id: createId(),
        ...reqBody,
      })
      .returning();

    return c.json({ data });
  })
  .post('/bulk-create', zValidator('json', z.array(insertTransactionsSchema.omit({ id: true }))), async (c) => {
    const body = c.req.valid('json');

    const data = await db
      .insert(transactionsTable)
      .values(
        body.map((item) => ({
          id: createId(),
          ...item,
        })),
      )
      .returning();

    return c.json({ data });
  })
  .post(
    '/bulk-delete',
    zValidator(
      'json',
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const userId = auth?.userId!;

      const reqBody = c.req.valid('json');

      const transactionsToDelete = db.$with('transactions_to_delete').as(
        db
          .select({ id: transactionsTable.id })
          .from(transactionsTable)
          .innerJoin(accounts, eq(accounts.id, transactionsTable.accountId))
          .where(and(inArray(transactionsTable.id, reqBody.ids), eq(accounts.userId, userId))),
      );

      const data = await db
        .with(transactionsToDelete)
        .delete(transactionsTable)
        .where(inArray(transactionsTable.id, sql`(select id from ${transactionsToDelete})`))
        .returning({ id: transactionsTable.id });

      return c.json({ data });
    },
  )
  .patch(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator('json', insertTransactionsSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);

      const { id } = c.req.valid('param');
      const body = c.req.valid('json');

      if (!id) {
        return c.json({ error: 'missing id' }, 400);
      }

      const transactionsToUpdate = db.$with('transactions_to_update').as(
        db
          .select({ id: transactionsTable.id })
          .from(transactionsTable)
          .innerJoin(accounts, eq(accounts.id, transactionsTable.accountId))
          .where(and(eq(transactionsTable.id, id), eq(accounts.userId, auth?.userId!))),
      );

      const [data] = await db
        .with(transactionsToUpdate)
        .update(transactionsTable)
        .set(body)
        .where(eq(transactionsTable.id, sql`(select id from ${transactionsToUpdate})`))
        .returning();

      if (!data) {
        return c.json({ error: 'Transaction not found' }, 404);
      }

      return c.json({ data });
    },
  )
  .delete(
    '/:id',
    zValidator(
      'param',
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);

      const { id } = c.req.valid('param');

      if (!id) {
        return c.json({ error: 'missing id' }, 400);
      }

      const transactionToDelete = db.$with('transaction_to_delete').as(
        db
          .select({ id: transactionsTable.id })
          .from(transactionsTable)
          .innerJoin(accounts, eq(accounts.id, transactionsTable.accountId))
          .where(and(eq(transactionsTable.id, id), eq(accounts.userId, auth?.userId!))),
      );
      const [data] = await db
        .with(transactionToDelete)
        .delete(transactionsTable)
        .where(eq(transactionsTable.id, sql`(select id from ${transactionToDelete})`))
        .returning({ id: transactionsTable.id });

      if (!data) {
        return c.json({ error: 'Transaction not found' }, 404);
      }

      return c.json({ data });
    },
  );
