"use client"
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  getAvailability,
  createAvailability,
  deleteAvailability,
  PatchAvailability,
  ChangeDayAvailability,
  Slot
} from "@/lib/availability";
import { getIndividualDoctors } from "@/lib/api/apis";
import { AvailabilityType, SlotType } from "@/lib/types";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Determine slotType by start time
const getSlotType = (startTime: string) => {
  const [hh] = startTime.split(":");
  const hour = parseInt(hh, 10);
  if (hour < 12) return SlotType.MORNING;
  if (hour < 17) return SlotType.AFTERNOON;
  return SlotType.EVENING;
};

export default function WorkingHoursPage() {
  const { user } = useAuth();
  const [availabilityType, setAvailabilityType] = useState<AvailabilityType>(
    AvailabilityType.CLINIC
  );
  
  const [slots, setSlots] = useState<Slot[]>([]);
  const [pendingSlots, setPendingSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resolvedDoctorId, setResolvedDoctorId] = useState<number | null>(null);

  const [availability, setAvailability] = useState<
    Record<string, { active: boolean; showToggle: boolean }>
  >(Object.fromEntries(daysOfWeek.map((day) => [day, { active: true, showToggle: true }])));

  useEffect(() => {
    if (user?.doctorId || user?.id) {
      setLoading(true);
      
      const fetchAndLoad = async () => {
        try {
          const storedDoctorId = typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
          const finalId = parseInt((storedDoctorId || user?.doctorId || user?.id || "0").toString());
          
          setResolvedDoctorId(finalId);
          const data = await getAvailability(finalId);
          
          const formattedData = data.map(s => ({
            ...s,
            startTime: s.startTime ? s.startTime.substring(0, 5) : "09:00",
            endTime: s.endTime ? s.endTime.substring(0, 5) : "17:00",
          }));
          setSlots(formattedData);
        } catch (error) {
           toast.error("Failed to load availability");
        } finally {
           setLoading(false);
        }
      };
      
      fetchAndLoad();
    }
  }, [user]);

  useEffect(() => {
    const updated = Object.fromEntries(
      daysOfWeek.map((day) => {
        const daySlots = [...slots, ...pendingSlots].filter(
          (s) => s.dayOfWeek?.toLowerCase() === day.toLowerCase() && s.availabilityType === availabilityType
        );

        if (daySlots.length === 0) return [day, { active: false, showToggle: false }];

        return [day, { active: daySlots.some(s => s.isActive), showToggle: true }];
      })
    );
    setAvailability(updated as Record<string, { active: boolean; showToggle: boolean }>);
  }, [slots, pendingSlots, availabilityType]);

  const timeToMinutes = (t?: string | null) => {
    if (!t) return null;
    const parts = t.split(":");
    if (parts.length < 2) return null;
    const hh = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return hh * 60 + mm;
  };

  const isOverlapMinutes = (s1: number, e1: number, s2: number, e2: number) => {
    return s1 < e2 && s2 < e1;
  };

  const validateSlotAgainstDay = (combinedSlots: Slot[], slotToValidate: Slot): string | null => {
    const day = slotToValidate.dayOfWeek.toLowerCase();
    const slotStart = timeToMinutes(slotToValidate.startTime);
    const slotEnd = timeToMinutes(slotToValidate.endTime);

    if (slotStart === null || slotEnd === null) {
      return "Please enter both start and end times.";
    }

    if (slotStart >= slotEnd) {
      return `Start time must be before end time (${slotToValidate.startTime} - ${slotToValidate.endTime}).`;
    }

    const duration = slotEnd - slotStart;
    if (duration < 30) {
      return `Each slot must be at least 30 minutes long (${slotToValidate.startTime} - ${slotToValidate.endTime}).`;
    }

    const others = combinedSlots.filter((s) => {
      if (s.dayOfWeek.toLowerCase() !== day) return false;
      // Also separate by availability Type so online/clinic slots can overlap if user wants, 
      // but if user wants strictly no overlap even for types, we leave it as is. 
      // The snippet validation prevented overlaps strictly for the same day.
      if (s.id && slotToValidate.id) return s.id !== slotToValidate.id;
      return s !== slotToValidate;
    });

    for (const o of others) {
      const oStart = timeToMinutes(o.startTime);
      const oEnd = timeToMinutes(o.endTime);
      if (oStart === null || oEnd === null) continue;

      if (oStart === slotStart && oEnd === slotEnd) {
        if(slotToValidate.id) {
            // it's an update, skip if same
        }
        return `Duplicate slot (${slotToValidate.startTime} - ${slotToValidate.endTime}) already exists for ${slotToValidate.dayOfWeek}.`;
      }

      if (isOverlapMinutes(slotStart, slotEnd, oStart, oEnd)) {
        return `Time slot (${slotToValidate.startTime} - ${slotToValidate.endTime}) overlaps with existing (${o.startTime} - ${o.endTime}) for ${slotToValidate.dayOfWeek}.`;
      }
    }

    return null;
  };

  const toggleAllDays = async (checked: boolean) => {
    try {
        const promises = daysOfWeek.map(day => ChangeDayAvailability(day, checked));
        await Promise.all(promises);
        toast.info(checked ? "All days turned on" : "All days turned off");
        if (user?.doctorId || user?.id || (typeof window !== "undefined" && localStorage.getItem("doctorId"))) {
          const storedDoctorId = typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
          const doctorIdVal = resolvedDoctorId || parseInt((storedDoctorId || user?.doctorId || user?.id || "0").toString());
          const data = await getAvailability(doctorIdVal);
          const formattedData = data.map(s => ({
            ...s,
            startTime: s.startTime ? s.startTime.substring(0, 5) : "09:00",
            endTime: s.endTime ? s.endTime.substring(0, 5) : "17:00",
          }));
          setSlots(formattedData);
        }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(err) {
        toast.error("Error toggling all days");
    }
  };

  const handleToggleDay = async (day: string, checked: boolean) => {
    setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], active: checked } }));
    try {
      await ChangeDayAvailability(day, checked);
      toast.success(`Day ${day} updated successfully`);
      if (user?.doctorId || user?.id || (typeof window !== "undefined" && localStorage.getItem("doctorId"))) {
        const storedDoctorId = typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
        const doctorIdVal = resolvedDoctorId || parseInt((storedDoctorId || user?.doctorId || user?.id || "0").toString());
        const data = await getAvailability(doctorIdVal);
        const formattedData = data.map(s => ({
          ...s,
          startTime: s.startTime ? s.startTime.substring(0, 5) : "09:00",
          endTime: s.endTime ? s.endTime.substring(0, 5) : "17:00",
        }));
        setSlots(formattedData);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Error updating day status");
      setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], active: !checked } }));
    }
  };

  const addSlot = (day: string) => {
    const storedDoctorId = typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
    const doctorIdVal = resolvedDoctorId || parseInt((storedDoctorId || user?.doctorId || user?.id || "0").toString());
    const newSlot: Slot = {
      doctorId: doctorIdVal,
      dayOfWeek: day,
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
      availabilityType: availabilityType,
      address: availabilityType === AvailabilityType.CLINIC ? "Main Clinic" : "",
      slotType: SlotType.MORNING
    } as any;
    
    // Validate first
    const combinedOriginal = [...slots, ...pendingSlots];
    const error = validateSlotAgainstDay(combinedOriginal, newSlot);
    if (error) {
      toast.error(error);
      return;
    }

    setPendingSlots((prev) => [...prev, newSlot]);
  };

  const removeSlot = async (slot: Slot, isPending: boolean) => {
    if (isPending) {
      setPendingSlots((prev) => prev.filter((s) => s !== slot));
    } else if (slot.id) {
      try {
        await deleteAvailability(slot.id);
        setSlots((prev) => prev.filter((s) => s.id !== slot.id));
        toast.success("Slot removed successfully");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        toast.error("Failed to remove slot");
      }
    }
  };

  const updateSlot = (slot: Slot, field: string, value: string, isPending: boolean) => {
    let updatedSlot = { ...slot } as any;

    if (field === "location") {
      if (value === "online") {
        updatedSlot.availabilityType = AvailabilityType.ONLINE;
        updatedSlot.address = "";
      } else if (value === "main") {
        updatedSlot.availabilityType = AvailabilityType.CLINIC;
        updatedSlot.address = "Main Clinic";
      } else if (value === "city") {
        updatedSlot.availabilityType = AvailabilityType.CLINIC;
        updatedSlot.address = "City Hospital";
      }
    } else {
        updatedSlot[field] = value;
    }

    if(updatedSlot.startTime) {
        updatedSlot.slotType = getSlotType(updatedSlot.startTime);
    }

    const combinedOriginal = [...slots, ...pendingSlots];
    const combinedWithUpdated = combinedOriginal.map((s) => (s === slot ? updatedSlot : s));

    if (field === "startTime" || field === "endTime") {
      const start = updatedSlot.startTime;
      const end = updatedSlot.endTime;

      if (start && end) {
        const error = validateSlotAgainstDay(combinedWithUpdated, updatedSlot);
        if (error) {
          toast.error(error);
          return;
        }
      }
    }

    const updater = (list: Slot[]) => list.map((s) => (s === slot ? updatedSlot : s));
    if (isPending) setPendingSlots(updater);
    else setSlots(updater);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const allSlots = [...slots, ...pendingSlots];

    for (let i = 0; i < allSlots.length; i++) {
        const slotToCheck = allSlots[i];
        if (!slotToCheck.startTime || !slotToCheck.endTime) continue;
        const combinedForCheck = allSlots.slice();
        const error = validateSlotAgainstDay(combinedForCheck, slotToCheck);
        if (error) {
            toast.error(error);
            setIsSaving(false);
            return;
        }
    }

    try {
      if (pendingSlots.length > 0) {
        const newSlotsData = await createAvailability(pendingSlots);
        setSlots((prev) => [...prev, ...newSlotsData]);
        setPendingSlots([]);
      }

      const modifiedSlots = slots.filter((s) => s.id && (s.startTime || s.endTime));
      for (const slot of modifiedSlots) {
        if (slot.id) {
          const payload = {
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isActive: slot.isActive,
            availabilityType: slot.availabilityType,
            address: slot.address,
            slotType: slot.slotType
          };
          await PatchAvailability(payload, slot.id);
        }
      }

      toast.success("Working hours updated successfully");
      const storedDoctorId = typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
      const doctorIdVal = resolvedDoctorId || parseInt((storedDoctorId || user?.doctorId || user?.id || "0").toString());
      const updatedData = await getAvailability(doctorIdVal);
      const formattedData = updatedData.map(s => ({
        ...s,
        startTime: s.startTime ? s.startTime.substring(0, 5) : "09:00",
        endTime: s.endTime ? s.endTime.substring(0, 5) : "17:00",
      }));
      setSlots(formattedData);
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Error saving availability");
    } finally {
      setIsSaving(false);
    }
  };

  const getLocationValue = (slot: Slot) => {
    if (slot.availabilityType === AvailabilityType.ONLINE) return "online";
    if (slot.address === "City Hospital") return "city";
    return "main";
  };

  if(!user) {
    return <div>Loading user context...</div>;
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold tracking-tight">Working Hours</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => {
              setPendingSlots([]);
              const storedDoctorId = typeof window !== "undefined" ? localStorage.getItem("doctorId") : null;
              const doctorIdVal = resolvedDoctorId || parseInt((storedDoctorId || user?.doctorId || user?.id || "0").toString());
              getAvailability(doctorIdVal).then(data => {
                  const formattedData = data.map(s => ({
                    ...s,
                    startTime: s.startTime ? s.startTime.substring(0, 5) : "09:00",
                    endTime: s.endTime ? s.endTime.substring(0, 5) : "17:00",
                  }));
                  setSlots(formattedData);
              });
          }}>Cancel</Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || loading}
          >
            <Save className={`mr-2 h-4 w-4 ${isSaving ? 'animate-spin' : ''}`} />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-2 mb-2">
        {["online", "clinic"].map((type) => (
          <button
            key={type}
            className={`${
              availabilityType === type
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            } font-medium px-5 py-2 text-[14px] rounded-full transition-colors`}
            onClick={() => setAvailabilityType(type as AvailabilityType)}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 flex-wrap gap-4">
            <div className="space-y-1">
              <CardTitle>{availabilityType === AvailabilityType.ONLINE ? "Online" : "Clinic"} Hours</CardTitle>
              <CardDescription>Set your clinic's regular operating hours for each day of the week. You can add multiple slots per day.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              {daysOfWeek.map((day, dayIndex) => {
                const dayConfig = availability[day] || { active: false };
                const daySlots = [...slots, ...pendingSlots].filter(
                  (s) => s.dayOfWeek?.toLowerCase() === day.toLowerCase() && s.availabilityType === availabilityType
                );

                return (
                  <div key={day} className="flex flex-col space-y-3">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-3 w-32 pt-2">
                        <Checkbox
                          id={`day-${dayIndex}`}
                          checked={dayConfig.active}
                          onCheckedChange={(checked) => {
                            if (checked && daySlots.length === 0) {
                              addSlot(day);
                            } else {
                              handleToggleDay(day, checked as boolean);
                            }
                          }}
                        />
                        <Label htmlFor={`day-${dayIndex}`} className="font-semibold cursor-pointer">
                          {day}
                        </Label>
                      </div>

                      <div className="flex-1 space-y-3">
                        {daySlots.length > 0 ? (
                          daySlots.map((slot, slotIndex) => {
                            const isPending = !slot.id;
                            return (
                            <div key={slot.id || `pending-${slotIndex}`} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
                              <div className="flex flex-1 items-center space-x-2">
                                <Select
                                  value={slot.startTime || ""}
                                  onValueChange={(v) => updateSlot(slot, "startTime", v, isPending)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Start time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 48 }, (_, i) => {
                                      const hour = Math.floor(i / 2);
                                      const minute = i % 2 === 0 ? "00" : "30";
                                      const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                                      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                      const ampm = hour < 12 ? "AM" : "PM";
                                      return <SelectItem key={time} value={time}>{`${displayHour}:${minute} ${ampm}`}</SelectItem>;
                                    })}
                                  </SelectContent>
                                </Select>
                                <span className="text-muted-foreground">to</span>
                                <Select
                                  value={slot.endTime || ""}
                                  onValueChange={(v) => updateSlot(slot, "endTime", v, isPending)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="End time" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 48 }, (_, i) => {
                                      const hour = Math.floor(i / 2);
                                      const minute = i % 2 === 0 ? "00" : "30";
                                      const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                                      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                      const ampm = hour < 12 ? "AM" : "PM";
                                      return <SelectItem key={time} value={time}>{`${displayHour}:${minute} ${ampm}`}</SelectItem>;
                                    })}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="w-48">
                                {availabilityType === AvailabilityType.CLINIC ? (
                                  <Input
                                    placeholder="Enter Address"
                                    value={slot.address || ""}
                                    onChange={(e) => updateSlot(slot, "address", e.target.value, isPending)}
                                  />
                                ) : (
                                  <div className="h-10 px-3 flex items-center border rounded-md bg-muted text-muted-foreground text-sm cursor-not-allowed">
                                    Online Video
                                  </div>
                                )}
                              </div>

                              <div className="w-10 flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => removeSlot(slot, isPending)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )})
                        ) : (
                          <div className="h-10 flex items-center">
                            <span className="text-sm text-muted-foreground italic">Closed - No slots configured</span>
                          </div>
                        )}
                      </div>

                      <div className="w-32 flex justify-end pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs font-medium"
                          onClick={() => addSlot(day)}
                        >
                          <Plus className="mr-1 h-3.5 w-3.5" />
                          Add Slot
                        </Button>
                      </div>
                    </div>
                    {dayIndex < daysOfWeek.length - 1 && <Separator className="opacity-50" />}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
