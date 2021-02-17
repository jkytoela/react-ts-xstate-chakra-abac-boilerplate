import AppStorage from 'services/LocalStorage';
import Permissions from 'constants/permissions';
import { LoginDetails } from 'constants/types';

const fakeAuthService = (details: LoginDetails) => {
  const fakeUser = {
    email: 'admin@admin.com',
    password: 'admin',
  };

  const fakeToken = '000';

  const userData = {
    email: fakeUser.email,
    permissions: [
      Permissions.ViewDashboard,
      // Permissions.DoSomething,
    ],
  };

  let loginSucceed = false;
  if (details.email === fakeUser.email && details.password === fakeUser.password) {
    loginSucceed = true;
    const appStorage = AppStorage.getInstance();
    appStorage.setAccessToken(fakeToken);
    appStorage.setUser(userData);
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (loginSucceed) {
        resolve(true);
      }
      reject(new Error('Login failed'));
    }, 1500);
  });
};

export default fakeAuthService;
