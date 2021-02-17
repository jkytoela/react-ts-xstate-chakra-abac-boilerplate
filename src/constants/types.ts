import { StateNodeConfig } from 'xstate';

export type LoginDetails = {
  email: string;
  password: string;
};

export type LocalStorageUser = {
  email: string;
  permissions: string[];
};

export interface ILoginSchema {
  states: {
    initial: StateNodeConfig<ILoginContext, Record<string, unknown>, ILoginEvent>;
    emailError: StateNodeConfig<ILoginContext, Record<string, unknown>, ILoginEvent>;
    passwordError: StateNodeConfig<ILoginContext, Record<string, unknown>, ILoginEvent>;
    serviceError: StateNodeConfig<ILoginContext, Record<string, unknown>, ILoginEvent>;
    success: StateNodeConfig<ILoginContext, Record<string, unknown>, ILoginEvent>;
    awaitingResponse: StateNodeConfig<ILoginContext, Record<string, unknown>, ILoginEvent>;
  };
}

export interface ILoginContext {
  email: string;
  password: string;
}

export type ILoginEvent =
  | { type: 'ENTER_EMAIL'; value: string }
  | { type: 'ENTER_PASSWORD'; value: string }
  | { type: 'EMAIL_BLUR' }
  | { type: 'PASSWORD_BLUR' }
  | { type: 'ATTEMPT_LOGIN' };
