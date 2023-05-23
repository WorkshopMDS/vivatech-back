import bcrypt from 'bcrypt';

export const makeTicketNumber = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const generateComplexPassword = () =>
  Math.random().toString(36).slice(-10) +
  Math.random().toString(36).toUpperCase().slice(-2) +
  Math.random().toString(36).slice(-2) +
  Math.random().toString(36).toUpperCase().slice(-2) +
  Math.random().toString(36).slice(-2) +
  Math.random().toString(36).toUpperCase().slice(-2) +
  Math.random().toString(36).slice(-2) +
  Math.random().toString(36).toUpperCase().slice(-2);

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw error;
  }
};

export const generateSlug = (content: string) =>
  content
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/^-+|-+$/g, '');
