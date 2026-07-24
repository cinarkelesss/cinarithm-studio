export default function FoundationsIllustration() {
  return (
    <div className="hidden lg:flex items-center justify-center">
      <svg
        width="500"
        height="320"
        viewBox="0 0 500 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-violet-300/60"
      >
        {/* Nokta Deseni */}
        {Array.from({ length: 6 }).map((_, y) =>
          Array.from({ length: 6 }).map((_, x) => (
            <circle
              key={`${x}-${y}`}
              cx={340 + x * 18}
              cy={40 + y * 18}
              r="1.5"
              fill="currentColor"
              opacity="0.25"
            />
          ))
        )}

        {/* Koordinat Sistemi */}
        <line
          x1="150"
          y1="160"
          x2="430"
          y2="160"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.25"
        />

        <line
          x1="290"
          y1="40"
          x2="290"
          y2="280"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.25"
        />

        {/* Ok */}
        <path
          d="M430 160 L422 154 M430 160 L422 166"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.35"
        />

        <path
          d="M290 40 L284 48 M290 40 L296 48"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.35"
        />

        {/* Fonksiyon Eğrisi */}
        <path
          d="
            M170 210
            C205 110 245 225 290 145
            S360 95 420 170
          "
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Yardımcı Eğri */}
        <path
          d="
            M175 215
            C210 180 245 170 275 185
          "
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.18"
          fill="none"
        />

        {/* Noktalar */}
        <circle cx="235" cy="132" r="4" fill="currentColor" />
        <circle cx="355" cy="118" r="4" fill="currentColor" />
        <circle cx="260" cy="160" r="3" fill="currentColor" opacity="0.6" />

        {/* Çember */}
        <circle
          cx="435"
          cy="90"
          r="34"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.25"
        />

        <ellipse
          cx="435"
          cy="90"
          rx="34"
          ry="12"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.2"
        />

        {/* f(x) */}
        <text
          x="188"
          y="118"
          fontSize="24"
          fill="currentColor"
          opacity="0.5"
        >
          f(x)
        </text>

        {/* Sigma */}
        <text
          x="405"
          y="255"
          fontSize="44"
          fill="currentColor"
          opacity="0.3"
        >
          Σ
        </text>
      </svg>
    </div>
  );
}