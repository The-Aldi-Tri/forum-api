class GetThreadUseCaseUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload);
    const threadInfo = await this._threadRepository.getThreadById(
      useCasePayload
    );
    const comments = await this._commentRepository.getCommentsByThreadId(
      useCasePayload
    );
    return { ...threadInfo, comments };
  }
}

module.exports = GetThreadUseCaseUseCase;
