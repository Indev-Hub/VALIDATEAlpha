import { mock } from '../lib/axios';
import createResourceId from '../utils/createResourceId';
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from '../utils/jwt';
import wait from '../utils/wait';

const users = [
  {
    id: '5e86809283e28b96d2d38537',
    avatar: '/static/mock-images/avatars/avatar-jane_rotanson.png',
    email: 'demo@devias.io',
    name: 'Jane Rotanson',
    password: 'Password123!',
    plan: 'Premium'
  }
];

mock
  .onPost('/api/authentication/login')
  .reply(async (config) => {
    await wait(1000);

    try {
      const { email, password } = JSON.parse(config.data);

      // Find the user
      const user = users.find((_user) => _user.email === email);

      if (!user || (user.password !== password)) {
        return [400, { message: 'Please check your email and password' }];
      }

      // Create the access token
      const accessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return [
        200, {
          accessToken,
          user: {
            id: user.id,
            avatar: user.avatar,
            email: user.email,
            name: user.name,
            plan: user.plan
          }
        }
      ];
    } catch (err) {
      console.error('[Mock]: ', err);
      return [500, { message: 'Internal server error' }];
    }
  });

mock
  .onPost('/api/authentication/register')
  .reply(async (config) => {
    await wait(1000);

    try {
      const { email, name, password } = JSON.parse(config.data);

      // Check if a user already exists
      let user = users.find((_user) => _user.email === email);

      if (user) {
        return [400, { message: 'User already exists' }];
      }

      user = {
        id: createResourceId(),
        avatar: null,
        email,
        name,
        password,
        plan: 'Standard'
      };

      users.push(user);

      const accessToken = sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return [
        200, {
          accessToken,
          user: {
            id: user.id,
            avatar: user.avatar,
            email: user.email,
            name: user.name,
            plan: user.plan
          }
        }
      ];
    } catch (err) {
      console.error('[Mock]: ', err);
      return [500, { message: 'Internal server error' }];
    }
  });

mock
  .onGet('/api/identity/me')
  .reply((config) => {
    try {
      // Ensure authorization is provided
      const { Authorization } = config.headers;

      if (!Authorization) {
        return [401, { message: 'Authorization required' }];
      }

      // Extract access token
      const accessToken = Authorization.split(' ')[1];

      // Decode access token
      const { userId } = decode(accessToken);

      // Find the user
      const user = users.find((_user) => _user.id === userId);

      if (!user) {
        return [401, { message: 'Invalid authorization token' }];
      }

      return [
        200, {
          user: {
            id: user.id,
            avatar: user.avatar,
            email: user.email,
            name: user.name,
            plan: user.plan
          }
        }
      ];
    } catch (err) {
      console.error('[Mock]: ', err);
      return [500, { message: 'Internal server error' }];
    }
  });
