import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  Image,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { confirmResetPassword } from 'aws-amplify/auth'; // ✅ v6 modular import
import { Formik } from 'formik';
import * as Yup from 'yup';

export default function VerificationCode() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const validationSchema = Yup.object().shape({
    verificationCode: Yup.string().required('Verification code is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Confirm password is required'),
  });

  async function handleVerificationCodeSubmit(values, { setFieldError }) {
    try {
      await confirmResetPassword({
        username: Array.isArray(email) ? email[0] : email,
        confirmationCode: values.verificationCode,
        newPassword: values.password,
      }); // ✅ v6 usage

      router.push('/auth/sign-in');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log('An unknown error occurred');
      }
      setFieldError(
        'verificationCode',
        `Code you entered is invalid, please enter the correct code sent to ${email}`
      );
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
          <Text style={styles.headerText}>Verification</Text>
        </View>
        <View style={styles.headingDescription}>
          <Text style={styles.descriptionText}>
            Enter the confirmation code we sent to{' '}
          </Text>
          <Text style={styles.descriptionText}>{email}</Text>
        </View>
      </View>

      <Formik
        initialValues={{
          verificationCode: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={(values, { setFieldError }) =>
          handleVerificationCodeSubmit(values, { setFieldError })
        }
        validationSchema={validationSchema}>
        {({
          values,
          errors,
          touched,
          isValid,
          handleChange,
          handleSubmit,
          handleBlur,
        }) => (
          <>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.inputStyle}
                value={values.verificationCode}
                onChangeText={handleChange('verificationCode')}
                onBlur={handleBlur('verificationCode')}
                placeholder="Enter confirmation code"
                placeholderTextColor={'#9B9B9B'}
              />
              {touched.verificationCode && errors.verificationCode ? (
                <Text style={styles.errorText}>{errors.verificationCode}</Text>
              ) : null}

              <TextInput
                style={styles.inputStyle}
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="Select new password"
                placeholderTextColor={'#9B9B9B'}
                secureTextEntry={true}
              />
              {touched.password && errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}

              <TextInput
                style={styles.inputStyle}
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                placeholder="Confirm new password"
                placeholderTextColor={'#9B9B9B'}
                secureTextEntry={true}
              />
              {touched.confirmPassword && errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.primaryBtn]}
                disabled={!isValid}
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
