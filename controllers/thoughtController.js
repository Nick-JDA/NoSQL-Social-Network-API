const { User, Thought } = require("../models");

module.exports = {
  // get to get all thoughts
  async getThoughts(req, res) {
    try {
      const thought = await Thought.find();
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get to get a single thought by its id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!thought) {
        return res.status(404).json({ message: "No thoughts with that ID" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // post to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: "Thought created, but found no user with that ID" });
      }

      res.json("Created thought");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // put to update a thought by its id
  async updateThought(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body},
            { runValidators: true, new: true }
        );

        if (!thought) {
            res.status(404).json({ message: 'No thought with this ID'});
        }

        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
  },

  // delete to remove a thought by its id
  async deleteThought(req, res) {
    try {
        const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

        if (!thought) {
            res.status(404).json({ message: 'No thought with that ID' });
        }

        await User.deleteMany({ _id: { $in: thought.users }});
        res.json({ message: 'Thought and users deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
  },

  //-------------------------------------
  // api/thoughts/:thoughtId/reactions

  // post to create a reaction stored in a single thought's reactions array field
  async createReaction(req, res) {
    console.log('You are adding a reaction');
    console.log(req.body);

    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.params.reactionId }},
            { runValidators: true, new: true }
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' })
        }

        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
  },

  // delete to pull and remove a reaction by the reaction's reactionId value
  async deleteReaction(req, res) {
    try {
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId }}},
            { runValidators: true, new: true}
        );

        if (!thought) {
            return res.status(404).json({ message: 'No thought with that ID' });
        }
        
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
  },
};
