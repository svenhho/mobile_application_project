import React from 'react';
import { View } from 'react-native';
import GroupCardEmail from './GroupCardEmail';

const MatchedGroupCards = ({ groupData, navigation }) => (
    <View>
        {groupData.map((group, index) => (
            <GroupCardEmail
                key={index}
                groupData={group}
                navigation={navigation}
            />
        ))}
    </View>
);

export default MatchedGroupCards;
