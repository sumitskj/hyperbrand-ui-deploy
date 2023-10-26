/* eslint-disable no-undef */

export const validateEmail = (email) => {
  // RFC2822
  const emailRegEx =
    // eslint-disable-next-line max-len
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

  return email.match(emailRegEx);
};

export const validateBankIfsc = (ifsc) => {
  // RFC2822
  const ifscRegex =
    // eslint-disable-next-line max-len
    "^[A-Z]{4}0[A-Z0-9]{6}$";

  return ifsc.match(ifscRegex);
};

export const validateNumberString = (value) => {
  // RFC2822
  const numberRegex =
    // eslint-disable-next-line max-len
    /^[0-9\b]+$/;

  return value.match(numberRegex);
};

const apiHeaders = {};
apiHeaders["Content-Type"] = "application/json";

export const fetchBackendApiWrapper = async (path, options, token = "") => {
  if (!options.headers) {
    options.headers = apiHeaders;
  }

  if (token) {
    options.headers["auth-token"] = token;
  }

  return await fetchRetry(
    `${process.env.REACT_APP_BACKEND_API}${path}`,
    options
  );
};

const fetchRetry = async (url, options, retries = 3) => {
  const retryCodes = [408, 500, 502, 503, 504, 522, 524];
  return await fetch(url, options)
    .then((res) => {
      if (res.ok) {
        return res;
      }
      if (retries > 0 && retryCodes.includes(res.status)) {
        console.log("Retrying url : ", url, " status: ", res.status);
        setTimeout(() => {
          return fetchRetry(url, options, retries - 1);
        }, 2000);
      } else {
        return res;
      }
    })
    .catch((err) => {
      if (retries > 0) {
        console.log("Retrying url on error : ", url, " err: ", err);
        setTimeout(() => {
          return fetchRetry(url, options, retries - 1);
        }, 2000);
      } else {
        console.error("Error in calling url: " + url + ", err: " + err);
        return null;
      }
    });
};
