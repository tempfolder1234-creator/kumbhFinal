import React from "react";
import { Globe, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="sh-footer">
      <div className="sh-container sh-footer-content">
        <div className="sh-footer-left">
          <span>&copy; {new Date().getFullYear()} StayHub, Inc.</span>
          <span className="sh-dot">&middot;</span>
          <a href="#privacy">Privacy</a>
          <span className="sh-dot">&middot;</span>
          <a href="#terms">Terms</a>
          <span className="sh-dot">&middot;</span>
          <a href="#destinations">Nashik Destinations</a>
        </div>

        <div className="sh-footer-right">
          <div className="sh-footer-locale">
            <Globe size={16} />
            <span>English (IN)</span>
            <span className="sh-currency">&#8377; INR</span>
          </div>

          <div className="sh-footer-socials">
            <a 
              href="https://www.facebook.com/people/StayHub/61573598655942/?sk=photos" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/stayhub04/" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a 
              href="https://in.pinterest.com/hj05102006/" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Pinterest"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.057.235-.188.285-.433.172-1.616-.752-2.624-3.111-2.624-5.008 0-4.077 2.962-7.822 8.543-7.822 4.485 0 7.971 3.2 7.971 7.472 0 4.46-2.809 8.049-6.708 8.049-1.31 0-2.541-.681-2.963-1.488l-.807 3.076c-.292 1.116-1.082 2.515-1.611 3.374 1.173.362 2.417.558 3.708.558 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .sh-footer {
          margin-top: auto;
          background: #F7F7F7;
          border-top: 1px solid var(--sh-border-light);
          padding: 24px 0;
          font-size: 0.875rem;
          color: var(--sh-text-secondary);
        }

        .sh-footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }

        .sh-footer-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .sh-dot {
          color: var(--sh-border);
        }

        .sh-footer-left a:hover {
          text-decoration: underline;
          color: var(--sh-text-primary);
        }

        .sh-footer-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .sh-footer-locale {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: var(--sh-text-primary);
        }

        .sh-currency {
          margin-left: 4px;
        }

        .sh-footer-socials {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .sh-footer-socials a {
          color: var(--sh-text-primary);
          transition: transform var(--sh-transition-fast), color var(--sh-transition-fast);
          display: flex;
          align-items: center;
        }

        .sh-footer-socials a:hover {
          color: var(--sh-primary);
          transform: translateY(-2px);
        }
      `}</style>
    </footer>
  );
}
