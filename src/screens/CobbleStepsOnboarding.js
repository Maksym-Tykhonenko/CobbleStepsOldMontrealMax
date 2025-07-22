import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, ImageBackground, TouchableWithoutFeedback, Animated, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import onboardingData from '../assets/data/onboardingData';

const CobbleStepsOnboarding = () => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [cobbleSlideIndex, setCobbleSlideIndex] = useState(0);
    const navigation = useNavigation();
    
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const titleSlideAnim = useRef(new Animated.Value(0)).current;
    const descriptionSlideAnim = useRef(new Animated.Value(0)).current;
    const buttonScaleAnim = useRef(new Animated.Value(1)).current;
    const backgroundZoomAnim = useRef(new Animated.Value(1)).current;
    const womanImageAnim = useRef(new Animated.Value(1)).current;
    const contentPanelAnim = useRef(new Animated.Value(0)).current;
    
    const finalFadeAnim = useRef(new Animated.Value(1)).current;
    const finalSlideUpAnim = useRef(new Animated.Value(0)).current;
    const finalRotateAnim = useRef(new Animated.Value(0)).current;
    const finalBackgroundAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const onChange = ({ window }) => {
            setDimensions(window);
        };
        const dimensionListener = Dimensions.addEventListener('change', onChange);
        return () => {
            dimensionListener.remove();
        };
    }, []);

    const handlePress = () => {
        if (cobbleSlideIndex < onboardingData.length - 1) {
            Animated.parallel([
                Animated.timing(backgroundZoomAnim, {
                    toValue: 1.05,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(womanImageAnim, {
                    toValue: 0.95,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(contentPanelAnim, {
                    toValue: 20,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(titleSlideAnim, {
                    toValue: -dimensions.width,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(descriptionSlideAnim, {
                    toValue: dimensions.width,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setCobbleSlideIndex(cobbleSlideIndex + 1);
                
                titleSlideAnim.setValue(dimensions.width);
                descriptionSlideAnim.setValue(-dimensions.width);
                
                Animated.parallel([
                    Animated.spring(backgroundZoomAnim, {
                        toValue: 1,
                        tension: 80,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                    Animated.spring(womanImageAnim, {
                        toValue: 1,
                        tension: 100,
                        friction: 8,
                        useNativeDriver: true,
                    }),
                    Animated.spring(contentPanelAnim, {
                        toValue: 0,
                        tension: 120,
                        friction: 9,
                        useNativeDriver: true,
                    }),
                    Animated.spring(titleSlideAnim, {
                        toValue: 0,
                        tension: 120,
                        friction: 9,
                        delay: 100,
                        useNativeDriver: true,
                    }),
                    Animated.spring(descriptionSlideAnim, {
                        toValue: 0,
                        tension: 100,
                        friction: 8,
                        delay: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 500,
                        delay: 150,
                        useNativeDriver: true,
                    }),
                ]).start();
            });
        } else {
            Animated.sequence([
                Animated.timing(buttonScaleAnim, {
                    toValue: 0.95,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(buttonScaleAnim, {
                    toValue: 1,
                    tension: 300,
                    friction: 10,
                    useNativeDriver: true,
                }),
                Animated.parallel([
                    Animated.timing(finalSlideUpAnim, {
                        toValue: -dimensions.height,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(finalRotateAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(finalFadeAnim, {
                        toValue: 0,
                        duration: 600,
                        delay: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(finalBackgroundAnim, {
                        toValue: 1.3,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => {
                navigation.replace('CobbleStepsHome');
            });
        }
    };

    const finalRotation = finalRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '5deg'],
    });

    return (
        <Animated.View style={{ 
            flex: 1,
            opacity: finalFadeAnim,
            transform: [
                { translateY: finalSlideUpAnim },
                { rotate: finalRotation }
            ]
        }}>
            <Animated.View style={{
                transform: [
                    { scale: backgroundZoomAnim },
                    { scale: finalBackgroundAnim }
                ]
            }}>
                <ImageBackground
                    source={require('../assets/images/cobbleStepsBg.png')}
                    style={{
                        flex: 1, width: dimensions.width, height: dimensions.height, position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0
                    }}
                    resizeMode="cover"
                />
            </Animated.View>

            <Animated.Image
                source={require('../assets/images/cobbleWoman.png')}
                style={{
                    width: dimensions.width * 0.9,
                    height: dimensions.height * 0.6,
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.1,
                    transform: [{ scale: womanImageAnim }]
                }}
                resizeMode="contain"
            />

            <View
                style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View
                    style={{
                        width: dimensions.width,
                        height: dimensions.height,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                    }}
                >

                </View>
            </View>

            <Animated.View style={{
                position: 'absolute',
                bottom: 0,
                alignSelf: 'center',
                width: dimensions.width,
                backgroundColor: '#A84A00',
                borderRadius: dimensions.width * 0.04,
                paddingHorizontal: dimensions.width * 0.05,
                paddingVertical: dimensions.width * 0.05,
                shadowColor: '#FFC168',
                shadowOffset: { width: 0, height: -dimensions.width * 0.008 },
                shadowOpacity: 1,
                shadowRadius: 0,
                alignItems: 'center',
                justifyContent: 'flex-start',
                height: dimensions.height * 0.35,
                opacity: fadeAnim,
                transform: [{ translateY: contentPanelAnim }]
            }}>
                <Animated.Text style={{
                    color: 'white',
                    fontSize: dimensions.width * 0.055,
                    textAlign: 'center',
                    paddingHorizontal: dimensions.width * 0.05,
                    fontWeight: '600',
                    marginTop: dimensions.width * 0.05,
                    transform: [{ translateX: titleSlideAnim }]
                }}>
                    {onboardingData[cobbleSlideIndex].title}
                </Animated.Text>

                <Animated.Text style={{
                    color: 'white',
                    fontSize: dimensions.width * 0.04,
                    textAlign: 'center',
                    paddingHorizontal: dimensions.width * 0.04,
                    fontWeight: '400',
                    paddingTop: dimensions.width * 0.031,
                    transform: [{ translateX: descriptionSlideAnim }]
                }}>
                    {onboardingData[cobbleSlideIndex].description}
                </Animated.Text>

                <Animated.View style={{
                    position: 'absolute',
                    bottom: dimensions.height * 0.07,
                    transform: [{ scale: buttonScaleAnim }]
                }}>
                    <TouchableOpacity style={{
                        width: dimensions.width * 0.8,
                        height: dimensions.height * 0.075,
                        backgroundColor: '#fff',
                        borderRadius: dimensions.width * 0.055,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }} onPress={handlePress}>
                        <Text style={{
                            color: '#5E2A00',
                            fontSize: dimensions.width * 0.0444,
                            textAlign: 'center',
                            fontWeight: '600'
                        }}>
                            {onboardingData[cobbleSlideIndex].cobbleNextButtonText}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        </Animated.View>
    );
};

export default CobbleStepsOnboarding;