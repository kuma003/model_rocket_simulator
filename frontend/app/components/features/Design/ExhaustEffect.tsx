import React, { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface ExhaustEffectProps {
  isActive: boolean;
  pitchAngle: number;
  exhaustX: number;
  exhaustY: number;
  scale: number;
  shouldPlaySound?: boolean;
}

const MAX_PARTICLES = 1000;
const PARTICLE_LIFETIME = 250;

const ExhaustEffect: React.FC<ExhaustEffectProps> = ({
  isActive,
  pitchAngle,
  exhaustX,
  exhaustY,
  scale,
  shouldPlaySound = false,
}) => {
  const [renderParticles, setRenderParticles] = useState<Particle[]>([]);

  const particlesRef = useRef<Particle[]>([]);
  const idCounterRef = useRef(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 最新のpropsを保持するrefたち
  const isActiveRef = useRef(isActive);
  const pitchAngleRef = useRef(pitchAngle);
  const exhaustXRef = useRef(exhaustX);
  const exhaustYRef = useRef(exhaustY);
  const scaleRef = useRef(scale);

  // props更新をrefに反映
  useEffect(() => {
    isActiveRef.current = isActive;
    pitchAngleRef.current = pitchAngle;
    exhaustXRef.current = exhaustX;
    exhaustYRef.current = exhaustY;
    scaleRef.current = scale;
  }, [isActive, pitchAngle, exhaustX, exhaustY, scale]);

  // 音声制御
  useEffect(() => {
    // 音声要素の初期化（一度だけ）
    if (!audioRef.current && shouldPlaySound) {
      audioRef.current = new Audio("./combustion.mp3");
      audioRef.current.volume = 0.7; // 適度な音量に設定
      audioRef.current.loop = false; // ループなし
    }

    if (!shouldPlaySound || !audioRef.current) return;

    const audio = audioRef.current;

    if (isActive) {
      // フェードアウト処理をキャンセル
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
        fadeTimeoutRef.current = null;
      }

      // 音声再生開始
      audio.volume = 0.7;
      audio.currentTime = 0; // 最初から再生
      audio.play().catch(console.error);
    } else {
      // フェードアウト開始
      if (audio && !audio.paused) {
        const fadeOutDuration = 1000; // 0.1秒
        const fadeSteps = 10;
        const volumeStep = audio.volume / fadeSteps;
        const stepInterval = fadeOutDuration / fadeSteps;

        let currentStep = 0;
        const fadeInterval = setInterval(() => {
          currentStep++;
          audio.volume = Math.max(0, audio.volume - volumeStep);

          if (currentStep >= fadeSteps || audio.volume <= 0) {
            clearInterval(fadeInterval);
            audio.pause();
            audio.currentTime = 0;
          }
        }, stepInterval);

        fadeTimeoutRef.current = fadeInterval as any;
      }
    }
  }, [isActive, shouldPlaySound]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 毎フレームのアニメーション更新ループ
  useEffect(() => {
    const update = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }
      const delta = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const pitchRad = (pitchAngleRef.current * Math.PI) / 180;
      const dirX = Math.sin(pitchRad);
      const dirY = -Math.cos(pitchRad);

      const updatedParticles: Particle[] = [];

      // パーティクルの寿命と移動を更新
      for (const p of particlesRef.current) {
        const newLife = p.life - delta;
        if (newLife > 0) {
          updatedParticles.push({
            ...p,
            x: p.x + p.vx * (delta / 16),
            y: p.y + p.vy * (delta / 16),
            life: newLife,
          });
        }
      }

      // パーティクルの生成（isActive のときのみ）
      if (isActiveRef.current) {
        const numNew = Math.max(1, Math.floor(delta / 10));
        for (let i = 0; i < numNew; i++) {
          const spread = 0.3;
          const angle = Math.atan2(dirY, dirX) + (Math.random() - 0.5) * spread;
          const speed = (0.5 + Math.random()) * scaleRef.current * 0.01;
          const size = (Math.random() * 0.3 + 0.3) * scaleRef.current * 0.06;

          updatedParticles.push({
            id: ++idCounterRef.current,
            x:
              exhaustXRef.current +
              (Math.random() - 0.5) * scaleRef.current * 0.001,
            y:
              exhaustYRef.current +
              (Math.random() - 0.5) * scaleRef.current * 0.05,
            vx: Math.sin(angle) * speed,
            vy: Math.cos(angle) * speed,
            life: PARTICLE_LIFETIME,
            maxLife: PARTICLE_LIFETIME,
            size,
          });
        }
      }

      // パーティクル数制限
      if (updatedParticles.length > MAX_PARTICLES) {
        updatedParticles.splice(0, updatedParticles.length - MAX_PARTICLES);
      }

      particlesRef.current = updatedParticles;
      setRenderParticles([...updatedParticles]);

      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = null;
    };
  }, []); // ← 一度だけ起動！

  return (
    <g>
      {renderParticles.map((p) => {
        const opacity = Math.max(0, p.life / p.maxLife);
        const sizeScale = 0.5 + (1 - opacity);
        const w = p.size * sizeScale;

        return (
          <image
            key={p.id}
            href="./noise.png"
            x={p.x - w / 2}
            y={p.y - w / 2}
            width={w}
            height={w}
          />
        );
      })}
    </g>
  );
};

export default ExhaustEffect;
