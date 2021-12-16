// global
import { FastifyPluginAsync } from 'fastify';

// local
import { SearchService } from './db-service';
import { TaskManager } from './task-manager';

const plugin: FastifyPluginAsync = async (fastify) => {
  const {
    taskRunner: runner
  } = fastify;
  const searchService = new SearchService();
  const taskManager = new TaskManager(searchService);

  // TODO: schema

  const getTaskByRange = (keyword, range, member) => {
    switch (range) {
      case 'title':
        return taskManager.createSearchByTitleTask(member, keyword);
      case 'tag':
        return taskManager.createSearchByTagTask(member, keyword);
    }
  }

  // search for items with keyword
  // range: title, tag
  // TODO: search for author and ALL
  fastify.get<{ Params: { keyword: string, range: string }; }>(
    '/search/:range/:keyword',
    async ({ member, params: { keyword, range }, log }) => {
      const task = getTaskByRange(keyword, range, member);
      return runner.runSingle(task, log);
    },
  );

};

export default plugin;