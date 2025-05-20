import { LIMIT_HOURS_REFRESH } from "../constants/localStorage";

export const saveInLocalStorage = (key = "", payload = {}, setNow = false) => {
  try {
    const newData = {
      lastRefreshTime: setNow
        ? getTotalSeconds(new Date())
        : getTodayMidnight(),
      data: payload,
    };
    localStorage.setItem(key, JSON.stringify(newData));
  } catch (error) {
    throw error;
  }
};

export const getLocalStorageData = (key = "") => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data;
  } catch (error) {
    throw error;
  }
};

export const getTodaySeconds = (now) => {
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const currentSeconds = hour * 60 * 60 + minutes * 60;
  return currentSeconds;
};

export const checkTimeLimit = (key) => {
  const data = getLocalStorageData(key);
  if (!data && data?.lastRefreshTime === undefined) return true;
  const { lastRefreshTime } = data;

  const now = new Date();
  const totalSeconds = getTotalSeconds(now);
  const isLimitExceeded =
    totalSeconds - lastRefreshTime > LIMIT_HOURS_REFRESH * 60 * 60;
  return isLimitExceeded;
};

export const getTodayMidnight = () => {
  const now = new Date();
  const todaySeconds = getTodaySeconds(now);
  const totalSeconds = getTotalSeconds(now);
  const todayMidnight = totalSeconds - todaySeconds;
  return todayMidnight;
};

export const getTotalSeconds = (now) => {
  const totalSeconds = now.getTime() / 1000;
  return totalSeconds;
};

export const manageLocalStorageExpiration = (key, timeLimitInSeconds) => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    const { lastRefreshTime } = JSON.parse(storedData);
    if (
      lastRefreshTime &&
      Math.floor(Date.now() / 1000) - lastRefreshTime > timeLimitInSeconds
    ) {
      localStorage.removeItem(key);
    }
  }
};

export const removeItemFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};
