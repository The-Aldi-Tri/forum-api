const pool = require("../../database/postgres/pool");

const NewReply = require("../../../Domains/replies/entities/NewReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");

const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("ReplyRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({
      id: "user-123",
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    });
    await ThreadsTableTestHelper.addThread({
      id: "thread-123",
      title: "judul",
      body: "isi",
      owner: "user-123",
    });
    await CommentsTableTestHelper.addComment({
      id: "comment-123",
      thread_id: "thread-123",
      content: "isi komen",
      owner: "user-123",
    });
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addReply function", () => {
    it("should persist new reply and return added reply correctly", async () => {
      // Arrange
      const newReply = new NewReply({
        commentId: "comment-123",
        content: "isi reply",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById("reply-123");
      expect(reply).toHaveLength(1);
    });

    it("should return added reply correctly", async () => {
      // Arrange
      const newReply = new NewReply({
        commentId: "comment-123",
        content: "isi reply",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(
        new AddedReply({
          id: "reply-123",
          content: "isi reply",
          owner: "user-123",
        })
      );
    });
  });

  describe("verifyReplyExist function", () => {
    it("should throw NotFoundError when reply is not exist", async () => {
      // Arrange
      const replyId = "must be not found";

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyExist(replyId)
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when reply is exist", async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        comment_id: "comment-123",
        content: "isi reply",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyExist("reply-123")
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("verifyReplyOwner function", () => {
    it("should throw AuthorizationError when record with replyId and userId is not exist", async () => {
      // Arrange
      const replyId = "must be not found";
      const userId = "lost people";

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner({ replyId, userId })
      ).rejects.toThrowError(AuthorizationError);
    });

    it("should not throw AuthorizationError when record with replyId and userId is exist", async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({
        id: "reply-123",
        comment_id: "comment-123",
        content: "isi reply",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action & Assert
      await expect(
        replyRepositoryPostgres.verifyReplyOwner({
          replyId: "reply-123",
          userId: "user-123",
        })
      ).resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe("deleteReplyById function", () => {
    it("should delete reply correctly", async () => {
      // Arrange
      const replyId = "reply-123";
      await RepliesTableTestHelper.addReply({
        id: replyId,
        comment_id: "comment-123",
        content: "isi reply",
        owner: "user-123",
      });

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await replyRepositoryPostgres.deleteReplyById(replyId);

      // Assert
      const result = await RepliesTableTestHelper.findReplyById(replyId);
      expect(result[0]).toHaveProperty("is_deleted", true);
    });
  });
});
