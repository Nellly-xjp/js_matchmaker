import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function AddScreen() {
  const [newProfile, setNewProfile] = useState({ name: '', age: 25, city: '', bio: '' });

  const addProfile = () => {
    if (!newProfile.name || !newProfile.city) {
      Alert.alert('Помилка', 'Заповніть ім’я та місто');
      return;
    }
    Alert.alert('Успіх!', `Профіль ${newProfile.name} додано!`);
    setNewProfile({ name: '', age: 25, city: '', bio: '' });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Додати новий профіль</Text>
      
      <TextInput label="Ім'я" value={newProfile.name} onChangeText={(t) => setNewProfile({...newProfile, name: t})} mode="outlined" style={styles.input} />
      <TextInput label="Місто" value={newProfile.city} onChangeText={(t) => setNewProfile({...newProfile, city: t})} mode="outlined" style={styles.input} />
      <TextInput label="Біо" multiline value={newProfile.bio} onChangeText={(t) => setNewProfile({...newProfile, bio: t})} mode="outlined" style={styles.input} />

      <Text style={styles.label}>Вік: {newProfile.age}</Text>
      <View style={styles.ageButtons}>
        <Button mode="outlined" onPress={() => setNewProfile({...newProfile, age: Math.max(18, newProfile.age-1)})}>−</Button>
        <Button mode="outlined" onPress={() => setNewProfile({...newProfile, age: Math.min(60, newProfile.age+1)})}> + </Button>
      </View>

      <Button mode="contained" onPress={addProfile} style={styles.addButton}>
        Додати профіль
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#FF2D55' },
  input: { marginBottom: 16 },
  label: { fontSize: 18, marginVertical: 15, textAlign: 'center' },
  ageButtons: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 30 },
  addButton: { marginTop: 20 },
});