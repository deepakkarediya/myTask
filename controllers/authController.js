const Regis = require("../models/Regis");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "deep404";

exports.createRegis = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, dob } = req.body;
  const imageUrl = req.file.path;
  //console.log(imageUrl);
  const errors = [];
  if (!firstName) {
    errors.push({ firstName: "First name is required." });
  }
  if (!lastName) {
    errors.push({ lastName: "Last name is required." });
  }
  if (!email) {
    errors.push({ email: "Email is required." });
  } else if (!validateEmail(email)) {
    errors.push({ email: "Invalid email address." });
  } else if (await emailAlreadyExists(email)) {
    errors.push({ email: "Email address is already registered." });
  }
  if (!phoneNumber) {
    errors.push({ phoneNumber: "Phone number is required." });
  }
  if (!password) {
    errors.push({ password: "Password is required." });
  } else if (password.length < 6) {
    errors.push({ password: "Password must have at least 6 characters." });
  }
  if (!dob) {
    errors.push({ dob: "Date of birth is required." });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    var salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    registration = await Regis.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      dob: dob,
      image: imageUrl,
    });

    res.send({ message: "successfully registered" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
};

// login api
exports.createLogin = async (req, res) => {
  try {
    let success = false;
    const errors = [];
    const { email, password } = req.body;
    if (!email) {
      errors.push({ email: "Email is required." });
    } else if (!validateEmail(email)) {
      errors.push({ email: "Invalid email address." });
    }
    if (!password) {
      errors.push({ password: "Password is required." });
    } else if (password.length < 6) {
      errors.push({ password: "Password must have at least 6 characters." });
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    let regis = await Regis.findOne({ email: email });
    if (!regis) {
      return res
        .status(400)
        .json({ errors: "please enter a valid email address " });
    }
    const passwordCompare = await bcrypt.compare(password, regis.password);
    if (!passwordCompare) {
      return res.status(400).json({ errors: "Enter a valid password" });
    }

    const data = {
      regis: {
        id: regis.id,
      },
    };
    //  const authtoken = jwt.sign({ data }, { secretKey }, { expireIn: "2h" },(err,token)=>{
    //       if(err)
    // {
    //   res.send({result:"something went wrong"})
    // }
    // res.send({user,auth:token})
    // });

    const authtoken = jwt.sign(data, secretKey, { expiresIn: "5s" });
    success = true;
    res.send({
      success,
      message: "successfully login",
      authtoken: authtoken,
      //user: regis,
    });
    // res.send({ message: "successfully login", user: user, authtoken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

function validateEmail(email) {
  const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

  return emailRegex.test(email);
}

async function emailAlreadyExists(email) {
  try {
    let regis = await Regis.findOne({ email: email });
    // if (regis) {
    //     return res.status(200).json({ success, error: "email already exists" })
    // }
    return regis !== null;
  } catch (err) {
    console.error(err);
    return false; // Return false in case of an error
  }
}
