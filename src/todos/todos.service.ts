import { Injectable } from '@nestjs/common';
import { InjectDrizzle } from '@nestjs/drizzle';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { todos, type Todo, type Status } from '../db/schema.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class TodosService {
  constructor(
    @InjectDrizzle()
    private readonly db: NodePgDatabase,
  ) {}

  getAll(): Promise<Todo[]> {
    return this.db.select().from(todos);
  }

  async getById(id: number): Promise<Todo> {
    const [todo] = await this.db.select().from(todos).where(eq(todos.id, id));
    return todo;
  }

  async create(task: string): Promise<Todo> {
    const [todo] = await this.db.insert(todos).values({ task }).returning();
    return todo;
  }

  async update(id: number, status: Status): Promise<Todo> {
    const [todo] = await this.db
      .update(todos)
      .set({ status })
      .where(eq(todos.id, id))
      .returning();

    return todo;
  }

  async delete(id: number): Promise<Todo> {
    const [todo] = await this.db
      .delete(todos)
      .where(eq(todos.id, id))
      .returning();
    return todo;
  }
}
