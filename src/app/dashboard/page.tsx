"use client"
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the type for the API response
interface AlternativeResult {
  Material: string;
  "Original Score": number;
  Substitute: string;
  "Substitute Score": number;
}

const ProductAlternativeFinder = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<AlternativeResult | null>(null); // Specify type for result
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      // Replace with your API endpoint
      const response = await fetch(`https://my-flask-app-brown.vercel.app/recommend?material=${encodeURIComponent(query)}`,{
        mode:'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: AlternativeResult = await response.json();

      // Check if all required fields are present
      if (data && data.Material && data["Original Score"] !== undefined && data.Substitute && data["Substitute Score"] !== undefined) {
        setResult(data); // Store the single object in state
      } else {
        setError("Unexpected response format from the server.");
      }
    } catch (err) {
      setError('Failed to fetch alternatives. Please try again later.');
      console.error('Error fetching alternatives:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Product Alternative Finder</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter a product name to find alternatives"
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Card>
            <CardContent className="p-8 flex justify-center items-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </CardContent>
          </Card>
        )}

        {!isLoading && result && (
          <Card className="hover:shadow-lg transition-shadow mb-4">
            <CardContent className="p-4">
              <div>
                <h3 className="text-lg font-semibold">Original Material: {result.Material}</h3>
                <p className="text-gray-600">Original Score (Lower is Better): {result["Original Score"]}</p>
                <h4 className="text-lg mt-2 font-semibold">Suggested Substitute:</h4>
                <p className="text-gray-600">{result.Substitute}</p>
                <p className="text-gray-600">Substitute Score (Lower is Better): {result["Substitute Score"]}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && query && !result && !error && (
          <Card>
            <CardContent className="p-4 text-center text-gray-600">
              No alternatives found. Try searching for a different product.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductAlternativeFinder;
