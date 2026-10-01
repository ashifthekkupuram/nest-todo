import { Module } from '@nestjs/common';
import { TodosService } from './todos.service.js';

@Module({
  providers: [TodosService]
})
export class TodosModule {}
