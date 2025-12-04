// src/pages/SchedulePage.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchProgramme,
  selectProgramme,
  type ProgrammeDay,
  type ProgrammeItem,
} from "../store/slices/programSlice";
import { parse, format } from "date-fns";

const SchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: days, loading, error } = useSelector((state: RootState) =>
    selectProgramme(state)
  );

  // Fetch programme on mount
  useEffect(() => {
    dispatch(fetchProgramme());
  }, [dispatch]);

  if (loading) return <p className="text-gray-600 p-4">Loading programme...</p>;
  if (error) return <p className="text-red-600 p-4 font-medium">Error: {error}</p>;

  // Helper: Format day title safely
  const formatDayTitle = (day: ProgrammeDay, index: number) => {
    // Remove weekday and ordinal suffixes ("th", "st", etc.) from the date
    const cleanedDate = day.date
      .replace(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s*/, "")
      .replace(/(\d+)(st|nd|rd|th)/, "$1");

    // Parse into Date object
    const dateObj = parse(cleanedDate, "d MMMM yyyy", new Date());

    // Format the date
    const dayName = format(dateObj, "EEEE"); // Full day name
    return `Day ${index + 1}: ${dayName}, ${format(dateObj, "d MMMM yyyy")}`;
  };

  return (
    <div className="space-y-8 pb-20 p-4">
      {/* Page Title */}
      <h2 className="text-3xl font-extrabold text-[#005A2B] border-b-4 border-[#C6A64F] pb-2">
        Annual Human Rights Summit Programme
      </h2>

      {days.map((day, idx) => (
        <div key={day._id} className="bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden">
          {/* Day Title Block */}
          <div className="bg-[#005A2B] text-white p-4">
            <h3 className="text-xl font-semibold">
              {formatDayTitle(day, idx)}
            </h3>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="min-w-full text-sm border-separate border-spacing-0">
              {/* Table Header */}
              <thead className="bg-[#C6A64F] text-[#005A2B] sticky top-0">
                <tr>
                  <th className="px-3 py-2 w-32 text-left font-bold rounded-tl-lg">Time</th>
                  <th className="px-3 py-2 text-left font-bold">Activity</th>
                  <th className="px-3 py-2 w-40 text-left font-bold rounded-tr-lg">Facilitator</th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {day.items.map((row: ProgrammeItem, i) => (
                  <tr 
                    key={i} 
                    className={`
                      ${i === day.items.length - 1 ? 'border-b-0' : 'border-b'} 
                      ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} 
                      hover:bg-[#005A2B]/10 transition-colors
                    `}
                  >
                    <td className="px-3 py-3 font-medium text-[#005A2B] whitespace-nowrap">{row.time}</td>
                    <td className="px-3 py-3 text-gray-800">{row.activity}</td>
                    <td className="px-3 py-3 text-gray-600">{row.facilitator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchedulePage;