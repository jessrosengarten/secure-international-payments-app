const jwt = require('jsonwebtoken')
const checkAuth = async (req, res, next) => {
  
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'Thisisthestringwewilluseforouttoken.TheLongerthestringmorecomplicated');
    req.accountNumber = decoded.accNum;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send('Unauthorized');
  }
};

module.exports=checkAuth