import { Star, MoreHorizontal } from 'lucide-react'

const reviews = [
  { id: 1, guest: 'John Smith', rating: 5, date: '2024-01-15', comment: 'Excellent stay! Very clean and comfortable.', status: 'Published' },
  { id: 2, guest: 'Sarah Johnson', rating: 4, date: '2024-01-14', comment: 'Great location, friendly staff. Would recommend.', status: 'Published' },
  { id: 3, guest: 'Michael Brown', rating: 5, date: '2024-01-13', comment: 'Amazing experience! Will definitely come back.', status: 'Published' },
  { id: 4, guest: 'Emily Davis', rating: 3, date: '2024-01-12', comment: 'Decent stay but could use some improvements.', status: 'Pending' },
  { id: 5, guest: 'David Wilson', rating: 4, date: '2024-01-11', comment: 'Very good value for money. Nice amenities.', status: 'Published' },
]

export default function ReviewTable() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Guest Reviews</h2>
        <button style={styles.addButton}>Add Review</button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tr}>
            <th style={styles.th}>Guest</th>
            <th style={styles.th}>Rating</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Comment</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id} style={styles.tr}>
              <td style={styles.td}>
                <div style={styles.guest}>
                  <div style={styles.avatar}>{review.guest.charAt(0)}</div>
                  <span style={styles.guestName}>{review.guest}</span>
                </div>
              </td>
              <td style={styles.td}>
                <div style={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < review.rating ? '#FFB800' : 'none'}
                      color={i < review.rating ? '#FFB800' : '#444'}
                    />
                  ))}
                </div>
              </td>
              <td style={styles.td}>{review.date}</td>
              <td style={{ ...styles.td, maxWidth: '300px' }}>{review.comment}</td>
              <td style={styles.td}>
                <span style={{
                  ...styles.status,
                  backgroundColor: review.status === 'Published' ? '#00623920' : '#FFB80020',
                  color: review.status === 'Published' ? '#006239' : '#FFB800',
                }}>
                  {review.status}
                </span>
              </td>
              <td style={styles.td}>
                <button style={styles.moreButton}>
                  <MoreHorizontal size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: '0px',
    border: '1px solid #333',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #333',
  },
  title: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#FAFAFA',
    margin: 0,
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#006239',
    color: '#FAFAFA',
    border: 'none',
    borderRadius: '0px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tr: {
    borderBottom: '1px solid #333',
  },
  th: {
    textAlign: 'left',
    padding: '16px 24px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '16px 24px',
    fontSize: '14px',
    color: '#FAFAFA',
  },
  guest: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#006239',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FAFAFA',
    fontSize: '14px',
    fontWeight: 600,
  },
  guestName: {
    fontWeight: 500,
  },
  rating: {
    display: 'flex',
    gap: '2px',
  },
  status: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
  },
  moreButton: {
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    padding: '4px',
  },
}
