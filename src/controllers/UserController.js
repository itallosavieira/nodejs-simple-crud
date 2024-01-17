let users = require('../mocks/users')

module.exports = {
  listUsers(request, response) {
    const isDescendingOrder = request.query.order === 'desc';
    const sortedUsers = users.sort((a, b) => {
      if (isDescendingOrder) {
        return b.id - a.id;
      }
      return a.id - b.id;
    })
    response.send(200, sortedUsers);
  },

  getUserById(request, response) {
    const { id } = request.params;
    const user = users.find((user) => user.id === Number(id));

    if (!user) {
      return response.send(400, { error: 'User not found.' });
    }
    response.send(200, user);
  },

  createUser(request, response) {
    const { name, username, email } = request.body;
    const userAscOrderById = users.sort((a, b) =>  a.id - b.id);
    const lastUserId = userAscOrderById[users.length - 1].id;
    const newUser = {
      id: lastUserId + 1,
      name,
      username,
      email
    };

    users.push(newUser);
    response.send(200, newUser);
  },

  updateUser(request, response) {
    let { id } = request.params;
    const { name, username, email } = request.body;

    id = Number(id);
    const userExists = users.find((user) => user.id === id);

    if (!userExists) {
      return response.send(400, { error: 'User not found.' });
    }

    users = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          name,
          username,
          email
        };
      }
      return user;
    })
    response.send(200, { id, name, username, email });
  },

  deleteUser(request, response) {
    let { id } = request.params;

    id = Number(id);
    users = users.filter((user) => user.id !== id);

    response.send(200, { deleted: true });
  },
}