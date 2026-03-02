import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { getUser, setLoggedInUser, getLoggedInUser } from '../../utils/storage';

const { width } = Dimensions.get('window');

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(4, 'Too Short!').required('Required'),
});

const LoginScreen = ({ navigation, setUserState }: any) => {
  const [storedUser, setStoredUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setStoredUser(user);

      const loggedInEmail = await getLoggedInUser();
      if (loggedInEmail) {
        // Instead of navigation.replace, just update user state
        setUserState(loggedInEmail);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = async (values: any) => {
    if (storedUser && values.email === storedUser.email && values.password === storedUser.password) {
      await setLoggedInUser(values.email);
      Alert.alert('Success', 'Logged in successfully!');

      // Update auth state; AppNavigator will automatically show Home
      setUserState(values.email);
    } else {
      Alert.alert('Error', 'Invalid credentials!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
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
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Don't have an account? Register</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 40, color: '#333' },
  input: { width: width * 0.9, borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 15, borderRadius: 10, backgroundColor: 'white' },
  button: { width: width * 0.9, backgroundColor: '#191919', padding: 15, borderRadius: 10, marginTop: 10 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  error: { color: 'red', alignSelf: 'flex-start', width: width * 0.9, marginBottom: 5 },
  link: { color: '#0c0c0c', marginTop: 15, textDecorationLine: 'underline' },
});