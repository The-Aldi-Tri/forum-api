const NewComment = require('../../Domains/comments/entities/NewComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newComment = new NewComment(useCasePayload);
    await this._threadRepository.verifyThreadExist(newComment.threadId);
    const addedComment = await this._commentRepository.addComment(newComment);
    return new AddedComment(addedComment);
  }
}

module.exports = AddCommentUseCase;
