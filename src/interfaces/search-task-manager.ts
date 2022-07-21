import { Actor, Task } from '@graasp/sdk';

export interface SearchTaskManager<A extends Actor = Actor> {
  getSearchByTitleTaskName(): string;
  getSearchByTagTaskName(): string;
  getSearchByAllTaskName(): string;
  getSearchByAuthorTaskName(): string;

  createSearchByTitleTask(member: A, keyword: string): Task<A, unknown>;
  createSearchByTagTask(member: A, keyword: string): Task<A, unknown>;
  createSearchByAllTask(member: A, keyword: string): Task<A, unknown>;
  createSearchByAuthorTask(member: A, keyword: string): Task<A, unknown>;
}
