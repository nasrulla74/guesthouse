import { useState, useEffect } from 'react'
import { Plus, Search, Loader2, Edit2, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Booking {
  id: string
  booking_name: string
  customer_id: string
  gh_id: string
  room_type_id: string
  room_id: string
  country_id: string
  booking_method: string
  booking_ref: string
  check_in_date: string
  check_out_date: string
  adults: number
  childs: number
  infants: number
  total_guests: number
  bed_nights: number
  meal_id: string
  transfer_id: string
  customer?: { name: string }
  room?: { room_no: string }
  room_type?: { name: string }
  country?: { country_name: string }
  meal_plan?: { meal_plan: string }
  transfer_type?: { transfer_type: string }
}

interface Customer {
  id: string
  name: string
}

interface GuestHouse {
  id: string
  gh_name: string
}

interface RoomType {
  id: string
  name: string
}

interface Room {
  id: string
  room_no: string
  room_type_id: string
}

interface Country {
  id: string
  country_name: string
}

interface MealPlan {
  id: string
  meal_code: string
  meal_plan: string
}

interface TransferType {
  id: string
  transfer_code: string
  transfer_type: string
}

const bookingMethods = [
  'Foreign Tour Operator',
  'Local Tour Operator Direct Booking (FIT)',
  'Online Travel Agent (OTA)'
]

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [guestHouses, setGuestHouses] = useState<GuestHouse[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [transferTypes, setTransferTypes] = useState<TransferType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [formData, setFormData] = useState({
    booking_name: '',
    customer_id: '',
    gh_id: '',
    room_type_id: '',
    room_id: '',
    country_id: '',
    booking_method: 'Foreign Tour Operator',
    booking_ref: '',
    check_in_date: '',
    check_out_date: '',
    adults: 0,
    childs: 0,
    infants: 0,
    meal_id: '',
    transfer_id: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [bookingsResult, customersResult, ghResult, rtResult, roomsResult, countriesResult, mpResult, ttResult] = await Promise.all([
        supabase.from('bookings').select('*, customer:customers(name), room:rooms(room_no), room_type:room_types(name), country:countries(country_name), meal_plan:meal_plans(meal_plan), transfer_type:transfer_types(transfer_type)').order('created_at', { ascending: false }),
        supabase.from('customers').select('id, name').order('name'),
        supabase.from('guest_houses').select('id, gh_name'),
        supabase.from('room_types').select('id, name'),
        supabase.from('rooms').select('id, room_no, room_type_id'),
        supabase.from('countries').select('id, country_name').order('country_name'),
        supabase.from('meal_plans').select('id, meal_code, meal_plan'),
        supabase.from('transfer_types').select('id, transfer_code, transfer_type').order('transfer_type')
      ])
      
      if (bookingsResult.data) setBookings(bookingsResult.data)
      if (customersResult.data) setCustomers(customersResult.data)
      if (ghResult.data) setGuestHouses(ghResult.data)
      if (rtResult.data) setRoomTypes(rtResult.data)
      if (roomsResult.data) setRooms(roomsResult.data)
      if (countriesResult.data) setCountries(countriesResult.data)
      if (mpResult.data) setMealPlans(mpResult.data)
      if (ttResult.data) setTransferTypes(ttResult.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.booking_name || !formData.check_in_date || !formData.check_out_date) return
    try {
      const submitData = {
        booking_name: formData.booking_name,
        customer_id: formData.customer_id || null,
        gh_id: formData.gh_id || null,
        room_type_id: formData.room_type_id || null,
        room_id: formData.room_id || null,
        country_id: formData.country_id || null,
        booking_method: formData.booking_method,
        booking_ref: formData.booking_ref || null,
        check_in_date: formData.check_in_date,
        check_out_date: formData.check_out_date,
        adults: formData.adults,
        childs: formData.childs,
        infants: formData.infants,
        meal_id: formData.meal_id || null,
        transfer_id: formData.transfer_id || null
      }

      if (editingBooking) {
        const { error } = await supabase
          .from('bookings')
          .update({ ...submitData, updated_at: new Date().toISOString() })
          .eq('id', editingBooking.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('bookings').insert(submitData)
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
        booking_name: booking.booking_name,
        customer_id: booking.customer_id || '',
        gh_id: booking.gh_id || '',
        room_type_id: booking.room_type_id || '',
        room_id: booking.room_id || '',
        country_id: booking.country_id || '',
        booking_method: booking.booking_method,
        booking_ref: booking.booking_ref || '',
        check_in_date: booking.check_in_date,
        check_out_date: booking.check_out_date,
        adults: booking.adults,
        childs: booking.childs,
        infants: booking.infants,
        meal_id: booking.meal_id || '',
        transfer_id: booking.transfer_id || ''
      })
    } else {
      setEditingBooking(null)
      setFormData({
        booking_name: '',
        customer_id: '',
        gh_id: '',
        room_type_id: '',
        room_id: '',
        country_id: '',
        booking_method: 'Foreign Tour Operator',
        booking_ref: '',
        check_in_date: '',
        check_out_date: '',
        adults: 0,
        childs: 0,
        infants: 0,
        meal_id: '',
        transfer_id: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBooking(null)
  }

  const totalGuests = formData.adults + formData.childs + formData.infants
  const bedNights = formData.check_in_date && formData.check_out_date 
    ? Math.max(0, Math.ceil((new Date(formData.check_out_date).getTime() - new Date(formData.check_in_date).getTime()) / (1000 * 60 * 60 * 24)) - 1)
    : 0

  const filteredBookings = bookings.filter(b => 
    b.booking_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.booking_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date: string) => {
    if (!date) return '-'
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
              <th style={styles.th}>Booking Name</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Room</th>
              <th style={styles.th}>Check In</th>
              <th style={styles.th}>Check Out</th>
              <th style={styles.th}>Guests</th>
              <th style={styles.th}>Bed Nights</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ ...styles.td, textAlign: 'center', color: 'var(--text-muted)' }}>
                  No bookings found
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.bookingInfo}>
                      <span style={styles.bookingName}>{booking.booking_name}</span>
                      {booking.booking_ref && <span style={styles.bookingRef}>{booking.booking_ref}</span>}
                    </div>
                  </td>
                  <td style={styles.td}>{booking.customer?.name || '-'}</td>
                  <td style={styles.td}>
                    {booking.room?.room_no || '-'}
                    {booking.room_type && <span style={styles.roomType}> ({booking.room_type.name})</span>}
                  </td>
                  <td style={styles.td}>{formatDate(booking.check_in_date)}</td>
                  <td style={styles.td}>{formatDate(booking.check_out_date)}</td>
                  <td style={styles.td}>{booking.total_guests}</td>
                  <td style={styles.td}>{booking.bed_nights}</td>
                  <td style={styles.td}>
                    <span style={styles.methodBadge}>{booking.booking_method}</span>
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
                <label style={styles.label}>Booking Name *</label>
                <input
                  type="text"
                  value={formData.booking_name}
                  onChange={(e) => setFormData({ ...formData, booking_name: e.target.value })}
                  placeholder="Enter booking name"
                  style={styles.input}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Customer</label>
                  <select
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    style={styles.input}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Guest House</label>
                  <select
                    value={formData.gh_id}
                    onChange={(e) => setFormData({ ...formData, gh_id: e.target.value })}
                    style={styles.input}
                  >
                    <option value="">Select Guest House</option>
                    {guestHouses.map((gh) => (
                      <option key={gh.id} value={gh.id}>{gh.gh_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Room Type</label>
                  <select
                    value={formData.room_type_id}
                    onChange={(e) => setFormData({ ...formData, room_type_id: e.target.value })}
                    style={styles.input}
                  >
                    <option value="">Select Room Type</option>
                    {roomTypes.map((rt) => (
                      <option key={rt.id} value={rt.id}>{rt.name}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Room</label>
                  <select
                    value={formData.room_id}
                    onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                    style={styles.input}
                  >
                    <option value="">Select Room</option>
                    {rooms.filter(r => !formData.room_type_id || r.room_type_id === formData.room_type_id).map((r) => (
                      <option key={r.id} value={r.id}>{r.room_no}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Country</label>
                  <select
                    value={formData.country_id}
                    onChange={(e) => setFormData({ ...formData, country_id: e.target.value })}
                    style={styles.input}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>{c.country_name}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Booking Method</label>
                  <select
                    value={formData.booking_method}
                    onChange={(e) => setFormData({ ...formData, booking_method: e.target.value })}
                    style={styles.input}
                  >
                    {bookingMethods.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Booking Reference</label>
                <input
                  type="text"
                  value={formData.booking_ref}
                  onChange={(e) => setFormData({ ...formData, booking_ref: e.target.value })}
                  placeholder="Enter booking reference"
                  style={styles.input}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Check In Date *</label>
                  <input
                    type="date"
                    value={formData.check_in_date}
                    onChange={(e) => setFormData({ ...formData, check_in_date: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Check Out Date *</label>
                  <input
                    type="date"
                    value={formData.check_out_date}
                    onChange={(e) => setFormData({ ...formData, check_out_date: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Adults</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 0 })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Children</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.childs}
                    onChange={(e) => setFormData({ ...formData, childs: parseInt(e.target.value) || 0 })}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Infants</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.infants}
                    onChange={(e) => setFormData({ ...formData, infants: parseInt(e.target.value) || 0 })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Total Guests (Auto)</label>
                  <input
                    type="text"
                    value={totalGuests}
                    readOnly
                    style={{ ...styles.input, backgroundColor: 'var(--background-secondary)' }}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Bed Nights (Auto)</label>
                  <input
                    type="text"
                    value={bedNights >= 0 ? bedNights : 0}
                    readOnly
                    style={{ ...styles.input, backgroundColor: 'var(--background-secondary)' }}
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Meal Plan</label>
                  <select
                    value={formData.meal_id}
                    onChange={(e) => setFormData({ ...formData, meal_id: e.target.value })}
                    style={styles.input}
                  >
                    <option value="">Select Meal Plan</option>
                    {mealPlans.map((mp) => (
                      <option key={mp.id} value={mp.id}>{mp.meal_code} - {mp.meal_plan}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Transfer Type</label>
                  <select
                    value={formData.transfer_id}
                    onChange={(e) => setFormData({ ...formData, transfer_id: e.target.value })}
                    style={styles.input}
                  >
                    <option value="">Select Transfer</option>
                    {transferTypes.map((tt) => (
                      <option key={tt.id} value={tt.id}>{tt.transfer_code} - {tt.transfer_type}</option>
                    ))}
                  </select>
                </div>
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
  container: { padding: '12px' },
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
  table: { width: '100%', borderCollapse: 'collapse' },
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
  tr: { borderBottom: '1px solid var(--border)' },
  bookingInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  bookingName: { fontWeight: 500 },
  bookingRef: { fontSize: '11px', color: 'var(--text-muted)' },
  roomType: { fontSize: '11px', color: 'var(--text-muted)' },
  methodBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 600,
    backgroundColor: 'var(--background-tertiary)',
    color: 'var(--text-primary)',
  },
  actions: { display: 'flex', gap: '6px' },
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
    maxWidth: '600px',
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
