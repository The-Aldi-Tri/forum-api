class ReplyDetails {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, content, date, username,
    } = this._formatPayload(payload);

    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
  }

  _verifyPayload({
    id, content, date, username, is_deleted: isDeleted,
  }) {
    if (!id || !content || !date || !username || isDeleted === undefined) {
      throw new Error('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof content !== 'string'
      || !(date instanceof Date)
      || typeof username !== 'string'
      || typeof isDeleted !== 'boolean'
    ) {
      throw new Error('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _formatPayload({
    id, content, date, username, is_deleted: isDeleted,
  }) {
    return {
      id,
      content: isDeleted ? '**balasan telah dihapus**' : content,
      date,
      username,
    };
  }
}

module.exports = ReplyDetails;
