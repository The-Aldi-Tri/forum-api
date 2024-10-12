/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply(
    {
      id = 'reply-123',
      commentId = 'comment-123',
      content = 'isi reply',
      owner = 'user-123',
      date = new Date(),
      isDeleted = false,
    } = {},
  ) {
    const query = {
      text: 'INSERT INTO replies (id, content, comment_id, owner, date, is_deleted) VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, commentId, owner, date, isDeleted],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async markDeleted(id) {
    const query = {
      text: 'UPDATE replies SET is_deleted = true WHERE id = $1',
      values: [id],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
