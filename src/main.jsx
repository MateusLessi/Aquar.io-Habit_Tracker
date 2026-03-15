import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { HabitProvider } from './context/HabitContext.jsx'
import { MarineEngineProvider } from './context/MarineEngineContext.jsx'
import { TodoProvider } from './context/TodoContext.jsx'
import { NavigationProvider } from './context/NavigationContext.jsx'
import './styles/globals.css'
import './styles/theme.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <NavigationProvider>
            <HabitProvider>
                <MarineEngineProvider>
                    <TodoProvider>
                        <App />
                    </TodoProvider>
                </MarineEngineProvider>
            </HabitProvider>
        </NavigationProvider>
    </React.StrictMode>
)
