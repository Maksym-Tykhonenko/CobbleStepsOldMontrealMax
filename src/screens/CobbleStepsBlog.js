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
    Share,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import cobbleStepsLocationsData from '../assets/data/cobbleStepsLocationsData';
import cobbleBlogsData from '../assets/data/cobbleBlogsData';

const CobbleStepsBlog = ({ }) => {
    const dimensions = Dimensions.get('window');
    const styles = cobbleStepsStyles(dimensions);
    const [isCobbleBlogOpened, setCobbleBlogOpened] = useState(false);
    const [selectedCobbleBlog, setSelectedCobbleBlog] = useState(null);

    const blogListOpacityAnim = useRef(new Animated.Value(1)).current;
    const blogListScaleAnim = useRef(new Animated.Value(1)).current;
    const blogListSlideAnim = useRef(new Animated.Value(0)).current;

    const blogDetailOpacityAnim = useRef(new Animated.Value(0)).current;
    const blogDetailScaleAnim = useRef(new Animated.Value(0.8)).current;
    const blogDetailSlideAnim = useRef(new Animated.Value(50)).current;

    const backgroundBlurAnim = useRef(new Animated.Value(0)).current;
    const backButtonAnim = useRef(new Animated.Value(0)).current;

    const openBlog = (blog) => {
        setSelectedCobbleBlog(blog);

        Animated.parallel([
            Animated.timing(blogListOpacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(blogListScaleAnim, {
                toValue: 0.9,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(blogListSlideAnim, {
                toValue: -30,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(backgroundBlurAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setCobbleBlogOpened(true);

            Animated.parallel([
                Animated.timing(blogDetailOpacityAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(blogDetailScaleAnim, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    delay: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(blogDetailSlideAnim, {
                    toValue: 0,
                    tension: 120,
                    friction: 10,
                    delay: 150,
                    useNativeDriver: true,
                }),
                Animated.spring(backButtonAnim, {
                    toValue: 1,
                    tension: 150,
                    friction: 8,
                    delay: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    const closeBlog = () => {
        Animated.parallel([
            Animated.timing(blogDetailOpacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(blogDetailScaleAnim, {
                toValue: 0.8,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(blogDetailSlideAnim, {
                toValue: 50,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(backButtonAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(backgroundBlurAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false,
            }),
        ]).start(() => {
            setCobbleBlogOpened(false);
            setSelectedCobbleBlog(null);

            Animated.parallel([
                Animated.timing(blogListOpacityAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(blogListScaleAnim, {
                    toValue: 1,
                    tension: 120,
                    friction: 8,
                    delay: 100,
                    useNativeDriver: true,
                }),
                Animated.spring(blogListSlideAnim, {
                    toValue: 0,
                    tension: 100,
                    friction: 7,
                    delay: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    opacity: backgroundBlurAnim,
                    zIndex: isCobbleBlogOpened ? 1 : -1,
                }}
            />

            <SafeAreaView style={{ zIndex: 10, marginBottom: dimensions.height * 0.01 }}>
                <View style={{
                    width: dimensions.width * 0.86,
                    height: dimensions.height * 0.075,
                    marginTop: dimensions.height * 0.014,
                    borderRadius: dimensions.width * 0.043,
                    backgroundColor: 'rgba(211, 129, 12, 1)',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: dimensions.width * 0.04,
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
                    <Animated.View
                        style={{
                            opacity: backButtonAnim,
                            transform: [{ scale: backButtonAnim }],
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                opacity: !isCobbleBlogOpened ? 0 : 1,
                            }}
                            disabled={!isCobbleBlogOpened}
                            onPress={closeBlog}
                        >
                            <Image
                                source={require('../assets/icons/cobbleBlackArrowLeftIcon.png')}
                                style={{
                                    width: dimensions.height * 0.023,
                                    height: dimensions.height * 0.023,
                                }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    <Text style={[{
                        color: 'rgba(94, 42, 0, 1)',
                        fontSize: dimensions.width * 0.05,
                        fontWeight: '700',
                    }]}>
                        Blog
                    </Text>

                    <Image
                        source={require('../assets/icons/cobbleBlackArrowLeftIcon.png')}
                        style={{
                            width: dimensions.height * 0.023,
                            height: dimensions.height * 0.023,
                            opacity: 0
                        }}
                        resizeMode='contain'
                    />
                </View>
            </SafeAreaView>

            {/* Blog List View */}
            {!isCobbleBlogOpened && (
                <Animated.View
                    style={{
                        flex: 1,
                        opacity: blogListOpacityAnim,
                        transform: [
                            { scale: blogListScaleAnim },
                            { translateY: blogListSlideAnim }
                        ],
                    }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                        paddingBottom: dimensions.height * 0.19,
                    }}>
                        {cobbleBlogsData.map((cobbleBlog, index) => (
                            <View key={cobbleBlog.id} style={styles.cobbleBlogCard}>
                                <Text style={styles.cobbleBlogHeading}>
                                    {cobbleBlog.heading}
                                </Text>

                                <Text style={styles.cobbleBlogSecondatyText}>
                                    {cobbleBlog.subheading}
                                </Text>

                                <View style={{
                                    alignSelf: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
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
                                                message: `Check out this blog post: ${cobbleBlog.heading}\n\n${cobbleBlog.blogText}`,
                                            })
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
                                        width: dimensions.width * 0.4,
                                        height: dimensions.width * 0.14,
                                        borderRadius: dimensions.width * 0.03,
                                        backgroundColor: '#5E2A00',
                                        borderWidth: dimensions.width * 0.004,
                                        borderColor: 'rgba(251, 182, 83, 1)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginHorizontal: dimensions.width * 0.04,
                                    }}
                                        onPress={() => openBlog(cobbleBlog)}
                                    >
                                        <Text style={[{
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: dimensions.width * 0.046,
                                        }]}>
                                            Read
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </Animated.View>
            )}

            {/* Blog Detail View */}
            {isCobbleBlogOpened && selectedCobbleBlog && (
                <Animated.View
                    style={{
                        flex: 1,
                        opacity: blogDetailOpacityAnim,
                        transform: [
                            { scale: blogDetailScaleAnim },
                            { translateY: blogDetailSlideAnim }
                        ],
                        zIndex: 5,
                    }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
                        paddingBottom: dimensions.height * 0.19,
                    }}>
                        <View style={[styles.cobbleBlogCard, {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 10 },
                            shadowOpacity: 0.3,
                            shadowRadius: 20,
                            elevation: 15,
                        }]}>
                            <Text style={styles.cobbleBlogHeading}>
                                {selectedCobbleBlog.heading}
                            </Text>

                            <Text style={styles.cobbleBlogSecondatyText}>
                                {selectedCobbleBlog.subheading}
                            </Text>

                            <Text style={styles.cobbleBlogSecondatyText}>
                                {selectedCobbleBlog.blogText}
                            </Text>

                            <TouchableOpacity style={{
                                width: dimensions.width * 0.14,
                                height: dimensions.width * 0.14,
                                borderRadius: dimensions.width * 0.03,
                                backgroundColor: 'rgba(255, 207, 104, 1)',
                                borderWidth: dimensions.width * 0.004,
                                borderColor: 'rgba(251, 182, 83, 1)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'flex-start',
                                marginTop: dimensions.height * 0.016,
                            }}
                                onPress={() => {
                                    Share.share({
                                        message: `Check out this blog post: ${selectedCobbleBlog.heading}\n\n${selectedCobbleBlog.blogText}`,
                                    })
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
                        </View>
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
};

const cobbleStepsStyles = (dimensions) => StyleSheet.create({
    cobbleBlogCard: {
        borderRadius: dimensions.height * 0.014,
        backgroundColor: '#D3810C',
        borderWidth: dimensions.width * 0.005,
        borderColor: '#FBB653',
        alignSelf: 'center',
        width: dimensions.width * 0.88,
        marginTop: dimensions.height * 0.016,
        paddingHorizontal: dimensions.width * 0.04,
        paddingVertical: dimensions.height * 0.016,
        overflow: 'hidden',
    },
    cobbleBlogHeading: {
        alignSelf: 'flex-start',
        textAlign: 'left',
        color: '#5E2A00',
        fontWeight: '600',
        fontSize: dimensions.width * 0.05,
    },
    cobbleBlogSecondatyText: {
        alignSelf: 'flex-start',
        textAlign: 'left',
        color: '#5E2A00',
        fontWeight: '400',
        fontSize: dimensions.width * 0.04,
        marginTop: dimensions.height * 0.016,
    }
});

export default CobbleStepsBlog;
