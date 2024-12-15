import React, { useEffect, useState } from "react";
import "./App.css";
import { AiOutlineDelete } from "react-icons/ai"; // Correct import for delete icon
import { BsCheckLg } from "react-icons/bs"; // Correct import for check icon
import { FaPen } from "react-icons/fa"; // Import pen icon from react-icons

function App() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false); // For switching between "Todo" and "Completed"
  const [allTodos, setTodos] = useState([]); // State to hold all todo items
  const [newTitle, setNewTitle] = useState(""); // State for new task title
  const [newDescription, setNewDescription] = useState(""); // State for new task description
  const [editingIndex, setEditingIndex] = useState(null); // Track which task is being edited
  const [editTitle, setEditTitle] = useState(""); // Track the new title when editing
  const [editDescription, setEditDescription] = useState(""); // Track the new description when editing
  const [currentDate, setCurrentDate] = useState(""); // State to store current date

  // Function to get the current date
  const getCurrentDate = () => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // Function to add a new todo item
  const handleAddTodo = () => {
    if (newTitle && newDescription) {
      let newTodoItem = {
        title: newTitle,
        description: newDescription,
        completed: false,
      };

      let updatedTodoArr = [...allTodos];
      updatedTodoArr.push(newTodoItem);
      setTodos(updatedTodoArr);
      localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));

      setNewTitle("");
      setNewDescription("");
    }
  };

  // Function to delete a todo item
  const handleDeleteTodo = (index) => {
    let updatedTodoArr = allTodos.filter((_, i) => i !== index);
    setTodos(updatedTodoArr);
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
  };

  // Function to mark a todo item as complete (without toggling back)
  const handleCompleteTodo = (index) => {
    let updatedTodoArr = [...allTodos];
    if (!updatedTodoArr[index].completed) {
      let now = new Date();
      let dd = now.getDate();
      let mm = now.getMonth() + 1;
      let yyyy = now.getFullYear();
      let h = now.getHours();
      let m = now.getMinutes();
      let s = now.getSeconds();
      let completedOn = `${dd}-${mm}-${yyyy} at ${h}:${m}:${s}`;
      updatedTodoArr[index].completed = true;
      updatedTodoArr[index].completedOn = completedOn;
    }

    setTodos(updatedTodoArr);
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr));
  };

  // Function to edit a todo task
  const handleEditTodo = (index) => {
    setEditingIndex(index); // Set the index of the task being edited
    setEditTitle(allTodos[index].title); // Set the current title as the edit value
    setEditDescription(allTodos[index].description); // Set the current description as the edit value
  };

  // Function to save the edited todo
  const handleSaveEdit = () => {
    let updatedTodoArr = [...allTodos];
    updatedTodoArr[editingIndex].title = editTitle; // Update the title
    updatedTodoArr[editingIndex].description = editDescription; // Update the description

    setTodos(updatedTodoArr); // Update the state
    localStorage.setItem("todolist", JSON.stringify(updatedTodoArr)); // Save to localStorage

    setEditingIndex(null); // Clear editing state
    setEditTitle(""); // Clear title input
    setEditDescription(""); // Clear description input
  };

  // Load saved todos from localStorage on first render
  useEffect(() => {
    const savedTodo = JSON.parse(localStorage.getItem("todolist"));
    if (savedTodo && Array.isArray(savedTodo)) {
      setTodos(savedTodo);
    } else {
      setTodos([]); // Initialize as empty array if no todos are found
    }
    setCurrentDate(getCurrentDate()); // Set current date when component mounts
  }, []);

  // Function to filter todos based on completion status
  const filteredTodos = isCompleteScreen
    ? allTodos.filter((todo) => todo.completed)
    : allTodos.filter((todo) => !todo.completed);

  return (
    <div className="App">
      <h1>My To-do List</h1>
      <p className="date">{currentDate}</p>{" "}
      {/* Display current date below the title */}
      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <button
              type="button"
              onClick={handleAddTodo}
              className="primaryBtn"
            >
              Add
            </button>
          </div>
        </div>

        <div className="btn-area">
          <button
            className={`isCompleteScreen ${!isCompleteScreen ? "active" : ""}`}
            onClick={() => setIsCompleteScreen(false)}
          >
            Todo
          </button>
          <button
            className={`isCompleteScreen ${isCompleteScreen ? "active" : ""}`}
            onClick={() => setIsCompleteScreen(true)}
          >
            Completed
          </button>
        </div>

        <div className="todo-list">
          {filteredTodos.map((items, index) => (
            <div
              className={`todo-list-item ${items.completed ? "completed" : ""}`}
              key={index}
            >
              {editingIndex === index ? (
                // If this item is being edited, show inputs
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)} // Handle title change while editing
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)} // Handle description change while editing
                  />
                  <button onClick={handleSaveEdit}>Save</button>
                </div>
              ) : (
                <div>
                  <h3>{items.title}</h3>
                  <p>{items.description}</p>
                  {items.completed && <p>Completed on: {items.completedOn}</p>}
                </div>
              )}

              {/* Action buttons */}
              <div className="todo-item-actions">
                {!items.completed && (
                  <BsCheckLg
                    className="check-icon"
                    onClick={() => handleCompleteTodo(index)}
                  />
                )}
                <AiOutlineDelete
                  className="icns"
                  onClick={() => handleDeleteTodo(index)}
                />
                {!items.completed && (
                  <FaPen
                    className="pen-icon"
                    onClick={() => handleEditTodo(index)} // Handle edit click
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
