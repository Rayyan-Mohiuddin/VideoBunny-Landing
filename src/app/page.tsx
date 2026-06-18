import ScrollScene from "@/components/ScrollScene";

export default function Home() {
  return (
    <main
      style={{
        background: "#000",
        minHeight: "500vh",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <ScrollScene />
      </div>
    </main>
  );
}
