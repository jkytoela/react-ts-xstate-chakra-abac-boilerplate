import * as React from 'react';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Fade,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useHistory, RouteComponentProps, Redirect } from 'react-router-dom';
import { useMachine } from '@xstate/react';
import AppStorage from 'services/LocalStorage';
import loginMachine from 'machines/login-machine';
import * as Routes from 'constants/routes';

interface Props {
  unauthorized?: boolean;
  loggedOut?: boolean;
}

const LoginPage = (props: RouteComponentProps<Record<string, never>, any, Props>) => {
  const [state, send] = useMachine(loginMachine);
  const { location } = props;
  const { email, password } = state.context;
  const appStorage = AppStorage.getInstance();
  const history = useHistory();
  const isServiceError = state.matches('serviceError');
  const isEmailError = state.matches('emailError');
  const isPasswordError = state.matches('passwordError');
  const isLoading = state.matches('awaitingResponse');
  const loginSucceeded = state.matches('success');
  const accessToken = appStorage.getAccessToken();
  const toast = useToast();

  React.useEffect(() => {
    if (location.state?.unauthorized) {
      toast({
        title: 'Sinulla ei ole riittäviä oikeuksia.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }

    if (location.state?.loggedOut) {
      toast({
        title: 'Sinut on kirjattu ulos.',
        status: 'success',
        duration: 5000,
        isClosable: false,
        position: 'top-right',
      });
      history.replace({
        pathname: Routes.PublicRoutes.login,
        state: {},
      });
    }
  }, [location.state, toast, history]);

  const isAuthenticated = accessToken !== null;
  const isAuthorized = !location.state?.unauthorized;

  if (loginSucceeded || (isAuthenticated && isAuthorized)) {
    return (
      <Redirect to={Routes.AuthRoutes.dashboard} />
    );
  }

  return (
    <Box width="100%" height="100vh" bg="blue.400" position="absolute">
      <Container mt={36} bg="white" py={8} px={16} borderRadius="10px">
        <Text fontSize="3xl" fontWeight="semibold">
          Tervetuloa takaisin
        </Text>
        {isServiceError ? (
          <Fade in>
            <Alert status="error" my={2} borderRadius="10px">
              <AlertIcon />
              Kirjautuminen ei onnistunut
            </Alert>
          </Fade>
        ) : null}
        <form
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            send('ATTEMPT_LOGIN');
          }}
        >
          <FormControl isInvalid={isEmailError} mt={4}>
            <FormLabel htmlFor="email">Sähköposti</FormLabel>
            <Input
              isInvalid={isEmailError}
              errorBorderColor="red.300"
              value={email}
              onChange={(event: any) => {
                send('ENTER_EMAIL', { value: event.target.value });
              }}
              onBlur={() => send('EMAIL_BLUR')}
              type="text"
              name="email"
              autoFocus
            />
            <FormErrorMessage>Tarkista sähköpostiosoite</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={isPasswordError} mt={2}>
            <FormLabel htmlFor="password">Salasana</FormLabel>
            <Input
              isInvalid={isPasswordError}
              errorBorderColor="red.300"
              value={password}
              onChange={(event) => {
                send('ENTER_PASSWORD', { value: event.target.value });
              }}
              onBlur={() => send('PASSWORD_BLUR')}
              type="password"
              name="password"
            />
            <FormErrorMessage>Tarkista salasana</FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="blue" mt={4} w="100%">
            {isLoading ? (
              <>
                Kirjaudutaan <Spinner ml={4} size="xs" />
              </>
            ) : (
              'Kirjaudu'
            )}
          </Button>
          <Text
            color="blue.500"
            fontWeight="semibold"
            fontSize="sm"
            textAlign="center"
            mt={4}
          >
            Unohditko salasanan?
          </Text>
        </form>
      </Container>
    </Box>
  );
};

export default LoginPage;
