import { DurableObject } from 'cloudflare:workers';

export class ExampleDurableObject extends DurableObject {
  savedData: string | undefined;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    void ctx.blockConcurrencyWhile(async () => {
      // Initialize the table if it doesn't exist
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS state (
          key TEXT PRIMARY KEY,
          value TEXT
        )
      `);

      // Load initial data
      const result = this.ctx.storage.sql
        .exec<{ value: string }>("SELECT value FROM state WHERE key = 'savedData'")
        .toArray();
      if (result.length > 0) {
        this.savedData = result[0]?.value;
      }
    });
  }

  async saveData(data: string) {
    this.ctx.storage.sql.exec(
      "INSERT OR REPLACE INTO state (key, value) VALUES ('savedData', ?)",
      data
    );
    this.savedData = data;
  }
}
