import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';

const WhatsAppButton = () => {
  const location = useLocation();
  const { isOpen } = useCart();

  const { footer } = useData();
  const waLink = footer?.whatsapp_link || "https://wa.me/919994617120";

  if (location.pathname === '/checkout' || isOpen) return null;

  return (
    <>
      <style>{`
        .wa-wrapper {
          position: fixed;
          bottom: 24px;
          left: 20px;
          z-index: 2000;
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .wa-circle {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: #25d366;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          z-index: 2;
        }
        .wa-circle svg {
          width: 26px;
          height: 26px;
          fill: #ffffff;
        }
        .wa-dot {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #e53e3e;
          border: 2px solid #ffffff;
        }
        .wa-label {
          background-color: #ffffff;
          border-radius: 999px;
          padding: 5px 12px 5px 13px;
          margin-left: 10px;
          color: #111111;
          font-size: 14px;
          font-weight: 600;
          font-family: Inter, sans-serif;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          z-index: 1;
          position: relative;
        }

        /* Mobile: smaller circle and text */
        @media (max-width: 640px) {
          .wa-wrapper {
            bottom: 80px;
            left: 14px;
          }
          .wa-circle {
            width: 40px;
            height: 40px;
          }
          .wa-circle svg {
            width: 22px;
            height: 22px;
          }
          .wa-dot {
            width: 8px;
            height: 8px;
            top: 1px;
            right: 1px;
          }
          .wa-label {
            font-size: 12px;
            padding: 5px 12px 5px 13px;
            margin-left: 8px;
          }
        }
      `}</style>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-wrapper"
      >
        {/* Green circle — rendered first so pill sits to its right */}
        <div className="wa-circle">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.2 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-65-157.1zM223.9 446.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.5-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 54 81.2 54 130.5 0 101.7-82.8 184.5-184.5 184.5zm100.5-137.4c-5.5-2.8-32.6-16.1-37.7-17.9-5.1-1.8-8.8-2.8-12.4 2.8s-14.3 17.9-17.5 21.6c-3.2 3.7-6.5 4.1-12 1.4-5.5-2.8-23.3-8.6-44.4-27.4-16.4-14.6-27.5-32.7-30.7-38.2-3.2-5.5-.3-8.6 2.5-11.3 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.2 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.4-29.9-17-41.1-4.5-11-9.1-9.5-12.4-9.7-3.2-.3-6.9-.3-10.6-.3-3.7 0-9.7 1.4-14.8 6.9-5.1 5.5-19.4 19-19.4 46.3 0 27.2 19.8 53.5 22.6 57.2 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.6-13.3 37.2-26.2s4.6-24 3.2-26.2c-1.4-2.2-5.1-3.6-10.6-6.4z" />
          </svg>
          {/* Red notification dot */}
          <span className="wa-dot" />
        </div>

        {/* White pill label — to the right of the circle */}
        <div className="wa-label">Chat with us</div>
      </a>
    </>
  );
};

export default WhatsAppButton;
