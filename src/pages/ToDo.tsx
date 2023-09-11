import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Paper, Box,  Typography  } from '@mui/material';
import { Delete, Edit} from '@mui/icons-material';
import { db } from '../config/firebaseConfig';
import axios from 'axios';

interface Todo {
  _id: string;
  text: string;
  complete: boolean;
  startDate: Date;
  endDate: Date;
}

const ToDo: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [editingTodo, setEditingTodo] = useState<string | null>(null);
    const [newText, setNewText] = useState<string>(''); 
    const [newStartDate, setNewStartDate] = useState<Date | string>('');
    const [newEndDate, setNewEndDate] = useState<Date | string>('');

    useEffect(() => {
      fetchTodos();
      getRandomImage()
    }, []);

    const getRandomImage = async () => {
        try {
          const response = await axios.get('https://picsum.photos/1920/1080', {
            responseType: 'blob', 
          });
      
          const blob = response.data;
          const imageUrl = URL.createObjectURL(blob);
          setBackgroundImage(imageUrl);
        } catch (error) {
          console.error('Error fetching random image:', error);
        }
      };
  
    const fetchTodos = async () => {
      try {
        // Consulta la colección 'todoList' en Firestore
        const todosSnapshot = await db.collection('todoList').get();
  
        // Convierte los documentos de la colección en un array de todos
        const todosArray = todosSnapshot.docs.map((doc) => ({
          _id: doc.id,
          text: doc.data().text,
          complete: doc.data().complete,
          startDate: new Date(doc.data().startDate), // Convierte la fecha de inicio
          endDate: new Date(doc.data().endDate) ,     // Convierte la fecha de fin
        }));
  
        setTodos(todosArray);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    
    const addTodo = async () => {
      if (!newTodo) return;
      try {
        // Agrega un nuevo documento a la colección 'todos' en Firestore
        await db.collection('todoList').add({
          text: newTodo,
          startDate: startDate, // Fecha actual como fecha de inicio
          endDate: endDate,   // Fecha actual como fecha de fin
        });
        setNewTodo('');
        fetchTodos(); // Actualiza la lista después de agregar un elemento
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    };
  
    const deleteTodo = async (id: string) => {
      try {
        await db.collection('todoList').doc(id).delete();
        fetchTodos(); // Actualiza la lista después de eliminar un elemento
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    };

    const editTodo = (id: string) => {
      // Establecer el ID del to-do que se está editando
      setEditingTodo(id);
      // Obtener los valores actuales de texto, fecha de inicio y fecha de finalización
      const todoToEdit = todos.find((todo) => todo._id === id);
      if (todoToEdit) {
        setNewText(todoToEdit.text);
        setNewStartDate(todoToEdit.startDate);
        setNewEndDate(todoToEdit.endDate);
      }
    };
  
    const cancelEdit = () => {
      // Cancelar la edición
      setEditingTodo(null);
    };
  
    const updateTodo = async (id: string) => {
      try {
        // Actualizar el texto, fecha de inicio y fecha de finalización del to-do en Firestore
        await db.collection('todoList').doc(id).update({
          text: newText,
          startDate: newStartDate,
          endDate: newEndDate,
        });
        // Cancelar la edición y volver a cargar la lista
        setEditingTodo(null);
        fetchTodos();
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    };

    const getTextColor = (endDate: Date | null) => {
      if (!endDate) return 'black'; // Color predeterminado si no hay fecha de finalización
    
      const currentDate = new Date();
      if (endDate < currentDate) return 'red'; // Si la fecha de finalización es anterior a la fecha actual, rojo
      if (endDate.getDate() === currentDate.getDate()) return 'yellow'; // Si la fecha de finalización es hoy, amarillo
    
      return 'green'; // En cualquier otro caso, verde
    };
  
    return (
      <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0,
      }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <Paper style={{ padding: '20px', borderRadius: '15px', background: '#f0f0f0' }}>
          <Typography variant="h4">To-do List</Typography>
            <TextField
              label="New To-do"
              variant="outlined"
              fullWidth
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="Start Date"
              type="date"
              variant="outlined"
              fullWidth
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{
                shrink: true, // Muestra el label siempre
              }}
              style={{ marginBottom: '10px' }}
            />
            <TextField
              label="End Date"
              type="date"
              variant="outlined"
              fullWidth
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{
                shrink: true, // Muestra el label siempre
              }}
              style={{ marginBottom: '10px' }}
            />
            <Button variant="contained" color="primary" onClick={addTodo} style={{ marginTop: '10px' }}>
              Add To-do
            </Button>
            <List>
            {todos.map((todo) => (
              <ListItem key={todo._id} button>
                {editingTodo === todo._id ? (
                  // Mostrar campo de edición si está editando este to-do
                  <>
                    <TextField
                      variant="outlined"
                      fullWidth
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                      style={{ marginRight: '10px' }} // Agrega margen a la derecha
                    />
                    <TextField
                      label="Start Date"
                      type="date"
                      variant="outlined"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true, // Muestra el label siempre
                      }}
                      style={{ marginRight: '10px' }}
                    />
                    <TextField
                      label="End Date"
                      type="date"
                      variant="outlined"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true, // Muestra el label siempre
                      }}
                      style={{ marginRight: '10px' }}
                    />
                    <Button variant="contained" color="primary" onClick={() => updateTodo(todo._id)}>
                      Update
                    </Button>
                    <Button variant="contained" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  // Mostrar texto normal si no está editando este to-do
                  <>
                    <ListItemText
                      primary={`${todo.text} (Fecha Límite: ${todo.endDate.toLocaleDateString()})`}
                      style={{ color: getTextColor(todo.endDate) }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" onClick={() => editTodo(todo._id)}>
                        <Edit />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo._id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </>
                )}
              </ListItem>
            ))}
            </List>
          </Paper>
        </Box>
      </div>
    );
  };
export default ToDo;