import ScrollScene from "@/components/ScrollScene";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import SimpleSection from "@/components/SimpleSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CreatorSection from "@/components/CreatorSection";
import ViewerSection from "@/components/ViewerSection";
import LeaderboardSection from "@/components/LeaderboardSection";
import PingsPreviewSection from "@/components/PingsPreviewSection/PingsPreviewSection";

export default function Home() {
  return (
    <main
      style={{
        background: "#000",
      }}
    >
      <section
        style={{
          height: "100dvh",
          position: "relative",
        }}
      >
        <ScrollScene />
      </section>

      <ProblemSection />

      <SolutionSection />

      <SimpleSection />

      <HowItWorksSection />

      <CreatorSection />

      <ViewerSection />

      <LeaderboardSection />

      <PingsPreviewSection />
    </main>
  );
}
