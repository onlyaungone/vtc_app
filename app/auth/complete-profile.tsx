import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useState, useRef} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import PhoneInput from 'react-native-phone-number-input';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router';

import Auth  from 'aws-amplify/auth';
import  Storage from 'aws-amplify/storage';
import { signUp } from 'aws-amplify/auth';

import { uploadData } from 'aws-amplify/storage';

import * as Yup from 'yup';

import {Formik} from 'formik';
import { registrationSchema } from '@/schemas/registration-schema';

export default function compProfile() {
  const router = useRouter();

  //const { email, fullName, password } = useLocalSearchParams();
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email ?? '';
  const fullName = Array.isArray(params.fullName) ? params.fullName[0] : params.fullName ?? '';
  const password = Array.isArray(params.password) ? params.password[0] : params.password ?? '';
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [imageName, setImageName] = useState('');
  const [imageData, setImageData] = useState<Blob>();
  const phoneInput = useRef<PhoneInput>(null);
  const [modalVisible, setModalVisible] = useState(false);


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // const handleConfirm = (event, newDate:any) => {
  //   setSelectedDate(newDate); 
  //   setDatePickerVisibility(false); 

  // };
  const handleConfirm = (event: any, newDate: any, setFieldValue: any) => {
    if (newDate) {
      setSelectedDate(newDate);
      setFieldValue('dateOfBirth', newDate);
    }
    setDatePickerVisibility(false);
  };

  const parseDateInput = (input: string): Date | null => {
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!dateRegex.test(input)) return null;
    const [month, day, year] = input.split('/').map(Number);
    const parsed = new Date(year, month - 1, day);
    return isNaN(parsed.getTime()) ? null : parsed;
  };


  const signUpHandle = async (values:any) => {
    try{
    const {confirmPassword, ...restValues} = values;
     console.log('signUp values :')
     await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          'custom:dateOfBirth': selectedDate.toISOString().split('T')[0], // ✅ Cognito expects string
          'custom:fullName': fullName,
          phone_number: restValues.phoneNumber,
          'custom:profilePicture': imagePath,
          'custom:role': 'NotSet',
        },
      },
    });

    
    const para = {
      email: email,
      imageName: imageName,
      imageURI: imagePath,
      password: password,
    };

    router.push({
        pathname: '/auth/verification',
        params: para
     });
    
  }
  catch(error){
    console.log('Error : ', error);
  }
};

  const fetchResourceFromURI = async (uri:string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const uploadImageS3 = async (filename: string) => {
    try {
      const result = await uploadData({
        key: filename,
        data: imageData!,
        options: { contentType: 'image/jpeg' },
      }).result;
  
      return result.key;
    } catch (error) {
      console.log('S3 Upload Error:', error);
    }
  };
  



  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

 
const handleCameraSelection = async () => {

// Request permissions first
const { status } = await ImagePicker.requestCameraPermissionsAsync();
if (status !== 'granted') {
  alert('Camera permission is required to take a photo.');
  return;
}

  // Handle selection of Camera
  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [3, 4],
    quality: 1,
  });

  if (!result.canceled) {
    const image = result.assets[0];
    setImagePath(image.uri);
    // Optionally, fetch the image data as a blob if needed
    const imageBlob = await fetchResourceFromURI(image.uri);
    setImageData(imageBlob);
    setImageName(image.uri.split('/').pop() ?? '');
    closeModal();
  }
};

const handleGallerySelection = async () => {
  // Handle selection of Photo Gallery
  let result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [3, 4],
    quality: 1,
    base64: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
  });

  if (!result.canceled) {
    const image = result.assets[0];
    setImagePath(image.uri);
    // Optionally, fetch the image data as a blob if needed
    const imageBlob = await fetchResourceFromURI(image.uri);
    setImageData(imageBlob);
    setImageName(image.uri.split('/').pop() ?? '');

    closeModal();
  }
};

const getFormattedDate = (date: Date) => {
  return date ? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` : '';
};

 const isAtLeast18 = (date: Date) => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };
  
  const registrationSchema = Yup.object().shape({
    //phoneNumber: Yup.string().required('Phone number is required'),
    dateOfBirth: Yup.date()
      .required('Date of birth is required')
      .test('is-18', 'You must be at least 18 years old', value => value ? isAtLeast18(value) : false),
  });

  return (
    <SafeAreaView style={styles.container}>
       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps="handled">
                <Formik
                  initialValues={{
                    fullName: '',
                    dateOfBirth: selectedDate,
                    phoneNumber: '',
                    loginWithBiometric: false,
                    measurementUnit: 'Metric',
                  }}
                  onSubmit={values => signUpHandle(values)}
                  validationSchema={registrationSchema}
                  validateOnChange={true}>
                  {({
                    values,
                    errors,
                    touched,
                    isValid,
                    handleChange,
                    handleSubmit,
                    handleBlur,
                    setFieldValue,
                  }) => (
                    <>
                      <View style={styles.headingContainer}>
                        <Text style={styles.headingText}>Complete Profile</Text>
                        <Text style={styles.textDescription}>
                          Add some details to complete
                        </Text>
                        <Text style={styles.textDescription}>your profile {email}</Text>
                      </View>
                      <View style={styles.inputWrapperContainer}>
                        <TouchableOpacity
                          style={styles.imageTouchable}
                          onPress={openModal}>
                          {imagePath ? (
                            <Image
                              source={{uri: imagePath}}
                              style={styles.profilePicture}
                            />
                          ) : (
                            <Image
                              source={require('@/assets/images/logo.png')} 
                              style={styles.profilePicture}
                            />
                          )}
                        </TouchableOpacity>
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={modalVisible}
                          onRequestClose={closeModal}>
                          <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                              <Text style={styles.modalTitle}>Select Option</Text>
                              <TouchableOpacity
                                style={styles.modalButton}
                                onPress={handleCameraSelection}>
                                <Text>Use Camera</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => handleGallerySelection()}>
                                <Text>Choose from Gallery</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={closeModal}>
                                <Text style={styles.cancelText}>Cancel</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </Modal>
                        {/* DATE INPUT */}
                      {/* DATE INPUT */}
                      <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.inputStyle}
                        value={getFormattedDate(values.dateOfBirth)}
                        placeholder="Date Of Birth"
                        placeholderTextColor={'#a3a2a0'}
                        onBlur={handleBlur('dateOfBirth')}
                        editable={true}
                        onChangeText={(text) => {
                          const parsedDate = parseDateInput(text);
                          if (parsedDate) {
                            setSelectedDate(parsedDate);
                            setFieldValue('dateOfBirth', parsedDate);
                          } else {
                            setFieldValue('dateOfBirth', '');
                          }
                        }}
                        onFocus={showDatePicker}
                      />
                      {isDatePickerVisible && (
                        <DateTimePicker
                          value={values.dateOfBirth instanceof Date ? values.dateOfBirth : new Date()}
                          mode="date"
                          display="default"
                          onChange={(event, date) => handleConfirm(event, date, setFieldValue)}
                          maximumDate={new Date()}
                        />
                      )}
                      {touched.dateOfBirth && typeof errors.dateOfBirth === 'string' ? (
                        <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                      ) : null}
                    </View>
                        <View style={styles.inputWrapper}>
                          <PhoneInput
                            value={values.phoneNumber}
                            ref={phoneInput}
                            defaultValue={values.phoneNumber}
                            defaultCode="AU"
                            layout="first"
                            onChangeFormattedText={(text) => {
                              setFieldValue('phoneNumber', text);  
                            }}
                            textInputStyle={styles.inputStyle}
                            containerStyle={styles.phoneInputContainer}
                            textContainerStyle={styles.phoneTextContainerStyle}
                          />
                          {touched.phoneNumber && errors.phoneNumber ? (
                            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                          ) : null}
                        </View>
                      </View>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          style={styles.primaryBtn}
                          onPress={() => handleSubmit()}>
                          <Text style={styles.primaryBtnTxt}>Create Account</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </Formik>
            </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  headingContainer: {
    padding: '6%',
    flex: 0.5,
    justifyContent: 'flex-start',
  },
  headingText: {
    fontFamily: 'Josefin Sans',
    fontSize: 35,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputWrapperContainer: {
    flex: 2,
    padding: '6%',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  textStyle: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textDescription: {
    fontSize: 18,
    marginTop: '4%',
    fontFamily: 'Josefin Sans',
    color: '#9B9B9B',
    textAlign: 'center',
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
    padding: 15,
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#CCCCCC',
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    color: 'red',
  },
  imageTouchable: {},
  inputWrapper: {
    marginTop: '5%',
  },
  phoneInputContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  phoneTextContainerStyle: {
    backgroundColor: '#FFFFFF',
  },
  buttonContainer: {
    flex: 1,
    marginBottom: '5%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
