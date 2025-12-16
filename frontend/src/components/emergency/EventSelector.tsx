import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronDown, Search, X, Calendar, MapPin } from "lucide-react";
import { eventService, Event, EventFilters } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface EventSelectorProps {
  selectedEventId?: number;
  onEventSelect: (eventId: number | undefined) => void;
  filters?: EventFilters;
  operation_status?: number; // optional override for operation status filter
}

export const EventSelector = ({ selectedEventId, onEventSelect, filters = {}, operation_status }: EventSelectorProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const selectedEvent = events?.find(e => e.id === selectedEventId);

  useEffect(() => {
    // Fetch events when filters change
    const fetchEvents = async () => {
      // Only fetch if we have at least type_event_id
      // if (!filters.type_event_id) {
      //   setEvents([]);
      //   return;
      // }

      setIsLoading(true);
      try {
        const response = await eventService.getEvents({
          ...filters,
          ...(operation_status !== undefined ? { operation_status } : {}),
          per_page: 100, // Get more events for client-side search
        });
        console.log(response);
        // Ensure we always set an array
        setEvents(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filters.type_event_id, filters.province_id, filters.branches_id, filters.operation_status, operation_status]);

  // Client-side filtering based on search term
  const filteredEvents = (events || []).filter(event => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      event.detailed_description?.toLowerCase().includes(searchLower) ||
      event.exact_location?.toLowerCase().includes(searchLower) ||
      event.num_report?.toString().includes(searchLower) ||
      event.id?.toString().includes(searchLower)
    );
  });

  const formatDate = (unixTimestamp: number) => {
    if (!unixTimestamp) return '';
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString('fa-IR');
  };

  const getOperationStatusLabel = (status: number) => {
    switch (status) {
      case 1: return 'در حال انجام';
      case 2: return 'پایان موقت';
      case 3: return 'پایان عملیات';
      default: return 'نامشخص';
    }
  };

  const getOperationStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-blue-100 text-blue-700 border-blue-300';
      case 2: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 3: return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="popover-trgigger-full">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-11 w-full justify-between text-right"
            disabled={!filters.type_event_id || isLoading}
          >
            {selectedEvent ? (
              <div className="flex items-center gap-2 flex-1 overflow-hidden">
                <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">
                  #{selectedEvent.id}
                </span>
                <span className="truncate">{selectedEvent.detailed_description}</span>
              </div>
            ) : (
              <span className="text-slate-500">
                {!filters.type_event_id 
                  ? "ابتدا نوع حادثه را انتخاب کنید"
                  : isLoading 
                    ? "در حال بارگذاری..."
                    : "انتخاب حادثه مرتبط"
                }
              </span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="popover-content-full p-0" align="start">
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                placeholder="جستجو در شرح حادثه، مکان یا شماره گزارش..."
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CommandList>
              <CommandEmpty>
                {isLoading ? (
                  <div className="py-6 text-center text-sm">در حال بارگذاری...</div>
                ) : (
                  <div className="py-6 text-center text-sm">حادثه‌ای یافت نشد</div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredEvents.map((event) => (
                  <CommandItem
                    key={event.id}
                    value={String(event.id)}
                    onSelect={() => {
                      onEventSelect(event.id === selectedEventId ? undefined : event.id);
                      setOpen(false);
                      setSearchTerm("");
                    }}
                    className="flex flex-col items-start gap-2 p-3 cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded font-semibold">
                          #{event.id}
                        </span>
                        <span className="font-mono text-xs text-slate-500">
                          گزارش: {event.num_report}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getOperationStatusColor(event.operation_status)}`}
                        >
                          {getOperationStatusLabel(event.operation_status)}
                        </Badge>
                      </div>
                      {event.id === selectedEventId && (
                        <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="h-2 w-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-sm font-medium text-right w-full">
                      {event.detailed_description}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500 w-full">
                      {event.date_accident && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{event.date_accident}</span>
                          {event.time_accident && <span>{event.time_accident}</span>}
                        </div>
                      )}
                      {event.exact_location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{event.exact_location}</span>
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Event Display */}
      {selectedEvent && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs bg-blue-100 px-2 py-1 rounded font-semibold">
                  #{selectedEvent.id}
                </span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getOperationStatusColor(selectedEvent.operation_status)}`}
                >
                  {getOperationStatusLabel(selectedEvent.operation_status)}
                </Badge>
              </div>
              <p className="text-sm font-medium text-right">{selectedEvent.detailed_description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                {selectedEvent.date_accident && (
                  <span>📅 {selectedEvent.date_accident}</span>
                )}
                {selectedEvent.exact_location && (
                  <span>📍 {selectedEvent.exact_location}</span>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onEventSelect(undefined)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};