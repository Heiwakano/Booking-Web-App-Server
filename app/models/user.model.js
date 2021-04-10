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
        type: Sequelize.DATEONLY,
      },
      lastLoginDate: {
        type: Sequelize.DATEONLY,
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
      // createDate: {
      //   type: Sequelize.DATEONLY,
      //   allowNull: false
      // },
      // createBy: {
      //   type: Sequelize.STRING,
      //   allowNull: false
      // },
      // updateDate: {
      //   type: Sequelize.DATEONLY,
      //   allowNull: false
      // },
      // updateBy: {
      //   type: Sequelize.STRING,
      //   allowNull: false
      // },
    });
  
    return User;
  };