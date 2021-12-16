// global
import { DatabaseTransactionHandler, Item, Member } from 'graasp'
// local
import { SearchService } from '../db-service';
import { BaseSearchTask } from './base-search-task';

type InputType = { keyword: string };

export class SearchByTagTask extends BaseSearchTask<Item[]> {
  input: InputType;
  getInput: () => InputType;

  get name(): string {
    return SearchByTagTask.name;
  }

  constructor(input: InputType, member: Member, searchService: SearchService) {
    super(member, searchService);
    this.input = input;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    const { keyword } = this.input;
    const items = await this.searchService.getItemsMatchName(keyword, handler);

    this.status = 'OK';
    this._result = items;
  }
}