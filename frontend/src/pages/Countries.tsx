import { useState, useEffect } from 'react'
import { Plus, Search, Loader2, Edit2, Trash2, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Country {
  id: string
  country_name: string
  is_active: boolean
}

export default function Countries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [formData, setFormData] = useState({
    country_name: '',
    is_active: true
  })

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCountries = async () => {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('countries')
        .select('*')
        .order('country_name')
      if (data) setCountries(data)
    } catch (error) {
      console.error('Error fetching countries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.country_name.trim()) return
    try {
      if (editingCountry) {
        const { error } = await supabase
          .from('countries')
          .update({
            country_name: formData.country_name,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCountry.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('countries')
          .insert(formData)
        if (error) throw error
      }
      fetchCountries()
      closeModal()
    } catch (error) {
      console.error('Error saving country:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this country?')) return
    try {
      const { error } = await supabase.from('countries').delete().eq('id', id)
      if (error) throw error
      setCountries(countries.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting country:', error)
    }
  }

  const openModal = (country?: Country) => {
    if (country) {
      setEditingCountry(country)
      setFormData({
        country_name: country.country_name,
        is_active: country.is_active
      })
    } else {
      setEditingCountry(null)
      setFormData({ country_name: '', is_active: true })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCountry(null)
  }

  const filteredCountries = countries.filter(c =>
    c.country_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <button onClick={() => openModal()} style={styles.addBtn}>
          <Plus size={16} /> Add Country
        </button>
      </div>

      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Country Name</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCountries.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ ...styles.td, textAlign: 'center', color: 'var(--text-muted)' }}>
                  No countries found
                </td>
              </tr>
            ) : (
              filteredCountries.map((country) => (
                <tr key={country.id} style={styles.tr}>
                  <td style={styles.td}>{country.country_name}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      ...styles.statusBadge, 
                      backgroundColor: country.is_active ? '#4CAF50' : '#9E9E9E' 
                    }}>
                      {country.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button onClick={() => openModal(country)} style={styles.editBtn}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(country.id)} style={styles.deleteBtn}>
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
              <h3>{editingCountry ? 'Edit Country' : 'Add Country'}</h3>
              <button onClick={closeModal} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Country Name *</label>
                <input
                  type="text"
                  value={formData.country_name}
                  onChange={(e) => setFormData({ ...formData, country_name: e.target.value })}
                  placeholder="e.g. United States"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    style={styles.checkbox}
                  />
                  Active
                </label>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={closeModal} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSubmit} style={styles.saveBtn}>
                {editingCountry ? 'Update' : 'Create'}
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
