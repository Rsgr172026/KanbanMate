import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaTasks, FaUserCog, FaSignOutAlt, FaMoon, FaSun, FaPlus, FaBell, FaTrash, FaGoogle, FaSearch, FaHistory, FaCheckCircle, FaExclamationCircle, FaUsers, FaChartLine, FaServer } from "react-icons/fa";

// Firebase Imports
import { auth, provider } from "./firebaseConfig";
import { signInWithPopup } from "firebase/auth";

const API_URL = "https://kanbanmate.onrender.com/api";
axios.defaults.withCredentials = true;

// --- 1. LOGIN COMPONENT ---
const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid Credentials");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { data } = await axios.post(`${API_URL}/auth/google`, {
        name: result.user.displayName,
        email: result.user.email,
        googleId: result.user.uid,
        photo: result.user.photoURL
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome ${result.user.displayName}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px]"></div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gray-900/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 w-full max-w-md shadow-2xl z-10">
        <h1 className="text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">KanbanMate</h1>
        <form onSubmit={handleLogin} className="space-y-5 mb-6">
          <input className="w-full p-4 bg-gray-800/50 rounded-xl outline-none border border-gray-600 focus:border-blue-500 text-white" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full p-4 bg-gray-800/50 rounded-xl outline-none border border-gray-600 focus:border-blue-500 text-white" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all">Log In</button>
        </form>
        <button onClick={handleGoogleLogin} className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-gray-200 transition-all">
          <FaGoogle className="text-red-500 text-xl" /> Google Sign In
        </button>
      </motion.div>
    </div>
  );
};

// --- 2. NAVBAR ---
const Navbar = ({ user, logout, darkMode, setDarkMode, notifications, clearNotifications }) => {
  const [showNotif, setShowNotif] = useState(false);

  return (
    <div className="bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50 px-6 py-4 flex justify-between items-center text-white">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"><FaTasks /></div>
        <h1 className="text-2xl font-bold hidden md:block">KanbanMate</h1>
      </div>
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="hover:text-blue-400 font-medium">Board</Link>
        {user?.role === "admin" && <Link to="/admin" className="text-red-400 hover:text-red-300 font-medium">Admin Panel</Link>}
        <Link to="/settings" className="hover:text-blue-400 font-medium">Settings</Link>
        
        <div className="flex items-center gap-4 border-l border-gray-700 pl-6">
          <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}</button>
          <div className="relative">
            <button onClick={() => setShowNotif(!showNotif)} className="relative">
              <FaBell className={notifications.length > 0 ? "text-blue-400" : "text-gray-400"} />
              {notifications.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{notifications.length}</span>}
            </button>
            <AnimatePresence>
              {showNotif && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-0 mt-4 w-72 bg-[#1e293b] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-[60]">
                  <div className="p-3 border-b border-gray-700 flex justify-between items-center"><h3 className="font-bold text-sm">Notifications</h3><button onClick={clearNotifications} className="text-xs text-blue-400">Clear All</button></div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? <p className="p-4 text-center text-xs text-gray-500">No new notifications</p> : notifications.map((n, i) => (
                      <div key={i} className="p-3 border-b border-gray-700/50 hover:bg-gray-700/30 text-sm flex gap-2">
                         <span className="mt-1">{n.type === 'add' ? '🟢' : n.type === 'delete' ? '🔴' : '🔵'}</span>
                         <div><p className="text-gray-200">{n.message}</p><span className="text-[10px] text-gray-500">{n.time}</span></div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={logout} className="text-red-500"><FaSignOutAlt /></button>
        </div>
      </div>
    </div>
  );
};

// --- 3. DASHBOARD (FIXED DRAG & DROP) ---
const Dashboard = ({ addNotification }) => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium", dueDate: "" });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async (keyword = "") => {
    try { const { data } = await axios.get(`${API_URL}/tasks?keyword=${keyword}`); setTasks(data); } catch (e) {}
  };

  const handleCreateTask = async () => {
    if (!newTask.title) return toast.error("Title required!");
    try {
      await axios.post(`${API_URL}/tasks`, newTask);
      toast.success("Task Added!");
      addNotification(`Created: "${newTask.title}"`, 'add');
      setShowModal(false);
      setNewTask({ title: "", description: "", priority: "medium", dueDate: "" });
      fetchTasks(search);
    } catch (e) { toast.error("Failed"); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm("Delete?")) return;
    try { await axios.delete(`${API_URL}/tasks/${id}`); toast.success("Deleted"); addNotification(`Deleted: "${title}"`, 'delete'); fetchTasks(search); } catch (e) { toast.error("Failed"); }
  };

  // 🔥 DRAG LOGIC
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, destination, source } = result;

    // UI update (Frontend logic)
    const updatedTasks = tasks.map(t => t._id === draggableId ? { ...t, status: destination.droppableId } : t);
    setTasks(updatedTasks);

    // Notification Logic
    if(source.droppableId !== destination.droppableId) {
        const title = tasks.find(t => t._id === draggableId)?.title;
        addNotification(`Moved "${title}" to ${destination.droppableId.toUpperCase()}`, 'move');
    }

    // Backend update
    try { 
      await axios.put(`${API_URL}/tasks/${draggableId}`, { status: destination.droppableId }); 
    } catch (e) { 
      fetchTasks(search); // Error aane par wapas purana state
    }
  };

  return (
    <div className="p-6 md:p-10 text-white h-[calc(100vh-80px)] overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
        <div className="relative w-full md:w-96"><FaSearch className="absolute left-4 top-4 text-gray-500" /><input type="text" placeholder="Search..." className="w-full bg-[#1e293b] p-3 pl-12 rounded-2xl border border-gray-700 outline-none focus:border-blue-500" onChange={(e) => { setSearch(e.target.value); fetchTasks(e.target.value); }} /></div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition"><FaPlus /> New Task</button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["todo", "inprogress", "done"].map(status => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-[#1e293b]/50 p-6 rounded-3xl min-h-[500px] border border-gray-800">
                  <h3 className="font-bold mb-6 uppercase flex justify-between text-xs tracking-widest text-gray-400">{status} <span className="bg-gray-800 px-3 py-1 rounded-lg">{tasks.filter(t => t.status === status).length}</span></h3>
                  
                  {tasks.filter(t => t.status === status).map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          // 🔥 STYLE FIX FOR DRAGGING
                          style={{
                            ...provided.draggableProps.style,
                            left: "auto !important",
                            top: "auto !important"
                          }}
                          className={`bg-[#1e293b] p-5 rounded-2xl mb-4 border border-gray-700/50 relative group transition-colors ${snapshot.isDragging ? 'bg-gray-800 shadow-2xl ring-2 ring-blue-500 z-50' : 'hover:border-blue-500/50'}`}
                        >
                          {/* Inner Content for Animation */}
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                            <button onClick={() => handleDelete(task._id, task.title)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"><FaTrash /></button>
                            <div className="pl-3">
                              <h4 className="font-bold text-gray-100 text-lg mb-1">{task.title}</h4>
                              <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
                            </div>
                          </motion.div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <AnimatePresence>{showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#1e293b] p-8 rounded-3xl w-full max-w-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Create Task</h2>
            <input className="w-full p-4 mb-4 bg-gray-900/50 rounded-xl outline-none border border-gray-700" placeholder="Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
            <textarea className="w-full p-4 mb-4 bg-gray-900/50 rounded-xl outline-none border border-gray-700 h-24" placeholder="Description" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
            <div className="flex gap-4 mb-6"><select className="w-1/2 bg-gray-900/50 p-4 rounded-xl outline-none border border-gray-700" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select><input type="date" className="w-1/2 bg-gray-900/50 p-4 rounded-xl outline-none border border-gray-700 text-gray-400" onChange={e => setNewTask({...newTask, dueDate: e.target.value})} /></div>
            <div className="flex justify-end gap-3"><button onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-400 hover:text-white">Cancel</button><button onClick={handleCreateTask} className="bg-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-500">Create</button></div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
};

// --- 4. ADMIN PANEL ---
const AdminPanel = () => (
  <div className="p-10 text-white max-w-7xl mx-auto h-screen overflow-y-auto">
    <h1 className="text-4xl font-bold text-red-500 mb-8 flex items-center gap-3"><FaUserCog /> Admin Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 hover:border-red-500 transition"><FaUsers className="text-3xl text-gray-500 mb-2" /><h3 className="text-gray-400">Total Users</h3><p className="text-4xl font-bold">1,240</p></div>
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition"><FaTasks className="text-3xl text-gray-500 mb-2" /><h3 className="text-gray-400">Active Tasks</h3><p className="text-4xl font-bold text-blue-400">850</p></div>
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 hover:border-green-500 transition"><FaChartLine className="text-3xl text-gray-500 mb-2" /><h3 className="text-gray-400">Completion Rate</h3><p className="text-4xl font-bold text-green-400">89%</p></div>
      <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 hover:border-purple-500 transition"><FaServer className="text-3xl text-gray-500 mb-2" /><h3 className="text-gray-400">Server Status</h3><p className="text-4xl font-bold text-purple-400">Online</p></div>
    </div>
  </div>
);

// --- 5. SETTINGS ---
const Settings = ({ user }) => (
  <div className="p-10 text-white max-w-3xl mx-auto">
    <h2 className="text-3xl font-bold mb-8">Settings ⚙️</h2>
    <div className="bg-[#1e293b] p-8 rounded-3xl border border-gray-700 space-y-6 shadow-xl">
      <div className="flex items-center gap-6 mb-8">
         <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">{user?.name?.charAt(0)}</div>
         <div><h3 className="text-2xl font-bold">{user?.name}</h3><p className="text-gray-400">{user?.role === 'admin' ? 'Administrator' : 'Project Member'}</p></div>
      </div>
      <button className="w-full bg-blue-600 py-4 rounded-xl font-bold hover:bg-blue-500 transition mt-4 shadow-lg">Save Changes</button>
    </div>
  </div>
);

// --- MAIN APP ---
function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userInfo")) || null);
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(() => { const saved = localStorage.getItem("notifications"); return saved ? JSON.parse(saved) : []; });

  useEffect(() => { localStorage.setItem("notifications", JSON.stringify(notifications)); }, [notifications]);

  const addNotification = (message, type = 'info') => {
    setNotifications(prev => [{ message, type, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...prev]);
  };

  const clearNotifications = () => { setNotifications([]); localStorage.removeItem("notifications"); };
  const logout = () => { localStorage.removeItem("userInfo"); setUser(null); toast.success("Logged Out"); };

  return (
    <div className={darkMode ? "bg-[#0f172a] min-h-screen font-sans" : "bg-gray-100 min-h-screen font-sans"}>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' } }} />
      <Router>
        {user && <Navbar user={user} logout={logout} darkMode={darkMode} setDarkMode={setDarkMode} notifications={notifications} clearNotifications={clearNotifications} />}
        <Routes>
          <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard addNotification={addNotification} /> : <Navigate to="/" />} />
          <Route path="/settings" element={user ? <Settings user={user} /> : <Navigate to="/" />} />
          <Route path="/admin" element={user?.role === "admin" ? <AdminPanel /> : <Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;