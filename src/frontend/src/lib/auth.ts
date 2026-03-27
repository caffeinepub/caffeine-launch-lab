import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function useAuth() {
  const {
    identity,
    login,
    clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginSuccess,
    isLoginError,
  } = useInternetIdentity();
  return {
    isAuthenticated: !!identity && !identity.getPrincipal().isAnonymous(),
    identity,
    login,
    logout: clear,
    loginStatus,
    isInitializing,
    isLoggingIn,
    isLoginSuccess,
    isLoginError,
  };
}
