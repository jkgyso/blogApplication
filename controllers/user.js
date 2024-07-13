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

module.exports.loginUser = (req, res) => {
    const searchField = req.body.email.includes('@') ? 'email' : 'username'; // Determine search field
    const searchValue = req.body.email;
  
    return User.findOne({ [searchField]: searchValue }) // Dynamic search based on email/username
      .then(user => {
        if (!user) {
          return res.status(404).send({ error: 'No User Found' }); // User not found
        }
  
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);
        if (isPasswordCorrect) {
          return res.status(200).send({ access: auth.createAccessToken(user) }); // Login successful
        } else {
          return res.status(401).send({ error: 'Username/Email and password do not match' }); // Invalid credentials
        }
      })
      .catch(findErr => {
        console.error('Error in finding the user: ', findErr);
        return res.status(500).send({ error: 'Error in find' }); // Server error
      });
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
