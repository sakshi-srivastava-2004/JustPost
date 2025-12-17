// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './Welcome';
import WriterLogin from './pages/WriterLogin';
import ComposerLogin from './pages/ComposerLogin';
import WriterSignup from './pages/WriterSignup';
import ComposerSignup from './pages/ComposerSignup';
 import Home from './pages/Home';
 import ChannelPage from './pages/ChannelPage';
 import WriterDashboard from './pages/WriterDashboard';
 import WorkDetailsPage from './pages/WorkDetailsPage';
// import WriterDashboard from './WriterDashboard'; // Import writer dashboard
import ComposerDashboard from './pages/ComposerDashboard'; // Import composer dashboard
import WriterProfile from "./pages/WriterProfile";

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/Home" element={<Home />} />

            <Route path="/login/writer" element={<WriterLogin />} />
            <Route path="/signup/writer" element={<WriterSignup />} />
            <Route path="/login/composer" element={<ComposerLogin />} />
            <Route path="/signup/composer" element={<ComposerSignup />} />
            <Route path="/writer-dashboard" element={<WriterDashboard />} /> 
            <Route path="/channel-page" element={<ChannelPage />} />
            
            <Route path="/work-details/:workId" element={<WorkDetailsPage />} />
            <Route path="/channel/:channelId" element={<ChannelPage />} />
           <Route path="/composer-dashboard" element={<ComposerDashboard />} /> 
           <Route path="/writer/:writerId" element={<WriterProfile />} />
           app.use(router);
        </Routes>
    );
};

export default App;
