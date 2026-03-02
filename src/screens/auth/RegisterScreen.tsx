import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { saveUser, getLoggedInUser, setLoggedInUser } from '../../utils/storage';

const { width } = Dimensions.get('window');

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(4, 'Too Short!').required('Required'),
});

const RegisterScreen = ({ setUserState, navigation }: any) => {

  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedInEmail = await getLoggedInUser();
      if (loggedInEmail) {
        setUserState(loggedInEmail);
      }
    };
    checkLoggedIn();
  }, []);

  const handleRegister = async (values: any) => {
    await saveUser(values);
    await setLoggedInUser(values.email);
    setUserState(values.email); 
    Alert.alert('Success', 'Registered successfully!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              onChangeText={handleChange('name')}
              value={values.name}
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
              placeholder="Password"
              style={styles.input}
              secureTextEntry
              onChangeText={handleChange('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, color: '#333' },
  input: { width: width * 0.9, borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 15, borderRadius: 10, backgroundColor: 'white' },
  button: { width: width * 0.9, backgroundColor: '#191919', padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  error: { color: 'red', alignSelf: 'flex-start', width: width * 0.9, marginBottom: 5 },
  link: { color: '#0c0c0c', marginTop: 15, textDecorationLine: 'underline' },
});