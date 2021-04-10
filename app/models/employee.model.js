module.exports = (sequelize, Sequelize) => {
    const Employee = sequelize.define("employee", {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profilePicture: {
        type: Sequelize.STRING,
      },
    });
  
    return Employee;
  };