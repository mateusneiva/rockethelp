import { useState } from "react";
import { VStack, Heading, Icon, useTheme } from "native-base";
import { Ionicons } from "@expo/vector-icons";

import { Alert } from "react-native";

import Auth from "@react-native-firebase/auth";

import Logo from "../assets/logo_primary.svg";

import Input from "../components/Input";
import Button from "../components/Button";

function SignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const { colors } = useTheme();

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert("Entrar", "Informe e-mail e senha.");
    }

    setIsLoading(true);

    Auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error.code);
        setIsLoading(false);

        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          return Alert.alert("Entrar", "E-mail e/ou Senha inválido.");
        }

        if (error.code === "auth/invalid-email") {
          return Alert.alert("Entrar", "E-mail inválido.");
        }

        return Alert.alert("Entrar", "Ocorreu um erro inesperado.");
      });
  }

  return (
    <VStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      bg="gray.600"
      px={8}
    >
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={10} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        placeholder="E-mail"
        mb={4}
        InputLeftElement={
          <Icon
            as={<Ionicons name="mail" color={colors.gray[300]} />}
            size={6}
            ml={4}
          />
        }
        onChangeText={setEmail}
      />

      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={
          <Icon
            as={<Ionicons name="key" color={colors.gray[300]} />}
            size={6}
            ml={4}
          />
        }
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        label="Entrar"
        w="full"
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  );
}

export default SignIn;
