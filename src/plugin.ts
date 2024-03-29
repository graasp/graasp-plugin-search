import { FastifyPluginAsync } from 'fastify';

import graaspPublicPlugin from 'graasp-plugin-public';

import { SearchService } from './db-service';
import { search } from './schemas';
import { TaskManager } from './task-manager';
import { Ranges } from './types';

const publicPlugin: FastifyPluginAsync = async (fastify) => {
  const {
    taskRunner: runner,
    public: { graaspActor, publishedTagId },
  } = fastify;
  const searchService = new SearchService(publishedTagId);
  const taskManager = new TaskManager(searchService);

  if (!graaspPublicPlugin) {
    throw new Error('Public plugin is not correctly defined');
  }

  const getTaskByRange = (member, keyword, range) => {
    switch (range) {
      case Ranges.Title:
        return taskManager.createSearchByTitleTask(member, keyword);
      case Ranges.Tag:
        return taskManager.createSearchByTagTask(member, keyword);
      case Ranges.All:
        return taskManager.createSearchByAllTask(member, keyword);
      case Ranges.Author:
        return taskManager.createSearchByAuthorTask(member, keyword);
    }
  };

  // search for items with keyword
  // range: title, tag, all, author
  fastify.get<{ Params: { keyword: string; range: string } }>(
    '/search/:range/:keyword',
    { schema: search },
    async ({ params: { keyword, range }, log }) => {
      const task = getTaskByRange(graaspActor, keyword, range);
      return runner.runSingle(task, log);
    },
  );
};

export default publicPlugin;
