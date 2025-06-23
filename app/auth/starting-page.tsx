import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    Text,
    ScrollView,
  } from 'react-native';

import React from 'react';

import {useRouter} from 'expo-router';
import {LinearGradient} from 'expo-linear-gradient';

const Logo = require('../../assets/images/logo.png');
const Google = require('../../assets/images/google.png');
const Apple = require('../../assets/images/apple.png');

// import {Auth} from 'aws-amplify';

export default function StartingPage() {
  const router = useRouter();

  return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Logo and Header */}
        <View style={styles.logoContainer}>
          <Image style={styles.img} source={Logo}/>
          <Text style={styles.headerText}>Let's Get Started!</Text>
          <Text style={styles.headerText2}>Let's get into your account</Text>
        </View>

        {/* Google Login Button */}
        <TouchableOpacity style={styles.button}
            // onPress={() => Auth.federatedSignIn({ provider: 'Google' })}
        >
          <View style={styles.iconContainer}>
            <Image source={Google} style={styles.icon}/>
          </View>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Apple Login Button */}
        <TouchableOpacity style={styles.button}>
          <View style={styles.iconContainer}>
            <Image source={Apple} style={styles.icon}/>
          </View>
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </TouchableOpacity>

        {/* Sign up with email Button */}
        <View style={styles.textInputContainer}>
          <LinearGradient
              colors={['#4B84C4', '#77C4C6']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.primaryBtn}
          >
            <TouchableOpacity onPress={() => router.push('/auth/sign-up')}>
              <Text style={styles.primaryBtnTxt}>Sign up with email</Text>
            </TouchableOpacity>
          </LinearGradient>

          {/* Sign In Link */}
          <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => router.push('/auth/sign-in')}
          >
            <Text style={styles.registerBtnText1}>Already have an account?</Text>
            <Text style={styles.registerBtnText2}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Policy and Terms of Service */}
        <View style={styles.footer}>
          <TouchableOpacity>
            <Text style={styles.footerText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}> | </Text>
          <TouchableOpacity>
            <Text style={styles.footerText}>Terms of service</Text>
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
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 30,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    img: {
      height: 100,
      width: 100,
      marginBottom: 20,
    },
    headerText: {
      fontFamily: 'Josefin Sans',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    headerText2: {
      fontFamily: 'Josefin Sans',
      fontSize: 16,
      color: 'grey',
      textAlign: 'center',
      marginBottom: 30,
    },
    textInputContainer: {
      alignItems: 'center',
      marginTop: 20,
      width: '100%',
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
      fontSize: 16,
      marginRight: 5,
    },
    registerBtnText2: {
      fontFamily: 'Josefin Sans',
      color: '#77C4C6',
      textDecorationLine: 'underline',
      fontSize: 16,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#000',
      borderWidth: 1,
      borderRadius: 25,
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginBottom: 15,
      width: '90%',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#000',
      marginLeft: 10,
    },
    iconContainer: {
      padding: 5,
    },
    icon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 30,
    },
    footerText: {
      fontFamily: 'Josefin Sans',
      color: 'grey',
      fontSize: 14,
    },
    exploreButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#4B84C4',
      borderRadius: 20,
    },
    exploreButtonText: {
      fontFamily: 'Josefin Sans',
      color: '#FFFFFF',
      fontSize: 16,
      textAlign: 'center',
    },
  });
