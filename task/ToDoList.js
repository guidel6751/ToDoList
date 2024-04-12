import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
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

  const TodoItem = ({ todo }) => {
    const [editMode, setEditMode] = useState(false);
    const [updatedText, setUpdatedText] = useState(todo.text);
    const [completed, setCompleted] = useState(false);

    const handlePress = () => {
      setCompleted(!completed);
    };

    const handleEdit = () => {
      setEditMode(true);
    };

    const handleSave = () => {
      editTodo(todo.id, { ...todo, text: updatedText });
      setEditMode(false);
    };

    return (
      <TouchableOpacity onPress={handlePress} style={styles.todoItem}>
        <View style={styles.checkboxContainer}>
          <View style={[styles.checkbox, completed && styles.checked]} />
        </View>
        {editMode ? (
          <>
            <TextInput
              style={styles.input}
              value={updatedText}
              onChangeText={setUpdatedText}
            />
            <Button title="Save" onPress={handleSave} color="#05445E" />
          </>
        ) : (
          <>
            <Text style={[styles.itemText, completed && styles.itemTextCompleted]}>
              {todo.text}
            </Text>
            <View style={styles.iconsContainer}>
              <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
                <Feather name="edit" size={20} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteTodo(todo.id)}
                style={styles.iconButton}
              >
                <Feather name="trash-2" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TO DO LIST</Text>
      <TextInput
        style={styles.input}
        placeholder="ENTER TO DO LIST"
        value={newTodoText}
        onChangeText={setNewTodoText}
      />
      <Button title="Add Todo" onPress={handleAddTodo} color="#05445E" />
      <FlatList
        data={todos}
        renderItem={({ item }) => <TodoItem todo={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A0E7E5',
    padding: 20,
    borderRadius: 5,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    marginBottom: 10,
    borderWidth: 1,
    padding: 5,
    width: '100%',
    backgroundColor: '#fff',
    fontSize: 20,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#888',
    marginRight: 10,
  },
  checkbox: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: '#4CAF50',
  },
  itemText: {
    fontSize: 30,
    flex: 1,
    marginLeft: 10,
    color: '#fff',
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 10,
  },
});

export default ToDoList;
