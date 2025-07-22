import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Share,
    Image,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cobbleStepsLocationsData from '../assets/data/cobbleStepsLocationsData';
import CobbleStepsLocationCard from '../components/CobbleStepsLocationCard';

const CobbleStepsSaved = ({ setCobbleStepsPage, cobbleStepsSavedLocs, setCobbleStepsSavedLocs }) => {
    const dimensions = Dimensions.get('window');
    const styles = cobbleStepsStyles(dimensions);

    const [savedLocations, setSavedLocations] = useState([]);

    useEffect(() => {
        loadSavedLocations();
    }, []);

    useEffect(() => {
        if (cobbleStepsSavedLocs.length > 0) {
            const filteredLocations = cobbleStepsLocationsData.filter(location =>
                cobbleStepsSavedLocs.includes(location.id)
            );
            setSavedLocations(filteredLocations);
        } else {
            setSavedLocations([]);
        }
    }, [cobbleStepsSavedLocs]);

    const loadSavedLocations = async () => {
        try {
            const saved = await AsyncStorage.getItem('cobbleStepsSavedLocs');
            if (saved) {
                const parsedSaved = JSON.parse(saved);
                setCobbleStepsSavedLocs(parsedSaved);
                console.log('Loaded saved locations:', parsedSaved);
            }
        } catch (error) {
            console.error('Error loading saved locations:', error);
        }
    };

    return (
        <View style={{
            flex: 1,
        }}>
            <SafeAreaView style={{ marginBottom: dimensions.height * 0.01 }}>
                <View style={{
                    width: dimensions.width * 0.86,
                    height: dimensions.height * 0.075,
                    marginTop: dimensions.height * 0.014,
                    borderRadius: dimensions.width * 0.043,
                    backgroundColor: 'rgba(211, 129, 12, 1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    alignSelf: 'center',

                    borderWidth: dimensions.width * 0.005,
                    borderColor: '#FBB653',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: dimensions.height * 0.01 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 15,
                }}>
                    <Text style={[{
                        color: 'rgba(94, 42, 0, 1)',
                        fontSize: dimensions.width * 0.05,
                        fontWeight: '700',
                    }]}>
                        Saved
                    </Text>
                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                paddingBottom: dimensions.height * 0.19,
            }}>
                {savedLocations.length > 0 ? (
                    savedLocations.map((cobbleLocation) => (
                        <View
                            key={cobbleLocation.id}
                            style={{
                                alignSelf: 'center',
                                marginTop: -dimensions.height * 0.01,
                            }}
                        >
                            <CobbleStepsLocationCard cobbleLocation={cobbleLocation} cobbleStepsSavedLocs={cobbleStepsSavedLocs} setCobbleStepsSavedLocs={setCobbleStepsSavedLocs} />
                        </View>
                    ))
                ) : (
                    <View style={{
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.15,
                        alignItems: 'center',
                        paddingHorizontal: dimensions.width * 0.1,
                    }}>
                        <Image
                            source={require('../assets/icons/cobbleWhiteIcons/likeIcon.png')}
                            style={{
                                width: dimensions.width * 0.15,
                                height: dimensions.width * 0.15,
                                opacity: 0.3,
                                marginBottom: dimensions.height * 0.02,
                            }}
                            resizeMode='contain'
                        />
                        <Text style={{
                            color: 'rgba(94, 42, 0, 0.7)',
                            fontSize: dimensions.width * 0.045,
                            fontWeight: '600',
                            textAlign: 'center',
                            marginBottom: dimensions.height * 0.01,
                        }}>
                            No Saved Locations Yet
                        </Text>
                        <Text style={{
                            color: 'rgba(94, 42, 0, 0.5)',
                            fontSize: dimensions.width * 0.035,
                            textAlign: 'center',
                            lineHeight: dimensions.width * 0.05,
                        }}>
                            Explore the Interactive Map and tap the heart icon on locations you want to save for later!
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const cobbleStepsStyles = (dimensions) => StyleSheet.create({
});

export default CobbleStepsSaved;
