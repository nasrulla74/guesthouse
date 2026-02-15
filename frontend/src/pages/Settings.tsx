import { useState, useEffect, useRef } from 'react'
import { Save, Edit2, Plus, X, Trash2, Loader2, Upload } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../lib/supabase'

interface GuestHouse {
  id: string
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
  logo_url: string
}

interface RoomType {
  id: string
  gh_id: string
  name: string
  total_rooms: string
}

interface Room {
  id: string
  room_no: string
  room_type_id: string
  size: string
}

interface Country {
  id: string
  country_name: string
  is_active: boolean
}

interface Operator {
  id: string
  name: string
  cu_type: string
  email: string
  phone: string
  address: string
  country: string
  is_active: boolean
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'guestHouse' | 'general'>('guestHouse')
  const [guestHouseTab, setGuestHouseTab] = useState<'info' | 'roomTypes' | 'rooms' | 'operators' | 'countries'>('info')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [guestHouse, setGuestHouse] = useState<GuestHouse>({
    id: '',
    gh_name: '',
    contact_number: '',
    email: '',
    website: '',
    address: '',
    tin_no: '',
    permit_no: '',
    company_name: '',
    company_reg_no: '',
    is_active: true,
    logo_url: ''
  })
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [operators, setOperators] = useState<Operator[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [roomTypeForm, setRoomTypeForm] = useState<Partial<RoomType>>({})
  const [roomForm, setRoomForm] = useState<Partial<Room>>({})
  const [operatorForm, setOperatorForm] = useState<Partial<Operator>>({ is_active: true })
  const [countryForm, setCountryForm] = useState<Partial<Country>>({ is_active: true })
  const [showRoomTypeModal, setShowRoomTypeModal] = useState(false)
  const [showRoomModal, setShowRoomModal] = useState(false)
  const [showOperatorModal, setShowOperatorModal] = useState(false)
  const [showCountryModal, setShowCountryModal] = useState(false)
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null)
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ghResult, rtResult, rResult, opResult, countryResult] = await Promise.all([
        supabase.from('guest_houses').select('*').limit(1).single(),
        supabase.from('room_types').select('*'),
        supabase.from('rooms').select('*'),
        supabase.from('customers').select('*').order('name'),
        supabase.from('countries').select('*').order('country_name')
      ])

      if (ghResult.data) {
        setGuestHouse(ghResult.data)
      } else {
        const { data: newGh, error: createError } = await supabase
          .from('guest_houses')
          .insert({
            gh_name: 'Grand Guest House',
            contact_number: '+1 234 567 8900',
            email: 'info@grandguesthouse.com',
            website: 'www.grandguesthouse.com',
            address: '123 Main Street\nCity Center\nState - 123456',
            tin_no: 'TIN123456789',
            permit_no: 'PERMIT2024001',
            company_name: 'Grand Hospitality Pvt Ltd',
            company_reg_no: 'REG2024001',
            is_active: true
          })
          .select()
          .single()

        if (createError) throw createError
        if (newGh) setGuestHouse(newGh)
      }
      if (rtResult.data) setRoomTypes(rtResult.data)
      if (rResult.data) setRooms(rResult.data)
      if (opResult.data) setOperators(opResult.data)
      if (countryResult.data) setCountries(countryResult.data)
      
      if (!countryResult.data || countryResult.data.length === 0) {
        await seedCountries()
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const seedCountries = async () => {
    const countriesList = [
      'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
      'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
      'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
      'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
      'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde',
      'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros',
      'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark',
      'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
      'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
      'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
      'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
      'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
      'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
      'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya',
      'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
      'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius',
      'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco',
      'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand',
      'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
      'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
      'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
      'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino',
      'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles',
      'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
      'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan',
      'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania',
      'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
      'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
      'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
      'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ]

    try {
      const countriesData = countriesList.map(name => ({
        country_name: name,
        is_active: true
      }))

      const { error } = await supabase.from('countries').insert(countriesData)
      if (error) throw error

      const { data } = await supabase.from('countries').select('*').order('country_name')
      if (data) setCountries(data)
    } catch (error) {
      console.error('Error seeding countries:', error)
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !guestHouse.id) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${guestHouse.id}-logo.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(fileName)

      setGuestHouse({ ...guestHouse, logo_url: publicUrl })
    } catch (error) {
      console.error('Error uploading logo:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveGuestHouse = async () => {
    if (!guestHouse) return
    setSaving(true)
    try {
      let guestHouseId = guestHouse.id

      if (!guestHouseId || guestHouseId === '') {
        const { data: newGh, error: createError } = await supabase
          .from('guest_houses')
          .insert({
            gh_name: guestHouse.gh_name,
            contact_number: guestHouse.contact_number,
            email: guestHouse.email,
            website: guestHouse.website,
            address: guestHouse.address,
            tin_no: guestHouse.tin_no,
            permit_no: guestHouse.permit_no,
            company_name: guestHouse.company_name,
            company_reg_no: guestHouse.company_reg_no,
            is_active: guestHouse.is_active,
            logo_url: guestHouse.logo_url
          })
          .select()
          .single()

        if (createError) throw createError
        if (newGh) {
          setGuestHouse(newGh)
          guestHouseId = newGh.id
        }
      } else {
        const { error } = await supabase
          .from('guest_houses')
          .update({
            gh_name: guestHouse.gh_name,
            contact_number: guestHouse.contact_number,
            email: guestHouse.email,
            website: guestHouse.website,
            address: guestHouse.address,
            tin_no: guestHouse.tin_no,
            permit_no: guestHouse.permit_no,
            company_name: guestHouse.company_name,
            company_reg_no: guestHouse.company_reg_no,
            is_active: guestHouse.is_active,
            logo_url: guestHouse.logo_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', guestHouseId)

        if (error) throw error
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving guest house:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddRoomType = async () => {
    if (!roomTypeForm.name || !roomTypeForm.total_rooms || !guestHouse || !guestHouse.id) return
    try {
      const { data, error } = await supabase
        .from('room_types')
        .insert({
          gh_id: guestHouse.id,
          name: roomTypeForm.name,
          total_rooms: roomTypeForm.total_rooms
        })
        .select()
        .single()

      if (error) throw error
      if (data) setRoomTypes([...roomTypes, data])
      setRoomTypeForm({})
      setShowRoomTypeModal(false)
    } catch (error) {
      console.error('Error adding room type:', error)
    }
  }

  const handleDeleteRoomType = async (id: string) => {
    try {
      const { error } = await supabase.from('room_types').delete().eq('id', id)
      if (error) throw error
      setRoomTypes(roomTypes.filter(rt => rt.id !== id))
    } catch (error) {
      console.error('Error deleting room type:', error)
    }
  }

  const handleEditRoomType = (rt: RoomType) => {
    setEditingRoomType(rt)
    setRoomTypeForm({ name: rt.name, total_rooms: rt.total_rooms })
    setShowRoomTypeModal(true)
  }

  const handleUpdateRoomType = async () => {
    if (!editingRoomType || !roomTypeForm.name || !roomTypeForm.total_rooms) return
    try {
      const { error } = await supabase
        .from('room_types')
        .update({
          name: roomTypeForm.name,
          total_rooms: roomTypeForm.total_rooms,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingRoomType.id)

      if (error) throw error
      setRoomTypes(roomTypes.map(rt => rt.id === editingRoomType.id ? { ...rt, ...roomTypeForm } : rt))
      setEditingRoomType(null)
      setRoomTypeForm({})
      setShowRoomTypeModal(false)
    } catch (error) {
      console.error('Error updating room type:', error)
    }
  }

  const handleAddRoom = async () => {
    if (!roomForm.room_no || !roomForm.room_type_id || !roomForm.size) return
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          room_no: roomForm.room_no,
          room_type_id: roomForm.room_type_id,
          size: roomForm.size
        })
        .select()
        .single()

      if (error) throw error
      if (data) setRooms([...rooms, data])
      setRoomForm({})
      setShowRoomModal(false)
    } catch (error) {
      console.error('Error adding room:', error)
    }
  }

  const handleDeleteRoom = async (id: string) => {
    try {
      const { error } = await supabase.from('rooms').delete().eq('id', id)
      if (error) throw error
      setRooms(rooms.filter(r => r.id !== id))
    } catch (error) {
      console.error('Error deleting room:', error)
    }
  }

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    setRoomForm({ room_no: room.room_no, room_type_id: room.room_type_id, size: room.size })
    setShowRoomModal(true)
  }

  const handleUpdateRoom = async () => {
    if (!editingRoom || !roomForm.room_no || !roomForm.room_type_id || !roomForm.size) return
    try {
      const { error } = await supabase
        .from('rooms')
        .update({
          room_no: roomForm.room_no,
          room_type_id: roomForm.room_type_id,
          size: roomForm.size,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingRoom.id)

      if (error) throw error
      setRooms(rooms.map(r => r.id === editingRoom.id ? { ...r, ...roomForm } : r))
      setEditingRoom(null)
      setRoomForm({})
      setShowRoomModal(false)
    } catch (error) {
      console.error('Error updating room:', error)
    }
  }

  const getRoomTypeName = (id: string) => {
    return roomTypes.find(rt => rt.id === id)?.name || 'Unknown'
  }

  const handleAddOperator = async () => {
    if (!operatorForm.name || !operatorForm.cu_type) return
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: operatorForm.name,
          cu_type: operatorForm.cu_type,
          email: operatorForm.email || null,
          phone: operatorForm.phone || null,
          address: operatorForm.address || null,
          country: operatorForm.country || null,
          is_active: operatorForm.is_active ?? true
        })
        .select()
        .single()

      if (error) throw error
      if (data) setOperators([...operators, data])
      setOperatorForm({ is_active: true })
      setShowOperatorModal(false)
    } catch (error) {
      console.error('Error adding operator:', error)
    }
  }

  const handleDeleteOperator = async (id: string) => {
    try {
      const { error } = await supabase.from('customers').delete().eq('id', id)
      if (error) throw error
      setOperators(operators.filter(op => op.id !== id))
    } catch (error) {
      console.error('Error deleting operator:', error)
    }
  }

  const handleEditOperator = (operator: Operator) => {
    setEditingOperator(operator)
    setOperatorForm({
      name: operator.name,
      cu_type: operator.cu_type,
      email: operator.email,
      phone: operator.phone,
      address: operator.address,
      country: operator.country,
      is_active: operator.is_active
    })
    setShowOperatorModal(true)
  }

  const handleUpdateOperator = async () => {
    if (!editingOperator || !operatorForm.name || !operatorForm.cu_type) return
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: operatorForm.name,
          cu_type: operatorForm.cu_type,
          email: operatorForm.email || null,
          phone: operatorForm.phone || null,
          address: operatorForm.address || null,
          country: operatorForm.country || null,
          is_active: operatorForm.is_active ?? true,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingOperator.id)

      if (error) throw error
      setOperators(operators.map(op => op.id === editingOperator.id ? { ...op, ...operatorForm } as Operator : op))
      setEditingOperator(null)
      setOperatorForm({ is_active: true })
      setShowOperatorModal(false)
    } catch (error) {
      console.error('Error updating operator:', error)
    }
  }

  const closeOperatorModal = () => {
    setShowOperatorModal(false)
    setEditingOperator(null)
    setOperatorForm({ is_active: true })
  }

  const handleAddCountry = async () => {
    if (!countryForm.country_name) return
    try {
      const { data, error } = await supabase
        .from('countries')
        .insert({
          country_name: countryForm.country_name,
          is_active: countryForm.is_active ?? true
        })
        .select()
        .single()

      if (error) throw error
      if (data) setCountries([...countries, data])
      setCountryForm({ is_active: true })
      setShowCountryModal(false)
    } catch (error) {
      console.error('Error adding country:', error)
    }
  }

  const handleEditCountry = (country: Country) => {
    setEditingCountry(country)
    setCountryForm({ country_name: country.country_name, is_active: country.is_active })
    setShowCountryModal(true)
  }

  const handleUpdateCountry = async () => {
    if (!editingCountry || !countryForm.country_name) return
    try {
      const { error } = await supabase
        .from('countries')
        .update({
          country_name: countryForm.country_name,
          is_active: countryForm.is_active ?? true,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCountry.id)

      if (error) throw error
      setCountries(countries.map(c => c.id === editingCountry.id ? { ...c, ...countryForm } as Country : c))
      setEditingCountry(null)
      setCountryForm({ is_active: true })
      setShowCountryModal(false)
    } catch (error) {
      console.error('Error updating country:', error)
    }
  }

  const closeCountryModal = () => {
    setShowCountryModal(false)
    setEditingCountry(null)
    setCountryForm({ is_active: true })
  }

  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Loader2 size={32} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      
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
            <button
              style={{ ...styles.subTab, ...(guestHouseTab === 'operators' ? styles.activeSubTab : {}) }}
              onClick={() => setGuestHouseTab('operators')}
            >
              Operators
            </button>
            <button
              style={{ ...styles.subTab, ...(guestHouseTab === 'countries' ? styles.activeSubTab : {}) }}
              onClick={() => setGuestHouseTab('countries')}
            >
              Countries
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
                      <button onClick={handleSaveGuestHouse} disabled={saving} style={styles.saveBtn}>
                        <Save size={16} /> {saving ? 'Saving...' : 'Save'}
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
                <div style={styles.logoSection}>
                  <div style={styles.logoPreview}>
                    {guestHouse.logo_url ? (
                      <img src={guestHouse.logo_url} alt="Logo" style={styles.logoImage} />
                    ) : (
                      <div style={styles.logoPlaceholder}>
                        <Upload size={24} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    )}
                  </div>
                  <div style={styles.logoActions}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      style={styles.uploadBtn}
                    >
                      {uploading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={16} />}
                      {uploading ? 'Uploading...' : 'Upload Logo'}
                    </button>
                    {guestHouse.logo_url && (
                      <button
                        onClick={() => setGuestHouse({ ...guestHouse, logo_url: '' })}
                        style={styles.removeLogoBtn}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

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
                      value={guestHouse.contact_number || ''}
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
                      value={guestHouse.email || ''}
                      onChange={(e) => setGuestHouse({ ...guestHouse, email: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Website</label>
                    <input
                      type="text"
                      value={guestHouse.website || ''}
                      onChange={(e) => setGuestHouse({ ...guestHouse, website: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Address</label>
                  <textarea
                    value={guestHouse.address || ''}
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
                      value={guestHouse.tin_no || ''}
                      onChange={(e) => setGuestHouse({ ...guestHouse, tin_no: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Permit No.</label>
                    <input
                      type="text"
                      value={guestHouse.permit_no || ''}
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
                      value={guestHouse?.company_name || ''}
                      onChange={(e) => setGuestHouse({ ...guestHouse!, company_name: e.target.value })}
                      disabled={!isEditing}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Company Reg. No.</label>
                    <input
                      type="text"
                      value={guestHouse?.company_reg_no || ''}
                      onChange={(e) => setGuestHouse({ ...guestHouse!, company_reg_no: e.target.value })}
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
                    <th style={styles.th}>Total Rooms</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roomTypes.map((rt) => (
                    <tr key={rt.id} style={styles.tr}>
                      <td style={styles.td}>{rt.name}</td>
                      <td style={styles.td}>{rt.total_rooms}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEditRoomType(rt)} style={styles.editBtnTable}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteRoomType(rt.id)} style={styles.deleteBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
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
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEditRoom(room)} style={styles.editBtnTable}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteRoom(room.id)} style={styles.deleteBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {guestHouseTab === 'operators' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Operators</h3>
                <button onClick={() => { setEditingOperator(null); setOperatorForm({ is_active: true }); setShowOperatorModal(true); }} style={styles.addBtn}>
                  <Plus size={16} /> Add Operator
                </button>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Country</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {operators.map((op) => (
                    <tr key={op.id} style={styles.tr}>
                      <td style={styles.td}>{op.name}</td>
                      <td style={styles.td}>{op.cu_type}</td>
                      <td style={styles.td}>{op.email || '-'}</td>
                      <td style={styles.td}>{op.phone || '-'}</td>
                      <td style={styles.td}>{op.country || '-'}</td>
                      <td style={styles.td}>
                        <span style={{ color: op.is_active ? '#4CAF50' : '#FF6B6B', fontSize: '12px' }}>
                          {op.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEditOperator(op)} style={styles.editBtnTable}>
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteOperator(op.id)} style={styles.deleteBtn}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {guestHouseTab === 'countries' && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Countries</h3>
                <button onClick={() => { setEditingCountry(null); setCountryForm({ is_active: true }); setShowCountryModal(true); }} style={styles.addBtn}>
                  <Plus size={16} /> Add Country
                </button>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Country Name</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((country) => (
                    <tr key={country.id} style={styles.tr}>
                      <td style={styles.td}>{country.country_name}</td>
                      <td style={styles.td}>
                        <span style={{ color: country.is_active ? '#4CAF50' : '#FF6B6B', fontSize: '12px' }}>
                          {country.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => handleEditCountry(country)} style={styles.editBtnTable}>
                          <Edit2 size={14} />
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
              <h3>{editingRoomType ? 'Edit Room Type' : 'Add Room Type'}</h3>
              <button onClick={() => { setShowRoomTypeModal(false); setEditingRoomType(null); setRoomTypeForm({}); }} style={styles.closeBtn}>
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
                <label style={styles.label}>Total Rooms</label>
                <input
                  type="text"
                  value={roomTypeForm.total_rooms || ''}
                  onChange={(e) => setRoomTypeForm({ ...roomTypeForm, total_rooms: e.target.value })}
                  placeholder="e.g. 10"
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => { setShowRoomTypeModal(false); setEditingRoomType(null); setRoomTypeForm({}); }} style={styles.cancelBtn}>Cancel</button>
              <button onClick={editingRoomType ? handleUpdateRoomType : handleAddRoomType} style={styles.saveBtn}>
                {editingRoomType ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRoomModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>{editingRoom ? 'Edit Room' : 'Add Room'}</h3>
              <button onClick={() => { setShowRoomModal(false); setEditingRoom(null); setRoomForm({}); }} style={styles.closeBtn}>
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
                  onChange={(e) => setRoomForm({ ...roomForm, room_type_id: e.target.value })}
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
              <button onClick={() => { setShowRoomModal(false); setEditingRoom(null); setRoomForm({}); }} style={styles.cancelBtn}>Cancel</button>
              <button onClick={editingRoom ? handleUpdateRoom : handleAddRoom} style={styles.saveBtn}>
                {editingRoom ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showOperatorModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>{editingOperator ? 'Edit Operator' : 'Add Operator'}</h3>
              <button onClick={closeOperatorModal} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name *</label>
                <input
                  type="text"
                  value={operatorForm.name || ''}
                  onChange={(e) => setOperatorForm({ ...operatorForm, name: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Type *</label>
                <select
                  value={operatorForm.cu_type || ''}
                  onChange={(e) => setOperatorForm({ ...operatorForm, cu_type: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Select Type</option>
                  <option value="OTA">OTA</option>
                  <option value="Tour Operator">Tour Operator</option>
                  <option value="FIT">FIT</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={operatorForm.email || ''}
                  onChange={(e) => setOperatorForm({ ...operatorForm, email: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="text"
                  value={operatorForm.phone || ''}
                  onChange={(e) => setOperatorForm({ ...operatorForm, phone: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Address</label>
                <textarea
                  value={operatorForm.address || ''}
                  onChange={(e) => setOperatorForm({ ...operatorForm, address: e.target.value })}
                  style={{ ...styles.input, minHeight: '60px' }}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Country</label>
                <input
                  type="text"
                  value={operatorForm.country || ''}
                  onChange={(e) => setOperatorForm({ ...operatorForm, country: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={operatorForm.is_active ?? true}
                    onChange={(e) => setOperatorForm({ ...operatorForm, is_active: e.target.checked })}
                    style={styles.checkbox}
                  />
                  Active
                </label>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={closeOperatorModal} style={styles.cancelBtn}>Cancel</button>
              <button onClick={editingOperator ? handleUpdateOperator : handleAddOperator} style={styles.saveBtn}>
                {editingOperator ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCountryModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>{editingCountry ? 'Edit Country' : 'Add Country'}</h3>
              <button onClick={closeCountryModal} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Country Name *</label>
                <input
                  type="text"
                  value={countryForm.country_name || ''}
                  onChange={(e) => setCountryForm({ ...countryForm, country_name: e.target.value })}
                  placeholder="e.g. United States"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={countryForm.is_active ?? true}
                    onChange={(e) => setCountryForm({ ...countryForm, is_active: e.target.checked })}
                    style={styles.checkbox}
                  />
                  Active
                </label>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={closeCountryModal} style={styles.cancelBtn}>Cancel</button>
              <button onClick={editingCountry ? handleUpdateCountry : handleAddCountry} style={styles.saveBtn}>
                {editingCountry ? 'Update' : 'Add'}
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
    maxWidth: '800px',
  },
  tabs: {
    display: 'flex',
    gap: '2px',
    marginBottom: '16px',
    borderBottom: '1px solid var(--border)',
  },
  tab: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-muted)',
    fontSize: '12px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  activeTab: {
    color: 'var(--primary)',
    borderBottomColor: 'var(--primary)',
  },
  subTabs: {
    display: 'flex',
    gap: '4px',
    marginBottom: '12px',
    backgroundColor: 'var(--background-secondary)',
    padding: '6px',
    borderRadius: '4px',
  },
  subTab: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    color: 'var(--text-muted)',
    fontSize: '11px',
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
    padding: '10px 14px',
    borderBottom: '1px solid var(--border)',
  },
  cardTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    margin: 0,
  },
  section: {
    padding: '12px',
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
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  headerActions: {
    display: 'flex',
    gap: '6px',
  },
  editBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    backgroundColor: 'var(--background-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--border-radius)',
    color: 'var(--text-primary)',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    backgroundColor: 'var(--primary)',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    color: '#FAFAFA',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '6px 10px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--border-radius)',
    color: 'var(--text-muted)',
    fontSize: '11px',
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
  editBtnTable: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  form: {
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'var(--text-muted)',
  },
  input: {
    padding: '6px 8px',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--background-tertiary)',
    color: 'var(--text-primary)',
    fontSize: '12px',
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
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--border)',
    marginBottom: '12px',
  },
  logoPreview: {
    width: '180px',
    height: '55px',
    borderRadius: '6px',
    overflow: 'hidden',
    backgroundColor: 'var(--background-tertiary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border)',
  },
  logoImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  logoPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 10px',
    backgroundColor: 'var(--primary)',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    color: '#FAFAFA',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  removeLogoBtn: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--border-radius)',
    color: 'var(--text-muted)',
    fontSize: '13px',
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
    padding: '8px 12px',
    fontSize: '10px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '8px 12px',
    fontSize: '12px',
    color: 'var(--text-primary)',
    borderBottom: '1px solid var(--border)',
  },
  tr: {
    borderBottom: '1px solid var(--border)',
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
