import { useState } from 'react'
import { Save, Edit2, Plus, X, Trash2, Sun, Moon, Bell } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface GuestHouse {
  id: number
  gh_name: string
  contact_number: string
  email: string
  website: string
  address: string
  tin_no: string
  permit_no: string
  company_name: string
  company_reg_no: string
  is_active: boolean
}

interface RoomType {
  id: number
  gh_id: number
  name: string
  size: string
}

interface Room {
  id: number
  room_no: string
  room_type_id: number
  size: string
}

const initialGuestHouse: GuestHouse = {
  id: 1,
  gh_name: 'Grand Guest House',
  contact_number: '+1 234 567 8900',
  email: 'info@grandguesthouse.com',
  website: 'www.grandguesthouse.com',
  address: '123 Main Street\nCity Center\nState - 123456',
  tin_no: 'TIN123456789',
  permit_no: 'PERMIT2024001',
  company_name: 'Grand Hospitality Pvt Ltd',
  company_reg_no: 'REG2024001',
  is_active: true,
}

const initialRoomTypes: RoomType[] = [
  { id: 1, gh_id: 1, name: 'Standard AC', size: '250 sqft' },
  { id: 2, gh_id: 1, name: 'Deluxe AC', size: '350 sqft' },
  { id: 3, gh_id: 1, name: 'Suite', size: '500 sqft' },
]

const initialRooms: Room[] = [
  { id: 1, room_no: '101', room_type_id: 1, size: '250 sqft' },
  { id: 2, room_no: '102', room_type_id: 1, size: '250 sqft' },
  { id: 3, room_no: '201', room_type_id: 2, size: '350 sqft' },
  { id: 4, room_no: '202', room_type_id: 2, size: '350 sqft' },
  { id: 5, room_no: '301', room_type_id: 3, size: '500 sqft' },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'guestHouse' | 'general'>('guestHouse')
  const [guestHouseTab, setGuestHouseTab] = useState<'info' | 'roomTypes' | 'rooms'>('info')
  const [isEditing, setIsEditing] = useState(false)
  const [guestHouse, setGuestHouse] = useState<GuestHouse>(initialGuestHouse)
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(initialRoomTypes)
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  
  const [roomTypeForm, setRoomTypeForm] = useState<Partial<RoomType>>({})
  const [roomForm, setRoomForm] = useState<Partial<Room>>({})
  const [showRoomTypeModal, setShowRoomTypeModal] = useState(false)
  const [showRoomModal, setShowRoomModal] = useState(false)

  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)

  const handleSaveGuestHouse = () => {
    setIsEditing(false)
  }

  const handleAddRoomType = () => {
    if (roomTypeForm.name && roomTypeForm.size) {
      const newRoomType: RoomType = {
        id: Date.now(),
        gh_id: 1,
        name: roomTypeForm.name,
        size: roomTypeForm.size,
      }
      setRoomTypes([...roomTypes, newRoomType])
      setRoomTypeForm({})
      setShowRoomTypeModal(false)
    }
  }

  const handleDeleteRoomType = (id: number) => {
    setRoomTypes(roomTypes.filter(rt => rt.id !== id))
  }

  const handleAddRoom = () => {
    if (roomForm.room_no && roomForm.room_type_id && roomForm.size) {
      const newRoom: Room = {
        id: Date.now(),
        room_no: roomForm.room_no,
        room_type_id: roomForm.room_type_id,
        size: roomForm.size,
      }
      setRooms([...rooms, newRoom])
      setRoomForm({})
      setShowRoomModal(false)
    }
  }

  const handleDeleteRoom = (id: number) => {
    setRooms(rooms.filter(r => r.id !== id))
  }

  const getRoomTypeName = (id: number) => {
    return roomTypes.find(rt => rt.id === id)?.name || 'Unknown'
  }

  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'guestHouse' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('guestHouse')}
        >
          Guest House Information
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'general' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('general')}
        >
          General Setting
        </button>
      </div>

      {activeTab === 'guestHouse' && (
        <>
          <div style={styles.subTabs}>
            <button
              style={{ ...styles.subTab, ...(guestHouseTab === 'info' ? styles.activeSubTab : {}) }}
              onClick={() => setGuestHouseTab('info')}
            >
              Information
            </button>
            <button
              style={{ ...styles.subTab, ...(guestHouseTab === 'roomTypes' ? styles.activeSubTab : {}) }}
              onClick={() => setGuestHouseTab('roomTypes')}
            >
              Room Types
            </button>
            <button
              style={{ ...styles.subTab, ...(guestHouseTab === 'rooms' ? styles.activeSubTab : {}) }}
              onClick={() => setGuestHouseTab('rooms')}
            >
              Rooms
            </button>
          </div>

          {guestHouseTab === 'info' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Guest House Details</h3>
                <div style={styles.headerActions}>
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>Cancel</button>
                      <button onClick={handleSaveGuestHouse} style={styles.saveBtn}>
                        <Save size={16} /> Save
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
                      <Edit2 size={16} /> Edit
                    </button>
                  )}
                </div>
              </div>

              <div style={styles.form}>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Guest House Name</label>
                    <input
                      type="text"
                      value={guestHouse.gh_name}
                      onChange={(e) => setGuestHouse({ ...guestHouse, gh_name: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Contact Number</label>
                    <input
                      type="text"
                      value={guestHouse.contact_number}
                      onChange={(e) => setGuestHouse({ ...guestHouse, contact_number: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                      type="email"
                      value={guestHouse.email}
                      onChange={(e) => setGuestHouse({ ...guestHouse, email: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Website</label>
                    <input
                      type="text"
                      value={guestHouse.website}
                      onChange={(e) => setGuestHouse({ ...guestHouse, website: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Address</label>
                  <textarea
                    value={guestHouse.address}
                    onChange={(e) => setGuestHouse({ ...guestHouse, address: e.target.value })}
                    disabled={!isEditing}
                    style={{ ...styles.input, minHeight: '80px' }}
                  />
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>TIN No.</label>
                    <input
                      type="text"
                      value={guestHouse.tin_no}
                      onChange={(e) => setGuestHouse({ ...guestHouse, tin_no: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Permit No.</label>
                    <input
                      type="text"
                      value={guestHouse.permit_no}
                      onChange={(e) => setGuestHouse({ ...guestHouse, permit_no: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Company Name</label>
                    <input
                      type="text"
                      value={guestHouse.company_name}
                      onChange={(e) => setGuestHouse({ ...guestHouse, company_name: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Company Reg. No.</label>
                    <input
                      type="text"
                      value={guestHouse.company_reg_no}
                      onChange={(e) => setGuestHouse({ ...guestHouse, company_reg_no: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={guestHouse.is_active}
                      onChange={(e) => setGuestHouse({ ...guestHouse, is_active: e.target.checked })}
                      disabled={!isEditing}
                      style={styles.checkbox}
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>
          )}

          {guestHouseTab === 'roomTypes' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Room Types</h3>
                <button onClick={() => setShowRoomTypeModal(true)} style={styles.addBtn}>
                  <Plus size={16} /> Add Room Type
                </button>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Size</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roomTypes.map((rt) => (
                    <tr key={rt.id} style={styles.tr}>
                      <td style={styles.td}>{rt.name}</td>
                      <td style={styles.td}>{rt.size}</td>
                      <td style={styles.td}>
                        <button onClick={() => handleDeleteRoomType(rt.id)} style={styles.deleteBtn}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {guestHouseTab === 'rooms' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Rooms</h3>
                <button onClick={() => setShowRoomModal(true)} style={styles.addBtn}>
                  <Plus size={16} /> Add Room
                </button>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Room No.</th>
                    <th style={styles.th}>Room Type</th>
                    <th style={styles.th}>Size</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id} style={styles.tr}>
                      <td style={styles.td}>{room.room_no}</td>
                      <td style={styles.td}>{getRoomTypeName(room.room_type_id)}</td>
                      <td style={styles.td}>{room.size}</td>
                      <td style={styles.td}>
                        <button onClick={() => handleDeleteRoom(room.id)} style={styles.deleteBtn}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'general' && (
        <div style={styles.card}>
          <div style={styles.section}>
            <h3 style={styles.cardTitle}>Appearance</h3>
            <div style={styles.settingRow}>
              <div style={styles.settingInfo}>
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                <div>
                  <span style={styles.settingLabel}>Theme</span>
                  <span style={styles.settingValue}>{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
                </div>
              </div>
              <button onClick={toggleTheme} style={styles.toggleBtn}>
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>

          <div style={{ ...styles.section, borderTop: '1px solid var(--border)' }}>
            <h3 style={styles.cardTitle}>Notifications</h3>
            <div style={styles.settingRow}>
              <div style={styles.settingInfo}>
                <Bell size={20} />
                <div>
                  <span style={styles.settingLabel}>Push Notifications</span>
                  <span style={styles.settingValue}>{notifications ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
              <button onClick={() => setNotifications(!notifications)} style={styles.toggleBtn}>
                {notifications ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRoomTypeModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Add Room Type</h3>
              <button onClick={() => setShowRoomTypeModal(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input
                  type="text"
                  value={roomTypeForm.name || ''}
                  onChange={(e) => setRoomTypeForm({ ...roomTypeForm, name: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Size</label>
                <input
                  type="text"
                  value={roomTypeForm.size || ''}
                  onChange={(e) => setRoomTypeForm({ ...roomTypeForm, size: e.target.value })}
                  placeholder="e.g. 250 sqft"
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setShowRoomTypeModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleAddRoomType} style={styles.saveBtn}>Add</button>
            </div>
          </div>
        </div>
      )}

      {showRoomModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Add Room</h3>
              <button onClick={() => setShowRoomModal(false)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Room No.</label>
                <input
                  type="text"
                  value={roomForm.room_no || ''}
                  onChange={(e) => setRoomForm({ ...roomForm, room_no: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Room Type</label>
                <select
                  value={roomForm.room_type_id || ''}
                  onChange={(e) => setRoomForm({ ...roomForm, room_type_id: Number(e.target.value) })}
                  style={styles.input}
                >
                  <option value="">Select Room Type</option>
                  {roomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id}>{rt.name}</option>
                  ))}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Size</label>
                <input
                  type="text"
                  value={roomForm.size || ''}
                  onChange={(e) => setRoomForm({ ...roomForm, size: e.target.value })}
                  placeholder="e.g. 250 sqft"
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setShowRoomModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleAddRoom} style={styles.saveBtn}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '16px',
    maxWidth: '900px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border)',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-muted)',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: 'var(--primary)',
    borderBottomColor: 'var(--primary)',
  },
  subTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    backgroundColor: 'var(--background-secondary)',
    padding: '8px',
    borderRadius: '8px',
  },
  subTab: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  activeSubTab: {
    backgroundColor: 'var(--primary)',
    color: '#FAFAFA',
  },
  card: {
    backgroundColor: 'var(--background-secondary)',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'var(--background-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--border-radius)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'var(--primary)',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    color: '#FAFAFA',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--border-radius)',
    color: 'var(--text-muted)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: 'var(--primary)',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    color: '#FAFAFA',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FF6B6B',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  form: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--text-muted)',
  },
  input: {
    padding: '10px 12px',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--background-tertiary)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 20px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '12px 20px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)',
  },
  tr: {
    borderBottom: '1px solid var(--border)',
  },
  section: {
    padding: '20px',
  },
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
  },
  settingInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: 'var(--text-muted)',
  },
  settingLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  settingValue: {
    display: 'block',
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
  toggleBtn: {
    padding: '8px 16px',
    backgroundColor: 'var(--background-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--border-radius)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--background-secondary)',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid var(--border)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
  },
  modalBody: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '16px 20px',
    borderTop: '1px solid var(--border)',
  },
}
