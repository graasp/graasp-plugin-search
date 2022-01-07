// global
import { DatabaseTransactionHandler, Item, Member } from 'graasp';
// local
import { SearchService } from '../db-service';
import { BaseSearchTask } from './base-search-task';

type InputType = { keyword: string };

export class SearchByAuthorTask extends BaseSearchTask<Item[]> {
  input: InputType;
  getInput: () => InputType;

  get name(): string {
    return SearchByAuthorTask.name;
  }

  constructor(member: Member, searchService: SearchService, input: InputType) {
    super(member, searchService);
    this.input = input;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    const { keyword } = this.input;
    const formattedKeyword = `%${keyword}%`;
    const items = await this.searchService.getItemsMatchAuthor(formattedKeyword, handler);

    this.status = 'OK';
    this._result = items;
  }
}