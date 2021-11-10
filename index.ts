import { FastifyPluginAsync } from "fastify";
import { Item } from "graasp";

export interface GraaspSearchOptions {
  someProperty: string;
}

const plugin: FastifyPluginAsync<GraaspSearchOptions> = async (fastify, options) => {
  const {
    items: { taskManager },
    taskRunner: runner,
    log: defaultLogger,
  } = fastify;

  // get (and update) s3 file item metadata - item's 'extra'
  fastify.get<{ Params: IdParam }>(
    "/:id",
    { schema: getMetadataSchema },
    async ({ member, params: { id }, log }) => {
      // do something
    }
  );
};

export default plugin;
