import { ItemService, Member } from 'graasp';
import { SearchService } from './db-service';
import { SearchTaskManager } from './interfaces/search-task-manager';
import { SearchByAllTask } from './tasks/search-by-all-task';
import { SearchByTagTask } from './tasks/search-by-tag-task';
import { SearchByTitleTask } from './tasks/search-by-title-task';


export class TaskManager implements SearchTaskManager {
  private searchService: SearchService;
  private itemService: ItemService;

  constructor(searchService: SearchService) {
    this.searchService = searchService;
    this.itemService = this.itemService;
  }

  getSearchByTitleTaskName(): string { return SearchByTitleTask.name; }
  getSearchByTagTaskName(): string { return SearchByTagTask.name; }
  getSearchByAllTaskName(): string { return SearchByAllTask.name; }

  createSearchByTitleTask(member: Member, keyword: string): SearchByTitleTask {
    return new SearchByTitleTask({keyword: keyword}, member, this.searchService);
  }

  createSearchByTagTask(member: Member, keyword: string): SearchByTagTask {
    return new SearchByTagTask({keyword: keyword}, member, this.searchService);
  }

  createSearchByAllTask(member: Member, keyword: string): SearchByAllTask {
    return new SearchByAllTask({keyword: keyword}, member, this.searchService);
  }
}