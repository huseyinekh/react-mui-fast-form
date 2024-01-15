export const isSuccessStatusCode = (statusCode: number) => {
  let result = false;
  if (statusCode > 199 && statusCode < 300) result = true;

  return result;
};
