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
    Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cobbleStepsLocationsData from '../assets/data/cobbleStepsLocationsData';

const CobbleStepsLocationCard = ({ setCobbleStepsPage, cobbleLocation, cobbleStepsSavedLocs, setCobbleStepsSavedLocs }) => {
    const dimensions = Dimensions.get('window');
    const styles = cobbleStepsStyles(dimensions);
    
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        loadSavedLocations();
    }, []);

    useEffect(() => {
        // Add null check for cobbleLocation
        if (cobbleLocation && cobbleLocation.id) {
            setIsSaved(cobbleStepsSavedLocs.includes(cobbleLocation.id));
        }
    }, [cobbleStepsSavedLocs, cobbleLocation?.id]); // Use optional chaining

    const loadSavedLocations = async () => {
        try {
            const saved = await AsyncStorage.getItem('cobbleStepsSavedLocs');
            if (saved) {
                const parsedSaved = JSON.parse(saved);
                setCobbleStepsSavedLocs(parsedSaved);
            }
        } catch (error) {
            console.error('Error loading saved locations:', error);
        }
    };

    const toggleSaveLocation = async () => {
        // Add null check
        if (!cobbleLocation || !cobbleLocation.id) {
            console.error('Cannot save location: cobbleLocation is null or missing id');
            return;
        }

        try {
            let updatedSavedLocs = [...cobbleStepsSavedLocs];

            if (isSaved) {
                // Remove from saved locations
                updatedSavedLocs = updatedSavedLocs.filter(id => id !== cobbleLocation.id);
            } else {
                // Add to saved locations
                updatedSavedLocs.push(cobbleLocation.id);
            }

            // Update state
            setCobbleStepsSavedLocs(updatedSavedLocs);

            // Save to AsyncStorage
            await AsyncStorage.setItem('cobbleStepsSavedLocs', JSON.stringify(updatedSavedLocs));
            
            console.log(`Location ${cobbleLocation.cobbleLocTitle} ${isSaved ? 'removed from' : 'added to'} saved locations`);
            console.log('Current saved locations:', updatedSavedLocs);
        } catch (error) {
            console.error('Error saving location:', error);
        }
    };

    // Add early return if cobbleLocation is null
    if (!cobbleLocation) {
        return null; // or return a loading component
    }

    return (
        <View style={{
            borderRadius: dimensions.height * 0.014,
            backgroundColor: '#D3810C',
            borderWidth: dimensions.width * 0.005,
            borderColor: '#D3810C',
            alignSelf: 'center',
            width: dimensions.width * 0.88,
            marginTop: dimensions.height * 0.04,
            overflow: 'hidden',
        }}>
            <Image
                source={cobbleLocation.cobbleLocImage}
                style={{
                    width: dimensions.width * 0.91,
                    height: dimensions.height * 0.21,
                    alignSelf: 'center',
                }}
                resizeMode='stretch'
            />
            <View style={{
                width: '100%',
                alignSelf: 'center',
                paddingHorizontal: dimensions.width * 0.04,
                paddingVertical: dimensions.height * 0.016,
            }}>
                <Text style={[{
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                    color: '#5E2A00',
                    fontWeight: '600',
                    fontSize: dimensions.width * 0.05,
                }]}>
                    {cobbleLocation.cobbleLocTitle}
                </Text>

                <Text style={[{
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                    color: '#5E2A00',
                    fontWeight: '400',
                    fontSize: dimensions.width * 0.04,
                    marginTop: dimensions.height * 0.016,
                }]}>
                    {cobbleLocation.cobbleLocDescription}
                </Text>

                <Text style={[{
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                    color: '#5E2A00',
                    fontWeight: '400',
                    fontSize: dimensions.width * 0.04,
                    marginTop: dimensions.height * 0.016,
                }]}>
                    Address: {cobbleLocation.cobbleLocAddress}
                </Text>

                <View style={{
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                    marginTop: dimensions.height * 0.016,
                }}>
                    <TouchableOpacity style={{
                        width: dimensions.width * 0.14,
                        height: dimensions.width * 0.14,
                        borderRadius: dimensions.width * 0.03,
                        backgroundColor: 'rgba(255, 207, 104, 1)',
                        borderWidth: dimensions.width * 0.004,
                        borderColor: 'rgba(251, 182, 83, 1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                        onPress={() => {
                            Share.share({
                                message: `Check out this location: ${cobbleLocation.cobbleLocTitle} - ${cobbleLocation.cobbleLocAddress}\n\nFind it on the map: ${cobbleLocation.cobbleLocMapLink}`,
                            });
                        }}
                    >
                        <Image
                            source={require('../assets/icons/cobbleStepsShareIcon.png')}
                            style={{
                                width: dimensions.width * 0.08,
                                height: dimensions.width * 0.08,
                                alignSelf: 'center',
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        flex: 1,
                        height: dimensions.width * 0.14,
                        borderRadius: dimensions.width * 0.03,
                        backgroundColor: '#5E2A00',
                        borderWidth: dimensions.width * 0.004,
                        borderColor: 'rgba(251, 182, 83, 1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginHorizontal: dimensions.width * 0.025,
                    }}
                        onPress={() => {
                            Linking.openURL(cobbleLocation.cobbleLocMapLink)
                        }}
                    >
                        <Text style={[{
                            color: 'white',
                            fontWeight: '600',
                            fontSize: dimensions.width * 0.046,
                        }]}>
                            Set Route
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width: dimensions.width * 0.14,
                        height: dimensions.width * 0.14,
                        borderRadius: dimensions.width * 0.03,
                        backgroundColor: 'rgba(255, 207, 104, 1)',
                        borderWidth: dimensions.width * 0.004,
                        borderColor: 'rgba(251, 182, 83, 1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                        onPress={toggleSaveLocation}
                    >
                        <Image
                            source={isSaved 
                                ? require('../assets/icons/cobbleBrownIcons/likeIcon.png')
                                : require('../assets/icons/cobbleWhiteIcons/likeIcon.png')
                            }
                            style={{
                                width: dimensions.width * 0.08,
                                height: dimensions.width * 0.08,
                                alignSelf: 'center',
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const cobbleStepsStyles = (dimensions) => StyleSheet.create({
});

export default CobbleStepsLocationCard;
