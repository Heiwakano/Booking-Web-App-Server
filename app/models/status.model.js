module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define("status", {
      Label: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
    });
  
    return Status;
  };