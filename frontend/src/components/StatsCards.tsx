import { Users, Star, TrendingUp, MessageSquare } from 'lucide-react'

const stats = [
  { icon: Users, label: 'Total Guests', value: '1,234', change: '+12%', color: '#006239' },
  { icon: Star, label: 'Average Rating', value: '4.8', change: '+0.2', color: '#FFB800' },
  { icon: TrendingUp, label: 'Bookings', value: '89', change: '+8%', color: '#006239' },
  { icon: MessageSquare, label: 'Total Reviews', value: '456', change: '+24%', color: '#006239' },
]

export default function StatsCards() {
  return (
    <div style={styles.grid}>
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{ ...styles.iconWrapper, backgroundColor: stat.color + '20' }}>
                <Icon size={20} style={{ color: stat.color }} />
              </div>
              <span style={styles.change}>{stat.change}</span>
            </div>
            <div style={styles.value}>{stat.value}</div>
            <div style={styles.label}>{stat.label}</div>
          </div>
        )
      })}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '32px',
  },
  card: {
    backgroundColor: '#1E1E1E',
    padding: '24px',
    borderRadius: '0px',
    border: '1px solid #333',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  iconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  change: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#006239',
    backgroundColor: '#00623920',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  value: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#FAFAFA',
    marginBottom: '4px',
  },
  label: {
    fontSize: '12px',
    color: '#888',
    fontWeight: 500,
  },
}
