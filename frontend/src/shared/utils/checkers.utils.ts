export const isValidId = (id: string): boolean => {
  return /^[0-9]+$/.test(id);
};
