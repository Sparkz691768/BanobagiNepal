import HeroBanner from '@/components/home/HeroBanner'
import TrustBar from '@/components/home/TrustBar'
import CategorySection from '@/components/home/CategorySection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import PromoBanner from '@/components/home/PromoBanner'

export default function HomePage() {
  return (
    <>
      <div className="pt-[96px]">
        <HeroBanner />
      </div>
      <TrustBar />
      <CategorySection />
      <FeaturedProducts />
      <PromoBanner />
    </>
  )
}

