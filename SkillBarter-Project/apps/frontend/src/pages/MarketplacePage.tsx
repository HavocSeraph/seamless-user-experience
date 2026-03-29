import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Search, Star, User } from 'lucide-react';
import { BookingModal } from '../components/BookingModal'; // Path assumed correct

// Mocking custom fetcher
const api = axios.create({ baseURL: 'http://localhost:3000' });

export function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  // Fetch categorized data
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => [
      { category: 'Development' },
      { category: 'Design' },
      { category: 'Marketing' }
    ] // Placeholder for phase 4 structure
  });

  // Fetch skills based on filters (simulating complex query logic)
  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills', search, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (category) params.append('category', category);
      
      const { data } = await api.get(`/skills/search?${params.toString()}`);
      return data;
    }
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Header & Search */}
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Learn anything from community experts</h1>
        <p className="text-xl text-gray-500">Master new skills by trading your own or using your earned points.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 outline-none"
            placeholder="Search for a skill (e.g. 'Advanced React Patterns')"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-64">
           <select
             className="w-full h-12 rounded-md border bg-white px-3 py-2 text-sm outline-none focus:ring-2"
             value={category}
             onChange={(e) => setCategory(e.target.value)}
           >
             <option value="">All Categories</option>
             {categoriesData?.map((cat) => (
               <option key={cat.category} value={cat.category}>
                 {cat.category}
               </option>
             ))}
           </select>
        </div>
      </div>

      {/* Grid of Results */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              No skills found matching your search.
            </div>
          ) : (
            skills?.map((skill: any) => (
              <div
                key={skill.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                      {skill.category}
                    </span>
                    <span className="flex items-center text-sm font-bold text-gray-700">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                      4.9
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                    {skill.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {skill.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-500 mt-auto">
                    <User className="w-4 h-4 mr-2" />
                    <span>User A</span>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Cost per hour</span>
                    <span className="font-bold text-lg">{skill.priceCoins} Coins</span>
                  </div>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    Book Session
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedSkill && (
        <BookingModal 
          skill={selectedSkill} 
          isOpen={true} 
          onClose={() => setSelectedSkill(null)} 
        />
      )}
    </div>
  );
}