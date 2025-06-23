import {
    StyleSheet,
    TouchableOpacity,
    TextInput,
    View,
    Text,
    SafeAreaView,
  } from 'react-native';
  import React from 'react';

  import { useRouter } from 'expo-router';

  import { resetPassword } from 'aws-amplify/auth';

  import {Formik} from 'formik';
  import { LinearGradient } from 'expo-linear-gradient';

  export default function forgetPassword() {
    const router = useRouter();

    async function handleVerificationCodeSubmit(values, {setFieldError}) {
      try{
       const data = await resetPassword({ username: values.email });

        const para = {
            email: values.email,
          };
        router.push({
            pathname: '/forgetPassword/verificationCode',
            params: para
          });

       // console.log(data);
      } catch (err) {
        console.log(err)
        setFieldError(
          'verificationCode',
          `Code you entered is invalid, please enter the correct code sent to ${values.email}`)
      }
    }

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headContainer}>
        <Text style={styles.headline}> Forget Password</Text>
          <Text style={styles.subheadline}>Enter your email address to continue</Text>
        </View>

        <Formik
          initialValues={{email: ''}}
          onSubmit={(values, {setFieldError}) =>
            handleVerificationCodeSubmit(values, {setFieldError})

          }>
          {({
            values,
            errors,
            touched,
            isValid,
            handleChange,
            handleSubmit,
            handleBlur,
            setFieldError,
          }) => (
            <>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputStyle}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('Email address')}
                  placeholder="Email address"
                  placeholderTextColor={'#9B9B9B'}
                />
                {touched.email && errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>
              <View style={styles.buttonContainer}>
              <LinearGradient
              colors={['#4B84C4', '#77C4C6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtn}>
              <TouchableOpacity onPress={() => handleSubmit()}>
                <Text style={styles.primaryBtnTxt}>Continue</Text>
              </TouchableOpacity>
            </LinearGradient>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({

  headline: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
  },
  subheadline: {
    fontSize: 14,
    color: '#A9A9A9',
  },
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    inputWrapper: {
      flex: 1,
      padding: '5%',
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
      padding: 10,
      backgroundColor: '#77C4C6',
      marginBottom: '10%',

    },
    primaryBtnTxt: {
      fontFamily: 'Josefin Sans',
      textAlign: 'center',
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 20,
    },
    buttonContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginTop: 5,
    },
    headContainer: {
      flex: 0.5,
      padding: '5%',
      flexDirection: 'column',
    },
    headingTextContainer: {
      flex: 1,
      alignItems: 'baseline',
      marginLeft: '5%',
      flexDirection: 'row',
      // justifyContent: 'center',
    },
    backButtonImage: {
      height: 30,
      width: 30,
    },
    headerText: {
      fontFamily: 'Josefin Sans',
      fontSize: 30,
      fontWeight: '500',
    },
    headingDescription: {
      flex: 1,
    },
    descriptionText: {
      fontFamily: 'Josefin Sans',
      color: '#9B9B9B',
      fontSize: 15,
      marginBottom: '3%',
    },
  });
