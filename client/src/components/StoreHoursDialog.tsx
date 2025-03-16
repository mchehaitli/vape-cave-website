import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
// Define the store location type inline to avoid import issues
interface StoreLocation {
  id: number;
  name: string;
  city: string;
  address: string;
  full_address: string;
  phone: string;
  hours?: string;
  closed_days?: string;
  image: string;
  lat: number | string;
  lng: number | string;
  opening_hours?: Record<string, string>;
  description?: string;
}

interface StoreHoursDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeLocation: StoreLocation | null;
  onSave: (data: {
    opening_hours: Record<string, string>;
    hours: string;
    closed_days: string;
  }) => Promise<void>;
}

export default function StoreHoursDialog({
  open,
  onOpenChange,
  storeLocation,
  onSave,
}: StoreHoursDialogProps) {
  const [temporaryHours, setTemporaryHours] = useState<Record<string, Record<string, string>>>({});
  const [hoursSummary, setHoursSummary] = useState("");
  const [closedDays, setClosedDays] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [copyingFromDay, setCopyingFromDay] = useState<string | null>(null);

  useEffect(() => {
    if (storeLocation && open) {
      // Initialize from store location data
      const initialHours: Record<string, Record<string, string>> = {};
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      
      // Initialize hours for all days
      days.forEach(day => {
        initialHours[day] = {
          open: '',
          close: ''
        };
      });
      
      // Fill with existing hours if available
      if (storeLocation.opening_hours) {
        Object.entries(storeLocation.opening_hours).forEach(([day, hoursString]) => {
          if (typeof hoursString === 'string') {
            const [open, close] = hoursString.split(' - ');
            if (open && close) {
              initialHours[day] = {
                open,
                close
              };
            }
          }
        });
      }
      
      setTemporaryHours(initialHours);
      setHoursSummary(storeLocation.hours || '');
      setClosedDays(storeLocation.closed_days || '');
    }
  }, [storeLocation, open]);

  const getOpeningHour = (day: string) => {
    return temporaryHours[day]?.open || '';
  };

  const getClosingHour = (day: string) => {
    return temporaryHours[day]?.close || '';
  };

  const handleHourChange = (day: string, type: 'open' | 'close', value: string) => {
    setTemporaryHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: value
      }
    }));
  };

  const handleCopyHours = (day: string) => {
    setCopyingFromDay(day);
  };

  const copyToDay = (targetDay: string) => {
    if (copyingFromDay && copyingFromDay !== targetDay) {
      setTemporaryHours(prev => ({
        ...prev,
        [targetDay]: { ...prev[copyingFromDay] }
      }));
    }
    setCopyingFromDay(null);
  };

  const handleSaveStoreHours = async () => {
    if (!storeLocation) return;
    
    setIsSaving(true);
    
    // Convert temporary hours format to opening_hours format
    const opening_hours: Record<string, string> = {};
    Object.entries(temporaryHours).forEach(([day, hours]) => {
      if (hours.open && hours.close) {
        opening_hours[day] = `${hours.open} - ${hours.close}`;
      }
    });
    
    try {
      await onSave({
        opening_hours,
        hours: hoursSummary,
        closed_days: closedDays
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save store hours:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 sm:max-w-2xl max-h-[90vh] overflow-y-auto mx-4 w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>Manage Store Hours</DialogTitle>
          <DialogDescription className="text-gray-400">
            {storeLocation ? 
              `Update operating hours for ${storeLocation.name} (${storeLocation.city}).` 
              : "Select a store location to manage hours."
            }
          </DialogDescription>
        </DialogHeader>
        
        {storeLocation && (
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="hoursSummary" className="text-sm font-medium">Hours Summary (Public Display)</Label>
              <Textarea 
                id="hoursSummary"
                value={hoursSummary}
                onChange={(e) => setHoursSummary(e.target.value)}
                className="bg-gray-900 border-gray-700 resize-none text-white"
                placeholder="Mon-Fri: 10am-8pm, Sat: 11am-7pm, Sun: Closed"
              />
              <p className="text-xs text-gray-400">This is the formatted text shown to customers on the website.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="closedDays" className="text-sm font-medium">Special Hours & Holiday Closures</Label>
              <Textarea 
                id="closedDays"
                value={closedDays}
                onChange={(e) => setClosedDays(e.target.value)}
                className="bg-gray-900 border-gray-700 resize-none text-white"
                placeholder="Closed on Thanksgiving, Christmas Day, New Year's Day"
              />
              <p className="text-xs text-gray-400">List any special hours, holiday closures, or temporary changes.</p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium">Regular Operating Hours</Label>
                <div className="text-xs text-gray-400">Format: 9:00 AM - 8:00 PM</div>
              </div>
              
              <div className="space-y-3 rounded-md border border-gray-700 p-4 bg-gray-900">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div 
                    key={day} 
                    data-day={day} 
                    className={`flex flex-col sm:flex-row gap-2 sm:items-center ${
                      copyingFromDay === day ? 'ring-2 ring-primary/60 rounded-md p-1 -m-1' : ''
                    }`}
                    onClick={() => copyingFromDay && copyToDay(day)}
                  >
                    <div className="w-28 flex items-center justify-between">
                      <span className="text-sm font-medium">{day}</span>
                      <Button 
                        type="button" 
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyHours(day);
                        }}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center justify-center text-gray-400 hover:text-white">
                              <RefreshCcw size={14} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p className="text-xs">
                              {copyingFromDay === day 
                                ? "Click on another day to copy hours there" 
                                : "Copy these hours to another day"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </Button>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <Label htmlFor={`${day}-open`} className="text-xs text-gray-400 mb-1">Open</Label>
                        <Input
                          id={`${day}-open`}
                          value={getOpeningHour(day)}
                          onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white h-9 text-sm"
                          placeholder="9:00 AM"
                        />
                      </div>
                      <div className="flex flex-col">
                        <Label htmlFor={`${day}-close`} className="text-xs text-gray-400 mb-1">Close</Label>
                        <Input
                          id={`${day}-close`}
                          value={getClosingHour(day)}
                          onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white h-9 text-sm"
                          placeholder="8:00 PM"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {copyingFromDay && (
                <div className="mt-2 text-sm text-primary flex items-center gap-1">
                  <RefreshCcw size={14} />
                  <span>Click on a day to copy hours from {copyingFromDay}</span>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-sm h-auto p-0 ml-2 text-gray-400 hover:text-white"
                    onClick={() => setCopyingFromDay(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-gray-600 text-white hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveStoreHours}
            className="bg-primary hover:bg-primary/90"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <RefreshCcw size={16} className="animate-spin" />
                Saving...
              </div>
            ) : (
              "Save Hours"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}