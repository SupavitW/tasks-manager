import bcrypt from 'bcrypt';

// Password hashing function
export const passwordHash = async (password: string, saltRounds: number) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch(err) {
      const hashingError = new Error('Error hashing the password');
      throw hashingError;
    }
};
  
//Password comparison function
export const comparePasswords = async (password: string, hash: string) => {
    try {
      const matchFound = await bcrypt.compare(password, hash);
      return matchFound;
    } catch (err) {
      const compareError = new Error('Error comparing the password');
      throw compareError;
    }
}; 
