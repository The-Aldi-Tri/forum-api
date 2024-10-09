const ReplyDetails = require("../ReplyDetails");

describe("a ReplyDetails entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      content: "abc",
    };

    // Action and Assert
    expect(() => new ReplyDetails(payload)).toThrowError(
      "REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: 123,
      content: true,
      date: "now",
      username: 99,
    };

    // Action and Assert
    expect(() => new ReplyDetails(payload)).toThrowError(
      "REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create replyDetails object correctly", () => {
    // Arrange
    const payload = {
      id: "reply-123",
      content: "isi reply",
      date: new Date(),
      username: "someone",
    };

    // Action
    const { id, username, date, content } = new ReplyDetails(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
