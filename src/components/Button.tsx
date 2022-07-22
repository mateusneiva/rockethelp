import { Button as NativeBaseButton, IButtonProps, Heading } from "native-base";

type Props = IButtonProps & {
  label: string;
};

function Button({ label, ...rest }: Props) {
  return (
    <NativeBaseButton
      bg="green.700"
      h={14}
      rounded="sm"
      _pressed={{ bg: "green.500" }}
      {...rest}
    >
      <Heading color="white" fontSize="md">
        {label}
      </Heading>
    </NativeBaseButton>
  );
}

export default Button;
