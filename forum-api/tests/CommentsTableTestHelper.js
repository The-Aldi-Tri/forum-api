/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment(
    {
      id = 'comment-123',
      threadId = 'thread-123',
      content = 'isi komen',
      owner = 'user-123',
      date = new Date(),
      isDeleted = false,
    } = {},
  ) {
    const query = {
      text: 'INSERT INTO comments (id, thread_id, content, owner, date, is_deleted) VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, content, owner, date, isDeleted],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async markDeleted(id) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
