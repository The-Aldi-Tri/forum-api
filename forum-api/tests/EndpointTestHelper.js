/* istanbul ignore file */
const createServer = require('../src/Infrastructures/http/createServer');
const container = require('../src/Infrastructures/container');

const UsersTableTestHelper = require('./UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('./AuthenticationsTableTestHelper');

const EndpointTestHelper = {
  async getAccessTokenAndUserIdHelper() {
    const server = await createServer(container);
    const randomNumber = Math.floor(Math.random() * 1000);

    const userPayload = {
      username: `user${randomNumber}`,
      password: `secret${randomNumber}`,
      fullname: `full name ${randomNumber}`,
    };

    const responseUser = await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload,
    });

    const responseAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: userPayload.username,
        password: userPayload.password,
      },
    });

    const { id: userId } = JSON.parse(responseUser.payload).data.addedUser;
    const { accessToken } = JSON.parse(responseAuth.payload).data;
    return { accessToken, userId };
  },

  async cleanTables() {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  },
};

module.exports = EndpointTestHelper;
