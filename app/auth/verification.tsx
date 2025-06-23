import {
    StyleSheet,
    TouchableOpacity,
    TextInput,
    View,
    Text,
    Image,
    SafeAreaView,
    ActivityIndicator,
  } from 'react-native';
  import React, { useState } from 'react';
  import { useNavigation,useLocalSearchParams, useRouter } from 'expo-router';

  import { confirmSignUp, signOut , signIn} from 'aws-amplify/auth';

  import {Formik} from 'formik';
  import type { FormikHelpers } from 'formik';
  import { uploadData } from 'aws-amplify/storage';


  import { verificationCodeSchema } from '@/schemas/verificationCode-schema';

  export default function verification() {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);
    const params = useLocalSearchParams();
    const password = Array.isArray(params.password) ? params.password[0] : params.password ?? '';
    const email = Array.isArray(params.email) ? params.email[0] : params.email ?? '';
    const imageURI = Array.isArray(params.imageURI) ? params.imageURI[0] : params.imageURI ?? '';
    const imageName = Array.isArray(params.imageName) ? params.imageName[0] : params.imageName ?? '';

    //const { isSignedIn, nextStep } = await signIn({ username: username, password: password, options: { authFlowType: "USER_PASSWORD_AUTH",    }, });
 

    async function handleVerificationCodeSubmit(
      values: { verificationCode: string },
      formikHelpers: FormikHelpers<{ verificationCode: string }>
    ) {
      const { setFieldError } = formikHelpers;
    
      try {
        setLoading(true);
        // Step 1: Confirm sign-up
        await confirmSignUp({
          username: email,
          confirmationCode: values.verificationCode,
        });
    
         try {
           const user = await signIn({
             username: email,
             password: password,
             options: { authFlowType: "USER_PASSWORD_AUTH",},
           });
           console.log('✅ Sign-in successful:', user);
         } catch (err) {
           console.log('❌ Sign-in failed:', err);
         }
    
        // Step 2: Upload image (if needed)
        console.log('imageName ',imageName);
        console.log('imageURI ',imageURI);
        if (imageURI && imageName) {
          const blob = await fetch(imageURI).then(res => res.blob());
          await uploadData({
            key: imageName,
            data: blob,
            options: {
              contentType: 'image/jpeg',              
            },
          }).result;    
          console.log('✅ Image uploaded to S3.');
        }
    
        await signOut(); // optional after upload
        router.push('/auth/signup-successful');
      } catch (error: any) {
        console.error(error.message);
        setFieldError(
          'verificationCode',
          `Code is invalid or expired. Please check your email for the correct code.`
        );
      }finally {

        setLoading(false);
        
        }
    }
  
  
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headContainer}>
          <View style={styles.headingTextContainer}>
            <TouchableOpacity>
              <Image
                style={styles.backButtonImage}
                source={require('@/assets/images/left-arrow.png')}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}> Verification</Text>
          </View>
          <View style={styles.headingDescription}>
            <Text style={styles.descriptionText}>
              Enter the confirmation code we sent to{' '}
            </Text>
            <Text style={styles.descriptionText}>{email}</Text>
          </View>
        </View>
  
        <Formik
          initialValues={{verificationCode: ''}}
          onSubmit={handleVerificationCodeSubmit}
          validationSchema={verificationCodeSchema}>
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
                  value={values.verificationCode}
                  onChangeText={handleChange('verificationCode')}
                  onBlur={handleBlur('verificationCode')}
                  placeholder="Enter your confirmation code"
                  placeholderTextColor={'#9B9B9B'}
                />
                {touched.verificationCode && errors.verificationCode ? (
                  <Text style={styles.errorText}>{errors.verificationCode}</Text>
                ) : null}
                {isLoading && (
                  <ActivityIndicator size="large" color="#77C4C6" style={{ marginVertical: 20 }} />
                )}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.primaryBtn]}
                  disabled={!isValid || isLoading}
                  onPress={() => handleSubmit()}>
                  <Text style={styles.primaryBtnTxt}>Continue</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
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
  