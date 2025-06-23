import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Image,
  Text,
  ScrollView, ActivityIndicator,
} from 'react-native';

import React, {useState} from 'react';

import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Formik } from 'formik';

const Logo = require('../../assets/images/logo.png');
const Google = require('../../assets/images/google.png');
const Apple = require('../../assets/images/apple.png');

import {useAuth} from "@/context/AuthContext";

export default function SignInScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  function forgotPassword() {
    router.push('/forgetPassword/forgetPassword');
  }

  async function handleSignIn({ username, password }: { username: string; password: string }, setFieldError: (field: string, errorMsg: string) => void) {
    await login(username, password, setLoading, setFieldError);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.img} source={Logo} />
        <Text style={styles.headerText}>Login</Text>
        <Text style={styles.headerText2}>Login with Email</Text>
      </View>
      <View style={styles.textInputContainer}>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={(values, { setFieldError }) =>
            handleSignIn(values, setFieldError)
          }>
          {({ handleSubmit, values, isValid, handleChange, errors, touched }) => (
            <>
              <View style={styles.inputWrapper}>
                <Text style={styles.textStyle}>Email</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={handleChange('username')}
                  placeholder="Enter your email address"
                  placeholderTextColor={'#9B9B9B'}
                  value={values.username}
                />
                {touched.username && errors.username ? (
                  <Text style={styles.errorText}>{errors.username}</Text>
                ) : null}
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.textStyle}>Password</Text>
                <TextInput
                  style={styles.inputStyle}
                  onChangeText={handleChange('password')}
                  placeholder="Enter your password"
                  placeholderTextColor={'#9B9B9B'}
                  secureTextEntry={true}
                  value={values.password}
                />
                {touched.password && errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.forgotPasswordBtn}
                  onPress={forgotPassword}>
                  <Text style={styles.forgotPasswordBtnText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>
              <LinearGradient
                colors={['#4B84C4', '#77C4C6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryBtn}>
                <TouchableOpacity
                    onPress={() => handleSubmit()}
                >
                  {loading
                      ? (<ActivityIndicator size="small" color="#ffffff" />)
                      : (<Text style={styles.primaryBtnTxt}>Login</Text>)
                  }
                </TouchableOpacity>
              </LinearGradient>
            </>
          )}
        </Formik>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or sign in with</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            <Image style={styles.imgButtons} source={Google} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={styles.imgButtons} source={Apple} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => router.push('/auth/sign-up')}>
          <Text style={styles.registerBtnText1}>Don't have an account?</Text>
          <Text style={styles.registerBtnText2}>Sign up</Text>
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
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  img: {
    height: 200,
    width: 200,
  },
  headerText: {
    fontFamily: 'Josefin Sans',
    fontSize: 25,
    fontWeight: 'bold',
  },
  headerText2: {
    fontFamily: 'Josefin Sans',
    marginTop: '5%',
    fontSize: 15,
    color: 'grey',
  },
  textInputContainer: {
    flex: 2,
    alignItems: 'center',
  },
  inputStyle: {
    backgroundColor: '#F4F6F9',
    borderRadius: 7,
    padding: 15,
    marginBottom: 10,
    fontFamily: 'Josefin Sans',
  },
  primaryBtn: {
    width: '90%',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 8,
  },
  primaryBtnTxt: {
    fontFamily: 'Josefin Sans',
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  inputWrapper: {
    marginBottom: 20,
    width: '90%',
  },
  textStyle: {
    fontFamily: 'Josefin Sans',
    marginBottom: 5,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  imgButtons: {
    height: 50,
    width: 50,
    margin: 10,
  },
  registerBtn: {
    padding: 10,
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
  forgotPasswordBtn: {
    padding: 10,
  },
  forgotPasswordBtnText: {
    fontFamily: 'Josefin Sans',
    color: '#77C4C6',
    textDecorationLine: 'underline',
    fontSize: 14,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  orText: {
    marginTop: '5%',
    fontFamily: 'Josefin Sans',
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    marginTop: '5%',
    width: 50,
    marginRight: '1%',
    marginLeft: '1%',
    height: 1,
    backgroundColor: '#000000',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
})
