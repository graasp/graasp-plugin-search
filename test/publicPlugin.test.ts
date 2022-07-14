import { StatusCodes } from 'http-status-codes';

import { PublicItemTaskManager } from 'graasp-plugin-public';
import {
  ItemMembershipTaskManager,
  ItemTaskManager,
  TaskRunner,
} from 'graasp-test';

import publicPlugin from '../src/plugin';
import { Ranges } from '../src/types';
import build from './app';
import { buildItem } from './constants';

const itemTaskManager = new ItemTaskManager();
const runner = new TaskRunner();
const itemMembershipTaskManager = {} as unknown as ItemMembershipTaskManager;
const publicItemTaskManager = {} as unknown as PublicItemTaskManager;

describe('Public Keyword Search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /search/:range/:keyword', () => {
    Object.values(Ranges).forEach((rangeType) => {
      it(`Get search result for ${rangeType}`, async () => {
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
          url: `/search/${rangeType}/test`,
        });
        expect(res.statusCode).toBe(StatusCodes.OK);
        expect(res.json()).toEqual(result);
      });
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
