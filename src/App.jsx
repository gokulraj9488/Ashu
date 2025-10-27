import React, { useState, useEffect } from 'react';

// Focused on floral/insect emojis for a more cohesive effect.
const FLYING_EMOJIS = ['🐝', '🌸', '🌼', '🌻', '🦋']; 

// =========================================================
// FlyingEmojis Component
// =========================================================
function FlyingEmojis({ emojis, sourceRect }) {
  const [emojisToRender, setEmojisToRender] = useState([]);

  useEffect(() => {
    const newEmojis = [];
    const numEmojis = 200; // Reduced to 200

    for (let i = 0; i < numEmojis; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      
      const startX = sourceRect.x + sourceRect.width / 2 + (Math.random() * sourceRect.width * 0.1 - sourceRect.width * 0.05);
      const startY = sourceRect.y + sourceRect.height / 2 + (Math.random() * sourceRect.height * 0.1 - sourceRect.height * 0.05);
      
      // Calculate angle for radial movement (ensures spread around 360 degrees)
      const angle = (i / numEmojis) * 2 * Math.PI; 
      
      // Calculate travel distance (randomized for scattering effect)
      // Massive travel distance to push emojis OFF SCREEN (800px to 1200px)
      const travelDistance = Math.floor(Math.random() * 400 + 800); 
      
      // Use sin/cos for radial movement, and add a random jitter 
      const jitterX = (Math.random() * 200) * (Math.random() > 0.5 ? 1 : -1); 
      const jitterY = (Math.random() * 200) * (Math.random() > 0.5 ? 1 : -1);

      const travelX = (Math.cos(angle) * travelDistance) + jitterX; 
      const travelY = (Math.sin(angle) * travelDistance) + jitterY;
      
      const rotation = Math.floor(Math.random() * 720) * (Math.random() > 0.5 ? 1 : -1); 

      // UPDATED: Faster animation duration (2.5s to 5.0s)
      const duration = (2.5 + Math.random() * 2.5).toFixed(2); 

      newEmojis.push({ 
          id: `${emoji}-${Date.now()}-${i}`, 
          emoji, 
          startX, 
          startY, 
          travelX, 
          travelY,
          rotation,
          duration
      });
    }
    setEmojisToRender(newEmojis);

    // No return cleanup needed if emojis are not cleared by this component
    return () => {}; 
  }, [sourceRect, emojis]); 

  return (
    <div className="flying-emojis-layer">
      {emojisToRender.map(emojiData => (
        <span 
          key={emojiData.id} 
          className="flying-emoji"
          style={{
            left: `${emojiData.startX}px`,
            top: `${emojiData.startY}px`,
            
            '--travel-x': `${emojiData.travelX}px`, 
            '--travel-y': `${emojiData.travelY}px`,
            '--rotation': `${emojiData.rotation}deg`,
            
            animationDelay: `${Math.random() * 0.05}s`, // UPDATED: Reduced delay for instant trigger
            animationDuration: `${emojiData.duration}s`, // Variable duration for variable speed
          }}
        >
          {emojiData.emoji}
        </span>
      ))}
    </div>
  );
}

// =========================================================
// MAIN APP COMPONENT
// =========================================================
function App() {
  const [activePhotoPosition, setActivePhotoPosition] = useState(null); 
  const [key, setKey] = useState(0); 

  const handlePhotoInteraction = (e) => {
    if (e.type === 'touchstart') e.preventDefault(); 
    
    const rect = e.currentTarget.getBoundingClientRect();
    const collageRect = e.currentTarget.offsetParent.getBoundingClientRect();
    
    setActivePhotoPosition({
      x: rect.left - collageRect.left, 
      y: rect.top - collageRect.top,
      width: rect.width,
      height: rect.height,
    });
    setKey(prevKey => prevKey + 1); // Instant activation
  };

  const handlePhotoLeave = () => {
    // We are no longer clearing emojis on leave if they are meant to persist
  };

  return (
    <>
    <style>
      {`
        /* --- GLOBAL & BACKGROUND STYLES (Applies to ALL Screens) --- */
        html {
            height: 100%;
            width: 100%;
            /* FIX: Hide vertical scrolling from the html element */
            overflow-y: hidden;
        }

        /* Reset for the document body */
        body {
            margin: 0;
            padding: 0;
            background-color: transparent; 
            color: #333; 
            /* FIX: Hide vertical and horizontal scrolling from the body element */
            overflow: hidden; 
            height: 100%;
        }

        /* The root div where React mounts */
        #root {
            background-color: transparent;
            min-height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 0;
        }

        /* The main app container (Full-page background) */
        .app-container {
            width: 100vw;
            min-height: 100vh; 
            margin: 0;
            padding: 0;
            
            background-image: url('/white-paper-texture.jpg'); 
            
            /* FIX FOR ZOMMED/TILED BACKGROUND ON MOBILE */
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            
            /* FLEXBOX CENTERING: Centers the collage on ALL screen sizes */
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            z-index: 2; 
        }


        /* ================================================= */
        /* 2. MOBILE / DEFAULT LAYOUT (Applies up to 1023px) */
        /* ================================================= */

        .collage-container {
            position: relative; 
            
            width: 380px;        
            height: 500px;       
            max-width: 90vw;    

            margin: 0; 
            text-align: initial;
            z-index: 10;
            transform: translateZ(0); 
        }

        /* Basic styling for all photo elements (Polaroid look) */
        .photo {
            position: absolute; 
            width: 150px; 
            height: 150px; 
            object-fit: cover; 
            border: 10px solid white; 
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5); 
            transition: transform 0.3s ease; 
            z-index: 10;
        }

        /* Hover effect (Restored) */
        .photo:hover {
            transform: scale(1.08) rotate(0deg) !important; 
            z-index: 100; 
            cursor: pointer;
        }


        /* Mobile: Photo 1 (Top) */
        .photo-1 {
            top: 5%;           
            left: 5%;          
            transform: rotate(-10deg) translateZ(1px); 
            z-index: 20; 
        }

        /* Mobile: Photo 2 */
        .photo-2 {
            top: 25%;           
            right: 5%;          
            transform: rotate(15deg) translateZ(1px); 
            z-index: 18;
        }

        /* Mobile: Photo 3 */
        .photo-3 {
            top: 55%;           
            left: 0;            
            transform: rotate(-5deg) translateZ(1px); 
            z-index: 15;
        }

        /* Mobile: Photo 4 (Bottom) */
        .photo-4 {
            top: 75%;         
            right: 10%;         
            border: 10px solid black; 
            transform: rotate(10deg) translateZ(1px); 
            z-index: 12;
        }


        /* ================================================= */
        /* 3. DESKTOP LAYOUT (Applies to screens 1024px and wider) */
        /* ================================================= */

        @media (min-width: 1024px) {
            
            .collage-container {
                width: 700px;
                height: 500px;
                max-width: 90vw;
            }

            /* Photo 1: Top Left */
            .photo-1 {
                top: 0;
                left: 0;
                transform: rotate(-10deg) translateZ(1px);
                z-index: 20;
            }

            /* Photo 2: Top Right */
            .photo-2 {
                top: 50px; 
                right: 0; 
                transform: rotate(15deg) translateZ(1px);
                z-index: 18;
            }

            /* Photo 3: Bottom Center */
            .photo-3 {
                top: auto; 
                bottom: 0;
                left: 50%;
                transform: translateX(-50%) rotate(5deg) translateZ(1px);
                z-index: 15;
            }

            /* Photo 4: Bottom Right (POSITION UPDATED) */
            .photo-4 {
                display: block; 
                top: auto; 
                bottom: 20px; 
                
                left: auto; 
                right: 50px; 
                
                transform: rotate(-5deg) translateZ(1px); 
                z-index: 12;
                border: 10px solid black; 
            }
        }


        /* ================================================= */
        /* 4. NEW EMOJI STYLES AND ANIMATION */
        /* ================================================= */

        /* Layer that holds the emojis. This ensures all emojis are below the photos. */
        .flying-emojis-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1; 
        }

        /* Basic style for each flying emoji */
        .flying-emoji {
          position: absolute;
          font-size: 1.5rem; 
          opacity: 0; 
          pointer-events: none; 
          z-index: 1; 

          animation-name: flyOut;
          /* UPDATED: Uses variable duration from JS */
          animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
          animation-fill-mode: forwards; 
        }

        /* Keyframes for the custom "flying out" animation */
        @keyframes flyOut {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.8) rotate(0deg); 
          }
          20% {
            opacity: 1; 
            transform: translate(0, 0) scale(1) rotate(0deg); 
          }
          100% {
            /* UPDATED: Fade to 0 opacity for optimization */
            opacity: 0; 
            /* Radial movement: O-direction, pushed far off-screen */
            transform: translate(var(--travel-x), var(--travel-y)) 
                       scale(1.2) 
                       rotate(var(--rotation)); 
          }
        }
      `}
    </style>
    <div className="app-container">
      <div className="collage-container">
        
        {/* EMOJI SPAWNING AREA: Renders absolutely positioned emojis (MOVED TO THE TOP) */}
        {activePhotoPosition && (
          <FlyingEmojis 
            emojis={FLYING_EMOJIS} 
            sourceRect={activePhotoPosition} 
            key={key} 
          />
        )}
        
        {/* Photo 1: Event Handlers Added */}
        <img 
          src="/1.jpg" 
          alt="Collage Photo 1" 
          className="photo photo-1" 
          onMouseEnter={handlePhotoInteraction}
          onMouseLeave={handlePhotoLeave}
          onTouchStart={handlePhotoInteraction}
        />
        
        {/* Photo 2: Event Handlers Added */}
        <img 
          src="/2.jpg" 
          alt="Collage Photo 2" 
          className="photo photo-2" 
          onMouseEnter={handlePhotoInteraction}
          onMouseLeave={handlePhotoLeave}
          onTouchStart={handlePhotoInteraction}
        />
        
        {/* Photo 3: Event Handlers Added */}
        <img 
          src="/3.jpg" 
          alt="Collage Photo 3" 
          className="photo photo-3" 
          onMouseEnter={handlePhotoInteraction}
          onMouseLeave={handlePhotoLeave}
          onTouchStart={handlePhotoInteraction}
        />
        
        {/* Photo 4: Event Handlers Added */}
        <img 
          src="/4.jpg" 
          alt="Collage Photo 4" 
          className="photo photo-4" 
          onMouseEnter={handlePhotoInteraction}
          onMouseLeave={handlePhotoLeave}
          onTouchStart={handlePhotoInteraction}
        />
      </div>
    </div>
    </>
  );
}

export default App;
