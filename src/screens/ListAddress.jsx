import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { useGetLocationQuery } from '../services/shopServices'
import AddressItem from '../components/AddressItem'

const ListAddress = ({navigation}) => {
    const {localId} = useSelector(state => state.auth.value)
    const {data: location, isLoading, error} = useGetLocationQuery(localId);
  
    return location ? (
    <AddressItem 
        location={location}
        navigation={navigation}
    />
  ): (
    <View style={styles.container}>
        <Text style={styles.text}>No Location set</Text>
        <Button 
            title='Set Location' 
            onPress={()=> navigation.navigate("Location Selector")}
        />
    </View>
  )
}

export default ListAddress

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
  
    
  },
  text: {
    paddingVertical: 20,
    fontFamily: "CourierL",
    fontSize: 18,
    color:'black',
  },
});
