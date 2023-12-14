export const inputValidator = (identifier: string, value: string): boolean => {
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

  switch (identifier) {
    case 'title':
      if (
        value.length > 20 ||
        value.length < 6 ||
        specialCharRegex.test(value)
      ) {
        return false;
      } else {
        return true;
      }
    case 'password':
      if (value.length !== 6 || !/^\d+$/.test(value)) return false;
      else return true;

    case 'size':
      if (parseInt(value) < 2 || parseInt(value) > 10 || isNaN(parseInt(value)))
        return false;
      else return true;
  }
  throw new Error('invalid identifier');
};
