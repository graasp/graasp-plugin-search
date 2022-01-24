import { PublicItemTaskManager } from 'graasp-plugin-public';
import {
  ItemMembershipTaskManager,
  ItemTaskManager,
  TaskRunner,
} from 'graasp-test';
import { StatusCodes } from 'http-status-codes';
import publicPlugin from '../src/plugin';
import build from './app';
import {
  buildItem,
} from './constants';

const itemTaskManager = new ItemTaskManager();
const runner = new TaskRunner();
const itemMembershipTaskManager = {} as unknown as ItemMembershipTaskManager;
const publicItemTaskManager = {} as unknown as PublicItemTaskManager;

describe('Public Keyword Search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /search/:range/:keyword', () => {
    it('Get search result', async () => {
      const app = await build({
        plugin: publicPlugin,
        runner,
        itemMembershipTaskManager,
        itemTaskManager,
        publicItemTaskManager,
      });

      const result = buildItem();
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => result);

      const res = await app.inject({
        method: 'GET',
        url: '/search/all/test',
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
    it('Throw if range is invalid', async () => {
      const app = await build({
        plugin: publicPlugin,
        runner,
        itemMembershipTaskManager,
        itemTaskManager,
        publicItemTaskManager,
      });

      const res = await app.inject({
        method: 'GET',
        url: '/search/invalid-range/test',
      });
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
