import {
  HStack,
  IconButton,
  Heading,
  useTheme,
  StyledProps,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

type Props = StyledProps & {
  title: string;
};

function Header({ title, ...rest }: Props) {
  const { colors } = useTheme();

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      bg="gray.600"
      pb={3}
      pt={12}
      {...rest}
    >
      <IconButton
        icon={
          <MaterialIcons
            name="chevron-left"
            size={24}
            color={colors.gray[200]}
            onPress={handleGoBack}
          />
        }
      />

      <Heading
        color="gray.100"
        textAlign="center"
        fontSize="lg"
        flex={1}
        ml={-9}
      >
        {title}
      </Heading>
    </HStack>
  );
}

export default Header;
