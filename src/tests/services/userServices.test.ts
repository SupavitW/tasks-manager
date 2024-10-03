// Test case for userServices.ts
import Users_Utils from "../../services/userServices";
import UsersModel from "../../db/users/users";

// Mock the UsersModel
jest.mock("../../db/users/users");

describe('Users_Utils', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users in database', async () => {
      const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
      UsersModel.find = jest.fn().mockResolvedValue(mockUsers);

      const users = await Users_Utils.getUsers();
      expect(users).toEqual(mockUsers);
    });

    it('should return null if database is empty', async () => {
      UsersModel.find = jest.fn().mockResolvedValue(null);

      const users = await Users_Utils.getUsers();
      expect(users).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = { username: 'user1' };
      UsersModel.findById = jest.fn().mockResolvedValue(mockUser);

      const user = await Users_Utils.getUserById('some-id');
      expect(user).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      UsersModel.findById = jest.fn().mockResolvedValue(null);

      const user = await Users_Utils.getUserById('some-id');
      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = { username: 'newUser' };
      UsersModel.prototype.save = jest.fn().mockResolvedValue({
        ...mockUser,
        toObject: jest.fn().mockReturnValue(mockUser)  // Mock toObject method
      });

      const newUser = await Users_Utils.createUser(mockUser);
      expect(newUser).toEqual(mockUser);
    });
  });

  describe('deleteUserById', () => {
    it('should delete user by id', async () => {
      const mockUser = { username: 'user1' };
      UsersModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockUser);

      const deletedUser = await Users_Utils.deleteUserById('some-id');
      expect(deletedUser).toEqual(mockUser);
    });
  });

  describe('updateUserById', () => {
    it('should update user by id', async () => {
      const mockUser = { username: 'updatedUser' };
      UsersModel.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUser);

      const updatedUser = await Users_Utils.updateUserById('some-id' as any, { username: 'updatedUser' });
      expect(updatedUser).toEqual(mockUser);
    });
  });
});