import React, { useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import GroupCardEmail from './GroupCardEmail';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    card: {
        marginHorizontal: 10,
    },
});

const MatchedGroupCards = ({ groupData, navigation }) => {
    const [pan] = useState(new Animated.ValueXY());
    const [gestureState, setGestureState] = useState(State.UNDETERMINED);

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            setGestureState(event.nativeEvent.state);
            Animated.spring(pan, { toValue: { x: 0, y: 0 } }).start();
        }
    };

    const renderCards = () => {
        return groupData.map((group, index) => {
            return (
                <PanGestureHandler
                    key={index}
                    onGestureEvent={Animated.event([
                        { nativeEvent: { translationX: pan.x } },
                    ])}
                    onHandlerStateChange={onHandlerStateChange}
                >
                    <Animated.View
                        style={[
                            styles.card,
                            { transform: [{ translateX: pan.x }] },
                        ]}
                    >
                        <GroupCardEmail
                            groupData={group}
                            navigation={navigation}
                        />
                    </Animated.View>
                </PanGestureHandler>
            );
        });
    };

    return <View style={styles.container}>{renderCards()}</View>;
};

export default MatchedGroupCards;
