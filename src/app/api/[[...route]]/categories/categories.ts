import { Hono } from 'hono';
import { db } from '@/database/connection';
import { categoriesTable, insertCategoriesSchema } from '@/database/schema';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, eq, inArray } from 'drizzle-orm';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

export const categoriesRoutes = new Hono()
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
      .select({ id: categoriesTable.id, name: categoriesTable.name })
      .from(categoriesTable)
      .where(eq(categoriesTable.userId, auth!.userId!));

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
      .from(categoriesTable)
      .where(and(eq(categoriesTable.userId, auth?.userId!), eq(categoriesTable.id, param.id!)));

    if (!data) {
      return c.json({ error: 'Account not found' }, 404);
    }

    return c.json({ data });
  })
  .post('/', zValidator('json', insertCategoriesSchema.pick({ name: true })), async (c) => {
    const auth = getAuth(c);
    const userId = auth!.userId!;

    const reqBody = c.req.valid('json');

    const existingCategory = await db
      .select()
      .from(categoriesTable)
      .where(and(eq(categoriesTable.userId, userId), eq(categoriesTable.name, reqBody.name)))
      .limit(1)
      .execute();

    if (existingCategory.length > 0) {
      return c.json({ error: 'Category already exists' }, 409);
    }

    const [data] = await db
      .insert(categoriesTable)
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
        .delete(categoriesTable)
        .where(and(eq(categoriesTable.userId, userId), inArray(categoriesTable.id, reqBody.ids)))
        .returning({ id: categoriesTable.id });

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
    zValidator('json', insertCategoriesSchema.pick({ name: true })),
    async (c) => {
      const auth = getAuth(c);

      const { id } = c.req.valid('param');
      const { name } = c.req.valid('json');

      if (!id) {
        return c.json({ error: 'missing id' }, 400);
      }

      const existingCategory = await db
        .select()
        .from(categoriesTable)
        .where(and(eq(categoriesTable.userId, auth?.userId!), eq(categoriesTable.name, name)))
        .limit(1)
        .execute();

      if (existingCategory.length > 0) {
        return c.json({ error: 'Category already exists' }, 409);
      }

      const [data] = await db
        .update(categoriesTable)
        .set({ name })
        .where(and(eq(categoriesTable.userId, auth?.userId!), eq(categoriesTable.id, id)))
        .returning();

      if (!data) {
        return c.json({ error: 'Category not found' }, 404);
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
        .delete(categoriesTable)
        .where(and(eq(categoriesTable.userId, auth?.userId!), eq(categoriesTable.id, id)))
        .returning({ id: categoriesTable.id });

      if (!data) {
        return c.json({ error: 'Category not found' }, 404);
      }

      return c.json({ data });
    },
  );
