// src/components/RegionPicker.jsx
// src/components/RegionPicker.jsx

import { useRegion } from '../context/RegionContext'

export default function RegionPicker() {
  const {
    pickerOpen,
    setPickerOpen,
    chooseRegion,
    regionCode,
    REGIONS,
  } = useRegion()

  if (!pickerOpen) return null

  return (
    <div
      className="region-overlay"
      onClick={() => setPickerOpen(false)}
    >
      <div
        className="region-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="region-header">

          <div>
            <span className="region-eyebrow">
              STORE SETTINGS
            </span>

            <h3>
              Choose your region
            </h3>

            <p>
              Select your location to view prices in your local currency.
            </p>
          </div>

          <button
            className="region-close"
            onClick={() => setPickerOpen(false)}
            aria-label="Close region picker"
          >
            ×
          </button>

        </div>


        {/* REGIONS */}
        <div className="region-list">

          {REGIONS.map((r) => {
            const selected = r.code === regionCode

            return (
              <button
                key={r.code}
                className={`region-option ${
                  selected ? 'selected' : ''
                }`}
                onClick={() => chooseRegion(r.code)}
              >

                <span className="region-name">
                  {r.label}
                </span>

                <span className="region-meta">

                  <span className="region-currency">
                    {r.currency}
                  </span>

                  <span
                    className={`region-check ${
                      selected ? 'visible' : ''
                    }`}
                  >
                    ✓
                  </span>

                </span>

              </button>
            )
          })}

        </div>


        {/* FOOTER */}
        <div className="region-footer">
          <span>
            You can change this anytime.
          </span>
        </div>

      </div>


      <style>{`

        /* OVERLAY */

        .region-overlay {
          position: fixed;
          inset: 0;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 24px;

          background: rgba(0, 0, 0, 0.72);

          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);

          z-index: 1000;

          animation: regionFadeIn 0.2s ease;
        }


        /* MODAL */

        .region-modal {
          width: 440px;
          max-width: 100%;

          background: #0c0c0c;
          color: #fff;

          border: 1px solid rgba(255, 255, 255, 0.14);

          box-shadow:
            0 25px 80px rgba(0, 0, 0, 0.5);

          animation: regionModalIn 0.25s ease;
        }


        /* HEADER */

        .region-header {
          position: relative;

          padding: 30px 30px 25px;

          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .region-eyebrow {
          display: block;

          margin-bottom: 10px;

          font-size: 10px;
          font-weight: 500;

          letter-spacing: 0.16em;
          text-transform: uppercase;

          color: #777;
        }

        .region-header h3 {
          margin: 0;

          font-size: 25px;
          line-height: 1.15;

          font-weight: 500;
          letter-spacing: -0.02em;
        }

        .region-header p {
          max-width: 320px;

          margin: 10px 0 0;

          font-size: 13px;
          line-height: 1.6;

          color: #888;
        }


        /* CLOSE */

        .region-close {
          position: absolute;

          top: 20px;
          right: 20px;

          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 50%;

          background: transparent;

          color: #aaa;

          font-size: 23px;
          font-weight: 300;

          line-height: 1;

          cursor: pointer;

          transition:
            color 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .region-close:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.25);
        }


        /* LIST */

        .region-list {
          display: flex;
          flex-direction: column;

          padding: 14px 18px;
        }


        /* REGION */

        .region-option {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 15px 12px;

          border: 1px solid transparent;
          border-radius: 0;

          background: transparent;

          color: #fff;

          cursor: pointer;

          text-align: left;

          transition:
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .region-option:hover {
          background: rgba(255, 255, 255, 0.055);
          border-color: rgba(255, 255, 255, 0.08);
        }

        .region-option.selected {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }


        /* NAME */

        .region-name {
          font-size: 15px;
          font-weight: 400;

          letter-spacing: 0.01em;
        }


        /* RIGHT SIDE */

        .region-meta {
          display: flex;
          align-items: center;

          gap: 13px;
        }

        .region-currency {
          min-width: 38px;

          font-size: 11px;
          letter-spacing: 0.06em;

          text-align: right;

          color: #777;
        }


        /* CHECK */

        .region-check {
          width: 20px;
          height: 20px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 50%;

          color: transparent;

          font-size: 11px;

          transition:
            color 0.2s ease,
            background 0.2s ease,
            border-color 0.2s ease;
        }

        .region-check.visible {
          background: #fff;
          border-color: #fff;

          color: #111;
        }


        /* FOOTER */

        .region-footer {
          padding: 15px 30px 20px;

          border-top: 1px solid rgba(255, 255, 255, 0.08);

          font-size: 11px;

          color: #666;

          text-align: center;
        }


        /* ANIMATIONS */

        @keyframes regionFadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes regionModalIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }


        /* MOBILE */

        @media (max-width: 500px) {

          .region-overlay {
            padding: 16px;
          }

          .region-modal {
            width: 100%;
          }

          .region-header {
            padding: 26px 22px 22px;
          }

          .region-header h3 {
            font-size: 22px;
          }

          .region-list {
            padding: 12px;
          }

          .region-option {
            padding: 15px 10px;
          }

          .region-footer {
            padding: 14px 20px 18px;
          }

        }

      `}</style>
    </div>
  )
}