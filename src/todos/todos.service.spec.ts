import "dotenv/config"
import { Test, TestingModule } from '@nestjs/testing';
import { DrizzleModule, getDrizzleToken, InjectDrizzle } from '@nestjs/drizzle';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { sql } from "drizzle-orm";

import { TodosService } from './todos.service.js';
import { todos } from "../db/schema.js";

describe('TodosService', () => {
  let service: TodosService;
  let db: NodePgDatabase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DrizzleModule.forRoot({ drizzle, connection: process.env.DATABASE_TEST_URL! }),],
      providers: [TodosService],
    }).compile();

    service = module.get<TodosService>(TodosService);
    db = module.get(getDrizzleToken())
  });

  afterEach(async () => {
    if(db){
      await db.execute(sql`TRUNCATE TABLE ${todos} RESTART IDENTITY CASCADE;`)
    }
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create todo', async () => {
    const todo = await service.create('Wake up at 5 AM');
    expect(todo).toBeDefined();
    expect(todo.task).toEqual('Wake up at 5 AM');
    expect(todo.status).toEqual('pending');
    expect(todo.createdAt).toBeDefined();
    expect(todo.updatedAt).toBeDefined();
  });

  it('should get all todos', async () => {
    await service.create('Go to gym');
    await service.create('Read book');
    const todos = await service.getAll();
    expect(todos).toBeDefined();
    expect(todos.length).toEqual(2);
  });

  it('should get todo by id', async () => {
    const createdTodo = await service.create('Run for 1km');
    const todo = await service.getById(createdTodo.id);
    expect(todo).toBeDefined();
    expect(todo.task).toEqual('Run for 1km');
  });

  it('should update a todo', async () => {
    const createdTodo = await service.create('10 Pushups');
    const updatedTodo = await service.update(createdTodo.id, 'completed');
    expect(updatedTodo).toBeDefined();
    expect(updatedTodo.status).toEqual('completed');
  });

  it('should delete a todo', async () => {
    const createdTodo = await service.create('10 Pullups');
    const deletedTodo = await service.delete(createdTodo.id);
    expect(deletedTodo).toBeDefined();
    expect(deletedTodo.task).toEqual('10 Pullups');
  });
});
