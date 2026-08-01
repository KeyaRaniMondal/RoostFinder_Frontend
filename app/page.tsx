'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('home');
  const [selectedPropertyType, setSelectedPropertyType] = useState('house');

  const categories = [
    { id: 'home', label: 'Home' },
    { id: 'apartments', label: 'Apartments' },
    { id: 'residential', label: 'Residential' },
  ];

  const propertyTypes = [
    { id: 'city', label: 'City' },
    { id: 'house', label: 'House' },
    { id: 'apartments', label: 'Apartments' },
    { id: 'residential', label: 'Residential' },
  ];

  return (
    <main className="min-h-screen -mt-20">

      <section
        className="min-h-screen flex flex-col justify-between pt-20 pb-8  px-4 md:px-6 lg:px-8 relative"
        style={{
          backgroundImage: "url('/assets/homepage.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 pointer-events-none"></div>
        <div className="relative z-10 max-w-6xl mx-auto w-full mt-20">
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id
                    ? 'bg-white text-slate-900'
                    : 'bg-white/70 text-slate-800 hover:bg-white'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight text-balance max-w-2xl">
            Your Trusted Real Estate Partner
          </h1>

          <p className="text-lg text-white/90 mb-12 max-w-xl leading-relaxed">
            We connect buyers and sellers through a trusted platform with verified properties, transparent deals, and expert guidance—supporting you at every step.
          </p>

          {/* Search Card */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-4xl">
            {/* Search Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {/* Looking For */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3">Looking for</label>
                <input
                  type="text"
                  placeholder="Enter Type"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3">Enter Price</label>
                <input
                  type="text"
                  placeholder="Price"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3">Location</label>
                <input
                  type="text"
                  placeholder="LONDON"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Number of Rooms */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-3">Number Of Room</label>
                <input
                  type="text"
                  placeholder="2 Room"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-slate-600">Filter</span>
                {propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedPropertyType(type.id)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all border ${selectedPropertyType === type.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              <button className="flex-shrink-0 w-12 h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center justify-center transition-all shadow-lg">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Your Primary home might begin to feel left out
            </h2>
          </div>

          <div>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              We connect buyers and sellers through a trusted platform with verified properties, transparent deals, and expert guidance—supporting you at every step.
            </p>
            <Button className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2">
              Learn More
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
