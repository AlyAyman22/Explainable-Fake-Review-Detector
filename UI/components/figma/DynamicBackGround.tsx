/* =========================
   src/components/figma/DynamicBackGround.tsx
   ========================= */
type Props = {
  opacity?: number;
  src?: string;
};

const DEFAULT_SRC =
  "https://github.com/AbdullahMo0409/AuthiWebsite/raw/refs/heads/main/Background%20pressed.mp4";

export default function DynamicBackground({ opacity = 1, src = DEFAULT_SRC }: Props) {
  return (
    <div className="video-bg" aria-hidden="true" style={{ opacity }}>
      <video className="video-bg__vid" autoPlay loop muted playsInline preload="auto">
        <source src={src} type="video/mp4" />
      </video>
      <div className="video-bg__grain" />
    </div>
  );
}
