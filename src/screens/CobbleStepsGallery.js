import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Animated,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import cobbleStepsLocationsData from '../assets/data/cobbleStepsLocationsData';

const CobbleStepsGallery = ({ }) => {
    const dimensions = Dimensions.get('window');
    const styles = cobbleStepsStyles(dimensions);
    const [selectedLocImage, setSelectedLocImage] = useState(null);
    const [isLocForFullScreen, setIsLocForFullScreen] = useState(false);

    const galleryFadeAnim = useRef(new Animated.Value(1)).current;
    const galleryScaleAnim = useRef(new Animated.Value(1)).current;
    const fullScreenOpacityAnim = useRef(new Animated.Value(0)).current;
    const fullScreenScaleAnim = useRef(new Animated.Value(0.8)).current;
    const fullScreenRotateAnim = useRef(new Animated.Value(0)).current;
    const backgroundBlurAnim = useRef(new Animated.Value(0)).current;

    const openFullScreen = (imageSource) => {
        setSelectedLocImage(imageSource);

        Animated.parallel([
            Animated.timing(galleryFadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(galleryScaleAnim, {
                toValue: 0.95,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(backgroundBlurAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setIsLocForFullScreen(true);

            Animated.parallel([
                Animated.timing(fullScreenOpacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(fullScreenScaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(fullScreenRotateAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    const closeFullScreen = () => {
        Animated.parallel([
            Animated.timing(fullScreenOpacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fullScreenScaleAnim, {
                toValue: 0.8,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fullScreenRotateAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(backgroundBlurAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setIsLocForFullScreen(false);
            setSelectedLocImage(null);

            Animated.parallel([
                Animated.timing(galleryFadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(galleryScaleAnim, {
                    toValue: 1,
                    tension: 120,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    const rotateInterpolate = fullScreenRotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    return (
        <TouchableWithoutFeedback onPress={() => {
            if (isLocForFullScreen) {
                closeFullScreen();
            }
        }}>
            <View style={{ flex: 1 }}>
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        opacity: backgroundBlurAnim,
                        zIndex: isLocForFullScreen ? 10 : -1,
                    }}
                />

                {!isLocForFullScreen && (
                    <Animated.View
                        style={{
                            flex: 1,
                            opacity: galleryFadeAnim,
                            transform: [{ scale: galleryScaleAnim }],
                        }}
                    >
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
                                    Gallery
                                </Text>
                            </View>
                        </SafeAreaView>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                            paddingBottom: dimensions.height * 0.19,
                        }}>
                            {cobbleStepsLocationsData.map((location, index) => (
                                <TouchableOpacity
                                    key={location.id}
                                    activeOpacity={0.8}
                                    onPress={() => openFullScreen(location.cobbleLocImage)}
                                >
                                    <Image
                                        source={location.cobbleLocImage}
                                        style={{
                                            width: dimensions.width * 0.88,
                                            height: dimensions.height * 0.25,
                                            borderRadius: dimensions.height * 0.014,
                                            marginTop: index === 0 ? dimensions.height * 0.03 : dimensions.height * 0.016,
                                            alignSelf: 'center',
                                        }}
                                        resizeMode='cover'
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                )}

                {isLocForFullScreen && selectedLocImage && (
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 20,
                            opacity: fullScreenOpacityAnim,
                            transform: [{ scale: fullScreenScaleAnim }],
                        }}
                    >
                        <Animated.View
                            style={{
                                transform: [{ rotate: rotateInterpolate }],
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.3,
                                shadowRadius: 20,
                                elevation: 15,
                            }}
                        >
                            <Image
                                source={selectedLocImage}
                                style={{
                                    width: dimensions.height * 0.5,
                                    height: dimensions.width * 0.9,
                                    borderRadius: dimensions.height * 0.02,
                                }}
                                resizeMode='cover'
                            />
                        </Animated.View>

                        <Animated.View
                            style={{
                                position: 'absolute',
                                bottom: dimensions.height * 0.17,
                                opacity: fullScreenOpacityAnim,
                            }}
                        >
                            <Text style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: dimensions.width * 0.035,
                                textAlign: 'center',
                            }}>
                                Tap anywhere to close
                            </Text>
                        </Animated.View>
                    </Animated.View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

const cobbleStepsStyles = (dimensions) => StyleSheet.create({
});

export default CobbleStepsGallery;
