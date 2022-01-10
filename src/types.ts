import { Actor } from 'graasp';

export interface GraaspSearchPluginOptions {
  publishedTagId: string;
  graaspActor: Actor;
}

export enum Ranges {
  Title = 'title',
  Tag = 'tag',
  All = 'all',
  Author = 'author',
}