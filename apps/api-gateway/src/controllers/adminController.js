const prisma = require('../prisma');

const listUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      candidate: true,
      hrProfile: true
    }
  });

  res.json(users);
};

module.exports = {
  listUsers
};