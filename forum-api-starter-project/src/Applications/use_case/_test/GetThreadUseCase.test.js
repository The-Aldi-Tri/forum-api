const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const GetThreadUseCase = require("../GetThreadUseCase");

describe("GetThreadUseCase", () => {
  /**
   * Menguji apakah use case mampu mengorkestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the get thread action correctly", async () => {
    // Arrange
    const useCasePayload = "thread-123";

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve(1));
    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({}));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ id: "comment-123" }]));
    mockReplyRepository.getRepliesByCommentId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(
      useCasePayload
    );
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload
    );
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith(
      "comment-123"
    );
  });
});
