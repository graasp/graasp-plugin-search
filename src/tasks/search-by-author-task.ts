import {
  Actor,
  DatabaseTransactionHandler,
  Item,
  TaskStatus,
} from '@graasp/sdk';

import { SearchService } from '../db-service';
import { BaseSearchTask } from './base-search-task';

type InputType = { keyword: string };

export class SearchByAuthorTask extends BaseSearchTask<Item[]> {
  input: InputType;
  getInput: () => InputType;

  get name(): string {
    return SearchByAuthorTask.name;
  }

  constructor(member: Actor, searchService: SearchService, input: InputType) {
    super(member, searchService);
    this.input = input;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;

    const { keyword } = this.input;
    const formattedKeyword = `%${keyword}%`;
    const items = await this.searchService.getItemsMatchAuthor(
      formattedKeyword,
      handler,
    );

    this.status = TaskStatus.OK;
    this._result = items;
  }
}
