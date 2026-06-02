import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, Clock, ArrowRight, ArrowLeft, Bookmark } from 'lucide-react';
import elenaLeyaImage from  '../assets/javier-kober-7M-BISgvUrs-unsplash.jpg';
import lavenderFrontImage from '../assets/micheile-henderson-4QQidx_t5PQ-unsplash.jpg';
import poulitryFormImage from '../assets/ante-hamersmit-Ru3IMko0KNg-unsplash.jpg';
const blogPosts = [
  {
    id: 1,
    title: "Why Raw Honey is Nature's Ultimate Superfood",
    category: "Health & Purity",
    excerpt: "Discover the powerful enzymes, antioxidants, and health benefits packed inside unfiltered honey, and why it beats processed sugars every time.",
    date: "May 20, 2026",
    readTime: "5 min read",
    image: elenaLeyaImage,
    content: `
      <p>For thousands of years, honey has been celebrated not just as a delicious sweetener, but as a potent medicine and vital superfood. However, in our modern industrial food system, most of the honey found on supermarket shelves has been heated, ultra-filtered, and stripped of its beneficial properties. To experience the true benefits, we must turn to raw, unfiltered honey.</p>
      
      <h3>What Makes Honey "Raw"?</h3>
      <p>Raw honey is honey exactly as it exists in the beehive. It is extracted, settled, and strained to remove wax particles and bee parts, but it is never pasteurized (heated to high temperatures) or micro-filtered. This gentle treatment ensures that three crucial elements remain intact:</p>
      <ul>
        <li><strong>Enzymes:</strong> Heat destroys diastase, invertase, and glucose oxidase—the delicate enzymes that give raw honey its unique antibacterial properties.</li>
        <li><strong>Pollen:</strong> Micro-filtering removes bee pollen, which contains vitamins, amino acids, and essential fatty acids. Pollen is also crucial for tracing honey back to its floral source.</li>
        <li><strong>Propolis:</strong> Often called "bee glue," propolis is a resinous compound gathered by bees from tree buds. It is rich in anti-inflammatory and immune-supporting bioflavonoids.</li>
      </ul>

      <blockquote>
        "Raw honey is a living food. It contains over 200 distinct substances, including vitamins, minerals, amino acids, and bioactive enzymes that cannot be replicated in a lab."
      </blockquote>

      <h3>Key Health Benefits</h3>
      <p>Regular consumption of raw honey offers several scientifically supported health advantages:</p>
      
      <h4>1. Rich in Antioxidants</h4>
      <p>High-quality raw honey contains organic acids and phenolic compounds like flavonoids, which act as powerful antioxidants. These help protect your cells from oxidative stress and free radical damage, supporting cardiovascular and cellular health.</p>
      
      <h4>2. Natural Antibacterial and Antifungal Action</h4>
      <p>When glucose oxidase in raw honey reacts with water, it naturally produces low levels of hydrogen peroxide. This, combined with honey's high acidity and low moisture content, makes it a natural antiseptic. It has been used for centuries to soothe sore throats and support wound healing.</p>
      
      <h4>3. Prebiotic Gut Support</h4>
      <p>Raw honey contains oligosaccharides—non-digestible carbohydrates that act as prebiotics. They feed the beneficial bacteria in your microbiome, supporting digestion, nutrient absorption, and overall gut health.</p>

      <h3>How to Spot Real Raw Honey</h3>
      <p>Real raw honey will naturally crystallize over time. This is not a sign of spoilage, but rather proof of purity. The glucose molecules bind to the pollen particles, creating a thick, spreadable texture. If your honey stays perfectly liquid and clear for months, it has likely been heavily processed or adulterated with sugar syrups.</p>
      <p>At Bee Magic, we jar our honey straight from the hive in small, hand-poured batches. We never heat or force-filter, preserving every drop of nature's magic just as the bees intended.</p>
    `
  },
  {
    id: 2,
    title: "A Day in the Life of a Master Beekeeper",
    category: "Beekeeping",
    excerpt: "Step into the suit and join us as we inspect our protected meadows, care for the queens, and ensure our hives thrive ethically.",
    date: "May 15, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?w=800",
    content: `
      <p>The morning mist is still clearing from the wildflower meadows of our protected apiary as Julian, our Master Beekeeper, zips up his heavy cotton suit. For Julian, beekeeping is not a job—it is a conversation with nature that has spanned over three decades.</p>
      
      <h3>The Morning Inspection</h3>
      <p>The first task of the day is inspecting the hives. Before opening a hive, Julian prepares the smoker. Using pine needles and dried leaves, he generates a cool, thick smoke. "Smoke doesn't harm the bees," Julian explains. "It simply masks their alarm pheromones and encourages them to feed, which keeps them calm during inspections."</p>
      <p>With gentle, deliberate movements, Julian removes the hive cover. A low, rhythmic hum fills the air—the sound of 60,000 healthy Italian honeybees at work. Julian slides out a wooden frame, holding it up to the morning light. The frame is heavy, covered in a beautiful mosaic of capped brood (baby bees), pollen, and glistening nectar.</p>

      <h3>Reading the Comb</h3>
      <p>A master beekeeper must read the frame like a book. Julian looks for specific signs:</p>
      <ul>
        <li><strong>The Queen's Pattern:</strong> A tight, concentrated circle of capped brood indicates a healthy, fertile queen.</li>
        <li><strong>Pollen Colors:</strong> The bright orange, yellow, and red cells show the diverse wildflowers the bees have been foraging on this week.</li>
        <li><strong>Hive Temperament:</strong> Calmer bees indicate a colony that feels safe, well-fed, and queen-right.</li>
      </ul>

      <blockquote>
        "You cannot rush bees. If you are anxious or hurried, they will sense it immediately. Beekeeping is a practice of patience, focus, and deep respect."
      </blockquote>

      <h3>Ethical Harvesting</h3>
      <p>As summer peaks, some frames are full of sealed, ripe honey. But Julian only takes what the colony can spare. "A common mistake in commercial beekeeping is taking all the honey and feeding the bees sugar water," Julian says. "We always leave at least 60-80 pounds of honey per hive for the winter. The bees worked hard for it, and their own honey is essential for their immune systems."</p>
      <p>Julian gently brushes the bees off the selected frames and places them in transport boxes. By afternoon, these frames will be spun in our hand-cranked radial extractor, allowing the raw honey to flow out without damaging the delicate honeycomb, which can be returned to the hive for the bees to reuse.</p>
      
      <p>As the sun sets, Julian removes his suit, sticky with honey and smelling of beeswax and propolis. It's a physically demanding life, but watching a healthy colony fly out toward the flowers makes every sting worth it.</p>
    `
  },
  {
    id: 3,
    title: "Honey & Lavender: The Perfect Culinary Pairings",
    category: "Recipes",
    excerpt: "From artisanal cheese boards to lavender honey teas, explore these simple, delicious recipes that elevate honey's natural floral notes.",
    date: "May 10, 2026",
    readTime: "4 min read",
    image: lavenderFrontImage,
    content: `
      <p>Few flavor combinations are as elegant and soothing as honey and lavender. While lavender brings a floral, slightly herbaceous note, honey provides a rich, sweet depth that rounds out the botanical flavors beautifully. Here are three simple ways to incorporate this culinary pairing into your kitchen.</p>

      <h3>1. Lavender-Honey Simple Syrup</h3>
      <p>This syrup is perfect for sweetening iced lattes, teas, lemonades, or drizzling over fresh fruit and waffles.</p>
      <ul>
        <li><strong>Ingredients:</strong> 1/2 cup water, 1/2 cup Bee Magic Raw Honey, 1 tablespoon food-grade dried lavender buds.</li>
        <li><strong>Instructions:</strong> Combine water and lavender buds in a small saucepan. Bring to a gentle simmer, then remove from heat. Let it steep for 10 minutes. Strain out the lavender buds. Allow the liquid to cool to lukewarm, then whisk in the raw honey until fully dissolved. (Adding honey when the water is warm, not boiling, preserves the active enzymes!). Store in a glass jar in the fridge for up to two weeks.</li>
      </ul>

      <h3>2. The Artisanal Honey & Cheese Board</h3>
      <p>Elevate your next gathering with a carefully curated cheese board that highlights raw honey's complexity.</p>
      <ul>
        <li><strong>The Cheese:</strong> Pair honey with creamy Goat Cheese (Chèvre), sharp Blue Cheese, or aged Parmigiano-Reggiano.</li>
        <li><strong>The Pairing:</strong> Drizzle our raw honey directly over a log of goat cheese, and garnish with fresh lavender sprigs. The creaminess of the cheese cuts through the floral sweetness, creating a balanced, luxurious bite. Add raw walnuts and dried figs to complete the board.</li>
      </ul>

      <blockquote>
        "The acidity of soft cheeses like Chèvre creates a beautiful contrast with the rich, warm floral notes of raw wildflower honey."
      </blockquote>

      <h3>3. Honey-Glazed Lavender Roasted Carrots</h3>
      <p>A side dish that brings a touch of gourmet flair to any dinner table.</p>
      <ul>
        <li><strong>Ingredients:</strong> 1 lb heirloom baby carrots (scrubbed), 2 tbsp olive oil, 3 tbsp Bee Magic Raw Honey, 1 tsp dried lavender (crushed), pinch of sea salt.</li>
        <li><strong>Instructions:</strong> Preheat oven to 400°F (200°C). Toss the carrots in olive oil, crushed lavender, and sea salt. Spread them on a baking sheet and roast for 20-25 minutes until tender. Drizzle the raw honey over the warm carrots immediately after pulling them from the oven, tossing gently to coat. Serve warm.</li>
      </ul>
    `
  },
  {
    id: 4,
    title: "Protecting the Pollinators: Help Bees at Home",
    category: "Sustainability",
    excerpt: "You don't need a hive to make a difference. Learn how planting native flowers and avoiding pesticides in your garden supports local bee colonies.",
    date: "May 05, 2026",
    readTime: "6 min read",
    image: poulitryFormImage,
    content: `
      <p>Bees are responsible for pollinating one-third of the food we eat, from almonds and apples to the alfalfa that feeds our livestock. Yet, bee populations globally are facing unprecedented challenges due to habitat loss, climate change, and pesticide exposure. Fortunately, you don't have to become a beekeeper to help. Here are small, meaningful ways to support bees in your own backyard or balcony.</p>

      <h3>1. Plant a Pollinator-Friendly Garden</h3>
      <p>One of the biggest struggles for urban and suburban bees is finding food throughout the seasons. You can help by planting a diverse selection of flowering plants:</p>
      <ul>
        <li><strong>Native Flowers:</strong> Native bees are adapted specifically to native plants. Research wildflowers native to your region and plant those first.</li>
        <li><strong>Continuous Blooms:</strong> Choose plants that bloom at different times of the year (spring, summer, and autumn) to provide a steady supply of nectar and pollen.</li>
        <li><strong>Diverse Shapes and Colors:</strong> Different bee species have different tongue lengths. Planting cup-shaped flowers like sunflowers alongside tubular flowers like lavender ensures all bees find food.</li>
      </ul>

      <h3>2. Build a Bee Water Fountain</h3>
      <p>Flying and foraging is hard work, and bees get thirsty! However, they can easily drown in deep water dishes or swimming pools. You can create a safe watering station:</p>
      <p>Fill a shallow tray or birdbath with clean water, and arrange flat stones, pebbles, or marbles throughout it. The stones should stick out above the water level, giving the bees a dry landing pad where they can stand safely and sip water.</p>

      <blockquote>
        "A simple shallow dish filled with pebbles and fresh water provides a vital resting and rehydrating stop for busy foraging bees."
      </blockquote>

      <h3>3. Ditch the Chemical Pesticides</h3>
      <p>Synthetic chemical pesticides, herbicides, and fertilizers are highly toxic to bees. Neonicotinoids, in particular, are absorbed by plants and end up in the pollen and nectar, damaging the bees' central nervous systems and making it difficult for them to navigate back to their hives.</p>
      <p>Instead, embrace organic gardening methods. Use compost for nutrients, plant marigolds to deter pests naturally, and let clover grow in your lawn—clover is one of the bees' absolute favorite early-spring foods!</p>
      
      <p>By making your outdoor space a safe, chemical-free sanctuary, you become a vital link in the chain that keeps our local ecosystems healthy, humming, and thriving.</p>
    `
  },
  {
    id: 5,
    title: "Understanding Honey Varieties: From Thulasi to Amla Infusions",
    category: "Health & Purity",
    excerpt: "Not all honey is created equal. Learn about the unique profiles, herbal benefits, and tasting notes of our artisanal infusions.",
    date: "April 28, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1613548058193-1cd24c1bebcf?w=800",
    content: `
      <p>When most people think of honey, they picture a single, sweet golden syrup. In reality, honey is as complex and varied as wine. The flavor, color, and aroma of honey are entirely dependent on the nectar of the flowers visited by the bees. In addition to single-origin floral honeys, infusing raw honey with organic medicinal herbs elevates both its flavor profile and health benefits.</p>

      <h3>Single-Origin vs. Herbal Infusions</h3>
      <p>While wildflower honey captures the diverse flora of a specific season, single-origin honeys come from bees foraging on a single type of blossom (like clover or orange blossom). Herbal infusions take raw wildflower honey and steep it with dried organic herbs over several weeks. The honey draws out the essential oils, antioxidants, and active compounds of the herbs without requiring heat.</p>

      <h3>Our Signature Infusions</h3>
      
      <h4>1. Thulasi (Holy Basil) Infused Honey</h4>
      <p>Thulasi, or Holy Basil, is revered in Ayurvedic medicine as an adaptogen—an herb that helps the body adapt to stress and supports respiratory health. Our Thulasi Infusion blends the sharp, peppery, herbal notes of fresh basil with the smooth sweetness of raw honey. It is excellent for soothing throat irritation, sweetening warm herbal teas, or taking by the spoonful during seasonal transitions.</p>
      
      <h4>2. Amla (Indian Gooseberry) Infused Honey</h4>
      <p>Amla is one of the richest natural sources of Vitamin C and antioxidants. Infusing sliced Amla in raw honey creates a beautiful sweet-and-sour profile, balancing Amla's natural astringency. This infusion is traditionally used to boost immunity, support digestion, and promote glowing skin. Drizzle it over yogurt bowls or enjoy it with warm lemon water in the morning.</p>

      <blockquote>
        "Herbal infusions combine the natural preservative and digestive qualities of raw honey with the targeted wellness benefits of ancient medicinal plants."
      </blockquote>

      <h4>3. Turmeric and Ginger Honey</h4>
      <p>A powerhouse blend of anti-inflammatory turmeric and warming ginger root. This infusion has a beautiful deep golden-orange hue and a slightly spicy kick. It is the perfect base for making "Golden Milk" or adding to warm water and apple cider vinegar for an invigorating wellness shot.</p>

      <h3>Tasting Tips</h3>
      <p>To fully appreciate different honey varieties:</p>
      <ul>
        <li>Taste the honey at room temperature.</li>
        <li>Let a small spoon of honey melt slowly on the tongue before swallowing.</li>
        <li>Notice the initial sweetness, the middle floral or herbal notes, and the lingering aftertaste.</li>
      </ul>
      <p>Explore our shop and find the variety that connects with your wellness needs and palate!</p>
    `
  }
];

const categories = ["All", "Health & Purity", "Beekeeping", "Recipes", "Sustainability"];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = activeCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = blogPosts[0];

  // If an article is open in detailed reading view
  if (selectedPost) {
    return (
      <div className="blog-page">
        <Navbar />
        <main className="blog-reader-main">
          <div className="reader-container">
            <button className="back-to-blog-btn" onClick={() => {
              setSelectedPost(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
              <ArrowLeft size={18} />
              <span>Back to Journal</span>
            </button>

            <article className="full-article page-fade-in">
              <header className="article-header">
                <span className="article-category-badge">{selectedPost.category}</span>
                <h1 className="article-title">{selectedPost.title}</h1>

                <div className="article-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{selectedPost.date}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>
              </header>

              <div className="article-hero-image">
                <img src={selectedPost.image} alt={selectedPost.title} />
              </div>

              <div
                className="article-body-content"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </article>

            <div className="article-footer-divider"></div>

            <div className="related-articles-section">
              <h3>Keep Reading</h3>
              <div className="related-grid">
                {blogPosts
                  .filter(p => p.id !== selectedPost.id)
                  .slice(0, 2)
                  .map(post => (
                    <div key={post.id} className="related-card" onClick={() => {
                      setSelectedPost(post);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}>
                      <div className="related-img-wrapper">
                        <img src={post.image} alt={post.title} />
                      </div>
                      <div className="related-text">
                        <span className="related-cat">{post.category}</span>
                        <h4>{post.title}</h4>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="blog-page">
      <Navbar />

      <main className="blog-main">
        {/* Blog Hero Banner */}
        <section className="blog-hero page-fade-in">
          <div className="blog-hero-content">
            <span className="blog-subtitle-label">BEE MAGIC JOURNAL</span>
            <h1>The Honey Journal</h1>
            <p>Stories of artisanal apiary craft, medicinal plants, bee conservation, and nature's golden elixir.</p>
          </div>
        </section>

        {/* Featured Post Card */}
        {activeCategory === "All" && (
          <section className="featured-post-section reveal-on-scroll slide-up">
            <div className="featured-blog-card">
              <div className="featured-img-wrapper">
                <img src={featuredPost.image} alt={featuredPost.title} />
              </div>
              <div className="featured-content-wrapper">
                <div className="featured-meta">
                  <span className="featured-category">{featuredPost.category}</span>
                  <div className="meta-row">
                    <span className="meta-item"><Calendar size={14} /> {featuredPost.date}</span>
                    <span className="meta-item"><Clock size={14} /> {featuredPost.readTime}</span>
                  </div>
                </div>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <button
                  className="read-article-btn"
                  onClick={() => {
                    setSelectedPost(featuredPost);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Read Full Article</span>
                  <ArrowRight size={18} className="arrow-icon" />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Category Tabs */}
        <section className="category-filter-section reveal-on-scroll slide-up">
          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-tab-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="blog-posts-grid-section">
          <div className="blog-grid">
            {filteredPosts.map((post, index) => (
              <article key={post.id} className={`blog-card reveal-on-scroll slide-up delay-${(index % 3 + 1) * 100}`}>
                <div className="blog-card-img-wrapper" onClick={() => {
                  setSelectedPost(post);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>
                  <img src={post.image} alt={post.title} />
                  <span className="blog-card-category">{post.category}</span>
                </div>

                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span className="meta-item"><Calendar size={14} /> {post.date}</span>
                    <span className="meta-item"><Clock size={14} /> {post.readTime}</span>
                  </div>
                  <h3 onClick={() => {
                    setSelectedPost(post);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}>
                    {post.title}
                  </h3>
                  <p>{post.excerpt}</p>

                  <button
                    className="blog-card-read-link"
                    onClick={() => {
                      setSelectedPost(post);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span>Read Article</span>
                    <ArrowRight size={16} className="arrow-icon" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="empty-blog-state">
              <Bookmark size={40} />
              <h4>No articles found</h4>
              <p>We are currently writing new articles in this category. Check back soon!</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
