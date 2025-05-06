import { Hono } from 'hono';
import { db } from '@/database/connection';
import { schemas } from '@/database/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, eq, inArray } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

export const accountsRoutes = new Hono()
  .use(clerkMiddleware())
  .use('/*', async (c, next) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    return next();
  })
  .get('/', async (c) => {
    const auth = getAuth(c);
    const data = await db
      .select({ id: schemas.accounts.id, name: schemas.accounts.name })
      .from(schemas.accounts)
      .where(eq(schemas.accounts.userId, auth!.userId!));

    return c.json({ data });
  })
  .get('/:id', zValidator('param', z.object({ id: z.string().optional() })), async (c) => {
    const auth = getAuth(c);
    const param = c.req.valid('param');

    if (!param.id) {
      return c.json({ error: 'id is required' }, 400);
    }

    const [data] = await db
      .select()
      .from(schemas.accounts)
      .where(and(eq(schemas.accounts.userId, auth?.userId!), eq(schemas.accounts.id, param.id!)));

    if (!data) {
      return c.json({ error: 'Account not found' }, 404);
    }

    return c.json({ data });
  })
  .post('/', zValidator('json', schemas.insertAccountSchema.pick({ name: true })), async (c) => {
    const auth = getAuth(c);
    const userId = auth!.userId!;

    const reqBody = c.req.valid('json');

    const existingAccount = await db
      .select()
      .from(schemas.accounts)
      .where(and(eq(schemas.accounts.userId, userId), eq(schemas.accounts.name, reqBody.name)))
      .limit(1)
      .execute();

    if (existingAccount.length > 0) {
      return c.json({ error: 'Account already exists' }, 409);
    }

    const [data] = await db
      .insert(schemas.accounts)
      .values({
        id: createId(),
        name: reqBody.name,
        plaidId: null,
        userId: userId,
      })
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

      const data = await db
        .delete(schemas.accounts)
        .where(and(eq(schemas.accounts.userId, userId), inArray(schemas.accounts.id, reqBody.ids)))
        .returning({ id: schemas.accounts.id });

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
    zValidator('json', schemas.insertAccountSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);

      const { id } = c.req.valid('param');
      const { name } = c.req.valid('json');

      if (!id) {
        return c.json({ error: 'missing id' }, 400);
      }

      const existingAccount = await db
        .select()
        .from(schemas.accounts)
        .where(and(eq(schemas.accounts.userId, auth?.userId!), eq(schemas.accounts.name, name)))
        .limit(1)
        .execute();

      if (existingAccount.length > 0) {
        return c.json({ error: 'Account already exists' }, 409);
      }

      const [data] = await db
        .update(schemas.accounts)
        .set({ name })
        .where(and(eq(schemas.accounts.userId, auth?.userId!), eq(schemas.accounts.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: 'Account not found' }, 404);
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

      const [data] = await db
        .delete(schemas.accounts)
        .where(and(eq(schemas.accounts.userId, auth?.userId!), eq(schemas.accounts.id, id)))
        .returning({ id: schemas.accounts.id });

      if (!data) {
        return c.json({ error: 'Account not found' }, 404);
      }

      return c.json({ data });
    },
  );
