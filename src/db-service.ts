// global
import { Item } from 'graasp';
import { sql, DatabaseTransactionConnectionType as TrxHandler } from 'slonik';
// local

/**
 * Database's first layer of abstraction for advanced search features
 */
export class SearchService{
  publishedTagId: string;

  constructor(publishedTagId: string){
    this.publishedTagId = publishedTagId;
  }

  private static allColumns = sql.join(
    [
      'id',
      'name',
      'description',
      'type',
      'path',
      'extra',
      'settings',
      'creator',
      ['created_at', 'createdAt'],
      ['updated_at', 'updatedAt'],
    ].map((c) =>
      !Array.isArray(c)
        ? sql.identifier([c])
        : sql.join(
            c.map((cwa) => sql.identifier([cwa])),
            sql` AS `,
          ),
    ),
    sql`, `,
  );

  private static allColumnsForJoinedTable = sql.join(
    [
      ['item.id', 'id'],
      'item.name',
      'description',
      'item.type',
      'path',
      'item.extra',
      'settings',
      'creator',
      ['item.created_at', 'createdAt'],
      ['item.updated_at', 'updatedAt'],
    ].map((c) =>
      !Array.isArray(c)
        ? sql.identifier([c])
        : sql.join(
            c.map((cwa) => sql.identifier([cwa])),
            sql` AS `,
          ),
    ),
    sql`, `,
  );

  /**
  * <keywordSequence>: string, containing formatted keyword. 
  * @return items containing keywords in name
  * Note: When searching with Name, the input will be treated as a single keyword
  */
  async getItemsMatchName(keywordSequence: string, transactionHandler: TrxHandler): Promise<Item[]> {
    return (
      transactionHandler
        .query<Item>(
          sql`
          WITH published_item_paths AS (
            SELECT item_path FROM item_tag
            WHERE tag_id = ${this.publishedTagId}
          )
          SELECT ${SearchService.allColumns}
          FROM item
          WHERE name ILIKE ${keywordSequence}
            AND path in (SELECT item_path FROM published_item_paths)
        `,
        )
        .then(({ rows }) => rows.slice(0))
    );
  }

  /**
  * <keywordSequence>: string, containing formatted keywords
  * @return items containing keywords in tags
  */
  async getItemsMatchTag(keywordSequence: string, transactionHandler: TrxHandler): Promise<Item[]> {
    return (
      transactionHandler
        .query<Item>(
          sql`
          WITH published_item_paths AS (
            SELECT item_path FROM item_tag
            WHERE tag_id = ${this.publishedTagId}
          )
          SELECT ${SearchService.allColumns}
          FROM item
          WHERE to_tsvector(settings->>'tags') @@ to_tsquery(${keywordSequence})
            AND path in (SELECT item_path FROM published_item_paths)
        `,
        )
        .then(({ rows }) => rows.slice(0))
    );
  }


  /**
  * <keywordSequence>: string, containing formatted keywords
  * @return items containing keywords in name, description or tags
  */
  async getItemsMatchAny(keyword: string, transactionHandler: TrxHandler): Promise<Item[]> {
    return (
      transactionHandler
        .query<Item>(
          sql`
          WITH published_item_paths AS (
            SELECT item_path FROM item_tag
            WHERE tag_id = ${this.publishedTagId}
          )
          SELECT ${SearchService.allColumns}
          FROM item
          WHERE to_tsvector(
            name || ' ' || coalesce(description, '') || ' ' || coalesce(settings->>'tags', '')
            ) @@ to_tsquery(${keyword})
            AND path in (SELECT item_path FROM published_item_paths)
        `,
        ) // this query concatenate name, description and tags into a single document. to_tsvector is a built-in function from Postgresql,
          // which converts the text document into a group of vectors, and compare it to tsquery. to_tsquery converts query string into 
          // vectors in a similar way. 
        .then(({ rows }) => rows.slice(0))
    );
  }

    /**
  * <keywordSequence>: string, containing formatted keyword (single keyword)
  * @return items containing keyword in author name
  */
    async getItemsMatchAuthor(keywordSequence: string, transactionHandler: TrxHandler): Promise<Item[]> {
    return (
      transactionHandler
        .query<Item>(
          sql`
          WITH published_item_paths AS (
            SELECT item_path FROM item_tag
            WHERE tag_id = ${this.publishedTagId}
          ),
          matching_authors AS (
            SELECT id AS author_id FROM member
            WHERE name ILIKE ${keywordSequence}
          )
          SELECT ${SearchService.allColumns}
          FROM item
          WHERE creator in (SELECT author_id FROM matching_authors)
            AND path in (SELECT item_path FROM published_item_paths)
        `,
        )
        .then(({ rows }) => rows.slice(0))
    );
  }
}

