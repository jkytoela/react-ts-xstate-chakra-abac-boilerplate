import { Machine, assign } from 'xstate';
import * as zod from 'zod';
import { ILoginContext, ILoginSchema, ILoginEvent } from 'constants/types';
import fakeAuthService from 'services/Misc/fakeAuthService';
import { assertEventType } from './utils';

const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(5);

const loginMachine = Machine<ILoginContext, ILoginSchema, ILoginEvent>(
  {
    id: 'loginMachine',
    initial: 'initial',
    context: {
      email: '',
      password: '',
    },
    states: {
      initial: {
        on: {
          ATTEMPT_LOGIN: [
            {
              cond: 'isInvalidEmailFormat',
              target: 'emailError',
            },
            {
              cond: 'isInvalidPasswordFormat',
              target: 'passwordError',
            },
            {
              target: 'awaitingResponse',
            },
          ],
          ENTER_EMAIL: {
            actions: 'setEmail',
          },
          EMAIL_BLUR: {
            cond: 'isInvalidEmailFormat',
            target: 'emailError',
          },
          ENTER_PASSWORD: {
            actions: 'setPassword',
          },
          PASSWORD_BLUR: {
            cond: 'isInvalidPasswordFormat',
            target: 'passwordError',
          },
        },
      },
      awaitingResponse: {
        invoke: {
          src: 'attemptLogin',
          onDone: 'success',
          onError: 'serviceError',
        },
      },
      emailError: {
        on: {
          ENTER_EMAIL: {
            target: 'initial',
            actions: 'setEmail',
          },
        },
      },
      passwordError: {
        on: {
          ENTER_PASSWORD: {
            target: 'initial',
            actions: 'setPassword',
          },
        },
      },
      serviceError: {
        on: {
          ATTEMPT_LOGIN: 'awaitingResponse',
          ENTER_EMAIL: {
            target: 'initial',
            actions: 'setEmail',
          },
          ENTER_PASSWORD: {
            target: 'initial',
            actions: 'setPassword',
          },
        },
      },
      success: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      setEmail: assign({
        email: (_, event) => {
          assertEventType(event, 'ENTER_EMAIL');
          return event.value;
        },
      }),
      setPassword: assign({
        password: (_, event) => {
          assertEventType(event, 'ENTER_PASSWORD');
          return event.value;
        },
      }),
    },
    services: {
      attemptLogin: (context) => fakeAuthService({
        email: context.email,
        password: context.password,
      }),
    },
    guards: {
      isInvalidEmailFormat: (context) => !emailSchema.safeParse(context.email)?.success,
      isInvalidPasswordFormat: (context) => !passwordSchema.safeParse(context.password)?.success,
    },
  },
);

export default loginMachine;
