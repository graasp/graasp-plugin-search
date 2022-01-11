// global
import { FastifyLoggerInstance } from 'fastify';
import { Actor, Task, TaskStatus, IndividualResultType, PreHookHandlerType, PostHookHandlerType, DatabaseTransactionHandler } from 'graasp';
// local
import { SearchService } from '../db-service';

export abstract class BaseSearchTask<R> implements Task<Actor, R> {
  protected searchService: SearchService;
  protected _result: R;
  protected _message: string;

  readonly actor: Actor;

  status: TaskStatus;
  data: Partial<IndividualResultType<R>>;
  preHookHandler: PreHookHandlerType<R>;
  postHookHandler: PostHookHandlerType<R>;

  skip?: boolean;
  input?: unknown;
  getInput?: () => unknown;
  getResult?: () => unknown;

  constructor(actor: Actor, searchService: SearchService) {
    this.actor = actor;
    this.searchService = searchService;
    this.status = 'NEW';
  }

  abstract get name(): string;
  get result(): R { return this._result; }
  get message(): string { return this._message; }

  abstract run(handler: DatabaseTransactionHandler, log?: FastifyLoggerInstance): Promise<void | BaseSearchTask<R>[]>;
}