const CommentDetails = require('../CommentDetails');

describe('a CommentDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'abc',
    };

    // Action and Assert
    expect(() => new CommentDetails(payload)).toThrowError(
      'COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY',
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 99,
      date: 'now',
      content: true,
    };

    // Action and Assert
    expect(() => new CommentDetails(payload)).toThrowError(
      'COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION',
    );
  });

  it('should create commentDetails object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'someone',
      date: new Date(),
      content: 'isi',
    };

    // Action
    const {
      id, username, date, content,
    } = new CommentDetails(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});
