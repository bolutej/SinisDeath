import { useEffect, useState } from 'react'

import image1 from '../assets/1.jpeg'
import image2 from '../assets/2.jpeg'
import image3 from '../assets/3.jpeg'
import image4 from '../assets/4.jpeg'
import image5 from '../assets/5.jpeg'
import image6 from '../assets/6.jpeg'
import image7 from '../assets/7.jpeg'
import image8 from '../assets/8.jpeg'
import image9 from '../assets/9.jpeg'
import image10 from '../assets/10.jpeg'

const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10]

export default function BackgroundCarousel({ children }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
    <style>{styles}</style>
    <div className="background-carousel">

      {/* Background images */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`background-slide ${
            index === active ? 'active' : ''
          }`}
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div className="background-overlay" />

      {/* Your actual page */}
      <div className="background-content">
        {children}
      </div>

    </div>
    </>
  )
}

const styles = `
    .background-carousel {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #000;
}

.background-slide {
  position: fixed;
  inset: 0;

  width: 100%;
  height: 100%;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  opacity: 0;
  transform: scale(1.05);

  transition:
    opacity 1.2s ease,
    transform 6s ease;

  z-index: 0;
}

.background-slide.active {
  opacity: 1;
  transform: scale(1);
}

.background-overlay {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.45);

  z-index: 1;
  pointer-events: none;
}

.background-content {
  position: relative;
  z-index: 2;

  min-height: 100vh;
}
`