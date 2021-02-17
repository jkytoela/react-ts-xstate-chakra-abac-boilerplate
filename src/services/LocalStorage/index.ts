import { LocalStorageUser } from 'constants/types';
import Storage from './base';

enum Locals {
  ACCESS_TOKEN = 'access_token',
  USER = 'user_data',
}

export default class AppStorage extends Storage<Locals> {
  private static instance?: AppStorage;

  private constructor() {
    super();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new AppStorage();
    }

    return this.instance;
  }

  public getAccessToken() {
    return this.get(Locals.ACCESS_TOKEN);
  }

  public setAccessToken(accessToken: string) {
    this.set(Locals.ACCESS_TOKEN, accessToken);
  }

  public getUser(): LocalStorageUser | null {
    const user = this.get(Locals.USER);
    return user !== null ? JSON.parse(user) : null;
  }

  public setUser(user: LocalStorageUser) {
    const userData = JSON.stringify(user);
    this.set(Locals.USER, userData);
  }

  public clear() {
    this.clearItems([
      Locals.ACCESS_TOKEN,
      Locals.USER,
    ]);
  }
}
