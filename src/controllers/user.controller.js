import UserService from "../services/user.service.js";
import UserResponse from "../dao/dtos/user.response.js";
import { generateUserError } from "../services/errors/errorMessages/user.creation.error.js";
import EErrors from "../services/errors/errorsEnum.js";
import CustomeError from "../services/errors/customeError.js";
import { createHash } from "../midsIngreso/bcrypt.js";

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async register(req, res, next) {
    try {
      const { first_name, last_name, email, age, password, role } = req.body;
    if( !first_name || !email || !age || !password){
      const customeError = new CustomeError({
        name: "User creation error",
        cause: generateUserError({
          first_name, last_name, age, email,  password, role,
        }),
        message: "Error al intentar registrar al usuario",
        code:400,
      });
      throw (customeError);
    }
    const response = await this.userService.registerUser({
      first_name,
      last_name,
      email,
      age,
      password,
      role,
    });

    return res.status(200).json({
      status: response.status,
      data: response.user,
      redirect: response.redirect,
    });
    } catch (error) {
      if (error instanceof CustomeError){
        return res.status(error.code).json({
          status: 'error',
          message: error.message,
        })
      } else {
        console.log(error);
        return res.status(500).json({
          status: 'error',
          message: 'Error interno',
        })
      }
    } 
  }
  
  async restorePassword(req, res, next) {
    
    try {
      const { user, pass } = req.query;
      const passwordRestored = await this.userService.restorePassword(user, createHash(pass));
      if (passwordRestored) {
        return res.send({status: "OK", message: "La contraseña se ha actualizado correctamente"});
      } else {
        const customeError = new CustomeError({
          name: "Restore Error",
          massage: "No fue posible actualizar la contraseña",
          code: EErrors.PASSWORD_RESTORATION_ERROR,
        });
        return next(customeError);  
      }
    } catch (error) {
      req.logger.error(error);
      return next(error);
    }
  }

  currentUser(req, res, next) {
    if (req.session.user) {
      return res.send({
        status: "OK",
        payload: new UserResponse(req.session.user),
      });
    } else {
      const customeError = new CustomeError({
        name: "Auth Error",
        massage: "No fue posible acceder a Current",
        code: EErrors.AUTHORIZATION_ERROR,
      });
      return next(customeError);  
    }
  }
}

export default UserController;
