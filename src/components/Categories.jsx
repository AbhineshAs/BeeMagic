const categories = [
  { id: 1, name: 'Infused Honey', image: '/images/amla_infused_honey.jpg' },
  { id: 2, name: 'Artisanal Pure', image: '/images/organic_honey.jpg' },
  { id: 3, name: 'Bestseller Selection', image: '/images/chilli_infused_honey.jpg' },
];

export default function Categories() {
  return (
    <section className="categories-section">
      <div className="categories-grid">
        {categories.map((category, index) => (
          <div key={category.id} className={`category-item reveal-on-scroll slide-up delay-${(index + 1) * 100}`}>
            <div className="category-image">
              <img src={category.image} alt={category.name} />
            </div>
            <p>{category.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
