// passwordUtils.test.ts
import { passwordHash, comparePasswords } from '../../helpers/'; // Adjust the import path
import bcrypt from 'bcrypt';

jest.mock('bcrypt'); // Mock bcrypt module

describe('Password Utilities', () => {
  const password = 'testPassword';
  const saltRounds = 10;
  const hashedPassword = 'hashedPassword123'; // Example hashed password

  describe('passwordHash', () => {
    it('should return a hashed password', async () => {
      // Mocking bcrypt's genSalt and hash methods
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('fakeSalt');
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await passwordHash(password, saltRounds);
      expect(result).toBe(hashedPassword); // Check if returned hash matches the expected
      expect(bcrypt.genSalt).toHaveBeenCalledWith(saltRounds); // Verify genSalt was called with the correct argument
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 'fakeSalt'); // Verify hash was called with correct args
    });

    it('should throw an error when hashing fails', async () => {
      (bcrypt.genSalt as jest.Mock).mockImplementation(() => {
        throw new Error('Salt generation failed');
      });

      await expect(passwordHash(password, saltRounds)).rejects.toThrow('Error hashing the password');
    });
  });

  describe('comparePasswords', () => {
    it('should return true if passwords match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await comparePasswords(password, hashedPassword);
      expect(result).toBe(true); // Check if passwords match
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword); // Verify compare was called correctly
    });

    it('should return false if passwords do not match', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await comparePasswords(password, hashedPassword);
      expect(result).toBe(false); // Check if passwords do not match
    });

    it('should throw an error when comparison fails', async () => {
      (bcrypt.compare as jest.Mock).mockImplementation(() => {
        throw new Error('Comparison failed');
      });

      await expect(comparePasswords(password, hashedPassword)).rejects.toThrow('Error comparing the password');
    });
  });
});
