import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { getLoggedInUser, getUser, logoutUser, saveUser } from '../../utils/storage';
import { LogOut, Edit2 } from 'lucide-react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

const { width } = Dimensions.get('window');

const ProfileSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
});

const ProfileScreen = ({ navigation, setUserState }: any) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = await getLoggedInUser();
      const storedUser = await getUser();
      if (!email || !storedUser) {
        navigation.replace('Login');
      } else {
        setUser({ name: storedUser.name, email: storedUser.email });
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUserState(null);
    Alert.alert('Logged out', 'You have been logged out successfully');
  };

  const handleUpdateProfile = async (values: any) => {
    await saveUser(values);
    setUser(values);
    setModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://i.imgur.com/8Km9tLL.png' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
          <Edit2 color="white" width={18} height={18} />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut color="white" width={20} height={20} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Formik
              initialValues={{ name: user?.name || '', email: user?.email || '' }}
              validationSchema={ProfileSchema}
              onSubmit={handleUpdateProfile}
            >
              {({ handleChange, handleSubmit, values, errors, touched }) => (
                <>
                  <TextInput
                    placeholder="Name"
                    style={styles.input}
                    value={values.name}
                    onChangeText={handleChange('name')}
                  />
                  {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    value={values.email}
                    onChangeText={handleChange('email')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                  <TouchableOpacity style={styles.saveButton} onPress={() => handleSubmit()}>
                    <Text style={styles.saveText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 20 },
  header: { marginTop: 40, marginBottom: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },

  profileCard: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 16, color: '#555', marginBottom: 15 },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4e54c8',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  editText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },

  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191919',
    paddingVertical: 12,
    borderRadius: 25,
  },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333', textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
  },
  error: { color: 'red', marginBottom: 5 },
  saveButton: { backgroundColor: '#4e54c8', padding: 12, borderRadius: 10, marginTop: 10 },
  saveText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  cancelButton: { padding: 12, borderRadius: 10, marginTop: 10, backgroundColor: '#ccc' },
  cancelText: { color: '#333', textAlign: 'center', fontWeight: 'bold' },
});