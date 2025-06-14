import bcrypt from "bcryptjs";

export const handleHashValue = async (value: string, saltRounds?: number) => {
  return bcrypt.hash(value, saltRounds || 10);
};

export const handleCompareValue = async (
  value: string,
  hashedValue: string
) => {
  return bcrypt.compare(value, hashedValue);
};
