const User = require('../models/User');
const bcrypt = require('bcryptjs');
const auth = require('../auth');

module.exports.registerUser = async (req, res) => {
    try {
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const existingUsername = await User.findOne({ username: req.body.username });
        if (existingUsername) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        if (!req.body.email.includes('@')) {
            return res.status(400).json({ error: 'Email invalid' });
        } else if (req.body.password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        } else if (req.body.username.length < 4) {
            return res.status(400).json({ error: 'Username must be at least 4 characters' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username
        });

        await newUser.save();
        res.status(201).json({ message: 'Registered Successfully' });
    } catch (error) {
        console.error('Error in saving the user: ', error);
        res.status(500).json({ error: 'Error in Save' });
    }
};

module.exports.loginUser = async (req, res) => {
  try {
    let user;

    if (req.body.email.includes('@')) {
      user = await User.findOne({ email: req.body.email });
    } else {
      user = await User.findOne({ username: req.body.email });
    }

    if (!user) {
      return res.status(401).json({ error: 'No user found' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email/username and password do not match' });
    }

    // Store user ID in session storage (replace with your session library)
    req.session.userId = user._id;

    const accessToken = auth.createAccessToken(user);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error in finding the user: ', error);
    res.status(500).json({ error: 'Error in find' });
  }
};

module.exports.userDetails = (req, res) => {

	return User.findById(req.user.id).then(user => {

		if(!user) {
			return res.status(404).send('User not found');
		}
		user.password = "";
		return res.status(200).send({ user });

	}).catch(findErr => {

		console.error('Error in finding the user: ', findErr);	

		return res.status(500).send({error: 'Failed to fetch user profile'});
	})
};
