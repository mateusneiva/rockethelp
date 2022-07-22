import { useState, useEffect } from "react";
import { VStack, Text, HStack, useTheme, ScrollView } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import { dateFormat } from "../utils/firestoreDateFormat";

import Header from "../components/Header";
import Loading from "../components/Loading";
import CardDetails from "../components/CardDetails";
import { OrderProps } from "../components/Order";

import {
  MaterialIcons,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";
import Input from "../components/Input";
import Button from "../components/Button";
import { Alert } from "react-native";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
};

function Details() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [solution, setSolution] = useState<string>();
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params as RouteParams;
  const { colors } = useTheme();

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert(
        "Solicitação",
        "Informe a solução para encerrar a solicitação"
      );
    }

    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação encerrada com sucesso.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Solicitação", "Não foi possível encerrar a solicitação.");
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        });

        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Header title="Solicitação" px={4} />

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <Ionicons
            name="checkmark-circle"
            size={22}
            color={colors.green[300]}
          />
        ) : (
          <MaterialIcons
            name="hourglass-empty"
            size={22}
            color={colors.secondary[700]}
          />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
          fontFamily="heading"
        >
          {order.status === "closed" ? "Finalizado" : "Em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={
            <MaterialCommunityIcons
              name="desktop-classic"
              size={21}
              color={colors.primary[700]}
            />
          }
        />

        <CardDetails
          title="descrição do problema"
          description={order.description}
          footer={`Aberto em ${order.when}`}
          icon={
            <MaterialCommunityIcons
              name="clipboard-alert-outline"
              size={21}
              color={colors.primary[700]}
            />
          }
        />

        <CardDetails
          title="solução"
          footer={order.closed && `Encerrado em ${order.closed}`}
          description={order.solution}
          icon={
            <Ionicons
              name="checkmark-circle"
              size={21}
              color={colors.primary[700]}
            />
          }
        >
          {order.status === "open" && (
            <Input
              bg="gray.600"
              placeholder="Digite a solução do Problema..."
              p={0}
              _focus={{ bg: "transparent" }}
              h={24}
              textAlignVertical="top"
              multiline
              onChangeText={setSolution}
            />
          )}
        </CardDetails>
      </ScrollView>
      {order.status === "open" && (
        <Button label="Encerrar solicitação" m={5} onPress={handleOrderClose} />
      )}
    </VStack>
  );
}

export default Details;
