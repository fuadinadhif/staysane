import HeroSection from "@/components/home/hero-section";
import PopularDestinations from "@/components/home/popular-destinations";
import PropertyCategories from "@/components/home/property-categories";
import RunningText from "@/components/home/running-text";
import FeaturedProperties from "@/components/home/featured-properties";
import WhyChooseUs from "@/components/home/why-choose-us";
import Newsletter from "@/components/home/newsletter";
import CTABanner from "@/components/home/cta-banner";

export default function Home() {
  return (
    <main className="flex-1">
      <HeroSection />
      <RunningText />
      <PopularDestinations />
      <PropertyCategories />
      <FeaturedProperties />
      <WhyChooseUs />
      <CTABanner />
      <Newsletter />
    </main>
  );
}
