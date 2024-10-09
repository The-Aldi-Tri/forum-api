class NewComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { thread_id, content, owner } = payload;

    this.thread_id = thread_id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload({ thread_id, content, owner }) {
    if (!thread_id || !content || !owner) {
      throw new Error("NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof thread_id !== "string" ||
      typeof content !== "string" ||
      typeof owner !== "string"
    ) {
      throw new Error("NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = NewComment;
