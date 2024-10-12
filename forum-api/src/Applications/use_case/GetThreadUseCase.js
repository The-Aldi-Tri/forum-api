const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../Domains/replies/entities/ReplyDetails');

class GetThreadUseCaseUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.verifyThreadExist(useCasePayload);

    const thread = await this._threadRepository.getThreadById(
      useCasePayload,
    );

    const comments = await this._commentRepository.getCommentsByThreadId(
      useCasePayload,
    );

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
        const formattedReplies = replies.map((reply) => new ReplyDetails(reply));

        return new CommentDetails({ ...comment, replies: formattedReplies });
      }),
    );

    return new ThreadDetails({ ...thread, comments: commentsWithReplies });
  }
}

module.exports = GetThreadUseCaseUseCase;
