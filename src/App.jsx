import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppShell from './components/layout/AppShell.jsx'
import Router from './app/routes/Router.jsx'
export default function App(){return(
    <BrowserRouter>
        <AppShell>
            <Router/>
        </AppShell>
    </BrowserRouter>
)}
