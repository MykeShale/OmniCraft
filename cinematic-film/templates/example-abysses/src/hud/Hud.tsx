import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { noise2D } from "@remotion/noise";
import { EV, FPS, TL, depthAt, project, window01 } from "../lib/camera";
import { anglerPose, bagPose, landmarkAnchor, landmarks, snailPose } from "../lib/choreo";
import { envAt, lightPercent, pressureAtm } from "../lib/env";
import { clamp, smoothstep } from "../lib/math";
import { MONO, SERIF, SERIF_ITALIC } from "./fonts";

const CYAN = "#a9e4ff";
const CYAN_DIM = "rgba(169,228,255,0.55)";
const GLOW = "0 0 14px rgba(120,205,255,0.35)";
const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// ---------- compteur de profondeur + relevés
const Readouts: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const depth = depthAt(frame);
  const env = envAt(depth);
  const light = lightPercent(depth);
  const flick = 0.92 + 0.08 * noise2D("hud", frame * 0.5, 0);
  const hadal = depth >= 6000;
  const blink = hadal ? 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.16)) : 1;
  const lightTxt = light >= 1 ? `${light.toFixed(0)} %` : light >= 0.01 ? `${light.toFixed(2)} %` : "0 %";
  return (
    <div style={{ position: "absolute", left: 72, top: 58, opacity: opacity * flick, fontFamily: MONO, color: CYAN, textShadow: GLOW }}>
      <div style={{ fontSize: 17, letterSpacing: "0.34em", color: CYAN_DIM }}>PROFONDEUR</div>
      <div style={{ fontSize: 108, lineHeight: 1, fontWeight: 300, marginTop: 6, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
        {fmt(depth)}<span style={{ fontSize: 34, marginLeft: 12, color: CYAN_DIM }}>m</span>
      </div>
      <div style={{ display: "flex", gap: 34, marginTop: 22, fontSize: 19, letterSpacing: "0.06em" }}>
        <Readout label="PRESSION" value={`×${fmt(pressureAtm(depth))}`} color={hadal ? "#ff9a86" : CYAN} opacity={blink} />
        <Readout label="LUMIÈRE" value={lightTxt} />
        <Readout label="TEMP." value={`${env.temp.toFixed(env.temp < 10 ? 1 : 0)} °C`} />
      </div>
    </div>
  );
};
const Readout: React.FC<{ label: string; value: string; color?: string; opacity?: number }> = ({ label, value, color = CYAN, opacity = 1 }) => (
  <div style={{ opacity }}>
    <div style={{ fontSize: 12, letterSpacing: "0.3em", color: CYAN_DIM, marginBottom: 4 }}>{label}</div>
    <div style={{ color, fontVariantNumeric: "tabular-nums" }}>{value}</div>
  </div>
);

// ---------- règle de profondeur (échelle log) à droite
const RULER_MARKS: { d: number; label?: string; shift?: number }[] = [
  { d: 10 }, { d: 20 }, { d: 40, label: "plongée loisir" }, { d: 60 }, { d: 93, label: "Statue de la Liberté" }, { d: 150 }, { d: 214, label: "record d'apnée" },
  { d: 330, label: "Tour Eiffel" }, { d: 500 }, { d: 535, label: "manchot empereur", shift: 8 }, { d: 828, label: "Burj Khalifa" }, { d: 1000, label: "zone de minuit", shift: 8 },
  { d: 1500 }, { d: 2000, label: "cachalot" }, { d: 3000 }, { d: 3803, label: "Titanic" }, { d: 5000 }, { d: 6000, label: "zone hadale" }, { d: 8336, label: "poisson le plus profond", shift: -9 },
  { d: 8849, label: "Everest", shift: 9 }, { d: 10935, label: "Challenger Deep", shift: 4 },
];
const S = (d: number) => Math.log10(1 + d / 30);
const Ruler: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const depth = depthAt(frame);
  const K = 640; // px par unité log
  const X = 1836, CY = 540;
  const yOf = (d: number) => CY + (S(d) - S(depth)) * K;
  return (
    <div style={{ position: "absolute", inset: 0, opacity, fontFamily: MONO, color: CYAN }}>
      <div style={{ position: "absolute", left: X, top: 0, width: 1, height: 1080, background: "rgba(169,228,255,0.28)" }} />
      {RULER_MARKS.map((m) => {
        const y = yOf(m.d);
        if (y < -40 || y > 1120) return null;
        const passed = m.d <= depth;
        const near = 1 - smoothstep(0, 420, Math.abs(y - CY));
        return (
          <div key={m.d} style={{ position: "absolute", left: X - (m.label ? 18 : 10), top: y, width: m.label ? 18 : 10, height: 1, background: passed ? "rgba(169,228,255,0.9)" : "rgba(169,228,255,0.45)" }}>
            <div style={{ position: "absolute", right: 30, top: -10 + (m.shift ?? 0), whiteSpace: "nowrap", textAlign: "right", fontSize: 15, letterSpacing: "0.08em", opacity: 0.35 + 0.65 * near, color: passed ? CYAN : CYAN_DIM }}>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(m.d)} m</span>
              {m.label && <span style={{ marginLeft: 12, color: passed ? CYAN : "rgba(169,228,255,0.7)", fontStyle: "italic", fontFamily: SERIF_ITALIC, fontSize: 19 }}>{m.label}</span>}
            </div>
          </div>
        );
      })}
      {/* position actuelle */}
      <div style={{ position: "absolute", left: X - 46, top: CY, width: 46, height: 1, background: CYAN, boxShadow: GLOW }} />
      <div style={{ position: "absolute", left: X - 5, top: CY - 5, width: 10, height: 10, borderRadius: 5, background: CYAN, boxShadow: "0 0 18px rgba(169,228,255,0.9)" }} />
    </div>
  );
};

// ---------- légendes par palier
const Caption: React.FC<{ frame: number; label: string; sub: string; start: number; end: number }> = ({ frame, label, sub, start, end }) => {
  const inF = start + 6, outF = end + 14;
  if (frame < inF - 5 || frame > outF + 25) return null;
  const chars = label.split("");
  const outK = smoothstep(outF, outF + 22, frame);
  const subK = window01(frame, inF + 22, outF + 10, 18, 16);
  return (
    <div style={{ position: "absolute", left: 72, bottom: 78, opacity: 1 - outK, transform: `translateY(${-10 * outK}px)`, filter: `blur(${6 * outK}px)` }}>
      {label && (
        <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 60, letterSpacing: "0.22em", color: "rgba(255,255,255,0.93)", textShadow: "0 0 24px rgba(140,210,255,0.25)", whiteSpace: "nowrap" }}>
          {chars.map((c, i) => {
            const k = smoothstep(inF + i * 1.1, inF + i * 1.1 + 16, frame);
            return (
              <span key={i} style={{ display: "inline-block", opacity: k, transform: `translateY(${12 * (1 - k)}px)`, filter: `blur(${5 * (1 - k)}px)`, minWidth: c === " " ? "0.35em" : undefined }}>{c === " " ? " " : c}</span>
            );
          })}
        </div>
      )}
      <div style={{ marginTop: label ? 10 : 0, fontFamily: MONO, fontSize: 21, letterSpacing: "0.12em", color: CYAN, opacity: subK, transform: `translateY(${6 * (1 - subK)}px)`, textShadow: GLOW }}>
        {sub}
      </div>
      <div style={{ marginTop: 14, height: 1, width: 420 * subK, background: "linear-gradient(90deg, rgba(169,228,255,0.7), rgba(169,228,255,0))" }} />
    </div>
  );
};

// ---------- étiquettes ancrées dans la 3D (ligne de rappel)
type Tag = { key: string; text: string; x: number; y: number; z: number; from: number; to: number; dx?: number; dy?: number };
const Tag3D: React.FC<{ frame: number; tag: Tag }> = ({ frame, tag }) => {
  const k = window01(frame, tag.from, tag.to, 18, 16);
  if (k <= 0.001) return null;
  const p = project(tag.x, tag.y, tag.z, frame);
  if (p.behind) return null;
  const dx = tag.dx ?? 70, dy = tag.dy ?? -60;
  const ex = p.sx + dx, ey = p.sy + dy;
  const len = Math.hypot(dx, dy);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: k, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: p.sx - 4, top: p.sy - 4, width: 8, height: 8, borderRadius: 4, border: `1px solid ${CYAN}`, boxShadow: GLOW }} />
      <div style={{ position: "absolute", left: p.sx, top: p.sy, width: len * k, height: 1, background: "rgba(169,228,255,0.75)", transformOrigin: "0 0", transform: `rotate(${ang}deg)` }} />
      <div style={{ position: "absolute", left: dx >= 0 ? ex + 8 : undefined, right: dx < 0 ? 1920 - ex + 8 : undefined, top: ey - 13, whiteSpace: "nowrap", fontFamily: MONO, fontSize: 19, letterSpacing: "0.1em", color: CYAN, textShadow: GLOW, background: "rgba(0,8,16,0.35)", padding: "3px 10px", borderLeft: dx >= 0 ? `1px solid ${CYAN}` : undefined, borderRight: dx < 0 ? `1px solid ${CYAN}` : undefined }}>
        {tag.text}
      </div>
    </div>
  );
};

const useTags = (frame: number): Tag[] => {
  const lm = useMemo(() => landmarks(), []);
  const tags: Tag[] = lm.filter((l) => l.label).map((l) => {
    const a = landmarkAnchor(l);
    return { key: l.id, text: l.label!, x: a.x, y: a.y, z: a.z, from: l.from, to: l.to, dx: l.id === "everest" ? -90 : 70, dy: l.id === "everest" ? 70 : -60 };
  });
  const b4 = TL.beats.find((b) => b.id === "04-midnight")!;
  const b7 = TL.beats.find((b) => b.id === "07-hadal")!;
  const ang = anglerPose(frame);
  tags.push({ key: "angler", text: "baudroie abyssale · sa lanterne attire ses proies", x: ang.x + 0.5, y: ang.y - 1.4, z: ang.z, from: b4.start + 120, to: b4.end + 15, dx: 90, dy: 80 });
  const sn = snailPose(frame);
  tags.push({ key: "snail", text: "Pseudoliparis · filmé à 8 336 m (2023)", x: sn.x - 1.2, y: sn.y - 0.6, z: sn.z, from: b7.start + 175, to: b7.end + 30, dx: 90, dy: 70 });
  const bag = bagPose(frame);
  tags.push({ key: "bag", text: "sac plastique · trouvé à 10 928 m (2019)", x: bag.x - 0.5, y: bag.y + 0.6, z: bag.z, from: EV.landing + 40, to: EV.eyeOpen - 10, dx: -90, dy: -80 });
  return tags;
};

// ---------- fondus, noir, titre
const Overlays: React.FC<{ frame: number; handle: string }> = ({ frame, handle }) => {
  const fadeIn = 1 - smoothstep(0, 50, frame);
  const black = smoothstep(EV.blackout - 2, EV.blackout + 6, frame);
  const tk = smoothstep(EV.title, EV.title + 40, frame);
  const sk = smoothstep(EV.title + 30, EV.title + 70, frame);
  const hk = smoothstep(EV.title + 60, EV.title + 95, frame);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: Math.max(fadeIn, black) }} />
      {frame >= EV.title - 5 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 132, letterSpacing: `${0.95 - 0.35 * tk}em`, paddingLeft: "0.6em", color: "rgba(255,255,255,0.92)", opacity: tk, filter: `blur(${8 * (1 - tk)}px)`, textShadow: "0 0 40px rgba(140,210,255,0.25)" }}>
            ABYSSES
          </div>
          <div style={{ marginTop: 26, fontFamily: SERIF_ITALIC, fontSize: 34, letterSpacing: "0.12em", color: CYAN, opacity: sk, textShadow: GLOW }}>
            moins de 5 % de l'océan a été exploré
          </div>
          <div style={{ position: "absolute", bottom: 64, fontFamily: MONO, fontSize: 20, letterSpacing: "0.3em", color: CYAN_DIM, opacity: hk }}>{handle}</div>
        </div>
      )}
    </>
  );
};

export const Hud: React.FC<{ frame: number; handle: string }> = ({ frame, handle }) => {
  const hud = smoothstep(28, 70, frame) * (1 - smoothstep(EV.blackout - 8, EV.blackout - 1, frame));
  const tags = useTags(frame);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Readouts frame={frame} opacity={hud} />
      <Ruler frame={frame} opacity={hud * 0.95} />
      {tags.map((t) => <Tag3D key={t.key} frame={frame} tag={t} />)}
      {TL.beats.map((b) => <Caption key={b.id} frame={frame} label={b.label} sub={b.sub} start={b.start} end={b.end} />)}
      <Overlays frame={frame} handle={handle} />
    </AbsoluteFill>
  );
};
