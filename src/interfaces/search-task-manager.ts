// global
import { Actor, Task } from 'graasp';


export interface SearchTaskManager<A extends Actor = Actor> {
  getSearchByTitleTaskName(): string;
  getSearchByTagTaskName(): string;
  getSearchByAllTaskName(): string;

  createSearchByTitleTask(member: A, keyword: string): Task<A, unknown>;
  createSearchByTagTask(member: A, keyword: string): Task<A, unknown>;
  createSearchByAllTask(member: A, keyword: string): Task<A, unknown>;
}