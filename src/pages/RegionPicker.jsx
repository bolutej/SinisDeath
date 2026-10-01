// src/components/RegionPicker.jsx

import { useRegion } from '../context/RegionContext'

function Flag({ country }) {
  if (country === 'Nigeria') {
    return (
      <svg viewBox="0 0 60 40" className="flag-svg">
        <rect width="60" height="40" rx="6" fill="#fff" />
        <rect width="20" height="40" rx="6" fill="#008751" />
        <rect x="40" width="20" height="40" rx="6" fill="#008751" />
      </svg>
    )
  }

  if (country === 'United States') {
    return (
      <svg viewBox="0 0 60 40" className="flag-svg">
        <rect width="60" height="40" rx="6" fill="#fff" />

        <path
          d="
            M0 0h60v3.08H0z
            M0 6.15h60v3.08H0z
            M0 12.31h60v3.08H0z
            M0 18.46h60v3.08H0z
            M0 24.62h60v3.08H0z
            M0 30.77h60v3.08H0z
            M0 36.92h60V40H0z
          "
          fill="#b22234"
        />

        <rect
          width="27"
          height="21.5"
          rx="4"
          fill="#3c3b6e"
        />

        <g fill="#fff">
          <circle cx="5" cy="4" r="1" />
          <circle cx="10" cy="4" r="1" />
          <circle cx="15" cy="4" r="1" />
          <circle cx="20" cy="4" r="1" />

          <circle cx="7.5" cy="8" r="1" />
          <circle cx="12.5" cy="8" r="1" />
          <circle cx="17.5" cy="8" r="1" />
          <circle cx="22.5" cy="8" r="1" />

          <circle cx="5" cy="12" r="1" />
          <circle cx="10" cy="12" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="20" cy="12" r="1" />

          <circle cx="7.5" cy="16" r="1" />
          <circle cx="12.5" cy="16" r="1" />
          <circle cx="17.5" cy="16" r="1" />
          <circle cx="22.5" cy="16" r="1" />
        </g>
      </svg>
    )
  }

  if (country === 'United Kingdom') {
    return (
      <svg viewBox="0 0 60 40" className="flag-svg">
        <defs>
          <clipPath id="ukClip">
            <rect width="60" height="40" rx="6" />
          </clipPath>
        </defs>

        <g clipPath="url(#ukClip)">
          <rect width="60" height="40" fill="#012169" />

          <path
            d="M0 0L60 40M60 0L0 40"
            stroke="#fff"
            strokeWidth="10"
          />

          <path
            d="M0 0L60 40M60 0L0 40"
            stroke="#c8102e"
            strokeWidth="5"
          />

          <path
            d="M30 0V40M0 20H60"
            stroke="#fff"
            strokeWidth="14"
          />

          <path
            d="M30 0V40M0 20H60"
            stroke="#c8102e"
            strokeWidth="8"
          />
        </g>
      </svg>
    )
  }

  if (country === 'Canada') {
    return (
      <svg viewBox="0 0 60 40" className="flag-svg">
        <rect width="60" height="40" rx="6" fill="#fff" />

        <path
          d="M0 0h15v40H0zM45 0h15v40H45z"
          fill="#d52b1e"
        />

        <path
          d="
            M30 8
            l2.2 5
            5-1.8
            -2.5 4.5
            5 2.2
            -6 1
            1 6
            -4.7-3
            -4.7 3
            1-6
            -6-1
            5-2.2
            -2.5-4.5
            5 1.8z
          "
          fill="#d52b1e"
        />
      </svg>
    )
  }

  if (country === 'Ghana') {
    return (
      <svg viewBox="0 0 60 40" className="flag-svg">
        <defs>
          <clipPath id="ghanaClip">
            <rect width="60" height="40" rx="6" />
          </clipPath>
        </defs>

        <g clipPath="url(#ghanaClip)">
          <rect width="60" height="13.33" fill="#ce1126" />
          <rect y="13.33" width="60" height="13.34" fill="#fcd116" />
          <rect y="26.67" width="60" height="13.33" fill="#006b3f" />

          <path
            d="
              M30 16
              l2.1 6.2
              h6.6
              l-5.3 3.8
              2 6.2
              -5.4-3.8
              -5.4 3.8
              2-6.2
              -5.3-3.8
              h6.6z
            "
            fill="#000"
          />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 60 40" className="flag-svg">
      <rect
        width="60"
        height="40"
        rx="6"
        fill="#f1f3f5"
      />
    </svg>
  )
}


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

          <div className="region-heading">

            <span className="region-eyebrow">
              STORE SETTINGS
            </span>

            <h3>
              Choose your region
            </h3>

            <p>
              Select your location to view prices
              in your local currency.
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

            const selected =
              r.code === regionCode

            return (
              <button
                key={r.code}
                className={`region-option ${
                  selected ? 'selected' : ''
                }`}
                onClick={() =>
                  chooseRegion(r.code)
                }
              >

                {/* FLAG */}
                <div className="region-flag">
                  <Flag country={r.label} />
                </div>


                {/* INFO */}
                <div className="region-info">

                  <span className="region-name">
                    {r.label}
                  </span>

                  <span className="region-details">

                    <span>
                      {r.currency}
                    </span>

                    <span className="region-dot">
                      •
                    </span>

                    <span>
                      {r.symbol || ''}
                    </span>

                  </span>

                </div>


                {/* CHECK */}
                <div
                  className={`region-check ${
                    selected ? 'visible' : ''
                  }`}
                >
                  {selected && '✓'}
                </div>

              </button>
            )
          })}

        </div>


        {/* FOOTER */}
        <div className="region-footer">

          <div className="region-info-icon">
            i
          </div>

          <span>
            You can change this anytime.
          </span>

        </div>


        <style>{`

          /* =========================
             OVERLAY
          ========================= */

          .region-overlay {
            position: fixed;
            inset: 0;
            z-index: 1000;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 24px;

            background:
              rgba(15, 18, 24, 0.48);

            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);

            animation:
              regionFadeIn 0.22s ease;
          }


          /* =========================
             MODAL
          ========================= */

          .region-modal {
            width: 520px;
            max-width: 100%;

            overflow: hidden;

            background: #fff;
            color: #111318;

            border: 1px solid #e8ebf0;
            border-radius: 24px;

            box-shadow:
              0 30px 80px
              rgba(0, 0, 0, 0.16),

              0 8px 25px
              rgba(0, 0, 0, 0.06);

            animation:
              regionModalIn
              0.28s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              );
          }


          /* =========================
             HEADER
          ========================= */

          .region-header {
            position: relative;

            display: flex;
            justify-content: space-between;

            padding:
              34px
              34px
              28px;

            border-bottom:
              1px solid #eef0f3;
          }

          .region-heading {
            padding-right: 45px;
          }

          .region-eyebrow {
            display: block;

            margin-bottom: 10px;

            font-size: 10px;
            font-weight: 700;

            letter-spacing: 0.18em;

            color: #8a919d;
          }

          .region-header h3 {
            margin: 0;

            font-size: 28px;
            line-height: 1.15;

            font-weight: 600;

            letter-spacing: -0.035em;

            color: #111318;
          }

          .region-header p {
            max-width: 390px;

            margin:
              10px
              0
              0;

            font-size: 13px;
            line-height: 1.6;

            color: #737b88;
          }


          /* =========================
             CLOSE
          ========================= */

          .region-close {
            position: absolute;

            top: 25px;
            right: 25px;

            width: 40px;
            height: 40px;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 0;

            border:
              1px solid #e4e7ec;

            border-radius: 50%;

            background: #fff;
            color: #737a86;

            font-size: 25px;
            font-weight: 300;

            line-height: 1;

            cursor: pointer;

            transition:
              background 0.2s ease,
              color 0.2s ease,
              border-color 0.2s ease,
              transform 0.2s ease;
          }

          .region-close:hover {
            background: #f4f5f7;

            color: #111318;

            border-color: #d9dde3;

            transform:
              rotate(5deg);
          }


          /* =========================
             LIST
          ========================= */

          .region-list {
            display: flex;
            flex-direction: column;

            gap: 10px;

            padding:
              22px
              24px;
          }


          /* =========================
             OPTION
          ========================= */

          .region-option {
            width: 100%;

            display: flex;
            align-items: center;

            gap: 16px;

            padding:
              15px
              16px;

            border:
              1px solid #e8ebef;

            border-radius: 16px;

            background: #fff;

            color: #111318;

            cursor: pointer;

            text-align: left;

            transition:
              border-color 0.2s ease,
              background 0.2s ease,
              box-shadow 0.2s ease,
              transform 0.2s ease;
          }

          .region-option:hover {
            border-color: #cfd4dc;

            background: #fafbfc;

            box-shadow:
              0 5px 18px
              rgba(0, 0, 0, 0.05);

            transform:
              translateY(-1px);
          }

          .region-option.selected {
            border-color: #d9dfe7;

            background: #f5f7fa;

            box-shadow:
              inset
              0 0 0 1px
              rgba(17, 19, 24, 0.02);
          }


          /* =========================
             FLAG
          ========================= */

          .region-flag {
            width: 58px;
            height: 42px;

            flex-shrink: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            overflow: hidden;

            border-radius: 8px;

            background: #f4f5f7;

            box-shadow:
              0 1px 4px
              rgba(0, 0, 0, 0.12);
          }

          .flag-svg {
            width: 100%;
            height: 100%;

            display: block;
          }


          /* =========================
             INFO
          ========================= */

          .region-info {
            min-width: 0;

            flex: 1;

            display: flex;
            flex-direction: column;

            gap: 5px;
          }

          .region-name {
            font-size: 15px;
            font-weight: 600;

            letter-spacing:
              -0.01em;

            color: #16191f;
          }

          .region-details {
            display: flex;
            align-items: center;

            gap: 7px;

            font-size: 12px;
            font-weight: 500;

            color: #818995;
          }

          .region-dot {
            color: #b5bac2;
          }


          /* =========================
             CHECK
          ========================= */

          .region-check {
            width: 28px;
            height: 28px;

            flex-shrink: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            border:
              1.5px solid #cbd1d9;

            border-radius: 50%;

            color: transparent;

            font-size: 13px;
            font-weight: 700;

            transition:
              background 0.2s ease,
              border-color 0.2s ease,
              color 0.2s ease,
              transform 0.2s ease;
          }

          .region-check.visible {
            border-color: #171a20;

            background: #171a20;

            color: #fff;

            transform:
              scale(1.05);
          }


          /* =========================
             FOOTER
          ========================= */

          .region-footer {
            margin:
              0
              24px
              24px;

            display: flex;
            align-items: center;

            gap: 12px;

            padding:
              15px
              17px;

            border-radius: 14px;

            background: #f6f8fa;

            color: #747c88;

            font-size: 11px;
            line-height: 1.5;
          }

          .region-info-icon {
            width: 22px;
            height: 22px;

            flex-shrink: 0;

            display: flex;
            align-items: center;
            justify-content: center;

            border:
              1.5px solid #aeb5bf;

            border-radius: 50%;

            font-size: 12px;
            font-weight: 600;
          }


          /* =========================
             ANIMATION
          ========================= */

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

              transform:
                translateY(14px)
                scale(0.97);
            }

            to {
              opacity: 1;

              transform:
                translateY(0)
                scale(1);
            }

          }


          /* =========================
             MOBILE
          ========================= */

          @media (max-width: 600px) {

            .region-overlay {
              align-items: flex-end;

              padding: 10px;
            }

            .region-modal {
              width: 100%;

              border-radius: 22px;
            }

            .region-header {
              padding:
                27px
                22px
                23px;
            }

            .region-header h3 {
              font-size: 23px;
            }

            .region-header p {
              font-size: 12px;
            }

            .region-close {
              top: 19px;
              right: 19px;

              width: 36px;
              height: 36px;
            }

            .region-list {
              gap: 8px;

              padding:
                17px
                16px;
            }

            .region-option {
              padding: 13px;

              border-radius: 14px;
            }

            .region-flag {
              width: 52px;
              height: 38px;
            }

            .region-name {
              font-size: 14px;
            }

            .region-details {
              font-size: 11px;
            }

            .region-check {
              width: 26px;
              height: 26px;
            }

            .region-footer {
              margin:
                0
                16px
                16px;
            }

          }

        `}</style>

      </div>
    </div>
  )
}