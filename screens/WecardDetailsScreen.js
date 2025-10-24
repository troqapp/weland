import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function WecardDetailsScreen({ navigation }) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);

  const createWecard = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id,
            name: name.trim(),
            date_of_birth: dob.trim(),
            username: user.email.split('@')[0],
            created_at: new Date()
          }
        ]);

      setLoading(false);

      if (error) {
        Alert.alert('Error', 'Failed to create profile');
      } else {
        Alert.alert('Success', 'Wecard created successfully!');
        navigation.navigate('MainTabs');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wecard Details</Text>
      
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="David Miller"
          value={name}
          onChangeText={setName}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          placeholder="25 / 08 / 1998"
          value={dob}
          onChangeText={setDob}
        />
      </View>
      
      <View style={styles.divider} />
      
      <TouchableOpacity 
        style={[styles.createButton, (!name.trim() || loading) && styles.disabledButton]} 
        onPress={createWecard}
        disabled={!name.trim() || loading}
      >
        <Text style={styles.createButtonText}>
          {loading ? 'Creating...' : 'Create Wecard'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  createButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
