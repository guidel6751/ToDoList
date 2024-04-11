// App.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import ToDoList from './task/ToDoList';

const App = () => {
  return (
    <View style={styles.container}>
      <ToDoList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
