import React from 'react';
import { Image } from 'react-native';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from 'react-native';

import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Welcome() {
  const router = useRouter();
  const Banner = require('../../assets/images/welcomeScreenImage.jpeg'); // change path accordingly

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.greyBox}>
        {/*<Text style={styles.boxText}></Text>*/}
        <Image source={Banner} style={styles.bannerImage} />
      </View>

      <View style={styles.logoContainer}>
        <Image style={styles.img} source={require('../../assets/images/logo.png')} />
        <Text style={styles.headerText}>Voltage Training</Text>
        <Text style={styles.headerText}>Club</Text>
        <Text style={styles.headerText2}>The fitness everything club</Text>
      </View>

      <View style={styles.textInputContainer}>

        <LinearGradient
          colors={['#4B84C4', '#77C4C6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryBtn }
        >
          <TouchableOpacity
              onPress={() => router.push('/auth/starting-page')}
          >
            <Text style={styles.primaryBtnTxt}>Get Started</Text>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => router.push('/auth/sign-in')}
        >
          <Text style={styles.registerBtnText1}>Already have an account?</Text>
          <Text style={styles.registerBtnText2}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 20,
  },
  headerText: {
    fontFamily: 'Josefin Sans',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerText2: {
    fontFamily: 'Josefin Sans',
    fontSize: 15,
    color: 'grey',
    textAlign: 'center',
  },
  textInputContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  primaryBtn: {
    width: '90%',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  primaryBtnTxt: {
    fontFamily: 'Josefin Sans',
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  registerBtn: {
    flexDirection: 'row',
  },
  registerBtnText1: {
    fontFamily: 'Josefin Sans',
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: '2%',
  },
  registerBtnText2: {
    fontFamily: 'Josefin Sans',
    color: '#77C4C6',
    textDecorationLine: 'underline',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greyBox: {
    width: '100%',
    height: 240,
    backgroundColor: '#808080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxText: {
    color: '#fff',
    fontSize: 18,
  },
  img: {
    width: 100,
    height: 120,
    marginBottom: 3,
    resizeMode: 'contain',

  },
  bannerImage: {
    width: '100%',
    aspectRatio: 3 / 10, // Example: width:height = 3:2
    resizeMode: 'contain',
  },
});
