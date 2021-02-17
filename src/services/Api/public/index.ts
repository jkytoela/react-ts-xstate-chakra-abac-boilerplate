import HttpClient from 'services/Api/base';
import { LoginDetails } from 'constants/types';

export default class PublicApi extends HttpClient {
  private static classInstance?: PublicApi;

  private constructor() {
    super('http://localhost:8000/api');
  }

  public static getInstance() {
    if (!this.classInstance) {
      this.classInstance = new PublicApi();
    }

    return this.classInstance;
  }

  public login = (body: LoginDetails) => this.instance.post('auth/login', body);

  public register = (body: LoginDetails) => this.instance.post('auth/register', body);
}
