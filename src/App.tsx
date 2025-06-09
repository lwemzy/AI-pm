import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { DataUpload } from './components/upload/DataUpload';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { DoctorsPage } from './components/doctors/DoctorsPage';
import { PharmaciesPage } from './components/pharmacies/PharmaciesPage';
import { PrescriptionsPage } from './components/prescriptions/PrescriptionsPage';
import { DataProvider } from './components/context/DataContext';
import { AuthProvider } from './components/auth/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useAuth } from './components/auth/AuthContext';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ReportsPage } from './components/reports/ReportsPage';
function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const {
    user,
    isLoading
  } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>;
  }
  if (!user) {
    return <LoginPage />;
  }
  return <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {currentPage === 'dashboard' && <DashboardOverview />}
          {currentPage === 'upload' && <DataUpload setCurrentPage={setCurrentPage} />}
          {currentPage === 'analytics' && <AnalyticsPage />}
          {currentPage === 'doctors' && <DoctorsPage />}
          {currentPage === 'pharmacies' && <PharmaciesPage />}
          {currentPage === 'prescriptions' && <PrescriptionsPage />}
          {currentPage === 'reports' && <ReportsPage />}
        </main>
      </div>
    </div>;
}
export function App() {
  return <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>;
}