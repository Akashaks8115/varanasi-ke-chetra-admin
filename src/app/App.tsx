import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import DataDashboard from '../features/dashboard/pages/DataDashboard'
import EntityForm from '../features/dashboard/pages/EntityForm'
import GhatDashboard from '../features/ghat/pages/GhatDashboard'
import GhatForm from '../features/ghat/pages/GhatForm'
import TempleDashboard from '../features/temple/pages/TempleDashboard'
import TempleForm from '../features/temple/pages/TempleForm'
import HistoricalPlaceDashboard from '../features/historical-place/pages/HistoricalPlaceDashboard'
import HistoricalPlaceForm from '../features/historical-place/pages/HistoricalPlaceForm'
import JyotirlingDashboard from '../features/jyotirling/pages/JyotirlingDashboard'
import JyotirlingForm from '../features/jyotirling/pages/JyotirlingForm'
import FoodDashboard from '../features/food/pages/FoodDashboard'
import FoodForm from '../features/food/pages/FoodForm'
import PanchkroshiDashboard from '../features/panchkroshi/pages/PanchkroshiDashboard'
import PanchkroshiForm from '../features/panchkroshi/pages/PanchkroshiForm'
import OurServicesDashboard from '../features/our-services/pages/OurServicesDashboard'
import OurServicesForm from '../features/our-services/pages/OurServicesForm'
import SpiritualDashboard from '../features/spiritual/pages/SpiritualDashboard'
import SpiritualForm from '../features/spiritual/pages/SpiritualForm'
import TransportDashboard from '../features/transport/pages/TransportDashboard'
import TransportForm from '../features/transport/pages/TransportForm'
import FlightsDashboard from '../features/flights/pages/FlightsDashboard'
import VisaDashboard from '../features/visa/pages/VisaDashboard'
import SendNotificationPage from '../features/notifications/pages/SendNotificationPage'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/ghat" replace />} />
                    <Route path="/ghat" element={<GhatDashboard />} />
                    <Route path="/ghat/add" element={<GhatForm />} />
                    <Route path="/temple" element={<TempleDashboard />} />
                    <Route path="/temple/add" element={<TempleForm />} />
                    <Route path="/temple/edit/:id" element={<TempleForm />} />
                    <Route path="/historical-place" element={<HistoricalPlaceDashboard />} />
                    <Route path="/historical-place/add" element={<HistoricalPlaceForm />} />
                    <Route path="/historical-place/edit/:id" element={<HistoricalPlaceForm />} />
                    <Route path="/jyotirling" element={<JyotirlingDashboard />} />
                    <Route path="/jyotirling/add" element={<JyotirlingForm />} />
                    <Route path="/food" element={<FoodDashboard />} />
                    <Route path="/food/add" element={<FoodForm />} />
                    <Route path="/food/edit/:id" element={<FoodForm />} />
                    <Route path="/panchkroshi" element={<PanchkroshiDashboard />} />
                    <Route path="/panchkroshi/add" element={<PanchkroshiForm />} />
                    <Route path="/our-services" element={<OurServicesDashboard />} />
                    <Route path="/our-services/add" element={<OurServicesForm />} />
                    <Route path="/spiritual" element={<SpiritualDashboard />} />
                    <Route path="/spiritual/add" element={<SpiritualForm />} />
                    <Route path="/transport" element={<TransportDashboard />} />
                    <Route path="/transport/add" element={<TransportForm />} />
                    <Route path="/flights" element={<FlightsDashboard />} />
                    <Route path="/visa" element={<VisaDashboard />} />
                    <Route path="/send-notification" element={<SendNotificationPage />} />
                    <Route path=":category" element={<DataDashboard />} />
                    <Route path=":category/add" element={<EntityForm />} />
                    <Route path=":category/edit/:id" element={<EntityForm />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
