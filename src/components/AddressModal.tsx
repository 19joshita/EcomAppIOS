import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (address: string) => void;
}

const AddressModal: React.FC<Props> = ({ visible, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [pincode, setPincode] = useState('');
  const [address, setAddress] = useState('');

  const handleSave = () => {
    if (!name.trim() || !pincode.trim() || !address.trim()) {
      Alert.alert('Please fill all fields');
      return;
    }

    const formatted = `${name}\n${address}\nPincode: ${pincode}`;

    onSave(formatted);

    setName('');
    setPincode('');
    setAddress('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Add New Address</Text>

          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Pincode"
            style={styles.input}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="number-pad"
          />

          <TextInput
            placeholder="Full Address"
            style={[styles.input, styles.addressInput]}
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <View style={styles.row}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Save Address
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddressModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: {
    padding: 12,
  },
  saveBtn: {
    backgroundColor: 'black',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
});