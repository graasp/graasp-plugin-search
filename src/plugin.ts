// global
import { FastifyPluginAsync } from 'fastify';

// local
import { SearchService } from './db-service';
import { TaskManager } from './task-manager';
import { search } from './schemas';
import { GraaspSearchPluginOptions } from './types';

const plugin: FastifyPluginAsync<GraaspSearchPluginOptions> = async (fastify, options) => {
  const {
    taskRunner: runner
  } = fastify;
  const searchService = new SearchService(options.publishedTagId);
  const taskManager = new TaskManager(searchService);

  enum ranges {
    title = 'title',
    tag = 'tag',
    all = 'all',
    author = 'author'
  }

  const getTaskByRange = (member, keyword, range) => {
    switch (range) {
      case ranges.title:
        return taskManager.createSearchByTitleTask(member, keyword);
      case ranges.tag:
        return taskManager.createSearchByTagTask(member, keyword);
      case ranges.all:
        return taskManager.createSearchByAllTask(member, keyword);
      case ranges.author:
        return taskManager.createSearchByAuthorTask(member, keyword);
    }
  };

  // search for items with keyword
  // range: title, tag, all, author
  fastify.get<{ Params: { keyword: string, range: string }; }>(
    '/search/:range/:keyword',
    { schema: search },
    async ({ member, params: { keyword, range }, log }) => {
      const task = getTaskByRange(member, keyword, range);
      return runner.runSingle(task, log);
    },
  );

};

export default plugin;