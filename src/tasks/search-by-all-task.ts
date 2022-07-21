import {
  Actor,
  DatabaseTransactionHandler,
  Item,
  TaskStatus,
} from '@graasp/sdk';

import { SearchService } from '../db-service';
import { BaseSearchTask } from './base-search-task';

type InputType = { keyword: string };

export class SearchByAllTask extends BaseSearchTask<Item[]> {
  input: InputType;
  getInput: () => InputType;

  get name(): string {
    return SearchByAllTask.name;
  }

  constructor(member: Actor, searchService: SearchService, input: InputType) {
    super(member, searchService);
    this.input = input;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;

    const { keyword } = this.input;
    // preprocess keywords: convert it from 'A B C' to 'A:* & B:* & C:*', ':*' is used for prefix matching in Full Text Search
    const keywordSequence = `${keyword
      .split(' ')
      .map((entry) => entry.trim())
      .join(':* & ')}:*`;
    const items = await this.searchService.getItemsMatchAny(
      keywordSequence,
      handler,
    );

    this.status = TaskStatus.OK;
    this._result = items;
  }
}
