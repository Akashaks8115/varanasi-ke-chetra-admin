import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import './admin-layout.css'

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
