const NewComment = require("../NewComment");

describe("a NewComment entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      content: "abc",
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      thread_id: 123,
      content: "abc",
      owner: true,
    };

    // Action and Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create newComment object correctly", () => {
    // Arrange
    const payload = {
      thread_id: "thread-123",
      content: "isi komen",
      owner: "user321",
    };

    // Action
    const { thread_id, content, owner } = new NewComment(payload);

    // Assert
    expect(thread_id).toEqual(payload.thread_id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
