module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      loginAttempts: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lastLoginAttempsDate: {
        type: Sequelize.DATE,
      },
      lastLoginDate: {
        type: Sequelize.DATE,
      },
      otp: {
        type: Sequelize.STRING,
      },
      otpRequestDate: {
        type: Sequelize.DATE,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createBy: {
        type: Sequelize.STRING,
        allowNull: false
      },
      updateBy: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  
    return User;
  };