"use client";

import Image from "next/image";
import Frame, { lines } from "./Frame";

export default function About() {
  return (
    <section className="section about" id="about">
      <Frame at={lines(6)} />
      <div className="container">
        <div className="section__head inset">
          <h2 className="heading" data-reveal>
            What we do
          </h2>
        </div>

        <div className="about__canvas-wrap">
          <div className="about__canvas">
            {/* SVG Background Layer (Grid lines, stars, dashed curves, bottom hexagon) */}
            <svg
              viewBox="300 120 1880 1760"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="about__canvas-svg"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Pink Grid 1 (Top Left) */}
              <g opacity="0.45">
                <line x1="350" y1="343" x2="964" y2="343" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="350" y1="405" x2="964" y2="405" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="350" y1="467" x2="964" y2="467" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="350" y1="528" x2="964" y2="528" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="350" y1="589" x2="964" y2="589" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="350" y1="651" x2="964" y2="651" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="350" y1="712" x2="964" y2="712" stroke="#F9858E" strokeWidth="2.5" />

                <line x1="410" y1="343" x2="410" y2="712" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="470" y1="343" x2="470" y2="712" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="533" y1="343" x2="533" y2="712" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="595" y1="343" x2="595" y2="712" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="656" y1="343" x2="656" y2="712" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="717" y1="343" x2="717" y2="712" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="778" y1="343" x2="778" y2="712" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="840" y1="343" x2="840" y2="712" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="902" y1="343" x2="902" y2="712" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="964" y1="343" x2="964" y2="712" stroke="#F9858E" strokeWidth="2.5" />
              </g>

              {/* Pink Star 1 */}
              <g transform="translate(-124, -55)">
                <path
                  d="M636.938 538.465L655.036 565.219L675.446 540.021L668.386 571.131L701.521 567.063L673.439 584.305L699.888 603.75L667.234 597.025L671.504 628.593L653.406 601.838L632.996 627.037L640.055 595.927L606.921 599.995L635.003 582.753L608.553 563.307L641.208 570.033L636.938 538.465Z"
                  fill="#F9858E"
                  className="about__star"
                />
              </g>

              {/* Pink Grid 2 (Middle Right) */}
              <g opacity="0.45">
                <line x1="1573" y1="934" x2="2123" y2="934" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1573" y1="997" x2="2123" y2="997" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1573" y1="1057" x2="2123" y2="1057" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1573" y1="1120" x2="2123" y2="1120" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1573" y1="1182" x2="2123" y2="1182" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1573" y1="1244" x2="2123" y2="1244" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1573" y1="1303" x2="2123" y2="1303" stroke="#F9858E" strokeWidth="2.5" />

                <line x1="1629" y1="934" x2="1629" y2="1303" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1691" y1="934" x2="1691" y2="1303" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1754" y1="934" x2="1754" y2="1303" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1815" y1="934" x2="1815" y2="1303" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1877" y1="934" x2="1877" y2="1303" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1938" y1="934" x2="1938" y2="1303" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="1998" y1="934" x2="1998" y2="1303" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="2061" y1="934" x2="2061" y2="1303" stroke="#F9858E" strokeWidth="2.5" />
                <line x1="2123" y1="934" x2="2123" y2="1303" stroke="#F9858E" strokeWidth="2.5" />
              </g>

              {/* Pink Star 2 */}
              <path
                d="M1914.78 1204.02L1915.95 1205.75L1917.23 1204.16L1933.52 1184.05L1927.91 1208.78L1927.43 1210.87L1929.61 1210.6L1955.86 1207.38L1933.61 1221.04L1931.77 1222.18L1933.55 1223.49L1954.57 1238.94L1928.51 1233.57L1926.46 1233.15L1926.73 1235.19L1930.15 1260.46L1915.66 1239.04L1914.5 1237.31L1913.21 1238.9L1896.92 1259.01L1902.54 1234.28L1903.01 1232.19L1900.83 1232.45L1874.58 1235.68L1896.83 1222.02L1898.68 1220.88L1896.89 1219.57L1875.87 1204.12L1901.93 1209.49L1903.99 1209.91L1903.71 1207.87L1900.29 1182.6L1914.78 1204.02Z"
                fill="#F9858E"
                stroke="#F9858E"
                strokeWidth="1.5"
                className="about__star"
              />

              {/* Dashed Connecting Curve 1 */}
              <path
                d="M1032.64 424C1068.61 495.936 1350.22 688.056 1362.57 555.626C1365.19 527.63 1335.49 471.902 1299.59 491.774C1264.74 511.068 1249.76 576.389 1240.97 610.978C1216.32 707.969 1253.9 797.879 1350.37 832.389C1422.11 858.051 1506.18 860.308 1573.96 828.03"
                stroke="#F9858E"
                strokeOpacity="0.85"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray="10 10"
                className="about__curve"
              />

              {/* Dashed Connecting Curve 2 */}
              <path
                d="M1457.14 1104.99C1346.96 1215.17 1181.6 1247.33 1033.74 1277.67C1006.63 1283.23 981.94 1287.53 956.014 1296.17"
                stroke="#F9858E"
                strokeOpacity="0.85"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray="10 10"
                className="about__curve"
              />

              {/* Dashed Connecting Curve 3 */}
              <path
                d="M841.534 1550C840.629 1550.69 823.318 1562.56 823.642 1563.7C828.908 1582.37 843.983 1597.04 857.142 1611.29C898.637 1656.24 943.129 1696.33 997.996 1725.12C1110.37 1784.07 1238.47 1806.31 1359.14 1790"
                stroke="#F9858E"
                strokeOpacity="0.85"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeDasharray="10 10"
                className="about__curve"
              />

              {/* Bottom Pink Hexagon */}
              <path
                d="M1441.62 1753.45L1463.53 1798.95L1435.08 1840.67L1384.72 1836.9L1362.81 1791.4L1391.26 1749.67L1441.62 1753.45Z"
                fill="#F9858E"
                className="about__hexagon"
              />
            </svg>

            {/* Overlaid HTML Elements matching exact relative percentages */}

            {/* TOP LEFT: Polaroid 1 */}
            <div className="about__node about__node--polaroid-1">
              <div className="polaroid polaroid--tilt-left">
                <div className="polaroid__photo">
                  <Image
                    src="/about/polaroid-1.jpg"
                    alt="UW PM execs at ProdCon ‘22!"
                    fill
                    sizes="380px"
                    className="polaroid__img"
                  />
                </div>
                <p className="polaroid__caption">UW PM execs at ProdCon ‘22!</p>
              </div>
            </div>

            {/* TOP RIGHT: Educate Text */}
            <div className="about__node about__node--educate-text text-right">
              <h3 className="about__heading">Educate</h3>
              <p className="about__description">
                Providing resources & training
                <br />
                of product management skills
              </p>
            </div>

            {/* MIDDLE LEFT: Exposure Text */}
            <div className="about__node about__node--exposure-text text-left">
              <h3 className="about__heading">Exposure</h3>
              <p className="about__description">
                Access to open opportunities
                <br />
                in Canada & the US
              </p>
            </div>

            {/* MIDDLE RIGHT: Polaroid 2 */}
            <div className="about__node about__node--polaroid-2">
              <div className="polaroid polaroid--tilt-right">
                <div className="polaroid__photo">
                  <Image
                    src="/about/polaroid-2.jpg"
                    alt="UW PM execs at ProdCon ‘22!"
                    fill
                    sizes="380px"
                    className="polaroid__img"
                  />
                </div>
                <p className="polaroid__caption">UW PM execs at ProdCon ‘22!</p>
              </div>
            </div>

            {/* BOTTOM LEFT: Polaroid 3 */}
            <div className="about__node about__node--polaroid-3">
              <div className="polaroid polaroid--tilt-slight">
                <div className="polaroid__photo">
                  <Image
                    src="/about/polaroid-3.jpg"
                    alt="UW PM execs at ProdCon ‘22!"
                    fill
                    sizes="380px"
                    className="polaroid__img"
                  />
                </div>
                <p className="polaroid__caption">UW PM execs at ProdCon ‘22!</p>
              </div>
            </div>

            {/* BOTTOM RIGHT: Network Text */}
            <div className="about__node about__node--network-text text-right">
              <h3 className="about__heading">Network</h3>
              <p className="about__description">
                Connecting students and alumni
                <br />
                in the industry
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
