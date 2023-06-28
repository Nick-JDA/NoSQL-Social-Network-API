const { User, Thought } = require("../models");

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.findAll();

      const userObj = {
        users,
      };

      res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // get a single user by id and populated thought and friend data
  async getSingleUser(req, res) {},

  // post create a new user
  async createUser(req, res) {},

  // put to update a user by its id
  async updateUser(req, res) {},

  // delete to remove user by its id
  async deleteUser(req, res) {},

  //-------------------------------------
  // api/users/:userId/friends/:friendId

  // post to add a new friend to a users friend list
  async addFriend(req, res) {},

  // delete to remove a friend from a user's friend list
  async deleteFriend(req, res) {},
};
