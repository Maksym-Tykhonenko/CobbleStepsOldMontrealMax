import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cobbleStepsLocationsData from '../assets/data/cobbleStepsLocationsData';
import CobbleStepsLocationCard from '../components/CobbleStepsLocationCard';
import CobbleLoadingComponent from '../components/CobbleLoadingComponent';

const CobbleStepsRandomiser = ({ setCobbleStepsPage, cobbleStepsSavedLocs, setCobbleStepsSavedLocs }) => {
    const dimensions = Dimensions.get('window');
    const styles = cobbleStepsStyles(dimensions);
    const [isGenerationCobbleLoc, setIsGenerationCobbleLoc] = useState(false);
    const [isGeneratedLoc, setIsGeneratedLoc] = useState(false);
    const [randomCobbleLoc, setRandomCobbleLoc] = useState(null);
    const [prevRandomCobbleLoc, setPrevRandomCobbleLoc] = useState(null);
    const [loadingDots, setLoadingDots] = useState(1);

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

    useEffect(() => {
        let interval;
        if (isGenerationCobbleLoc) {
            interval = setInterval(() => {
                setLoadingDots(prev => prev === 3 ? 1 : prev + 1);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isGenerationCobbleLoc]);

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

    const generateRandomLocation = () => {
        setIsGenerationCobbleLoc(true);
        setIsGeneratedLoc(false);
        setLoadingDots(1);

        setTimeout(() => {
            let newRandomLocation;

            do {
                const randomIndex = Math.floor(Math.random() * cobbleStepsLocationsData.length);
                newRandomLocation = cobbleStepsLocationsData[randomIndex];
            } while (prevRandomCobbleLoc && newRandomLocation.id === prevRandomCobbleLoc.id && cobbleStepsLocationsData.length > 1);

            setRandomCobbleLoc(newRandomLocation);
            setPrevRandomCobbleLoc(newRandomLocation);
            setIsGenerationCobbleLoc(false);
            setIsGeneratedLoc(true);

            console.log('Generated random location:', newRandomLocation.cobbleLocTitle);
        }, 5000);
    };

    const resetRandomiser = () => {
        setIsGeneratedLoc(false);
        setIsGenerationCobbleLoc(false);
        setRandomCobbleLoc(null);
    };

    const getDots = () => {
        return '.'.repeat(loadingDots);
    };

    return (
        <View style={{
            flex: 1,
        }}>
            <SafeAreaView style={{}}>
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
                        Randomiser
                    </Text>
                </View>
            </SafeAreaView>

            {!isGeneratedLoc ? (
                <>
                    <Image
                        source={require('../assets/images/cobbleWoman.png')}
                        style={{
                            width: dimensions.width * 0.9,
                            height: dimensions.height * 0.5,
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.03,
                        }}
                        resizeMode="contain"
                    />

                    {isGenerationCobbleLoc && (
                        <View style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            top: dimensions.height * 0.5,
                        }}
                        >
                            <CobbleLoadingComponent />
                        </View>
                    )}

                    <TouchableOpacity
                        style={{
                            width: dimensions.width * 0.88,
                            height: dimensions.height * 0.07,
                            backgroundColor: isGenerationCobbleLoc ? '#E0E0E0' : '#fff',
                            borderRadius: dimensions.height * 0.025,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={generateRandomLocation}
                        disabled={isGenerationCobbleLoc}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: dimensions.width * 0.3, // Fixed width container
                        }}>
                            <Text style={[{
                                color: 'rgba(94, 42, 0, 1)',
                                fontSize: dimensions.width * 0.05,
                                fontWeight: '700',
                            }]}>
                                {isGenerationCobbleLoc ? 'Loading' : 'Surprise me'}
                            </Text>
                            {isGenerationCobbleLoc && (
                                <View style={{
                                    width: dimensions.width * 0.08, // Fixed width for dots
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={[{
                                        color: 'rgba(94, 42, 0, 1)',
                                        fontSize: dimensions.width * 0.05,
                                        fontWeight: '700',
                                    }]}>
                                        {getDots()}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </>
            ) : (
                <View style={{
                    flex: 1,
                    paddingBottom: dimensions.height * 0.15,
                }}>
                    {/* <ScrollView 
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: dimensions.height * 0.05,
                        }}
                    >
                        <View style={{
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.02314,
                        }}>
                            <CobbleStepsLocationCard 
                                cobbleLocation={randomCobbleLoc} 
                                cobbleStepsSavedLocs={cobbleStepsSavedLocs} 
                                setCobbleStepsSavedLocs={setCobbleStepsSavedLocs} 
                            />
                        </View>
                    </ScrollView> */}

                    <View style={{
                        alignSelf: 'center',
                    }}>
                        <CobbleStepsLocationCard
                            cobbleLocation={randomCobbleLoc}
                            cobbleStepsSavedLocs={cobbleStepsSavedLocs}
                            setCobbleStepsSavedLocs={setCobbleStepsSavedLocs}
                        />
                    </View>

                    <View style={{
                        alignSelf: 'center',
                        flexDirection: 'row',
                        width: dimensions.width * 0.88,
                        justifyContent: 'space-between',
                        marginTop: dimensions.height * 0.04,
                    }}>
                        <TouchableOpacity
                            style={{
                                width: dimensions.width * 0.42,
                                height: dimensions.height * 0.07,
                                backgroundColor: '#fff',
                                borderRadius: dimensions.height * 0.025,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: '#D3810C',
                            }}
                            onPress={resetRandomiser}
                        >
                            <Text style={[{
                                color: 'rgba(94, 42, 0, 1)',
                                fontSize: dimensions.width * 0.045,
                                fontWeight: '700',
                            }]}>
                                Try Again
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: dimensions.width * 0.42,
                                height: dimensions.height * 0.07,
                                backgroundColor: '#5E2A00',
                                borderRadius: dimensions.height * 0.025,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={generateRandomLocation}
                        >
                            <Text style={[{
                                color: 'white',
                                fontSize: dimensions.width * 0.045,
                                fontWeight: '700',
                            }]}>
                                Another One
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const cobbleStepsStyles = (dimensions) => StyleSheet.create({
});

export default CobbleStepsRandomiser;
