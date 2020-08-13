const yup = require('yup');

const schema = yup.object().shape({
    name: yup.string().trim().min(2).required(),
    email: yup.string().trim().email().required(),
    password: yup.string().min(8).max(100).required(),
    role: yup.string().min(4).trim().notRequired()
  });

  module.exports = schema;