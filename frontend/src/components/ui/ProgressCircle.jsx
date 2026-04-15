import { useEffect, useState } from "react";

export default function ProgressCircle({ score = 72 }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= score) clearInterval(interval);
      else {
        i++;
        setProgress(i);
      }
    }, 15);
  }, [score]);

  const radius = 60;
  const stroke = 10;
  const normalized = radius - stroke * 0.5;
  const circumference = normalized * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="flex items-center justify-center">
      <svg
        height={170}
        width={170}
        className="drop-shadow-[0_0_32px_rgba(96,165,250,0.18)]"
      >
        <circle
          stroke="rgba(148, 163, 184, 0.16)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalized}
          cx="85"
          cy="85"
        />
        <circle
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalized}
          cx="85"
          cy="85"
          style={{ transition: "stroke-dashoffset 0.3s ease" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5ea0ff" />
            <stop offset="55%" stopColor="#8f7cff" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
        <text
          x="50%"
          y="49%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-white text-xl font-semibold"
        >
          {progress}%
        </text>
        <text
          x="50%"
          y="61%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-slate-400 text-[10px] uppercase tracking-[0.3em]"
        >
          Match
        </text>
      </svg>
    </div>
  );
}
