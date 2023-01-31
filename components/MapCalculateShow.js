import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { getDistance } from 'geolib';

export default function MapCalculateShow() {

    // datapoints from DB, need Latitude and Longitude
    const datapoint1 = {
        latitude: 45.46427,
        longitude: 9.18951, 
    }
    const datapoint2 = {
        latitude: 45.46727,
        longitude: 9.19851, 
    }
    const datapoint3 = {
        latitude: 45.46527,
        longitude: 9.10051, 
    }
    const d1AndD2 = getDistance(datapoint1, datapoint2);
    const d1AndD3 = getDistance(datapoint1, datapoint3);
    const d2AndD3 = getDistance(datapoint2, datapoint3);

    // get the data form the user
    const withinRadius = 2500;

    return(
        <View style={styles.container}>
            <Text>Datapoint 1 has latitude at {datapoint1.latitude} and longitude at {datapoint1.longitude}</Text>
            <Text>Datapoint 2 has latitude at {datapoint2.latitude} and longitude at {datapoint2.longitude}</Text>
            <Text>Datapoint 3 has latitude at {datapoint3.latitude} and longitude at {datapoint3.longitude}</Text>
            <Text>Distance between point 1 and point 2 is {d1AndD2}</Text>
            <Text>Distance between point 1 and point 3 is {d1AndD3}</Text>
            <Text>Distance between point 2 and point 3 is {d2AndD3}</Text>
        </View>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 400,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '80%',
      },
});