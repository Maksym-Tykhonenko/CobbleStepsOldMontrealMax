import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  Animated,
  Text,
  TouchableOpacity,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import CobbleStepsSaved from './CobbleStepsSaved';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import cobbleStepsLocationsData from '../assets/data/cobbleStepsLocationsData';
import CobbleStepsLocationCard from '../components/CobbleStepsLocationCard';
import CobbleStepsRandomiser from './CobbleStepsRandomiser';
import CobbleStepsGallery from './CobbleStepsGallery';
import CobbleStepsBlog from './CobbleStepsBlog';

const cobbleStepsButtonsOfScreens = [
  {
    id: 1,
    cobbleStepsScreen: 'Cobble Gallery',
    cobbleStepsWhiteIcon: require('../assets/icons/cobbleWhiteIcons/galleryIcon.png'),
    cobbleStepsBrownIcon: require('../assets/icons/cobbleBrownIcons/galleryIcon.png'),
  },
  {
    id: 2,
    cobbleStepsScreen: 'Cobble Randomiser',
    cobbleStepsWhiteIcon: require('../assets/icons/cobbleWhiteIcons/randomizerIcon.png'),
    cobbleStepsBrownIcon: require('../assets/icons/cobbleBrownIcons/randomizerIcon.png'),
  },
  {
    id: 3,
    cobbleStepsScreen: 'Interactive Map',
    cobbleStepsWhiteIcon: require('../assets/icons/cobbleWhiteIcons/mapIcon.png'),
    cobbleStepsBrownIcon: require('../assets/icons/cobbleBrownIcons/mapIcon.png'),
  },
  {
    id: 4,
    cobbleStepsScreen: 'Cobble Blog',
    cobbleStepsWhiteIcon: require('../assets/icons/cobbleWhiteIcons/bookIcon.png'),
    cobbleStepsBrownIcon: require('../assets/icons/cobbleBrownIcons/bookIcon.png'),
  },
  {
    id: 5,
    cobbleStepsScreen: 'Cobble Saved',
    cobbleStepsWhiteIcon: require('../assets/icons/cobbleWhiteIcons/likeIcon.png'),
    cobbleStepsBrownIcon: require('../assets/icons/cobbleBrownIcons/likeIcon.png'),
  },
]

const CobbleStepsHome = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [cobbleStepsPage, setCobbleStepsPage] = useState('Interactive Map');
  const [selectedCobbleStepsLocation, setSelectedCobbleStepsLocation] = useState(null);
  const [isCobbleStepsLocDetailsVisible, setIsCobbleStepsLocDetailsVisible] = useState(false);
  const [cobbleStepsSavedLocs, setCobbleStepsSavedLocs] = useState([]);

  useEffect(() => {
    loadSavedLocations();
  }, []);
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

  const cobbleFadeAnim = useRef(new Animated.Value(1)).current;
  const cobbleSlideAnim = useRef(new Animated.Value(0)).current;
  const cobbleScaleAnim = useRef(new Animated.Value(1)).current;
  const cobbleBackgroundZoomAnim = useRef(new Animated.Value(1)).current;
  const cobbleRotateAnim = useRef(new Animated.Value(0)).current;
  const cobbleDepthAnim = useRef(new Animated.Value(0)).current;

  const cobbleCardFadeAnim = useRef(new Animated.Value(0)).current;
  const cobbleCardSlideAnim = useRef(new Animated.Value(50)).current;
  const cobbleCardScaleAnim = useRef(new Animated.Value(0.8)).current;
  const cobbleCardRotateAnim = useRef(new Animated.Value(0)).current;
  const cobbleBackgroundBlurAnim = useRef(new Animated.Value(0)).current;

  const getCurrentScreenId = (screen) => {
    const currentButton = cobbleStepsButtonsOfScreens.find(button => button.cobbleStepsScreen === screen);
    return currentButton ? currentButton.id : 3;
  };

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };
    const dimensionListener = Dimensions.addEventListener('change', onChange);
    return () => {
      dimensionListener.remove();
    };
  }, []);

  const cobbleTransitionAnimationScreens = (newScreen) => {
    const currentId = getCurrentScreenId(cobbleStepsPage);
    const newId = getCurrentScreenId(newScreen);
    const isForward = newId > currentId;

    const direction = isForward ? 1 : -1;

    Animated.parallel([
      Animated.timing(cobbleBackgroundZoomAnim, {
        toValue: 1.08,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cobbleSlideAnim, {
        toValue: -dimensions.width * direction,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.timing(cobbleScaleAnim, {
        toValue: 0.82,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(cobbleFadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(cobbleRotateAnim, {
        toValue: direction * 0.5,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(cobbleDepthAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCobbleStepsPage(newScreen);

      cobbleSlideAnim.setValue(dimensions.width * direction);

      Animated.sequence([
        Animated.delay(50),
        Animated.parallel([
          Animated.spring(cobbleBackgroundZoomAnim, {
            toValue: 1,
            tension: 90,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.spring(cobbleSlideAnim, {
            toValue: 0,
            tension: 110,
            friction: 12,
            delay: 120,
            useNativeDriver: true,
          }),
          Animated.spring(cobbleScaleAnim, {
            toValue: 1,
            tension: 130,
            friction: 11,
            delay: 180,
            useNativeDriver: true,
          }),
          Animated.timing(cobbleFadeAnim, {
            toValue: 1,
            duration: 600,
            delay: 250,
            useNativeDriver: true,
          }),
          Animated.spring(cobbleRotateAnim, {
            toValue: 0,
            tension: 120,
            friction: 10,
            delay: 150,
            useNativeDriver: true,
          }),
          Animated.spring(cobbleDepthAnim, {
            toValue: 0,
            tension: 100,
            friction: 9,
            delay: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    });
  };

  const cobbleShowLocationCard = (location) => {
    setSelectedCobbleStepsLocation(location);
    setIsCobbleStepsLocDetailsVisible(true);

    Animated.parallel([
      Animated.timing(cobbleCardFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(cobbleCardSlideAnim, {
        toValue: 0,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(cobbleCardScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 7,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.spring(cobbleCardRotateAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cobbleBackgroundBlurAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const cobbleHideLocationCard = () => {
    Animated.parallel([
      Animated.timing(cobbleCardFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cobbleCardSlideAnim, {
        toValue: 30,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(cobbleCardScaleAnim, {
        toValue: 0.85,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cobbleCardRotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(cobbleBackgroundBlurAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsCobbleStepsLocDetailsVisible(false);
      setSelectedCobbleStepsLocation(null);
    });
  };

  const cobbleRotateInterpolate = cobbleRotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  const cobbleDepthInterpolate = cobbleDepthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const cobbleCardRotateInterpolate = cobbleCardRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1deg'],
  });

  const [randomCobbleLoc, setRandomCobbleLoc] = useState(null);
  const [prevRandomCobbleLoc, setPrevRandomCobbleLoc] = useState(null);

  const generateRandomLocation = () => {

    let newRandomLocation;

    do {
      const randomIndex = Math.floor(Math.random() * cobbleStepsLocationsData.length);
      newRandomLocation = cobbleStepsLocationsData[randomIndex];
    } while (prevRandomCobbleLoc && newRandomLocation.id === prevRandomCobbleLoc.id && cobbleStepsLocationsData.length > 1);

    setRandomCobbleLoc(newRandomLocation);
    setPrevRandomCobbleLoc(newRandomLocation);

    console.log('Generated random location:', newRandomLocation.cobbleLocTitle);
  };

  useEffect(() => {
    generateRandomLocation();
  }, [cobbleStepsPage])

  const renderCobbleAnimatedScreen = (screen) => {
    return (
      <Animated.View
        style={[
          { flex: 1 },
          {
            opacity: cobbleFadeAnim,
            transform: [
              { translateX: cobbleSlideAnim },
              { translateY: cobbleDepthInterpolate },
              { scale: cobbleScaleAnim },
              { rotate: cobbleRotateInterpolate },
            ],
          },
        ]}
      >
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.25,
          shadowRadius: 15,
          elevation: 10,
          opacity: 0.3,
        }} />
        {screen}
      </Animated.View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      if (isCobbleStepsLocDetailsVisible) {
        cobbleHideLocationCard();
      }
    }}>
      <View style={{
        backgroundColor: '#b35805',
        width: '100%',
        height: dimensions.height,
        flex: 1,
      }}>
        {/* Dark background overlay - BEHIND the card */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            opacity: cobbleBackgroundBlurAnim,
            zIndex: isCobbleStepsLocDetailsVisible ? 400 : -1, // Changed from 500 to 400
          }}
        />

        <View
          style={{
            marginTop: Platform.OS === 'ios' ? 0 : dimensions.height * 0.025,
          }}
        />
        <Animated.View style={{
          transform: [{ scale: cobbleBackgroundZoomAnim }]
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

        {cobbleStepsPage === 'Interactive Map' ? (
          renderCobbleAnimatedScreen(
            <View style={{ flex: 1 }}>
              <SafeAreaView style={{
                flex: 1,
                alignItems: 'center',
                marginTop: Platform.OS === 'android' ? dimensions.height * 0.03 : 0,
              }}>
                <View style={{
                  width: dimensions.width * 0.86,
                  height: dimensions.height * 0.075,
                  marginTop: dimensions.height * 0.014,
                  borderRadius: dimensions.width * 0.043,
                  backgroundColor: 'rgba(211, 129, 12, 1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,

                  borderWidth: dimensions.width * 0.005,
                  borderColor: '#FBB653',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: dimensions.height * 0.01 },
                  shadowOpacity: 0.4,
                  shadowRadius: 20,
                  elevation: 15,
                }}>
                  <Text style={[{
                    color: 'rgba(94, 42, 0, 1)',
                    fontSize: dimensions.width * 0.05,
                    fontWeight: '700',
                  }]}>
                    {cobbleStepsPage}
                  </Text>
                </View>

                {Platform.OS === 'android' && (
                  <View style={{
                    alignSelf: 'center',
                    position: 'absolute',
                    zIndex: 500,
                    top: dimensions.height * 0.17,
                    alignSelf: 'center',
                  }}>
                    <CobbleStepsLocationCard
                      cobbleLocation={randomCobbleLoc}
                      cobbleStepsSavedLocs={cobbleStepsSavedLocs}
                      setCobbleStepsSavedLocs={setCobbleStepsSavedLocs}
                    />
                  </View>
                )}

                <MapView
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: dimensions.width,
                    height: dimensions.height,
                  }}
                  initialRegion={{
                    latitude: cobbleStepsLocationsData[0].cobbleCoordinates.latitude,
                    longitude: cobbleStepsLocationsData[0].cobbleCoordinates.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  mapType="none"
                  onPress={() => {
                    if (isCobbleStepsLocDetailsVisible) {
                      cobbleHideLocationCard();
                    }
                  }}
                >
                  {cobbleStepsLocationsData.map((location) => (
                    <Marker
                      key={location.id}
                      coordinate={{
                        latitude: location.cobbleCoordinates.latitude,
                        longitude: location.cobbleCoordinates.longitude,
                      }}
                      title={location.cobbleLocTitle}
                      description={location.cobbleLocDescription}
                    >
                      <TouchableOpacity
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() => {
                          console.log('Marker pressed:', location.cobbleLocTitle);
                          if (isCobbleStepsLocDetailsVisible) {
                            cobbleHideLocationCard();
                            setTimeout(() => {
                              cobbleShowLocationCard(location);
                            }, 400);
                          } else {
                            cobbleShowLocationCard(location);
                          }
                        }}
                      >
                        <Image
                          source={require('../assets/icons/pinIcon.png')}
                          style={{
                            width: dimensions.width * 0.08,
                            height: dimensions.width * 0.08,
                          }}
                        />
                      </TouchableOpacity>
                    </Marker>
                  ))}
                </MapView>
              </SafeAreaView>
            </View>
          )
        ) : cobbleStepsPage === 'Cobble Saved' ? (
          renderCobbleAnimatedScreen(
            <CobbleStepsSaved
              setCobbleStepsPage={cobbleTransitionAnimationScreens}
              cobbleLocation={selectedCobbleStepsLocation} cobbleStepsSavedLocs={cobbleStepsSavedLocs} setCobbleStepsSavedLocs={setCobbleStepsSavedLocs}
            />
          )
        ) : cobbleStepsPage === 'Cobble Randomiser' ? (
          renderCobbleAnimatedScreen(
            <CobbleStepsRandomiser
              setCobbleStepsPage={cobbleTransitionAnimationScreens}
              cobbleStepsSavedLocs={cobbleStepsSavedLocs} setCobbleStepsSavedLocs={setCobbleStepsSavedLocs}
            />
          )
        ) : cobbleStepsPage === 'Cobble Blog' ? (
          renderCobbleAnimatedScreen(
            <CobbleStepsBlog
              setCobbleStepsPage={cobbleTransitionAnimationScreens}
            />
          )
        ) : cobbleStepsPage === 'Cobble Gallery' ? (
          renderCobbleAnimatedScreen(
            <CobbleStepsGallery
              setCobbleStepsPage={cobbleTransitionAnimationScreens}
            />
          )
        ) : null}

        {selectedCobbleStepsLocation && isCobbleStepsLocDetailsVisible && (
          <Animated.View style={{
            alignSelf: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 15,
            position: 'absolute',
            top: dimensions.height * 0.25,
            zIndex: 600,
            opacity: cobbleCardFadeAnim,
            transform: [
              { translateY: cobbleCardSlideAnim },
              { scale: cobbleCardScaleAnim },
              { rotate: cobbleCardRotateInterpolate }
            ]
          }}>
            <CobbleStepsLocationCard cobbleLocation={selectedCobbleStepsLocation} cobbleStepsSavedLocs={cobbleStepsSavedLocs} setCobbleStepsSavedLocs={setCobbleStepsSavedLocs} />
          </Animated.View>
        )}

        <View style={{
          width: dimensions.width * 0.914,
          alignSelf: 'center',
          position: 'absolute',
          bottom: dimensions.height * 0.05,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10,
        }}>
          {cobbleStepsButtonsOfScreens.map((button, index) => (
            <TouchableOpacity key={button.id} style={{
              width: dimensions.width * 0.17,
              height: dimensions.width * 0.17,
              borderRadius: dimensions.width * 0.03,
              backgroundColor: cobbleStepsPage === button.cobbleStepsScreen ? 'rgba(255, 207, 104, 1)' : 'rgba(211, 129, 12, 1)',
              borderWidth: dimensions.width * 0.004,
              borderColor: 'rgba(251, 182, 83, 1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
              onPress={() => {
                cobbleTransitionAnimationScreens(button.cobbleStepsScreen);
              }}
            >
              <Image
                source={cobbleStepsPage === button.cobbleStepsScreen ? button.cobbleStepsBrownIcon : button.cobbleStepsWhiteIcon}
                style={{
                  width: dimensions.width * 0.08,
                  height: dimensions.width * 0.08,
                  alignSelf: 'center',
                }}
                resizeMode='contain'
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CobbleStepsHome;
