// src/components/Hamburger.jsx
export default function Hamburger({ isOpen, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 5,
        width: 32,
        height: 32,
        color: '#ffff'
      }}
    >
      <span
        style={{
          display: 'block',
          width: 24,
          height: 2,
          background: 'currentColor',
          borderRadius: 2,
          transition: 'transform 0.25s ease, opacity 0.25s ease',
          transform: isOpen ? 'translateY(7px) rotate(45deg)' : 'none',
        }}
      />
      <span
        style={{
          display: 'block',
          width: 24,
          height: 2,
          background: 'currentColor',
          borderRadius: 2,
          transition: 'opacity 0.2s ease',
          opacity: isOpen ? 0 : 1,
        }}
      />
      <span
        style={{
          display: 'block',
          width: 24,
          height: 2,
          background: 'currentColor',
          borderRadius: 2,
          transition: 'transform 0.25s ease, opacity 0.25s ease',
          transform: isOpen ? 'translateY(-7px) rotate(-45deg)' : 'none',
        }}
      />
    </button>
  )
}