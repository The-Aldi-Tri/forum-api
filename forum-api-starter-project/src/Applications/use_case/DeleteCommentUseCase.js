class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.verifyCommentExist(useCasePayload.commentId);
    await this._commentRepository.verifyCommentOwner({
      commentId: useCasePayload.commentId,
      userId: useCasePayload.userId,
    });
    await this._commentRepository.deleteCommentById(useCasePayload.commentId);
  }
}

module.exports = DeleteCommentUseCase;
