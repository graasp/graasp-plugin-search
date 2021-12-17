// global
import { Item } from 'graasp';
import { sql, DatabaseTransactionConnectionType as TrxHandler } from 'slonik';
// local

/**
 * Database's first layer of abstraction for Categorys
 */
export class SearchService {
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

  // return items contain keyword in title
  async getItemsMatchTitle(keyword: string, transactionHandler: TrxHandler): Promise<Item[]> {
    console.log('to db query');
    return (
      transactionHandler
        .query<Item>(
          sql`
          WITH published_item_paths AS (
            SELECT item_path FROM item_tag
            WHERE tag_id = 'ea9a3b4e-7b67-44c2-a9df-528b6ae5424f'
          )
          SELECT ${SearchService.allColumns}
          FROM item
          WHERE name ILIKE ${keyword}
            AND path in (SELECT item_path FROM published_item_paths)
        `,
        )
        .then(({ rows }) => rows.slice(0))
    );
  }

  // return items contain keyword in tags
  async getItemsMatchTag(keyword: string, transactionHandler: TrxHandler): Promise<Item[]> {
    return (
      transactionHandler
        .query<Item>(
          sql`
          WITH published_item_paths AS (
            SELECT item_path FROM item_tag
            WHERE tag_id = 'ea9a3b4e-7b67-44c2-a9df-528b6ae5424f'
          )
          SELECT ${SearchService.allColumns}
          FROM item
          WHERE settings->>'tags' ILIKE ${keyword} 
            AND path in (SELECT item_path FROM published_item_paths)
        `,
        )
        .then(({ rows }) => rows.slice(0))
    );
  }
}