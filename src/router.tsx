import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { App } from './App';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { DoctorsPage } from './components/doctors/DoctorsPage';
import { PharmaciesPage } from './components/pharmacies/PharmaciesPage';
import { PrescriptionsPage } from './components/prescriptions/PrescriptionsPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { DataUpload } from './components/upload/DataUpload';
import { LoginPage } from './components/auth/LoginPage';
const router = createBrowserRouter([{
  path: '/',
  element: <App />,
  children: [{
    path: '/',
    element: <DashboardOverview />
  }, {
    path: '/analytics',
    element: <AnalyticsPage />
  }, {
    path: '/doctors',
    element: <DoctorsPage />
  }, {
    path: '/pharmacies',
    element: <PharmaciesPage />
  }, {
    path: '/prescriptions',
    element: <PrescriptionsPage />
  }, {
    path: '/reports',
    element: <ReportsPage />
  }, {
    path: '/upload',
    element: <DataUpload setCurrentPage={() => {}} />
  }]
}, {
  path: '/login',
  element: <LoginPage />
}]);
export function Router() {
  return <RouterProvider router={router} />;
}