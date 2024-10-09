class GetThreadUseCaseUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload);
    const threadInfo = await this._threadRepository.getThreadById(
      useCasePayload
    );
    const comments = await this._commentRepository.getCommentsByThreadId(
      useCasePayload
    );
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        comment.replies = await this._replyRepository.getRepliesByCommentId(
          comment.id
        );
        return comment;
      })
    );
    return { ...threadInfo, comments: commentsWithReplies };
  }
}

module.exports = GetThreadUseCaseUseCase;
