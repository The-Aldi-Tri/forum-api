const ReplyDetails = require('../ReplyDetails');

describe('a ReplyDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action and Assert
    expect(() => new ReplyDetails(payload)).toThrowError(
      'REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: true,
      date: 'now',
      username: 99,
      is_deleted: 'yes',
    };

    // Action and Assert
    expect(() => new ReplyDetails(payload)).toThrowError(
      'REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create replyDetails object correctly', () => {
    // Arrange
    const payload1 = {
      id: 'reply-123',
      content: 'isi reply',
      date: new Date(),
      username: 'someone',
      is_deleted: false,
    };

    const payload2 = {
      id: 'reply-1234',
      content: 'isi reply 2',
      date: new Date(),
      username: 'someone',
      is_deleted: true,
    };

    // Action
    const {
      id: id1, username: username1, date: date1, content: content1,
    } = new ReplyDetails(payload1);

    const {
      id: id2, username: username2, date: date2, content: content2,
    } = new ReplyDetails(payload2);

    // Assert
    expect(id1).toEqual(payload1.id);
    expect(username1).toEqual(payload1.username);
    expect(date1).toEqual(payload1.date);
    expect(content1).toEqual(payload1.content);

    // Assert
    expect(id2).toEqual(payload2.id);
    expect(username2).toEqual(payload2.username);
    expect(date2).toEqual(payload2.date);
    expect(content2).toEqual('**balasan telah dihapus**');
  });
});
