const pool = require('../../database/postgres/pool');
const container = require('../../container');
const createServer = require('../createServer');

const EndpointTestHelper = require('../../../../tests/EndpointTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');

describe('/threads endpoint', () => {
  let accessToken;
  let userId;

  beforeEach(async () => {
    const data = await EndpointTestHelper.getAccessTokenAndUserIdHelper();
    accessToken = data.accessToken;
    userId = data.userId;
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await EndpointTestHelper.cleanTables();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'judul',
        body: 'isi',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread).toHaveProperty('id');
      expect(responseJson.data.addedThread).toHaveProperty('title', requestPayload.title);
      expect(responseJson.data.addedThread).toHaveProperty('owner', userId);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'judul',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 'judul',
        body: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai',
      );
    });

    it('should response 401 when access token not provided', async () => {
      // Arrange
      const requestPayload = {
        title: 'judul',
        body: 'isi',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toEqual('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 when request valid', async () => {
      // Arrange
      const userData1 = {
        id: 'user-1',
        username: 'username1',
        password: 'secret',
        fullname: 'full name 1',
      };
      await UsersTableTestHelper.addUser(userData1);

      const userData2 = {
        id: 'user-2',
        username: 'username2',
        password: 'secret',
        fullname: 'full name 2',
      };
      await UsersTableTestHelper.addUser(userData2);

      const threadData = {
        id: 'thread-123',
        title: 'judul',
        body: 'isi',
        owner: userData1.id,
        date: new Date('2024-10-01'),
      };
      await ThreadsTableTestHelper.addThread(threadData);

      const commentData1 = {
        id: 'comment-1',
        threadId: threadData.id,
        content: 'komentar 1',
        date: new Date('2024-10-02'),
        owner: userData1.id,
      };
      await CommentsTableTestHelper.addComment(commentData1);

      const commentData2 = {
        id: 'comment-2',
        threadId: threadData.id,
        content: 'komentar 2',
        date: new Date('2024-10-03'),
        owner: userData2.id,
        isDeleted: true,
      };
      await CommentsTableTestHelper.addComment(commentData2);

      const replyData1 = {
        id: 'reply-1',
        commentId: commentData1.id,
        content: 'balasan 1',
        date: new Date('2024-10-04'),
        owner: userData1.id,
      };
      await RepliesTableTestHelper.addReply(replyData1);

      const replyData2 = {
        id: 'reply-2',
        commentId: commentData1.id,
        content: 'balasan 2',
        date: new Date('2024-10-04'),
        owner: userData2.id,
        isDeleted: true,
      };
      await RepliesTableTestHelper.addReply(replyData2);

      const expectedThread = {
        id: threadData.id,
        title: threadData.title,
        body: threadData.body,
        date: threadData.date.toISOString(),
        username: userData1.username,
        comments: [
          {
            id: commentData1.id,
            content: commentData1.content,
            date: commentData1.date.toISOString(),
            username: userData1.username,
            replies: [
              {
                id: replyData1.id,
                content: replyData1.content,
                date: replyData1.date.toISOString(),
                username: userData1.username,
              },
              {
                id: replyData2.id,
                content: '**balasan telah dihapus**',
                date: replyData2.date.toISOString(),
                username: userData2.username,
              },
            ],
          },
          {
            id: commentData2.id,
            content: '**komentar telah dihapus**',
            date: commentData2.date.toISOString(),
            username: userData2.username,
            replies: [],
          },
        ],
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadData.id}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread).toStrictEqual(expectedThread);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const threadId = 'not-found';
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Thread tidak ditemukan');
    });
  });
});
