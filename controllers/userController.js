const { User } = require("../models");

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();

      res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // get a single user by id and populated thought and friend data
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select("-__v")
        .populate("friends")
        .populate("thoughts");

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // post create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // put to update a user by its id
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // delete to remove user by its id
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: "That user does not exist" });
      }
      res.json({ message: "User deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //-------------------------------------
  // api/users/:userId/friends/:friendId

  // post to add a new friend to a users friend list
  async addFriend(req, res) {
    console.log("Adding a friend");
    console.log(req.body);

    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete to remove a friend from a user's friend list
  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: { friendId: req.params.friendId } } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user found with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
