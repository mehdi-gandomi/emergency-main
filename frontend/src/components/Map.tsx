import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, X } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create pulsing marker icon
const createPulsingIcon = (isDraggable = true) => {
  return L.divIcon({
    className: 'pulsing-marker',
    html: `
      <div class="marker-container" style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: ${isDraggable ? 'grab' : 'pointer'};
      ">
        <div class="pulse-ring" style="
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: rgba(220, 38, 38, 0.3);
          animation: subtle-pulse 3s infinite ease-in-out;
        "></div>
        <div class="marker-core" style="
          background-color: #dc2626;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          z-index: 1;
          position: relative;
          transition: transform 0.2s ease;
        ">
          🚨
        </div>
        ${isDraggable ? `
        <div class="drag-indicator" style="
          position: absolute;
          bottom: -8px;
          right: -8px;
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          z-index: 2;
          transition: all 0.3s ease;
        ">
          ✋
        </div>
        <div class="hover-hint" style="
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(59, 130, 246, 0.9);
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
          z-index: 3;
        ">
          بکشید
        </div>` : ''}
      </div>
      <style>
        @keyframes subtle-pulse {
          0% { 
            transform: scale(1); 
            opacity: 0.3; 
          }
          50% { 
            transform: scale(1.6); 
            opacity: 0.1; 
          }
          100% { 
            transform: scale(1); 
            opacity: 0.3; 
          }
        }
        
        .pulsing-marker {
          animation: none;
        }
        
        .pulsing-marker .pulse-ring {
          animation: subtle-pulse 3s infinite ease-in-out;
        }
        
        .pulsing-marker:hover .marker-core {
          transform: scale(1.15);
          box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        }
        
        .pulsing-marker:hover .drag-indicator {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          transform: scale(1.3);
          box-shadow: 0 3px 8px rgba(59, 130, 246, 0.5);
        }
        
        .pulsing-marker:hover .hover-hint {
          opacity: 1;
        }
        
        .pulsing-marker:hover .pulse-ring {
          animation-duration: 2s;
          opacity: 0.5;
          transform: scale(1.1);
        }
        
        .pulsing-marker:active {
          cursor: grabbing !important;
        }
        
        .pulsing-marker:active .pulse-ring {
          animation-play-state: paused !important;
          opacity: 0.1 !important;
        }
        
        .pulsing-marker:active .marker-core {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        
        .pulsing-marker:active .drag-indicator {
          background-color: #1d4ed8;
          transform: scale(1.2);
        }
        
        .pulsing-marker.dragging .pulse-ring {
          animation-play-state: paused !important;
          opacity: 0.05 !important;
          transform: scale(1.2);
        }
        
        .pulsing-marker.dragging .marker-core {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.5);
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Component to handle flying to new positions
function FlyToPosition({ position, shouldFlyTo }: { position: [number, number] | null, shouldFlyTo: boolean }) {
  const map = useMap();
  const prevPosition = useRef<[number, number] | null>(null);
  const isFlying = useRef(false);

  useEffect(() => {
    // Only flyTo when shouldFlyTo is true (coordinates set via props like "دریافت موقعیت")
    if (position && position !== prevPosition.current && !isFlying.current && shouldFlyTo) {
      isFlying.current = true;
      
      // Wait for tiles to load before flying
      const flyToPosition = () => {
        map.flyTo(position, 15, {
          animate: true,
          duration: 1.5,
        });
        prevPosition.current = position;
        isFlying.current = false;
      };

      // Check if map is ready
      if (map.getSize().x > 0 && map.getSize().y > 0) {
        // Map is ready, fly immediately
        flyToPosition();
      } else {
        // Wait for map to be ready, then fly
        map.once('load', flyToPosition);
        // Also try to fly after a short delay as backup
        setTimeout(flyToPosition, 200);
      }
    } else if (position && position !== prevPosition.current) {
      // Just update the previous position without flying
      prevPosition.current = position;
    }
  }, [position, map, shouldFlyTo]);

  return null;
}

// Component to handle map size invalidation and tile loading
function InvalidateSize() {
  const map = useMap();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      
      // Force tile refresh after size invalidation
      setTimeout(() => {
        map.getContainer().dispatchEvent(new Event('resize'));
      }, 100);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [map]);
  
  return null;
}

// Component to handle tile loading
function TileLoader() {
  const map = useMap();
  
  useEffect(() => {
    const handleTileLoad = () => {
      // Force a refresh when tiles load
      map.invalidateSize();
    };

    map.on('tileload', handleTileLoad);
    
    return () => {
      map.off('tileload', handleTileLoad);
    };
  }, [map]);
  
  return null;
}

// Component to handle direct map clicks
function MapClickHandler({ onPositionChange }: { onPositionChange: (pos: [number, number]) => void }) {
  const map = useMap();
  
  // Handle map click to set marker (without flyTo)
  useEffect(() => {
    const handleMapClick = (e: any) => {
      const { lat, lng } = e.latlng;
      // Force immediate update with requestAnimationFrame
      requestAnimationFrame(() => {
        onPositionChange([lat, lng]);
      });
    };

    map.on('click', handleMapClick);
    
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onPositionChange]);
  
  return null;
}

// Component to handle map interactions
function MapInteractions({ position, onPositionChange }: { position: [number, number] | null, onPositionChange: (pos: [number, number]) => void }) {
  const map = useMap();
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string, lat: string, lon: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  

  // Geocoding search function
  const searchAddress = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=ir`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Geocoding error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search result selection with flyTo
  const handleResultSelect = (result: { lat: string, lon: string }) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    const newPosition: [number, number] = [lat, lon];
    
    // Set the marker position
    onPositionChange(newPosition);
    
    // FlyTo the selected location with smooth animation
    map.flyTo(newPosition, 15, {
      animate: true,
      duration: 1.5,
    });
    
    // Clear search state
    setSearchResults([]);
    setSearchQuery('');
    setIsSearchExpanded(false);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchAddress(query);
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      setIsSearchExpanded(false);
      setSearchResults([]);
      setSearchQuery('');
    }
    // If Enter is pressed and there's exactly one result, select it
    if (e.key === 'Enter' && searchResults.length === 1) {
      e.preventDefault();
      handleResultSelect(searchResults[0]);
    }
  };

  // Toggle search expansion (prevent marker setting)
  const toggleSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    (e as any).nativeEvent?.stopImmediatePropagation?.();
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setSearchResults([]);
      setSearchQuery('');
    }
  };

  return (
    <div className="absolute top-4 right-4 z-1000">
      {/* Search Icon/Input */}
      <div 
        className="relative" 
        onClick={(e) => {
          e.stopPropagation();
          (e as any).nativeEvent?.stopImmediatePropagation?.();
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          (e as any).nativeEvent?.stopImmediatePropagation?.();
        }}
      >
        {!isSearchExpanded ? (
          // Search Icon Button
          <button
            onClick={toggleSearch}
            onMouseDown={(e) => {
              e.stopPropagation();
              (e as any).nativeEvent?.stopImmediatePropagation?.();
            }}
            className="w-12 h-12 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl shadow-lg hover:bg-blue-50 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex items-center justify-center group"
            title="جستجوی آدرس"
          >
            <Search className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
          </button>
        ) : (
          // Expanded Search Input
          <div className="relative animate-in slide-in-from-right-5 duration-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
              <input
                type="text"
                placeholder="جستجوی آدرس..."
                value={searchQuery}
                onChange={handleSearchChange}
                onClick={(e) => {
                  e.stopPropagation();
                  (e as any).nativeEvent?.stopImmediatePropagation?.();
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  (e as any).nativeEvent?.stopImmediatePropagation?.();
                }}
                onFocus={(e) => {
                  e.stopPropagation();
                  (e as any).nativeEvent?.stopImmediatePropagation?.();
                }}
                onKeyDown={handleKeyDown}
                className="w-80 h-12 pl-12 pr-12 py-2 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 text-right transition-all duration-300 placeholder:text-gray-400"
                autoFocus
              />
              <button
                onClick={toggleSearch}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  (e as any).nativeEvent?.stopImmediatePropagation?.();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 group"
                title="بستن"
              >
                <X className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors" />
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      (e as any).nativeEvent?.stopImmediatePropagation?.();
                      handleResultSelect(result);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      (e as any).nativeEvent?.stopImmediatePropagation?.();
                    }}
                    className="w-full p-4 text-right hover:bg-blue-50 hover:shadow-sm border-b border-gray-100 last:border-b-0 transition-all duration-200 group first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5 group-hover:text-blue-600 transition-colors" />
                      <span className="text-sm text-gray-700 line-clamp-2 text-right leading-relaxed group-hover:text-gray-900 transition-colors">
                        {result.display_name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Loading Indicator */}
            {isSearching && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl shadow-xl animate-in fade-in-0 duration-200">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="text-sm text-gray-600 font-medium">در حال جستجو...</span>
                </div>
              </div>
            )}

            {/* No Results Found */}
            {!isSearching && searchQuery.length > 0 && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-xl shadow-xl animate-in fade-in-0 duration-200">
                <div className="flex items-center justify-center gap-3 text-gray-500">
                  <Search className="h-5 w-5" />
                  <span className="text-sm font-medium">هیچ نتیجه‌ای یافت نشد</span>
                </div>
              </div>
            )}
      </div>
        )}
      </div>
    </div>
  );
}

// Default center (Tehran)
const DEFAULT_CENTER: [number, number] = [32.4279, 53.6880];

interface MapProps {
  position: [number, number] | null;
  onPositionChange?: (position: [number, number]) => void;
  shouldFlyTo?: boolean;
  enableMarkerDrag?: boolean;
}

export default function Map({ position, onPositionChange, shouldFlyTo = false, enableMarkerDrag = true }: MapProps) {
  const center = DEFAULT_CENTER;
  const zoom = position ? 9 : 5;

  // keep icon instance stable
  const pulsingIcon = useMemo(() => createPulsingIcon(enableMarkerDrag), [enableMarkerDrag]);

  // Keep a local mirror so marker shows immediately on click
  const [internalPosition, setInternalPosition] = useState<[number, number] | null>(position);
  
  // Only update internal position when position prop changes
  useEffect(() => {
    setInternalPosition(position ?? null);
  }, [position]);
  
  // Force marker to appear immediately when position changes
  useEffect(() => {
    if (internalPosition && mapRef.current) {
      const map = mapRef.current;
      // This forces the map to recognize the marker position
      setTimeout(() => {
        map.invalidateSize();
      }, 0);
    }
  }, [internalPosition]);

  // Handle map click directly in the main component
  const mapRef = useRef<L.Map | null>(null);
  
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      
      const handleMapClick = (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const newPosition: [number, number] = [lat, lng];
        
        // Update internal position immediately
        setInternalPosition(newPosition);
        
        // Notify parent
        if (onPositionChange) onPositionChange(newPosition);
      };
      
      map.on('click', handleMapClick);
      
      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [onPositionChange]);
  
  // Default position change handler (updates local + parent)
  const handlePositionChange = useCallback((newPosition: [number, number]) => {
    setInternalPosition(newPosition);           // <— make sure the marker appears/moves now
    if (onPositionChange) onPositionChange(newPosition);
  }, [onPositionChange]);

  // Cast components to any to avoid TypeScript issues
  const AnyMapContainer: any = MapContainer as any;
  const AnyTileLayer: any = TileLayer as any;
  const AnyMarker: any = Marker as any;

  return (
    <div className="h-full w-full relative">
      <AnyMapContainer
        key={internalPosition ? `map-${internalPosition[0]}-${internalPosition[1]}` : 'map-default'}
        center={internalPosition || center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="rounded-xl"
        scrollWheelZoom={true}
        ref={mapRef}
      >
        <AnyTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          minZoom={2}
          updateWhenIdle={false}
          updateWhenZooming={false}
          keepBuffer={2}
        />
        
        {/* Show marker only when position is available */}
        {internalPosition && (
          <AnyMarker
            position={internalPosition}
            icon={pulsingIcon}
            draggable={enableMarkerDrag}
            eventHandlers={enableMarkerDrag ? {
              dragstart: (event: any) => {
                const marker = event.target;
                const map = marker._map;
                const markerElement = marker.getElement();
                
                // Disable map dragging when marker dragging starts
                if (map) {
                  map.dragging.disable();
                  map.doubleClickZoom.disable();
                  map.scrollWheelZoom.disable();
                  map.boxZoom.disable();
                  map.keyboard.disable();
                  if (map.tap) map.tap.disable();
                }
                
                if (markerElement) {
                  markerElement.classList.add('dragging');
                }
              },
              dragend: (event: any) => {
                const marker = event.target;
                const map = marker._map;
                const markerElement = marker.getElement();
                
                // Re-enable map dragging when marker dragging ends
                if (map) {
                  map.dragging.enable();
                  map.doubleClickZoom.enable();
                  map.scrollWheelZoom.enable();
                  map.boxZoom.enable();
                  map.keyboard.enable();
                  if (map.tap) map.tap.enable();
                }
                
                if (markerElement) {
                  markerElement.classList.remove('dragging');
                }
                
                const newPosition = marker.getLatLng();
                const newPos: [number, number] = [newPosition.lat, newPosition.lng];
                handlePositionChange(newPos); // <— sync local + parent
              },
              drag: (event: any) => {
                // Ensure dragging state is maintained
                const marker = event.target;
                const markerElement = marker.getElement();
                if (markerElement && !markerElement.classList.contains('dragging')) {
                  markerElement.classList.add('dragging');
                }
              },
            } : undefined}
          />
        )}
        
        {/* Helper components */}
        <InvalidateSize />
        <FlyToPosition position={internalPosition} shouldFlyTo={shouldFlyTo} />
        <TileLoader />
        <MapClickHandler onPositionChange={handlePositionChange} />
        {/* <MapInteractions position={internalPosition} onPositionChange={handlePositionChange} /> */}
      </AnyMapContainer>
    </div>
  );
}
