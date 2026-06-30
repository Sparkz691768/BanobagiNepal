import ProductCard from './ProductCard'

export default function ProductGrid({ products }) {
  if (!products?.length) {
    return (
      <div className="text-center py-20 text-muted">
        <p>No products found.</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
