'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ServiceCard from './components/ServiceCard';
import { useServices } from './hooks/useServices';
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

   <div className="absolute inset-0 overflow-hidden bg-custom-beige">
  <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-blue-100" />
  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
  <div className="absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-blue-300/40 blur-3xl" />

  <div className="relative z-10 flex h-full flex-col">
  <div className="pt-6 sm:pt-8 lg:pt-10">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="inline-flex items-center rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm backdrop-blur-md">
        Premium marketplace
      </div>

      <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
        Sklep z usługami
      </h1>

      <p className="mt-3 max-w-xl text-sm sm:text-base leading-6 text-slate-600">
        Miejsce do szybkiego wyszukiwania i zamawiania usług w Tax&Money.
      </p>
    </div>
  </div>

  <div className="flex flex-1 items-center justify-center px-4 sm:px-6">
    <div className="w-full max-w-3xl">
      <div className="rounded-3xl border border-white/70 bg-white/70 p-1.5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Szukaj usług..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveCategory("all");
            }}
            className="h-12 sm:h-13 w-full rounded-[1.35rem] bg-transparent pl-5 pr-14 text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none"
          />

          <button className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-95">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>

  <div className="pb-5 sm:pb-7 lg:pb-10">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
        {categories.map((category) => {
          const isActive = activeCategory === category.key;

          return (
            <Button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              disableElevation
              sx={{
                flexShrink: 0,
                borderRadius: "14px",
                px: { xs: 2.5, sm: 3 },
                py: 1,
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                fontWeight: 500,
                textTransform: "none",
                letterSpacing: "0.01em",
                backdropFilter: "blur(10px)",
                transition: "all 0.2s ease",
                border: "1px solid rgba(255,255,255,0.7)",

                ...(isActive
                  ? {
                      background: "rgba(37, 99, 235, 0.08)",
                      color: "#1d4ed8",
                      borderColor: "rgba(37, 99, 235, 0.25)",
                      boxShadow: "0 4px 12px rgba(37,99,235,0.12)",
                    }
                  : {
                      background: "rgba(255,255,255,0.6)",
                      color: "#475569",
                      boxShadow: "0 2px 6px rgba(15,23,42,0.05)",
                    }),

                "&:hover": {
                  ...(isActive
                    ? {
                        background: "rgba(37, 99, 235, 0.12)",
                      }
                    : {
                        background: "rgba(255,255,255,0.9)",
                        color: "#0f172a",
                        boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
                      }),
                },

                "&:active": {
                  transform: "scale(0.97)",
                },
              }}
            >
              {category.name}
            </Button>
          );
        })}

        {activeCategory !== "all" && (
          <Button
            onClick={() => setActiveCategory("all")}
            startIcon={<CloseIcon />}
            disableElevation
            sx={{
              flexShrink: 0,
              borderRadius: "14px",
              px: { xs: 2.5, sm: 3 },
              py: 1,
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              fontWeight: 500,
              textTransform: "none",
              backdropFilter: "blur(10px)",
              border: "1px dashed rgba(148,163,184,0.4)",
              background: "rgba(255,255,255,0.6)",
              color: "#64748b",
              transition: "all 0.2s ease",

              "&:hover": {
                background: "rgba(255,255,255,0.9)",
                color: "#0f172a",
                borderColor: "rgba(100,116,139,0.6)",
              },

              "&:active": {
                transform: "scale(0.97)",
              },
            }}
          >
            Wyczyść filtry
          </Button>
        )}
      </div>
    </div>
  </div>
</div>
</div>
      </div>

         <div className="py-4 md:py-6">
  <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-1 md:px-2">

      <div className="relative pl-4 md:pl-5">
        <span className="absolute left-0 top-1/2 h-8 w-[2px] -translate-y-1/2 bg-blue-600 rounded-full" />

        <p className="text-sm md:text-base text-slate-700 font-medium">
          Jako stały klient Tax&Money zyskujesz{" "}
          <span className="text-blue-600 font-semibold">20% rabatu</span>{" "}
          na wszystkie nasze usługi
        </p>

        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Automatycznie aktywowany dla subskrybentów
        </p>
      </div>

      {/* RIGHT CTA */}
      <a
        href="https://taxm.pl/"
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 active:scale-95 whitespace-nowrap"
      >
        Zleć księgowość i zdobądź rabaty
      </a>

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

    const filteredServices = activeCategory === 'all' 
      ? searchFilteredServices 
      : searchFilteredServices.filter(service => service.category === activeCategory);

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
    <section key={category} className="mb-8 md:mb-12">
      <div className="mb-4 md:mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-900">
            {categoryNames[category] || category}
          </h2>
          <div className="mt-2 h-[2px] w-12 bg-blue-600 rounded-full" />
        </div>
      </div>

      <div className="group relative">
        <div className="relative md:-mx-3 md:px-3">
          {categoryServices.length > 4 && (
            <button
              onClick={() => scroll(category, "left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center border border-slate-200 bg-white/95 text-slate-700 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white hover:shadow-lg"
              aria-label="Scroll left"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          <div
            ref={(el) => {
              scrollRefs.current[category] = el;
            }}
            className="flex flex-col gap-3 md:flex-row md:gap-4 md:overflow-x-auto overflow-visible md:pb-3 md:snap-x md:snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {categoryServices.map((service) => (
              <div
                key={service.id}
                className="w-full md:w-auto md:min-w-[320px] md:max-w-[320px] md:snap-start"
              >
                <ServiceCard
                  service={service}
                  onAddToCart={addToCart}
                />
              </div>
            ))}
          </div>

          {categoryServices.length > 4 && (
            <button
              onClick={() => scroll(category, "right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center border border-slate-200 bg-white/95 text-slate-700 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 hover:bg-white hover:shadow-lg"
              aria-label="Scroll right"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
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
    </div>
  );
}