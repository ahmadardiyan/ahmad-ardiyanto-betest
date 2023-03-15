import AccountController from "../../src/controllers/account.controller.js";
import AccountService from "../../src/services/account.service.js";

const mockFunction = jest.fn(() => []);

jest.mock('../../src/services/account.service.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      login: mockFunction,
      getAccounts: mockFunction,
      getAccount: mockFunction,
      updateAccount: mockFunction,
      deleteAccount: mockFunction,
    }
  })
});

describe('AccountController', () => {
  let accountController;
  let accountService;
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
    accountController = new AccountController();
    accountService = new AccountService();
  })

  describe('login', () => {
    let login;
    const dummtToken = {
      "accessToken": "thisisdummytoken",
      "expiredOn": 1678876552
    }

    beforeEach(() => {
      jest.clearAllMocks();
      login = jest.spyOn(accountService, 'login');
    });

    it('should return token with status code 200', async () => {
      login.mockReturnValue(dummtToken);

      await accountController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(login).toHaveBeenCalled();
    });

    it('should handle exception status code 400', async () => {
      login.mockRejectedValue(new Error('it is error messages'));;

      await accountController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(login).toHaveBeenCalled();
    });

  });

  describe('getAccounts', () => {
    const dummyAccounts = [
      {
        "accountId": "64110dc675b9d22c27eb09f3",
        "accountId": "64110dc675b9d22c27eb09f1",
        "accountName": "jhon",
        "lastLoginDateTime": "2023-03-15T11:54:02.368Z"
      },
      {
          "accountId": "64110de775b9d22c27eb09fa",
          "accountId": "64110de775b9d22c27eb09f8",
          "accountName": "jhon2",
          "lastLoginDateTime": "2023-03-15T00:14:31.519Z"
      }
    ]

    const dummyMeta = {
      "limit": 10,
      "totalData": 7,
      "currentPage": 1,
      "totalPage": 1
    }

    it('should success return status code 200 with data accounts and meta pagination', async () => {
      const serviceGetAccounts = jest.spyOn(accountService, 'getAccounts').mockReturnValue({ accounts: dummyAccounts, meta: dummyMeta});

      await accountController.getAccounts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(serviceGetAccounts).toHaveBeenCalled();
    });
    
    it('should exception status code 400', async () => {
      const serviceGetAccounts = jest.spyOn(accountService, 'getAccounts').mockRejectedValue(new Error('it is error messages'));
      await accountController.getAccounts(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceGetAccounts).toHaveBeenCalled();
    });
  });

  describe('getAccount', () => {
    let serviceGetAccount;

    beforeEach(() => {
      jest.clearAllMocks();
      serviceGetAccount = jest.spyOn(accountService, 'getAccount');
    });

    it('should success get account with status code 200', async () => {
      serviceGetAccount.mockReturnValue({id: 1});

      await accountController.getAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(serviceGetAccount).toHaveBeenCalled();
    })

    it('should exception status code 400, because failed get account', async () => {
      serviceGetAccount.mockReturnValue(false);

      await accountController.getAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceGetAccount).toHaveBeenCalled();
    })

    it('should exception status code 400', async () => {
      serviceGetAccount.mockRejectedValue(new Error('it is error messages'));

      await accountController.getAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceGetAccount).toHaveBeenCalled();
    })
  });

  describe('updateAccount', () => {
    let serviceUpdateAccount;

    beforeEach(() => {
      jest.clearAllMocks();
      serviceUpdateAccount = jest.spyOn(accountService, 'updateAccount');
    });

    it('should success update account with status code 200', async () => {
      serviceUpdateAccount.mockReturnValue({modifiedCount: 1});

      await accountController.updateAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(serviceUpdateAccount).toHaveBeenCalled();
    })

    it('should exception status code 400, because failed update account', async () => {
      serviceUpdateAccount.mockReturnValue({modifiedCount: 0});

      await accountController.updateAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceUpdateAccount).toHaveBeenCalled();
    })

    it('should exception status code 400', async () => {
      serviceUpdateAccount.mockRejectedValue(new Error('it is error messages'));

      await accountController.updateAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceUpdateAccount).toHaveBeenCalled();
    })
  });

  describe('deleteAccount', () => {
    let serviceDeleteAccount;

    beforeEach(() => {
      jest.clearAllMocks();
      serviceDeleteAccount = jest.spyOn(accountService, 'deleteAccount');
    });

    it('should success delete account with status code 200', async () => {
      serviceDeleteAccount.mockReturnValue({deleteCount: 1});
      
      req.params.id = 1;
      req.user = {
        accountId: 2
      }

      await accountController.deleteAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(serviceDeleteAccount).toHaveBeenCalled();
    })

    it('should exception status code 400, because param id same with data auth account', async () => {
      serviceDeleteAccount.mockReturnValue({deleteCount: 0});

      req.params.id = 1;
      req.user = {
        accountId: 1
      }

      await accountController.deleteAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceDeleteAccount).toHaveBeenCalledTimes(0);
    })

    it('should exception status code 400, because failed delete account', async () => {
      serviceDeleteAccount.mockReturnValue({deleteCount: 0});

      req.params.id = 1;
      req.user = {
        accountId: 2
      }

      await accountController.deleteAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceDeleteAccount).toHaveBeenCalled();
    })

    it('should exception status code 400', async () => {
      serviceDeleteAccount.mockRejectedValue(new Error('it is error messages'));

      req.params.id = 1;
      req.user = {
        accountId: 2
      }

      await accountController.deleteAccount(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(serviceDeleteAccount).toHaveBeenCalled();
    })
  });

});