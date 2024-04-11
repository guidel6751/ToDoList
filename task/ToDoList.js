// ToDoList.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Importing Feather icons
import create from 'zustand';

const useToDoStore = create((set) => ({
  todos: [],
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  deleteTodo: (id) =>
    set((state) => ({ todos: state.todos.filter((todo) => todo.id !== id) })),
  editTodo: (id, updatedTodo) =>
    set((state) => ({
      todos: state.todos.map((todo) => (todo.id === id ? updatedTodo : todo)),
    })),
}));

const TodoItem = ({ todo, onDelete, onEdit }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedText, setUpdatedText] = useState(todo.text);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    onEdit(todo.id, { ...todo, text: updatedText });
    setEditMode(false);
  };

  return (
    <View style={styles.todoItem}>
      {editMode ? (
        <>
          <TextInput
            style={styles.input}
            value={updatedText}
            onChangeText={setUpdatedText}
          />
          <Button title="Save" onPress={handleSave} />
        </>
      ) : (
        <>
          <Text>{todo.text}</Text>
          <Feather name="edit" size={20} color="blue" onPress={handleEdit} />
          <Feather name="trash-2" size={20} color="red" onPress={() => onDelete(todo.id)} />
        </>
      )}
    </View>
  );
};

const ToDoList = () => {
  const todos = useToDoStore((state) => state.todos);
  const addTodo = useToDoStore((state) => state.addTodo);
  const deleteTodo = useToDoStore((state) => state.deleteTodo);
  const editTodo = useToDoStore((state) => state.editTodo);

  const [newTodoText, setNewTodoText] = useState('');

  const handleAddTodo = () => {
    if (newTodoText.trim() !== '') {
      addTodo({
        id: Date.now(),
        text: newTodoText,
      });
      setNewTodoText('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a new todo"
        value={newTodoText}
        onChangeText={setNewTodoText}
      />
      <Button title="Add Todo" onPress={handleAddTodo} />
      <FlatList
        data={todos}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 5,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default ToDoList;

