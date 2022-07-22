import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

import Loading from "../components/Loading";

import SignIn from "../screens/SignIn";
import AppRoutes from "./app.routes";

function Routes() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User>();

  useEffect(() => {
    const subscriber = Auth().onAuthStateChanged((response) => {
      setUser(response);
      setIsLoading(false);
    });

    return subscriber;
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {user ? <AppRoutes /> : <SignIn />}
    </NavigationContainer>
  );
}

export default Routes;
