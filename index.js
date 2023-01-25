const express = require('express');
const Sequelize = require('sequelize');
const sequelize = require("./util/database");



// Client model
const Client = sequelize.define('client', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  number: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

// Coupon model
const Coupon = sequelize.define('coupon', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  number: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

// Define the association between the Client and Coupon
Client.hasMany(Coupon, { foreignKey: 'clientId' });
Coupon.belongsTo(Client, { foreignKey: 'clientId' });


const app = express();
app.use(express.json());

// Insert a new client and associated coupons
app.post('/clients', async (req, res) => {
  try {
      // Create the client
      const client = await Client.create({
          name: req.body.name,
          number: req.body.number
      });
      // Create the coupon and associate it with the client
      const coupon = await Coupon.create({
          number: req.body.couponNumber,
          clientId: client.id
      });

      res.status(201).json({ message: 'Client and coupon created successfully' });
  } catch (error) {
      res.status(400).json({ message: error });
  }
});

// Find the clients with more than 2 coupons
app.get('/clients/coupon-count', async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [
        {
          model: Coupon,
          where: {
            number: {
              [Sequelize.Op.gte]: 2
            }
          }
        }
      ]
    });

    clients.forEach(client => {
      console.log(client.name);
    });

    const clientsNumber = clients.map(client => client.number)
    console.log('Clients numbers to send the SMS: ',clientsNumber)

    res.json(clients);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Sync the models with the database and start the Express app
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });
});
