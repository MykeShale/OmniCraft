import React from "react";
import { AbsoluteFill } from "remotion";
import { noise2D } from "@remotion/noise";
import { HUD } from "../film.config";
import { EV, TL, progressAt, project, valueAt, window01 } from "../lib/camera";
import { smoothstep } from "../lib/math";
import { tagsAt, type Tag } from "../tags";
import { MONO, SERIF, SERIF_ITALIC } from "./fonts";

// HUD "instrument" : compteur principal, relevés, règle graduée, légendes par réplique, étiquettes 3D, noir + titre.
const ACC = HUD.accent;
const hexA = (h: string, a: number) => `rgba(${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(h.slice(5, 7), 16)},${a})`;
const DIM = hexA(ACC, 0.55), GLOW = `0 0 14px ${hexA(ACC, 0.35)}`;

const Readouts: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const v = valueAt(frame), p = progressAt(frame);
  const flick = 0.92 + 0.08 * noise2D("hud", frame * 0.5, 0);
  return (
    <div style={{ position: "absolute", left: 72, top: 58, opacity: opacity * flick, fontFamily: MONO, color: ACC, textShadow: GLOW }}>
      <div style={{ fontSize: 17, letterSpacing: "0.34em", color: DIM }}>{HUD.counter.label}</div>
      <div style={{ fontSize: 108, lineHeight: 1, fontWeight: 300, marginTop: 6, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em" }}>
        {HUD.counter.format(v)}<span style={{ fontSize: 34, marginLeft: 12, color: DIM }}>{HUD.counter.unit}</span>
      </div>
      <div style={{ display: "flex", gap: 34, marginTop: 22, fontSize: 19, letterSpacing: "0.06em" }}>
        {HUD.readouts(v, p).map((r) => (
          <div key={r.label} style={{ opacity: r.blink ? 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.16)) : 1 }}>
            <div style={{ fontSize: 12, letterSpacing: "0.3em", color: DIM, marginBottom: 4 }}>{r.label}</div>
            <div style={{ color: r.color ?? ACC, fontVariantNumeric: "tabular-nums" }}>{r.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Ruler: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => {
  const R = HUD.ruler;
  if (!R) return null;
  const v = valueAt(frame), X = 1836, CY = 540;
  const yOf = (d: number) => CY + (R.scale(d) - R.scale(v)) * R.pxPerUnit;
  return (
    <div style={{ position: "absolute", inset: 0, opacity, fontFamily: MONO, color: ACC }}>
      <div style={{ position: "absolute", left: X, top: 0, width: 1, height: 1080, background: hexA(ACC, 0.28) }} />
      {R.marks.map((m) => {
        const y = yOf(m.v);
        if (y < -40 || y > 1120) return null;
        const passed = m.v <= v, near = 1 - smoothstep(0, 420, Math.abs(y - CY));
        return (
          <div key={m.v} style={{ position: "absolute", left: X - (m.label ? 18 : 10), top: y, width: m.label ? 18 : 10, height: 1, background: hexA(ACC, passed ? 0.9 : 0.45) }}>
            <div style={{ position: "absolute", right: 30, top: -10 + (m.shift ?? 0), whiteSpace: "nowrap", textAlign: "right", fontSize: 15, letterSpacing: "0.08em", opacity: 0.35 + 0.65 * near, color: passed ? ACC : DIM }}>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{HUD.counter.format(m.v)} {HUD.counter.unit}</span>
              {m.label && <span style={{ marginLeft: 12, color: passed ? ACC : hexA(ACC, 0.7), fontStyle: "italic", fontFamily: SERIF_ITALIC, fontSize: 19 }}>{m.label}</span>}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: X - 46, top: CY, width: 46, height: 1, background: ACC, boxShadow: GLOW }} />
      <div style={{ position: "absolute", left: X - 5, top: CY - 5, width: 10, height: 10, borderRadius: 5, background: ACC, boxShadow: `0 0 18px ${hexA(ACC, 0.9)}` }} />
    </div>
  );
};

const Caption: React.FC<{ frame: number; label: string; sub: string; start: number; end: number }> = ({ frame, label, sub, start, end }) => {
  const inF = start + 6, outF = end + 14;
  if (frame < inF - 5 || frame > outF + 25) return null;
  const outK = smoothstep(outF, outF + 22, frame), subK = window01(frame, inF + 22, outF + 10, 18, 16);
  return (
    <div style={{ position: "absolute", left: 72, bottom: 78, opacity: 1 - outK, transform: `translateY(${-10 * outK}px)`, filter: `blur(${6 * outK}px)` }}>
      {label && (
        <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 60, letterSpacing: "0.22em", color: "rgba(255,255,255,0.93)", textShadow: `0 0 24px ${hexA(ACC, 0.25)}`, whiteSpace: "nowrap" }}>
          {label.split("").map((c, i) => {
            const k = smoothstep(inF + i * 1.1, inF + i * 1.1 + 16, frame);
            return <span key={i} style={{ display: "inline-block", opacity: k, transform: `translateY(${12 * (1 - k)}px)`, filter: `blur(${5 * (1 - k)}px)` }}>{c === " " ? " " : c}</span>;
          })}
        </div>
      )}
      <div style={{ marginTop: label ? 10 : 0, fontFamily: MONO, fontSize: 21, letterSpacing: "0.12em", color: ACC, opacity: subK, transform: `translateY(${6 * (1 - subK)}px)`, textShadow: GLOW }}>{sub}</div>
      <div style={{ marginTop: 14, height: 1, width: 420 * subK, background: `linear-gradient(90deg, ${hexA(ACC, 0.7)}, ${hexA(ACC, 0)})` }} />
    </div>
  );
};

const Tag3D: React.FC<{ frame: number; tag: Tag }> = ({ frame, tag }) => {
  const k = window01(frame, tag.from, tag.to, 18, 16);
  if (k <= 0.001) return null;
  const p = project(tag.x, tag.y, tag.z, frame);
  if (p.behind) return null;
  const dx = tag.dx ?? 70, dy = tag.dy ?? -60, ex = p.sx + dx, ey = p.sy + dy;
  const len = Math.hypot(dx, dy), ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: k, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: p.sx - 4, top: p.sy - 4, width: 8, height: 8, borderRadius: 4, border: `1px solid ${ACC}`, boxShadow: GLOW }} />
      <div style={{ position: "absolute", left: p.sx, top: p.sy, width: len * k, height: 1, background: hexA(ACC, 0.75), transformOrigin: "0 0", transform: `rotate(${ang}deg)` }} />
      <div style={{ position: "absolute", left: dx >= 0 ? ex + 8 : undefined, right: dx < 0 ? TL.width - ex + 8 : undefined, top: ey - 13, whiteSpace: "nowrap", fontFamily: MONO, fontSize: 19, letterSpacing: "0.1em", color: ACC, textShadow: GLOW, background: "rgba(0,8,16,0.35)", padding: "3px 10px", borderLeft: dx >= 0 ? `1px solid ${ACC}` : undefined, borderRight: dx < 0 ? `1px solid ${ACC}` : undefined }}>{tag.text}</div>
    </div>
  );
};

const Overlays: React.FC<{ frame: number; handle: string }> = ({ frame, handle }) => {
  const black = EV.blackout ?? Infinity, title = EV.title ?? black + 45;
  const fadeIn = 1 - smoothstep(0, 50, frame), blackK = smoothstep(black - 2, black + 6, frame);
  const tk = smoothstep(title, title + 40, frame), sk = smoothstep(title + 30, title + 70, frame), hk = smoothstep(title + 60, title + 95, frame);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: Math.max(fadeIn, blackK) }} />
      {frame >= title - 5 && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 300, fontSize: 132, letterSpacing: `${0.95 - 0.35 * tk}em`, paddingLeft: "0.6em", color: "rgba(255,255,255,0.92)", opacity: tk, filter: `blur(${8 * (1 - tk)}px)`, textShadow: `0 0 40px ${hexA(ACC, 0.25)}` }}>{HUD.title}</div>
          <div style={{ marginTop: 26, fontFamily: SERIF_ITALIC, fontSize: 34, letterSpacing: "0.12em", color: ACC, opacity: sk, textShadow: GLOW }}>{HUD.tagline}</div>
          <div style={{ position: "absolute", bottom: 64, fontFamily: MONO, fontSize: 20, letterSpacing: "0.3em", color: DIM, opacity: hk }}>{handle}</div>
        </div>
      )}
    </>
  );
};

export const Hud: React.FC<{ frame: number; handle: string }> = ({ frame, handle }) => {
  const black = EV.blackout ?? Infinity;
  const hud = smoothstep(28, 70, frame) * (1 - smoothstep(black - 8, black - 1, frame));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Readouts frame={frame} opacity={hud} />
      <Ruler frame={frame} opacity={hud * 0.95} />
      {tagsAt(frame).map((t) => <Tag3D key={t.key} frame={frame} tag={t} />)}
      {TL.beats.map((b) => <Caption key={b.id} frame={frame} label={b.label} sub={b.sub} start={b.start} end={b.end} />)}
      <Overlays frame={frame} handle={handle} />
    </AbsoluteFill>
  );
};
