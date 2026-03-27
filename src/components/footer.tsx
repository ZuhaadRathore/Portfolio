'use client'

export default function Footer() {
  return (
    <footer className="footer">
      {/* Torn paper edge — overlaps the last section, revealing the dark beneath */}
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="tear-edge"
      >
        <path
          d="M 0,80 L 0,50 L 22,46 L 35,52 L 48,43 L 60,48 L 72,40 L 85,44 L 98,56
             L 110,46 L 122,42 L 135,24 L 148,44 L 160,50 L 172,40 L 185,46 L 198,54
             L 210,44 L 222,40 L 234,48 L 246,38 L 258,44 L 272,52 L 285,42 L 298,28
             L 312,46 L 325,52 L 338,44 L 350,40 L 362,48 L 375,38 L 388,44 L 400,58
             L 412,46 L 425,30 L 438,48 L 450,44 L 462,52 L 474,40 L 486,46 L 498,38
             L 510,44 L 522,54 L 535,42 L 548,26 L 560,46 L 572,52 L 584,42 L 596,38
             L 608,46 L 620,56 L 632,44 L 644,40 L 656,48 L 668,38 L 680,44 L 692,28
             L 705,48 L 718,54 L 730,44 L 742,40 L 754,48 L 766,36 L 778,44 L 790,52
             L 802,42 L 814,22 L 828,46 L 840,52 L 852,44 L 864,40 L 876,48 L 888,38
             L 900,46 L 912,56 L 925,44 L 938,30 L 950,48 L 962,44 L 974,52 L 986,42
             L 998,38 L 1010,46 L 1022,54 L 1035,42 L 1048,26 L 1060,48 L 1072,44
             L 1084,52 L 1096,40 L 1108,46 L 1120,38 L 1132,44 L 1145,56 L 1157,44
             L 1170,30 L 1182,48 L 1194,44 L 1206,52 L 1218,40 L 1230,46 L 1242,54
             L 1255,42 L 1268,28 L 1280,48 L 1292,44 L 1304,52 L 1316,38 L 1328,46
             L 1340,40 L 1352,48 L 1364,36 L 1376,44 L 1390,50 L 1410,44 L 1440,48
             L 1440,80 Z"
          fill="var(--ink)"
        />
      </svg>

      <div className="footer-logo">ZUHAAD.</div>
      <div className="footer-links">
        <a href="https://github.com/ZuhaadRathore" target="_blank" rel="noopener noreferrer">
          GITHUB
        </a>
        <a href="https://linkedin.com/in/zuhaad-rathore" target="_blank" rel="noopener noreferrer">
          LINKEDIN
        </a>
        <a href="mailto:zuhaad@example.com">EMAIL</a>
      </div>

      <style jsx>{`
        .footer {
          background: var(--ink);
          color: var(--paper);
          padding: 4rem 2rem;
          text-align: center;
          position: relative;
          z-index: 100;
        }

        .tear-edge {
          display: block;
          width: 100%;
          height: 80px;
          margin-top: -80px;
        }

        .footer-logo {
          font-family: var(--font-display);
          font-size: 5rem;
          margin-bottom: 2rem;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          font-family: var(--font-mono);
        }

        .footer-links a {
          color: var(--paper);
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: var(--red);
        }

        @media (max-width: 768px) {
          .footer-logo {
            font-size: 3rem;
          }

          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </footer>
  )
}
