import { useState, useEffect } from 'react'
import { Plus, Search, Loader2, Edit2, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Booking {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  room_id: string
  check_in: string
  check_out: string
  total_amount: number
  paid_amount: number
  status: string
  room?: { room_no: string; room_types?: { name: string } }
}

interface Room {
  id: string
  room_no: string
  room_type_id: string
  room_types?: { name: string }
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    room_id: '',
    check_in: '',
    check_out: '',
    total_amount: 0,
    paid_amount: 0,
    status: 'confirmed'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [bookingsResult, roomsResult] = await Promise.all([
        supabase.from('bookings').select('*, room:rooms(room_no, room_types(name))').order('created_at', { ascending: false }),
        supabase.from('rooms').select('*, room_types(name)')
      ])
      
      if (bookingsResult.data) setBookings(bookingsResult.data)
      if (roomsResult.data) setRooms(roomsResult.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingBooking) {
        const { error } = await supabase
          .from('bookings')
          .update({
            customer_name: formData.customer_name,
            customer_phone: formData.customer_phone,
            customer_email: formData.customer_email,
            room_id: formData.room_id,
            check_in: formData.check_in,
            check_out: formData.check_out,
            total_amount: formData.total_amount,
            paid_amount: formData.paid_amount,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingBooking.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('bookings')
          .insert(formData)
        if (error) throw error
      }
      fetchData()
      closeModal()
    } catch (error) {
      console.error('Error saving booking:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return
    try {
      const { error } = await supabase.from('bookings').delete().eq('id', id)
      if (error) throw error
      setBookings(bookings.filter(b => b.id !== id))
    } catch (error) {
      console.error('Error deleting booking:', error)
    }
  }

  const openModal = (booking?: Booking) => {
    if (booking) {
      setEditingBooking(booking)
      setFormData({
        customer_name: booking.customer_name,
        customer_phone: booking.customer_phone,
        customer_email: booking.customer_email,
        room_id: booking.room_id,
        check_in: booking.check_in,
        check_out: booking.check_out,
        total_amount: booking.total_amount,
        paid_amount: booking.paid_amount,
        status: booking.status
      })
    } else {
      setEditingBooking(null)
      setFormData({
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        room_id: '',
        check_in: '',
        check_out: '',
        total_amount: 0,
        paid_amount: 0,
        status: 'confirmed'
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBooking(null)
  }

  const filteredBookings = bookings.filter(b => 
    b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customer_phone?.includes(searchTerm) ||
    b.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#4CAF50'
      case 'checked_in': return '#2196F3'
      case 'checked_out': return '#9E9E9E'
      case 'cancelled': return '#FF6B6B'
      default: return '#9E9E9E'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <button onClick={() => openModal()} style={styles.addBtn}>
          <Plus size={16} /> New Booking
        </button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Guest</th>
              <th style={styles.th}>Room</th>
              <th style={styles.th}>Check In</th>
              <th style={styles.th}>Check Out</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Paid</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ ...styles.td, textAlign: 'center', color: 'var(--text-muted)' }}>
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.guestInfo}>
                      <span style={styles.guestName}>{booking.customer_name}</span>
                      <span style={styles.guestContact}>{booking.customer_phone}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {booking.room?.room_no || '-'}
                    {booking.room?.room_types && (
                      <span style={styles.roomType}> ({booking.room.room_types.name})</span>
                    )}
                  </td>
                  <td style={styles.td}>{formatDate(booking.check_in)}</td>
                  <td style={styles.td}>{formatDate(booking.check_out)}</td>
                  <td style={styles.td}>${booking.total_amount}</td>
                  <td style={styles.td}>${booking.paid_amount}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(booking.status) }}>
                      {booking.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button onClick={() => openModal(booking)} style={styles.editBtn}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(booking.id)} style={styles.deleteBtn}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>{editingBooking ? 'Edit Booking' : 'New Booking'}</h3>
              <button onClick={closeModal} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Guest Name *</label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone</label>
                  <input
                    type="text"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Room *</label>
                <select
                  value={formData.room_id}
                  onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.room_no} - {room.room_types?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Check In *</label>
                  <input
                    type="date"
                    value={formData.check_in}
                    onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Check Out *</label>
                  <input
                    type="date"
                    value={formData.check_out}
                    onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Total Amount</label>
                  <input
                    type="number"
                    value={formData.total_amount}
                    onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) || 0 })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Paid Amount</label>
                  <input
                    type="number"
                    value={formData.paid_amount}
                    onChange={(e) => setFormData({ ...formData, paid_amount: parseFloat(e.target.value) || 0 })}
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={styles.input}
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="checked_in">Checked In</option>
                  <option value="checked_out">Checked Out</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={closeModal} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSubmit} style={styles.saveBtn}>
                {editingBooking ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '12px',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    gap: '12px',
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: 'var(--background-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--border-radius)',
    flex: 1,
    maxWidth: '300px',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '13px',
    width: '100%',
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
  card: {
    backgroundColor: 'var(--background-secondary)',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    borderBottom: '1px solid var(--border)',
    backgroundColor: 'var(--background-tertiary)',
  },
  td: {
    padding: '12px',
    fontSize: '13px',
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)',
  },
  tr: {
    borderBottom: '1px solid var(--border)',
  },
  guestInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  guestName: {
    fontWeight: 500,
  },
  guestContact: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  roomType: {
    fontSize: '11px',
    color: 'var(--text-muted)',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
  },
  actions: {
    display: 'flex',
    gap: '6px',
  },
  editBtn: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  deleteBtn: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FF6B6B',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
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
    maxWidth: '500px',
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
    maxHeight: '70vh',
    overflowY: 'auto',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    padding: '16px 20px',
    borderTop: '1px solid var(--border)',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-muted)',
  },
  input: {
    padding: '8px 10px',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--background-tertiary)',
    color: 'var(--text-primary)',
    fontSize: '13px',
    outline: 'none',
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
  saveBtn: {
    padding: '8px 16px',
    backgroundColor: 'var(--primary)',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    color: '#FAFAFA',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
  },
}
