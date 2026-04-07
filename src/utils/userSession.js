import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export const USER_SESSION_STORAGE_KEY = 'userSession';

const normalizeUserSession = (rawSession) => {
  if (!rawSession || rawSession.isAuthenticated !== true) {
    return null;
  }

  const email = typeof rawSession.email === 'string' ? rawSession.email.trim() : '';
  if (!email) {
    return null;
  }

  const normalizedSession = {
    ...rawSession,
    isAuthenticated: true,
    email,
    firstName: typeof rawSession.firstName === 'string' ? rawSession.firstName : '',
    lastName: typeof rawSession.lastName === 'string' ? rawSession.lastName : ''
  };

  delete normalizedSession.expiresAt;

  return normalizedSession;
};

const readLocalUserSession = () => {
  const storedSession = localStorage.getItem(USER_SESSION_STORAGE_KEY);
  if (!storedSession) {
    return null;
  }

  try {
    return normalizeUserSession(JSON.parse(storedSession));
  } catch (error) {
    console.error('Failed to parse local user session:', error);
    return null;
  }
};

const writeLocalUserSession = (session) => {
  localStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const getUserSession = () => {
  const session = readLocalUserSession();
  if (!session) {
    localStorage.removeItem(USER_SESSION_STORAGE_KEY);
  }
  return session;
};

export const persistUserSession = async (rawSession) => {
  const session = normalizeUserSession(rawSession);

  if (!session) {
    await clearUserSession();
    return null;
  }

  writeLocalUserSession(session);

  if (Capacitor.isNativePlatform()) {
    await Preferences.set({
      key: USER_SESSION_STORAGE_KEY,
      value: JSON.stringify(session)
    });
  }

  return session;
};

export const hydrateUserSession = async () => {
  const localSession = getUserSession();
  if (localSession) {
    writeLocalUserSession(localSession);

    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: USER_SESSION_STORAGE_KEY,
        value: JSON.stringify(localSession)
      });
    }

    return localSession;
  }

  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const { value } = await Preferences.get({ key: USER_SESSION_STORAGE_KEY });
    if (!value) {
      return null;
    }

    const restoredSession = normalizeUserSession(JSON.parse(value));
    if (!restoredSession) {
      await Preferences.remove({ key: USER_SESSION_STORAGE_KEY });
      return null;
    }

    writeLocalUserSession(restoredSession);
    return restoredSession;
  } catch (error) {
    console.error('Failed to restore native user session:', error);
    return null;
  }
};

export const clearUserSession = async () => {
  localStorage.removeItem(USER_SESSION_STORAGE_KEY);

  if (Capacitor.isNativePlatform()) {
    await Preferences.remove({ key: USER_SESSION_STORAGE_KEY });
  }
};

export const clearUserSessionSync = () => {
  localStorage.removeItem(USER_SESSION_STORAGE_KEY);

  if (Capacitor.isNativePlatform()) {
    void Preferences.remove({ key: USER_SESSION_STORAGE_KEY });
  }
};
