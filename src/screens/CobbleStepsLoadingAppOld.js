import React, {useContext, useEffect, useState, useRef} from 'react';
import {View, Dimensions, Animated, ImageBackground, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {loadUserData} from '../redux/userSlice';
import {UserContext} from '../context/UserContext';
import CobbleLoadingComponent from '../components/CobbleLoadingComponent';

const CobbleStepsLoadingAppOld = () => {
  const navigation = useNavigation();
  const {setUser} = useContext(UserContext);
  const dispatch = useDispatch();
  const dimensions = Dimensions.get('window');

  const [isCobbleStepsLoadedUser, setCobbleStepsLoadedUser] = useState(false);
  const [isCobbleStepsOnboWasBefore, setCobbleStepsOnboWasBefore] =
    useState(false);

  const loadingCobbleOpacityAnim = useRef(new Animated.Value(1)).current;
  const loadingCobbleScaleAnim = useRef(new Animated.Value(1)).current;

  const iconOpacityAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0.3)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;

  const fadeOutAnim = useRef(new Animated.Value(1)).current;
  const scaleOutAnim = useRef(new Animated.Value(1)).current;
  const slideUpAnim = useRef(new Animated.Value(0)).current;

  const iconRotateInterpolate = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    const cobbleStepsLoadingUserOld = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const isCobbleStepsUserWasLoadedBef = await AsyncStorage.getItem(
          'isCobbleStepsUserWasLoadedBef',
        );
        const storesCobbleStepsUser = await AsyncStorage.getItem(storageKey);

        if (storesCobbleStepsUser) {
          setUser(JSON.parse(storesCobbleStepsUser));
          setCobbleStepsLoadedUser(false);
        } else if (isCobbleStepsUserWasLoadedBef) {
          setCobbleStepsLoadedUser(false);
        } else {
          setCobbleStepsLoadedUser(true);
          await AsyncStorage.setItem('isCobbleStepsUserWasLoadedBef', 'true');
        }
      } catch (error) {
        console.error('Loading cobble steps user error: ', error);
      } finally {
        setCobbleStepsOnboWasBefore(true);
      }
    };

    cobbleStepsLoadingUserOld();
  }, [setUser]);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    if (isCobbleStepsOnboWasBefore) {
      const cobbleTimerSteps = setTimeout(() => {
        Animated.parallel([
          Animated.timing(loadingCobbleOpacityAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(loadingCobbleScaleAnim, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Animated.sequence([
            Animated.parallel([
              Animated.spring(iconScaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
              }),
              Animated.timing(iconOpacityAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(iconRotateAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
              }),
            ]),
            Animated.spring(iconScaleAnim, {
              toValue: 1.05,
              tension: 150,
              friction: 4,
              useNativeDriver: true,
            }),
            Animated.spring(iconScaleAnim, {
              toValue: 1,
              tension: 150,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.delay(1000),
            Animated.parallel([
              Animated.timing(slideUpAnim, {
                toValue: -dimensions.height,
                duration: 800,
                useNativeDriver: true,
              }),
              Animated.timing(fadeOutAnim, {
                toValue: 0,
                duration: 600,
                delay: 200,
                useNativeDriver: true,
              }),
              Animated.timing(scaleOutAnim, {
                toValue: 1.2,
                duration: 800,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
        });
      }, 4000);

      return () => clearTimeout(cobbleTimerSteps);
    }
  }, [isCobbleStepsOnboWasBefore, isCobbleStepsLoadedUser, navigation]);

  return (
    <View style={{flex: 1, backgroundColor: '#b35805'}}>
      <Animated.View
        style={{
          alignItems: 'center',
          height: dimensions.height,
          justifyContent: 'center',
          width: dimensions.width,
          opacity: fadeOutAnim,
          transform: [{scale: scaleOutAnim}, {translateY: slideUpAnim}],
          backgroundColor: '#b35805',
        }}>
        <ImageBackground
          source={require('../assets/images/cobbleStepsBg.png')}
          style={{
            flex: 1,
            width: dimensions.width,
            height: dimensions.height,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          resizeMode="cover"
        />

        {/* Loading Animation */}
        <Animated.View
          style={{
            position: 'absolute',
            opacity: loadingCobbleOpacityAnim,
            transform: [{scale: loadingCobbleScaleAnim}],
          }}>
          <CobbleLoadingComponent />
        </Animated.View>

        {/* App Icon Animation */}
        <Animated.View
          style={{
            opacity: iconOpacityAnim,
            transform: [
              {scale: iconScaleAnim},
              {rotate: iconRotateInterpolate},
            ],
          }}>
          <Image
            source={require('../assets/images/appIcon.png')}
            style={{
              width: dimensions.width * 0.7,
              height: dimensions.width * 0.7,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

export default CobbleStepsLoadingAppOld;
