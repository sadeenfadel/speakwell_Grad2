const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const { User, Parent, Therapist } = require('./models/User');

const app = express();

// EJS
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configure session middleware
app.use(
  session({
    secret: 'your_secret_key', // Replace with a secure key
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Middleware to set loggedIn variable
app.use((req, res, next) => {
  res.locals.loggedIn = !!req.session.userId;
  res.locals.username = req.session.username;
  res.locals.userRole = req.session.userRole;
  next();
});

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/speakWell')
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log(err));

// Middleware to check if the user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.userId) {
    next(); // If logged in, proceed to the next middleware/route handler
  } else {
    res.redirect('/login'); // If not logged in, redirect to the login page
  }
};

// Routes
app.get('/signup', (req, res) => {
  res.render('login');
});

app.post('/signup', async (req, res) => {
  const { username, email, password, cpassword, userType } = req.body;

  // Check if passwords match
  if (password !== cpassword) {
    return res.send('Passwords do not match!');
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.send('Username already exists!');
    }

    // Create new user based on userType
    let user;
    if (userType === 'Parent') {
      user = new Parent({ username, email, password });
    } else if (userType === 'Therapist') {
      user = new Therapist({ username, email, password });
    } else {
      return res.send('Invalid user type!');
    }

    await user.save();

    req.session.userId = user._id; // Store user ID in session
    console.log(req.session.userId, user._id);
    req.session.username = user.username;
    req.session.userRole = userType;

    if (userType === 'Parent') {
      // Render parent view
      res.redirect(`/addChild?parentId=${user._id}`);
      // res.render('parent', { username: user.username });
    } else if (userType === 'Therapist') {
      // Render therapist view
      res.render('Therapist_Profile', { username: user.username });
    } else {
      // Handle invalid userType
      res.send('Invalid user type!');
    }
  } catch (err) {
    console.log(err);
    res.send('Error creating user!');
  }
});

app.get('/addChild', async (req, res) => {
  const { parentId } = req.query;
  if (!parentId) {
    return res.send('Parent ID is missing!');
  }

  try {
    const parent = await Parent.findById(parentId);
    if (!parent) {
      return res.send('Parent not found!');
    }

    res.render('child', { parentId, parentName: parent.username });
  } catch (err) {
    console.log(err);
    res.send('Error retrieving parent information!');
  }
});

app.post('/addtherapist', async (req, res) => {
  const {
    qualifications,
    certifications,
    experience,
    specialization,
    about,
    profilePhoto,
  } = req.body;
  const userId = new mongoose.Types.ObjectId(req.session.userId); // Replace with an actual ObjectId from your database
  console.log(userId);
  const result = await User.aggregate([{ $match: { _id: userId } }]);
  let user = await User.findOne({
    email: result[0].email,
  });

  const therapist = {
    qualifications,
    certifications,
    experience,
    specialization,
    about,
    profilePhoto,
  };
  user.qualifications = qualifications;
  user.certifications = certifications;
  user.experience = experience;
  user.about = about;
  user.specialization = specialization;
  user.profilePhoto = profilePhoto;
  user.save();
  return res.render('therapist', { username: user.username });
});

app.post('/addChild', async (req, res) => {
  const { parentId, name, age, profilePhoto, bio, interests } = req.body;

  try {
    const parent = await Parent.findById(parentId);
    if (!parent) {
      console.log(`Parent ID not found: ${parentId}`); // Debug information
      return res.send('Parent not found!');
    }

    const newKid = {
      name,
      age,
      parentName: parent.username,
      profilePhoto,
      bio,
      interests: interests.split(',').map((interest) => interest.trim()),
    };

    parent.kids.push(newKid);
    await parent.save();
    const therapists = await Therapist.find();

    res.render('parent', { username: parent.username, therapists });
  } catch (err) {
    console.log(err);
    res.send('Error adding child!');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      req.session.userId = user._id; // Store user ID in session
      req.session.username = user.username;
      req.session.userRole = user.role;

      // Redirect based on user's role
      if (user.role === 'Parent') {
        res.redirect(`/parentDashboard?username=${user.username}`);
      } else if (user.role === 'Therapist') {
        res.redirect(`/therapistDashboard?username=${user.username}`);
      } else {
        res.send('Invalid user type!');
      }
    } else {
      res.send('Invalid username or password!');
    }
  } catch (err) {
    res.send('Error logging in!');
  }
});

// Route to render parent dashboard
app.get('/parentDashboard', async (req, res) => {
  const { username } = req.query;
  const therapists = await Therapist.find();

  res.render('parent', { username, therapists });
});
app.post('/sendBookingData', async (req, res) =>{
  const parent = await Parent.findById(req.session.userId);
  if(!parent){
    return res.redirect('/login')
  }
  const therapist = await Therapist.findById(req.body.therapistId);
  therapist.appointments = [...therapist.appointments, {
    appointmentName: `Appointment with ${parent.username} and ${parent.kids[0].name}`,
    date: req.body.date,
    time: req.body.time,
    kidName: parent.kids[0].name,
    parentName: parent.username,
  }]
  // Save the appointment to the database
  await therapist.save();
  return res.redirect(`/parentDashboard?username=${parent.username}`)
})
// Route to render therapist dashboard
app.get('/therapistDashboard', (req, res) => {
  const { username } = req.query;
  res.render('therapist', { username });
});
app.get('/matching-game', (req, res) => {
  res.render('g');
});
app.get('/celebrate', (req, res) => {
  res.render('celebrate');
});
// Route to render the session page
app.get('/session', async (req, res) => {
  try {
    if (req.session.userRole === 'Parent') {
      // If user is a parent, fetch and render child data
      const parent = await Parent.findById(req.session.userId, {
        'kids.name': 1,
        'kids.age': 1,
      });
      const childData = parent.kids.map((child) => ({
        name: child.name,
        age: child.age,
      }));
      res.render('session', { childData, username: req.session.username });
    } else {
      // If user is not a parent, render an error message or redirect to a different page
      res.send('Only parents can access this page!');
    }
  } catch (err) {
    console.error('Error fetching session data:', err);
    res.send('Error fetching session data!');
  }
});

app.get('/profile', async (req, res) => {
  try {
    // Check if the user is logged in and is a therapist
    if (req.session.userId && req.session.userRole === 'Therapist') {
      let therapist = await Therapist.findById(req.session.userId);
      return res.render('profile', { therapist, isTherapist: (req.session.userId && req.session.userRole === 'Therapist') });
    } else {
      let therapist = await Therapist.findById(req.query.therapistId);
      if (req.session.userRole === 'Parent') {
        // If user is a parent, fetch and render child data
        const parent = await Parent.findById(req.session.userId, {
          'kids.name': 1,
          'kids.age': 1,
        });
        const childData = parent.kids.map((child) => ({
          name: child.name,
          age: child.age,
        }));
        return res.render('profile', { therapist, isTherapist: false });
      }
    }
  } catch (err) {
    console.error('Error fetching therapist data:', err);
    return res.send('Error fetching therapist data!');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Error logging out!');
    }
    res.redirect('/');
  });
});

app.get('/appointment', async (req, res) => {
  if (req.session.userId && req.session.userRole === 'Therapist') {
    const therapist = await Therapist.findById(req.session.userId);
    const appointments = therapist.appointments
    return res.render('appointment', {appointments});
  }
  return res.send('err')
});
app.get('/', async (req, res) => {
  const therapists = await Therapist.find();
  res.render('home', {therapists});
});
app.get('*', (req, res) => {
  res.status(404).send('Error 404');
});

const PORT = 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
