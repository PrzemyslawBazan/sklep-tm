'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ServiceCard from './components/ServiceCard';
import { useServices } from './hooks/useServices';
import { useCartActions, useIsCartHydrated, useTotalItems } from '../app/contexts/CartContext';

export default function Home() {
  const router = useRouter();
  const { data: services = [], isLoading, isError, error } = useServices();
  const { addToCart } = useCartActions();
  const totalItems = useTotalItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isHovered, setIsHovered] = useState(false);

  const isHydrated = useIsCartHydrated();


  // Refs for scrollable containers
  const scrollRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const goToCart = () => {
    router.push('/cart');
  };

  const scroll = (category: string, direction: 'left' | 'right') => {
    const container = scrollRefs.current[category];
    if (container) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Błąd ładowania usług</h2>
          <p className="text-gray-600 mb-6">
            {error?.message || 'Wystąpił problem podczas pobierania usług.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  // Service categories for navigation
  const categories = [
    { name: 'Księgowe', key: 'accounting' },
    { name: 'Kadrowe', key: 'hr' },
    { name: 'Prawne', key: 'legal' },
    { name: 'Imigracyjne', key: 'immigration' },
    { name: 'Doradztwo podatkowe', key: 'tax' }
  ];

  const filteredServices = services.filter((service) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCategoryTab = activeCategory === 'all' || service.category === activeCategory;

    if (query === '') {
      return matchesCategoryTab;
    }

    const nameMatch = (service.name || '').toLowerCase().includes(query);
    const descriptionMatch = (service.description || '').toLowerCase().includes(query);
    const categoryTextMatch = (service.category || '').toLowerCase().includes(query);
    const deliverablesMatch = Array.isArray(service.deliverables)
      ? service.deliverables.some((d) => (d || '').toLowerCase().includes(query))
      : false;

    const matchesSearch = nameMatch || descriptionMatch || categoryTextMatch || deliverablesMatch;
    return matchesCategoryTab && matchesSearch;
  });


  return (
    <div className="min-h-screen bg-gray-50">
     <div className="relative h-[400px] bg-cover bg-center bg-no-repeat md:h-[400px] h-[300px]" 
     style={{
       backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/images/background-img.png')`,
      backgroundPosition: 'center 20%'

     }}>

   <div className="absolute inset-0 flex flex-col">
  <div className="absolute top-8 left-0 md:top-8 top-4">
  <div className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 px-2">
    <h1 className="md:text-2xl md:text-3xl text-xl font-bold text-white md:ml-0 ml-2">
      Sklep z usługami
    </h1>
  </div>
</div>

  <div className="flex-1 flex items-center justify-center">
    <div className="w-full max-w-2xl md:px-4 px-2">
      <div className="relative">
        <input
          type="text"
          placeholder="Szukaj usług"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:px-6 px-4 md:py-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 md:text-base text-sm"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <svg className="md:w-5 md:h-5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div className="md:pb-8 pb-4">
    <div className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 px-2">
      <div className="flex md:justify-between justify-start md:gap-0 gap-2 items-center overflow-x-auto md:overflow-visible">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`md:text-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap md:px-0 px-2 ${
              activeCategory === category.key
                ? 'text-blue-300 border-b-2 border-blue-300 pb-1'
                : 'text-white hover:text-blue-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>  
      </div>


      <div className="bg-gray-100 md:py-6 py-3">
        <div className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 px-2">
          <div className="flex flex-col md:flex-row items-center justify-between md:gap-6 gap-3">
            <div className="flex-1">
              <p className="md:text-lg text-sm text-gray-700 font-medium md:text-left text-center">
                Jako stały klient Tax&Money zyskujesz rabat 20% na wszystkie nasze usługi
              </p>
            </div>
            <button className="bg-blue-600 text-white md:px-8 px-4 md:py-3 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap md:text-base text-sm" >
              <a href='https://taxm.pl/'>Zleć księgowość i zdobądź rabaty!</a>
            </button>
          </div>
        </div>
      </div>

   <main className="bg-custom-beige">
  <div className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 px-4 md:py-12 py-6">

  {(() => {
    const categoryNames: Record<string, string> = {
      accounting: 'Usługi księgowe',
      hr: 'Usługi kadrowe',
      legal: 'Usługi prawne',
      immigration: 'Usługi imigracyjne',
      tax: 'Doradztwo podatkowe'
    };

    // Filter services by search query
    const searchFilteredServices = services.filter((service) => {
      if (!searchQuery.trim()) return true;
      
      const query = searchQuery.toLowerCase();
      const nameMatch = (service.name || '').toLowerCase().includes(query);
      const descriptionMatch = (service.description || '').toLowerCase().includes(query);
      const categoryTextMatch = (service.category || '').toLowerCase().includes(query);
      const deliverablesMatch = Array.isArray(service.deliverables)
        ? service.deliverables.some((d) => (d || '').toLowerCase().includes(query))
        : false;

      return nameMatch || descriptionMatch || categoryTextMatch || deliverablesMatch;
    });

    // Filter by active category
    const filteredServices = activeCategory === 'all' 
      ? searchFilteredServices 
      : searchFilteredServices.filter(service => service.category === activeCategory);

    // Group services by category
    const groupedServices = filteredServices.reduce((acc, service) => {
      const category = service.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(service);
      return acc;
    }, {} as Record<string, typeof services>);

    return (
      <>
        {Object.keys(groupedServices).length > 0 ? (
          Object.entries(groupedServices).map(([category, categoryServices]) => (
            <section key={category} className="md:mb-12 mb-6">
              <div className="flex items-center justify-between md:mb-6 mb-4">
                <h2 className="md:text-2xl text-lg font-bold text-gray-900">
                  {categoryNames[category] || category}
                </h2>
              </div>

              <div className="relative group">
                <div className="relative md:-mx-4 md:px-4 -mx-2 px-2">
                  {categoryServices.length > 4 && (
                    <button
                      onClick={() => scroll(category, 'left')}
                      className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      aria-label="Scroll left"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  <div 
                    ref={(el) => { scrollRefs.current[category] = el; }}
                    className="flex md:flex-row flex-col md:gap-4 gap-3 md:overflow-x-auto overflow-visible md:pb-4 pb-0 md:snap-x snap-none md:snap-mandatory"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                  >
                    {categoryServices.map((service) => (
                      <div key={service.id} className="md:snap-start w-full md:w-auto">
                        <ServiceCard
                          service={service}
                          onAddToCart={addToCart}
                        />
                      </div>
                    ))}
                  </div>

                  {categoryServices.length > 4 && (
                    <button
                      onClick={() => scroll(category, 'right')}
                      className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      aria-label="Scroll right"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
            </section>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center md:py-16 py-8 text-center">
            <div className="mb-4 inline-flex md:h-12 md:w-12 h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <svg className="md:h-6 md:w-6 h-5 w-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
              </svg>
            </div>
            <h3 className="md:text-lg text-base font-medium text-gray-900 mb-1">
              {searchQuery || activeCategory !== 'all' ? 'Nie znaleziono usług' : 'Brak dostępnych usług'}
            </h3>
            <p className="text-gray-600 max-w-md md:text-base text-sm md:px-0 px-4">
              {searchQuery || activeCategory !== 'all'
                ? 'Spróbuj zmienić kryteria wyszukiwania lub wybrać inną kategorię.'
                : 'Obecnie nie ma aktywnych usług do wyświetlenia.'}
            </p>
            {(searchQuery || activeCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-6 inline-flex items-center rounded-lg bg-blue-600 md:px-5 px-4 md:py-2.5 py-2 text-white hover:bg-blue-700 transition-colors md:text-base text-sm"
              >
                Wyczyść filtry
              </button>
            )}
          </div>
        )}
      </>
    );
  })()}
  </div>
</main>
      <div className="fixed md:bottom-6 md:right-6 bottom-4 right-4 z-50">
      <button
            onClick={goToCart}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`Shopping cart with ${totalItems} items`}
            className="group relative inline-flex items-center justify-center gap-2.5 
                       h-11 px-5 
                       bg-zinc-900 hover:bg-zinc-800 
                       border border-zinc-800 hover:border-zinc-700
                       rounded-xl
                       text-zinc-100
                       shadow-lg shadow-black/20
                       transition-all duration-200 ease-out
                       hover:shadow-xl hover:shadow-black/30
                       hover:-translate-y-0.5
                       active:translate-y-0 active:shadow-md
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <svg
              className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>

            <span className="text-sm font-medium">Koszyk</span>

            {totalItems > 0 && (
              <span
                className="inline-flex items-center justify-center 
                           min-w-[1.375rem] h-[1.375rem] px-1.5
                           bg-emerald-500 
                           text-zinc-950 text-xs font-semibold
                           rounded-full
                           transition-transform duration-200
                           group-hover:scale-110"
              >
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
      </div>
    </div>
  );
}