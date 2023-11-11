export const validatePassword = async (value) => {
    /* eslint-disable */
    let regex = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,12}");
    /* eslint-disable */
    if (value.length > 12 || !regex.test(value)) {
      return Promise.reject(
        "Password must be 6-12 digits and include letter, number and symbol!"
      );
    }

    return Promise.resolve();
  };
  
