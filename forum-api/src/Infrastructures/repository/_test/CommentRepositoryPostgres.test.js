const pool = require('../../database/postgres/pool');

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NewComment = require('../../../Domains/comments/entities/NewComment');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    });
    await ThreadsTableTestHelper.addThread({
      id: 'thread-123',
      title: 'judul',
      body: 'isi',
      owner: 'user-123',
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'isi komen',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById(
        'comment-123',
      );
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = {
        threadId: 'thread-123',
        content: 'isi komen',
        owner: 'user-123',
      };
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(
        newComment,
      );

      // Assert
      expect(addedComment).toStrictEqual(
        {
          id: 'comment-123',
          content: 'isi komen',
          owner: 'user-123',
        },
      );
    });
  });

  describe('verifyCommentExist function', () => {
    it('should throw NotFoundError when comment is not exist', async () => {
      // Arrange
      const commentId = 'must be not found';

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentExist(commentId),
      ).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is exist', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-123',
        content: 'isi komen',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentExist('comment-123'),
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when record with commentId and userId is not exist', async () => {
      // Arrange
      const commentId = 'must be not found';
      const userId = 'lost people';

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner({ commentId, userId }),
      ).rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when record with commentId and userId is exist', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-123',
        content: 'isi komen',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action & Assert
      await expect(
        commentRepositoryPostgres.verifyCommentOwner({
          commentId: 'comment-123',
          userId: 'user-123',
        }),
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({
        id: commentId,
        thread_id: 'thread-123',
        content: 'isi komen',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const result = await CommentsTableTestHelper.findCommentById(commentId);
      expect(result[0]).toHaveProperty('is_deleted', true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const commentDate1 = new Date();
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: 'thread-123',
        content: 'isi komen 1',
        owner: 'user-123',
        date: commentDate1,
      });

      // Add a delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      const commentDate2 = new Date();
      await CommentsTableTestHelper.addComment({
        id: 'comment-1234',
        thread_id: 'thread-123',
        content: 'isi komen 2',
        owner: 'user-123',
        date: commentDate2,
      });

      await CommentsTableTestHelper.markDeleted('comment-1234');

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator,
      );

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-123',
      );

      // Assert
      expect(comments).toHaveLength(2);

      expect(comments[0]).toHaveProperty('id', 'comment-123');
      expect(comments[0]).toHaveProperty('username', 'dicoding');
      expect(comments[0]).toHaveProperty('date', commentDate1);
      expect(comments[0]).toHaveProperty('content', 'isi komen 1');
      expect(comments[0]).toHaveProperty('is_deleted', false);

      expect(comments[1]).toHaveProperty('id', 'comment-1234');
      expect(comments[1]).toHaveProperty('username', 'dicoding');
      expect(comments[1]).toHaveProperty('date', commentDate2);
      expect(comments[1]).toHaveProperty('content', 'isi komen 2');
      expect(comments[1]).toHaveProperty('is_deleted', true);

      expect(comments[0].date.getTime()).toBeLessThanOrEqual(
        comments[1].date.getTime(),
      );
    });
  });
});
