import fastify, { FastifyPluginAsync } from 'fastify';
import { PublicItemTaskManager } from 'graasp-plugin-public';

import {
  TaskRunner,
  ItemTaskManager,
  ItemMembershipTaskManager,
} from 'graasp-test';
import {
  DEFAULT_GRAASP_ACTOR,
  PUBLIC_TAG_ID,
  PUBLISHED_TAG_ID,
} from './constants';

type props = {
  itemTaskManager: ItemTaskManager;
  runner: TaskRunner;
  itemMembershipTaskManager?: ItemMembershipTaskManager;
  plugin: FastifyPluginAsync;
  publicItemTaskManager?: PublicItemTaskManager;
};

const build = async ({
  plugin,
  itemTaskManager,
  runner,
  itemMembershipTaskManager,
  publicItemTaskManager,
}: props) => {
  const app = fastify({
    ajv: {
      customOptions: {
        // This allow routes that take array to correctly interpret single values as an array
        // https://github.com/fastify/fastify/blob/main/docs/Validation-and-Serialization.md
        coerceTypes: 'array',
      },
    },
  });

  app.decorate('taskRunner', runner);
  app.decorate('items', {
    taskManager: itemTaskManager,
  });
  app.decorate('itemMemberships', {
    taskManager: itemMembershipTaskManager,
  });
  app.decorate('public', {
    publicTagId: PUBLIC_TAG_ID,
    publishedTagId: PUBLISHED_TAG_ID,
    graaspActor: DEFAULT_GRAASP_ACTOR,
    items: { taskManager: publicItemTaskManager },
  });

  await app.register(plugin, {});

  return app;
};
export default build;
