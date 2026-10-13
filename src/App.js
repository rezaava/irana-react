import logo from './logo.svg';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/HomeComponent';
import Login from './pages/loginComponent';
import Nav from './pages/navComponent';
import Form from './pages/CustomerRequestFormComponent';
import Welcome from './pages/WelcomeComponent';
import TechniciansPage from './pages/TechniciansPageComponent';
import TechnicianProfilePage from './pages/TechnicianProfileComponent';
import RequestDetails from './pages/RequestDetailsComponent';
import PersonalInfoPage from './pages/PersonalInfoPageComponenet';
import RequestsPage from './pages/RequestsPageComponent';
import SettingsMenu from './pages/SettingsMenuComponent';
import BrandManagementPage from './pages/BrandManagementPageComponent';
import DeviceTypeManagementPage from './pages/DeviceTypeManagementPageComponent';
import SettlementRequestsPage from './pages/SettlementRequestsPageComponenet';
import SpecialtyManagementPage from './pages/SpecialtyManagementPageComponent';
import RequestsReportForm from './pages/RequestsReportFormComponent';
import NotificationsPage from './pages/NotificationsPageComponent';
import NotificationDetailPage from './pages/NotificationDetailPageComponent';
import SettlementDetailPage from './pages/SettlementDetailPageComponent';
import DeviceTypeAddPageComponent from './pages/DeviceTypeAddPageComponent';
import SpecialtyAddPageComponent from './pages/SpecialtyAddPageComponent';
import BrandAddPageComponent from './pages/BrandAddPageComponent';
import BrandEditPage from './pages/BrandEditPageComponent';
import DeviceTypeEditPage from './pages/DeviceTypeEditPageComponent';
import SpecialtyEditPage from './pages/SpecialtyEditPageComponent';
import NotificationAddPage from './pages/NotificationAddPageComponent';
import ProfileChangeRequestsPage from './pages/ProfileChangeRequestsPage';
import PersonalInfoPageComponenet from './pages/PersonalInfoPageComponenet';
import ChatPage from './pages/ChatPageComponent';
import HomeButtonComponent from './pages/HomeButtonComponent';

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/form" element={<Form />} />
        <Route path="/technician" element={<TechniciansPage />} />

        <Route path="/profile/:id" element={<TechnicianProfilePage />} />


        <Route path="/request-details/:id" element={<RequestDetails />} />


        <Route path="/PersonalInfoPage/:id" element={<PersonalInfoPage />} />

        <Route path="/request" element={<RequestsPage />} />

        <Route path="/setting" element={<SettingsMenu />} />
        
        <Route path="/brands" element={<BrandManagementPage />} />
        <Route path="/brands/add" element={<BrandAddPageComponent />} />

        <Route path="/device-types" element={<DeviceTypeManagementPage />} />
        <Route path="/device-types/add" element={<DeviceTypeAddPageComponent />} />

        <Route path="/settlements" element={<SettlementRequestsPage />} />
        <Route path="/settlements/:id" element={<SettlementDetailPage />} />
        <Route path="/profile-edit-requests" element={<ProfileChangeRequestsPage />} />
        <Route path="/profile-edit-requests/:id" element={<PersonalInfoPageComponenet pendingMode />} />

        <Route path="/reports" element={<RequestsReportForm />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        <Route path="/notifications/:id" element={<NotificationDetailPage />} />

        <Route path="/specialties" element={<SpecialtyManagementPage />} />
        <Route path="/specialties/add" element={<SpecialtyAddPageComponent />} />

        <Route path="/brands/:id/edit" element={<BrandEditPage />} />

        <Route path="/device-types/:id/edit" element={<DeviceTypeEditPage />} />

        <Route path="/specialties/:id/edit" element={<SpecialtyEditPage />} />

        <Route path="/notifications/add" element={<NotificationAddPage />} />

        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>
        <HomeButtonComponent />
      <Nav/>

    </BrowserRouter>
  );
}

export default App;
