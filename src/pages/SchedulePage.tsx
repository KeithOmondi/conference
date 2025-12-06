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
import { MdSchedule, MdStar, MdAccessTime, MdPeople } from 'react-icons/md';

const SchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: days, loading, error } = useSelector((state: RootState) =>
    selectProgramme(state)
  );

  useEffect(() => {
    dispatch(fetchProgramme());
  }, [dispatch]);

  if (loading) return <p className="text-[#005A2B] font-semibold p-4">Loading programme...</p>;
  if (error) return <p className="text-red-600 font-semibold p-4">Error: {error}</p>;

  const formatDayTitle = (day: ProgrammeDay, index: number) => {
    const cleanedDate = day.date
      .replace(/^(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday),\s*/, "")
      .replace(/(\d+)(st|nd|rd|th)/, "$1");

    const dateObj = parse(cleanedDate, "d MMMM yyyy", new Date());
    const dayName = format(dateObj, "EEEE");
    return `Day ${index + 1}: ${dayName}, ${format(dateObj, "d MMMM yyyy")}`;
  };

  // COLORS
  const gold = "#C6A64F";
  const darkGreen = "#005A2B";
  // Subtle colors for enhanced readability
  const lightGreen = "rgba(0, 90, 43, 0.1)"; // 10% opacity of darkGreen for Session Chair box
  const lightGold = "rgba(198, 166, 79, 0.1)"; // 10% opacity of gold for Secretariat items

  // Filter items to count only non-session items for alternating background logic
  const getNonSessionIndex = (dayItems: ProgrammeItem[], currentIndex: number): number => {
    return dayItems
      .slice(0, currentIndex + 1)
      .filter(item => !item.isSession)
      .length;
  };

  return (
    <div className="space-y-10 pb-20 p-4">
      <h2 className="text-4xl font-extrabold mb-4 border-b-4 pb-2" style={{ color: darkGreen, borderColor: gold }}>
        <MdSchedule className="inline-block mr-2 align-top" size={32} /> Annual Human Rights Summit Programme
      </h2>

      {days.map((day, idx) => (
        <div
          key={day._id}
          className="shadow-xl rounded-xl border border-gray-200 bg-white overflow-hidden"
        >
          {/* Day Header */}
          <div
            className="px-6 py-4 text-white font-extrabold text-xl flex items-center"
            style={{ backgroundColor: darkGreen }}
          >
            {formatDayTitle(day, idx)}
          </div>

          <div className="p-6 relative">
            {/* Timeline Connector Line */}
            <div className="hidden md:block absolute left-6 top-0 bottom-0 w-0.5" style={{ backgroundColor: gold, opacity: 0.3 }}></div>

            {day.items.map((row: ProgrammeItem, i) => {
              const nonSessionIndex = getNonSessionIndex(day.items, i);
              // Use non-session index for alternating color of standard items
              const isEven = nonSessionIndex % 2 === 0; 
              
              const isSecretariat = row.facilitator?.toLowerCase().includes("secretariat");
              
              if (row.isSession) {
                return (
                  // -------------------------------------------
                  // SESSION HEADER STYLE (Enhanced distinction)
                  // -------------------------------------------
                  <div key={i} className="relative mt-8 mb-4">
                    {/* Timeline Dot for Session Start */}
                    <div className="hidden md:block absolute -left-[27px] top-0 h-4 w-4 rounded-full border-4 border-white z-10" style={{ backgroundColor: gold, borderColor: gold }} />

                    <div className="border-l-4 pl-4 py-3 bg-gray-50/50 rounded-r-lg shadow-inner" style={{ borderColor: gold }}>
                      <h4
                        className="font-extrabold text-xl flex items-center"
                        style={{ color: darkGreen }}
                      >
                        <MdStar className="mr-2" style={{ color: gold }} /> {row.activity}
                      </h4>
                      
                      {/* Session Chair: Centered with light green background */}
                      {row.facilitator && (
                        <div 
                          className="text-sm mt-3 py-2 px-4 rounded-lg font-bold text-center border-l-4" 
                          style={{ backgroundColor: lightGreen, color: darkGreen, borderColor: gold }}
                        >
                            <p className="font-light italic text-xs mb-0.5">Session Chair:</p>
                            <p className="font-extrabold">{row.facilitator}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // -------------------------------------------
              // NORMAL ITEM STYLE (TIME ➝ ACTIVITY ➝ FACILITATOR)
              // -------------------------------------------
              return (
                <div
                  key={i}
                  className={`relative flex flex-col md:flex-row md:items-start md:gap-6 py-4 transition-colors 
                    ${isSecretariat ? '' : (isEven ? 'bg-gray-50' : 'bg-white')}
                    ${isSecretariat ? 'border-b-4 border-dotted border-gray-300' : 'border-b border-gray-100'}
                  `}
                  // Secretariat items use a light gold background
                  style={{ backgroundColor: isSecretariat ? lightGold : undefined }}
                >
                  {/* Timeline Dot for Normal Item */}
                  <div 
                    className="hidden md:block absolute -left-6 top-4 h-3 w-3 rounded-full border-2 border-white z-10" 
                    style={{ backgroundColor: isSecretariat ? gold : darkGreen }} 
                  />

                  {/* Time Block */}
                  <div className="w-full md:w-40 font-bold text-gray-800 text-sm flex items-center">
                    <MdAccessTime className="w-4 h-4 mr-2 hidden md:inline-block" style={{ color: gold }} />
                    {row.time || "TBC"}
                  </div>

                  {/* Activity + Facilitator Block */}
                  <div className="flex-1 mt-1 md:mt-0">
                    <p className="font-semibold text-gray-900">{row.activity}</p>
                    {row.facilitator && row.facilitator !== "-" && (
                      <p 
                        className="text-sm mt-1 flex items-center"
                        style={{ color: isSecretariat ? darkGreen : 'rgb(75 85 99)' }} // Darker text for Secretariat 
                      >
                        {isSecretariat && <MdPeople className="mr-1 w-4 h-4" />}
                        {row.facilitator}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SchedulePage;