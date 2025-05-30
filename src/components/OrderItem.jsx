import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { memo } from 'react'
import Feather from "@expo/vector-icons/Feather";
import { colors } from '../global/colors';
import Card from './Card';

const OrderItem = memo(({ order, navigation }) => {
  const handleNavigate = () => {
    if (navigation) {
      navigation.navigate("OrderDetail", { order });
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.date}>{new Date(order.createdAt).toLocaleString()}</Text>
        <Text style={styles.total}>Total: ${order.total}</Text>
      </View>
      <Pressable 
        style={({pressed}) => [
          styles.detailsButton,
          pressed && styles.detailsButtonPressed
        ]} 
        onPress={handleNavigate}
      >
        <Feather name="search" size={24} color={colors.white} />
      </Pressable>
    </Card>
  );
})

export default OrderItem

const styles = StyleSheet.create({
    card: {
        width: "100%",
        marginVertical: 8,
        marginHorizontal: 0,
        borderRadius: 12,
        backgroundColor: colors.teal600,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        gap: 8,
    }, 
    date: {
        fontFamily: 'CourierL',
        fontSize: 20,
        color: colors.platinum,
    },
    total: {
        fontFamily: 'CourierL',
        fontSize: 22,
        color: colors.letras,
    },
    detailsButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.boton,
    },
    detailsButtonPressed: {
        backgroundColor: colors.burgundyDark,
        transform: [{ scale: 0.95 }],
    }
})
