module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define("room", {
      RoomNumber: {
        type: Sequelize.STRING(3),
        allowNull: false
      },
      AdultsCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      ChildrenCapacity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Price: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    });
  
    return Room;
  };