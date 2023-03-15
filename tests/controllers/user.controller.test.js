import UserController from "../../src/controllers/user.controller";
import UserService from "../../src/services/user.service.js";

const mockFunction = jest.fn(() => []);

jest.mock('../../src/services/user.service.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getUsers: mockFunction,
      getUser: mockFunction,
      createUser: mockFunction,
      updateUser: mockFunction,
      deleteUser: mockFunction,
    }
  })
});

describe('UserController', () => {
  let userController;
  let userService;
  let req;
  let res;

  const mockRequest = () => {
    const req = {}
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    req.query = jest.fn().mockReturnValue(req)
    return req
  }
  
  const mockResponse = () => {
    const res = {}
    res.send = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    return res
  }

  beforeEach(() => {
    req = mockRequest()
    res = mockResponse()
    userController = new UserController();
    userService = new UserService();
  })
  
  it('should be defined', () => {
    expect(userController).toBeDefined()
  }) 

  describe('getUsers', () => {
    const dummyUsers = [
      {
          "userId": "64110dc675b9d22c27eb09f1",
          "fullName": "jhone doe-",
          "emailAddress": "jhon.doe-@gmail.com",
          "accountNumber": 1,
          "registrationNumber": 1
      },
      {
          "userId": "64110de775b9d22c27eb09f8",
          "fullName": "jhone doe2",
          "emailAddress": "jhon.doe2@gmail.com",
          "accountNumber": 2,
          "registrationNumber": 2
      },
      {
          "userId": "64110ded75b9d22c27eb09fc",
          "fullName": "jhone doe3",
          "emailAddress": "jhon.doe3@gmail.com",
          "accountNumber": 3,
          "registrationNumber": 3
      },
    ]

    const dummyMeta = {
      "limit": 10,
      "totalData": 7,
      "currentPage": 1,
      "totalPage": 1
    }

    it('should success return status code 200 with data users and meta pagination', async () => {
      const serviceGetUsers = jest.spyOn(userService, 'getUsers').mockReturnValue({ users: dummyUsers, meta: dummyMeta});

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(serviceGetUsers).toHaveBeenCalled();
    });
    
    it('should exception status code 400', async () => {
      const serviceGetUsers = jest.spyOn(userService, 'getUsers').mockRejectedValue(new Error('it is error messages'));
      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceGetUsers).toHaveBeenCalled();
    });
  })

  describe('createUser', () => {
    let serviceCreateUsers;

    beforeEach(() => {
      jest.clearAllMocks();
      serviceCreateUsers = jest.spyOn(userService, 'createUser');
    });

    it('should success create user with status code 201', async () => {
      serviceCreateUsers.mockReturnValue({id: 1});

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(serviceCreateUsers).toHaveBeenCalled();
    })

    it('should exception status code 400, because failed create user', async () => {
      serviceCreateUsers.mockReturnValue(false);

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceCreateUsers).toHaveBeenCalled();
    })

    it('should exception status code 400', async () => {
      serviceCreateUsers.mockRejectedValue(new Error('it is error messages'));

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceCreateUsers).toHaveBeenCalled();
    })
  })
  
  describe('getUser', () => {
    let serviceGetUser;

    beforeEach(() => {
      jest.clearAllMocks();
      serviceGetUser = jest.spyOn(userService, 'getUser');
    });

    it('should success get user with status code 200', async () => {
      serviceGetUser.mockReturnValue({id: 1});

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(serviceGetUser).toHaveBeenCalled();
    })

    it('should exception status code 400, because failed get user', async () => {
      serviceGetUser.mockReturnValue(false);

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceGetUser).toHaveBeenCalled();
    })

    it('should exception status code 400', async () => {
      serviceGetUser.mockRejectedValue(new Error('it is error messages'));

      await userController.getUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceGetUser).toHaveBeenCalled();
    })
  })
  
  describe('updateUser', () => {
    let serviceUpdateUser;

    beforeEach(() => {
      jest.clearAllMocks();
      serviceUpdateUser = jest.spyOn(userService, 'updateUser');
    });

    it('should success update user with status code 200', async () => {
      serviceUpdateUser.mockReturnValue({modifiedCount: 1});

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(serviceUpdateUser).toHaveBeenCalled();
    })

    it('should exception status code 400, because failed update user', async () => {
      serviceUpdateUser.mockReturnValue({modifiedCount: 0});

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceUpdateUser).toHaveBeenCalled();
    })

    it('should exception status code 400', async () => {
      serviceUpdateUser.mockRejectedValue(new Error('it is error messages'));

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceUpdateUser).toHaveBeenCalled();
    })

  })

  describe('deleteUser', () => {
    let serviceDeleteUser;

    beforeEach(() => {
      jest.clearAllMocks();
      serviceDeleteUser = jest.spyOn(userService, 'deleteUser');
    });

    it('should success delete user with status code 200', async () => {
      serviceDeleteUser.mockReturnValue({deleteCount: 1});
      
      req.params.id = 1;
      req.user = {
        userId: 2
      }

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(serviceDeleteUser).toHaveBeenCalled();
    })

    it('should exception status code 400, because param id same with data auth user', async () => {
      serviceDeleteUser.mockReturnValue({deleteCount: 0});

      req.params.id = 1;
      req.user = {
        userId: 1
      }

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceDeleteUser).toHaveBeenCalledTimes(0);
    })

    it('should exception status code 400, because failed delete user', async () => {
      serviceDeleteUser.mockReturnValue({deleteCount: 0});

      req.params.id = 1;
      req.user = {
        userId: 2
      }

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceDeleteUser).toHaveBeenCalled();
    })

    it('should exception status code 400', async () => {
      serviceDeleteUser.mockRejectedValue(new Error('it is error messages'));

      req.params.id = 1;
      req.user = {
        userId: 2
      }

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceDeleteUser).toHaveBeenCalled();
    })
  })
})