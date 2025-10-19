import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import JobList from './pages/jobs/JobList';
import JobForm from './pages/jobs/JobForm';
import JobDetail from './pages/jobs/JobDetail';
import JobOverview from './pages/jobs/JobOverview';
import JobApplications from './pages/jobs/JobApplications';
import JobRanking from './pages/jobs/JobRanking';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import AdminUsers from './pages/AdminUsers';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Navigate to="/jobs" replace />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/new" element={<JobForm />} />
            <Route path="/jobs/:jobId" element={<JobDetail />}>
              <Route index element={<JobOverview />} />
              <Route path="applications" element={<JobApplications />} />
              <Route path="ranking" element={<JobRanking />} />
            </Route>
            <Route path="/applications" element={<Applications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;