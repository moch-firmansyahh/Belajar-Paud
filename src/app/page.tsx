import { getAllMateri } from "@/lib/content/loadMateri";
import { HomeClient } from "@/components/home/HomeClient";

export default function HomePage() {
  const materiList = getAllMateri();

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 pt-6 sm:pt-8 flex-1">
      <HomeClient materiList={materiList} />
    </div>
  );
}
