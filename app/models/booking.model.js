module.exports = (sequelize, Sequelize) => {
    const Booking = sequelize.define("booking", {
      GuestLastName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      GuestFirstName: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      CheckInDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      CheckOutDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      NumberOfAdults: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      NumberOfChildren: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  
    return Booking;
  };