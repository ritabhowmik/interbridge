export default function AuraBackground() {
  return (
    <div className="aura-layer" aria-hidden="true">
      <div
        className="aura-blob"
        style={{
          width: 700,
          height: 700,
          top: "-12%",
          left: "-10%",
          background: "#ff4d6a",
        }}
      />
      <div
        className="aura-blob"
        style={{
          width: 800,
          height: 800,
          top: "10%",
          right: "-18%",
          background: "#7c5cff",
        }}
      />
      <div
        className="aura-blob"
        style={{
          width: 600,
          height: 600,
          bottom: "-15%",
          left: "18%",
          background: "#33d6c0",
          opacity: 0.2,
        }}
      />
      <div
        className="aura-blob"
        style={{
          width: 500,
          height: 500,
          bottom: "5%",
          right: "10%",
          background: "#7c5cff",
          opacity: 0.16,
        }}
      />
    </div>
  );
}
