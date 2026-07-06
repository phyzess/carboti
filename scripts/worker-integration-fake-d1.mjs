export class FakeD1Database {
  constructor(database) {
    this.database = database;
  }

  prepare(sql) {
    return new FakeD1PreparedStatement(this.database, sql);
  }

  async batch(statements) {
    const results = [];
    for (const statement of statements) {
      results.push(await statement.run());
    }
    return results;
  }
}

class FakeD1PreparedStatement {
  constructor(database, sql, params = []) {
    this.database = database;
    this.sql = sql;
    this.params = params;
  }

  bind(...params) {
    return new FakeD1PreparedStatement(this.database, this.sql, params);
  }

  async first() {
    return this.database.prepare(this.sql).get(...this.params) ?? null;
  }

  async all() {
    return {
      results: this.database.prepare(this.sql).all(...this.params),
      success: true,
      meta: {},
    };
  }

  async run() {
    const result = this.database.prepare(this.sql).run(...this.params);
    return {
      success: true,
      meta: {
        changes: result.changes,
        last_row_id: result.lastInsertRowid,
      },
    };
  }
}
