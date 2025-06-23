import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal } from 'react-native';

import {Formik} from 'formik';
import { FormikHelpers } from 'formik';

import { signUpSchema } from '@/schemas/signup-schema';

import TermsModal from '@/components/TermsModal'; // adjust path as needed
import PolicyModal from '@/components/PolicyModal'; // adjust path as needed



type BasicFields = {
  email: string
  fullName: string
  password: string
  confirmPassword: string;

}

export default function SignUp() {
  const router = useRouter();
  const [showTermsModal, setShowTermsModal] = useState(false);
const [showPolicyModal, setShowPolicyModal] = useState(false);
const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
const [hasAgreedToPolicy, setHasAgreedToPolicy] = useState(false);
const [isMainCheckboxChecked, setIsMainCheckboxChecked] = useState(false);
  const [tcError, setTcError] = useState<string | null>(null);

  const handleEmailSubmit = async (
    values: BasicFields,
    helpers: FormikHelpers<BasicFields>
  ) => {
    const { setFieldError } = helpers;
    if (!(isMainCheckboxChecked && hasAgreedToTerms && hasAgreedToPolicy)) {
      console.log('hasAgreedToTerms : '+hasAgreedToTerms);
      console.log('hasAgreedToPolicy : '+hasAgreedToPolicy);
      setTcError('❌ Please click on the links to read the Terms & Conditions and Privacy Policy.');
      return;

    } else {
      setTcError(null);
    }
    try {
      const { confirmPassword, ...safeValues } = values;

      const para = {
        email: safeValues.email,
        fullName: safeValues.fullName,
        password: safeValues.password,
      };
      console.log("Redirecting to complete-profile with:", para);

       router.push({
         pathname: '/auth/complete-profile',
         params: para
       });
    }
    catch (error: any) {
      let errorMessage = '';

      switch (error.name) {
        case 'UsernameExistsException':
          errorMessage = 'Email already exists';
          setFieldError('email', errorMessage);
          return { result: true, errorMessage };

        case 'ReferenceError':
        case 'UserNotFoundException':
          errorMessage = 'Email does not exist';
          setFieldError('email', errorMessage);
          return { result: false, errorMessage };

        default:
          errorMessage = 'An unknown error occurred';
          setFieldError('email', errorMessage);
          return { result: false, errorMessage };
      }
    }

  };


  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          email: '',
          fullName: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={handleEmailSubmit}
         validationSchema={signUpSchema}
        validateOnChange={true}>
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
            <View style={styles.headingContainer}>
              <Text style={styles.headingText}>Create Account</Text>
              <Text style={styles.textDescription}>
                Let's create your account
              </Text>
            </View>
            <View style={styles.textInputContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.textStyle}>Full Name</Text>
                <TextInput
                  testID="fullName"
                  style={styles.inputStyle}
                  value={values.fullName}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  placeholder="Bruce Wayne"
                  placeholderTextColor={'#9B9B9B'}
                />
                {touched.fullName && errors.fullName ? (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                ) : null}
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.textStyle}>Email</Text>
                <TextInput
                  style={styles.inputStyle}
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder="Enter your email address"
                  placeholderTextColor={'#9B9B9B'}
                />
                {touched.email && errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.textStyle}>Password</Text>
                <TextInput
                  style={styles.inputStyle}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry
                  placeholder="Enter your password"
                  placeholderTextColor={'#9B9B9B'}
                />
                {touched.password && errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.textStyle}>Confirm Password</Text>
                <TextInput
                  style={styles.inputStyle}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  placeholder="Enter your password again"
                  placeholderTextColor={'#9B9B9B'}
                  secureTextEntry
                />
                {touched.confirmPassword && errors.confirmPassword ? (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                ) : null}
              </View>

              <View style={styles.termsAndConditionsContainer}>
              <BouncyCheckbox
                size={25}
                fillColor="#77C4C6"
                unFillColor="#FFFFFF"
                isChecked={isMainCheckboxChecked}
                iconStyle={{ borderColor: '#a3a2a0' }}
                innerIconStyle={{ borderWidth: 2 }}
                onPress={() => setIsMainCheckboxChecked(!isMainCheckboxChecked)}
              />
              <Text style={styles.tcText}>I agree to the </Text>
              <TouchableOpacity onPress={() => setShowTermsModal(true)}>
                <Text style={styles.linkText}>Terms & Conditions</Text>
              </TouchableOpacity>
              <Text style={styles.tcText}> and </Text>
              <TouchableOpacity onPress={() => setShowPolicyModal(true)}>
                <Text style={styles.linkText}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
              {tcError && <Text style={styles.errorText}>{tcError}</Text>}
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleSubmit()} >
                  <LinearGradient
                    colors={['#4B84C4', '#77C4C6']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={[styles.primaryBtn]}>
                    <Text style={styles.primaryBtnTxt}>Create Account</Text>
                  </LinearGradient>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
              <View style={styles.lineContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>Or sign in with</Text>
                <View style={styles.line} />
              </View>
              <View style={styles.googleAppleSignInContainer}>
                <TouchableOpacity>
                  <Image
                    style={styles.imgButtons}
                    source={require('@/assets/images/google.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    style={styles.imgButtons}
                    source={require('@/assets/images/apple.png')}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginBtnText1}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => router.push('/auth/sign-in')}>
                  <Text style={styles.loginBtnText2}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </Formik>

        <TermsModal
          visible={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          onProceed={() => {
            setShowTermsModal(false);
            setHasAgreedToTerms(true);
          }}
          isChecked={hasAgreedToTerms}
          onToggleCheck={() => setHasAgreedToTerms(!hasAgreedToTerms)}
        />

        <PolicyModal
          visible={showPolicyModal}
          onClose={() => setShowPolicyModal(false)}
          onProceed={() => {
            setShowPolicyModal(false);
            setHasAgreedToPolicy(true);
          }}
          isChecked={hasAgreedToPolicy}
          onToggleCheck={() => setHasAgreedToPolicy(!hasAgreedToPolicy)}
        />

    </ScrollView>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headingContainer: {
    flex: 0.3,
    justifyContent: 'flex-start',
    marginTop: '5%',
  },
  headingText: {
    fontFamily: 'Josefin Sans',
    fontSize: 35,
    fontWeight: '500',
    textAlign: 'center',
  },
  textInputContainer: {
    flex: 1.9,
  },
  inputWrapper: {
    justifyContent: 'center',
    alignContent: 'center',
    margin: '3%',
  },
  textStyle: {
    fontSize: 16,
    fontFamily: 'Josefin Sans',
    color: '#000000',
  },
  textDescription: {
    fontSize: 18,
    marginTop: 5,
    fontFamily: 'Josefin Sans',
    color: '#9B9B9B',
    textAlign: 'center',
  },
  inputStyle: {
    backgroundColor: '#F4F6F9',
    borderRadius: 7,
    padding: 15,
    fontFamily: 'Josefin Sans',
  },

  primaryBtn: {
    width: '90%',
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#77C4C6',
    marginHorizontal: 8,
  },
  primaryBtnTxt: {
    fontFamily: 'Josefin Sans',
    textAlign: 'center',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonContainer: {
    flex: 0.2,
    alignContent: 'center',
    justifyContent: 'center',
    marginTop: '10%',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  termsAndConditionsContainer: {
    flexDirection: 'row',
    margin: '3%',
  },
  tcText: {
    marginTop: '2%',
    fontFamily: 'Josefin Sans',
  },
  linkText: {
    marginTop: '2%',
    fontFamily: 'Josefin Sans',
    color: '#77C4C6',
    textDecorationLine: 'underline',
  },
  googleAppleSignInContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  imgButtons: {
    height: 50,
    width: 50,
    margin: 10,
  },
  orText: {
    marginTop: '3%',
    fontFamily: 'Josefin Sans',
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  bottomContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtn: {},
  loginBtnText1: {
    fontFamily: 'Josefin Sans',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginBtnText2: {
    fontFamily: 'Josefin Sans',
    color: '#77C4C6',
    textDecorationLine: 'underline',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
  },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContainer: {
      backgroundColor: '#fff',
      borderRadius: 16,
      width: '100%',
      maxHeight: '85%',
      padding: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
    },
    modalContent: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#800080', // purple
      marginTop: 12,
    },
    sectionText: {
      fontSize: 14,
      color: '#333',
      marginTop: 4,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    declineBtn: {
      backgroundColor: '#eeeeee',
    },
    acceptBtn: {
      backgroundColor: '#1abc9c',
    },
    declineText: {
      color: '#555',
      fontWeight: 'bold',
    },
    acceptText: {
      color: '#fff',
      fontWeight: 'bold',
    },

});
