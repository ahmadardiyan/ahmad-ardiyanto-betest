import UserService from "../../services/user.service.js"

describe('UserService', () => {
  const userService = new UserService();

  describe('getUsers', () => {
    it('should be defined', () => {
      expect(userService).toBeDefined()
    }) 
  })
})