// tests/services/userService.test.ts
import Users_Utils from "../../services/userServices";

describe('getUsers service', () => {
  it('should return all users in database', async () => {
    const users = await Users_Utils.getUsers();
    
  });

  it('should return null if database is empty', async () => {
    const users = await Users_Utils.getUsers();
    expect(users).toBeNull();
  });
});