import { Actor, ItemService } from '@graasp/sdk';

import { SearchService } from './db-service';
import { SearchTaskManager } from './interfaces/search-task-manager';
import { SearchByAllTask } from './tasks/search-by-all-task';
import { SearchByAuthorTask } from './tasks/search-by-author-task';
import { SearchByTagTask } from './tasks/search-by-tag-task';
import { SearchByTitleTask } from './tasks/search-by-title-task';

export class TaskManager implements SearchTaskManager {
  private searchService: SearchService;
  private itemService: ItemService;

  constructor(searchService: SearchService) {
    this.searchService = searchService;
    this.itemService = this.itemService;
  }

  getSearchByTitleTaskName(): string {
    return SearchByTitleTask.name;
  }
  getSearchByTagTaskName(): string {
    return SearchByTagTask.name;
  }
  getSearchByAllTaskName(): string {
    return SearchByAllTask.name;
  }
  getSearchByAuthorTaskName(): string {
    return SearchByAuthorTask.name;
  }

  createSearchByTitleTask(member: Actor, keyword: string): SearchByTitleTask {
    return new SearchByTitleTask(member, this.searchService, {
      keyword: keyword,
    });
  }

  createSearchByTagTask(member: Actor, keyword: string): SearchByTagTask {
    return new SearchByTagTask(member, this.searchService, {
      keyword: keyword,
    });
  }

  createSearchByAllTask(member: Actor, keyword: string): SearchByAllTask {
    return new SearchByAllTask(member, this.searchService, {
      keyword: keyword,
    });
  }

  createSearchByAuthorTask(member: Actor, keyword: string): SearchByAuthorTask {
    return new SearchByAuthorTask(member, this.searchService, {
      keyword: keyword,
    });
  }
}
