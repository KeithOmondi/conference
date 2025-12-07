// src/pages/SchedulePage.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../store/store";

import {
  fetchProgramme,
  selectProgramme,
  type ProgrammeDay,
  type ISession,
  type IActivity,
} from "../store/slices/programSlice";

import { format, parseISO } from "date-fns";
import { MdCalendarToday, MdAccessTime, MdPeople, MdStar } from "react-icons/md";

// COLOR CONSTANTS
const PRIMARY_GREEN = "#005A2B";
const ACCENT_GOLD = "#C6A64F";
const LIGHT_GREEN = "rgba(0, 90, 43, 0.05)";

const SchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(selectProgramme);

  useEffect(() => {
    dispatch(fetchProgramme());
  }, [dispatch]);

  // Safe date formatter
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Date not available";
    try {
      return format(parseISO(dateStr), "EEEE, dd MMMM yyyy");
    } catch {
      return dateStr;
    }
  };

  /* ------------------- LOADING ------------------- */
  if (loading)
    return (
      <p className="text-xl font-semibold p-6" style={{ color: PRIMARY_GREEN }}>
        Loading programme...
      </p>
    );

  /* ------------------- ERROR ------------------- */
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600 font-medium bg-red-100 p-4 rounded-lg border border-red-300">
          Error loading programme: {error}
        </p>
      </div>
    );

  /* ------------------- EMPTY ------------------- */
  if (!loading && !error && (data?.length ?? 0) === 0)
    return (
      <p className="text-gray-600 italic p-4 bg-gray-50 rounded-lg">
        No programme data available.
      </p>
    );

  /* ------------------- MAIN UI ------------------- */
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">

      {/* Page Header */}
      <h1
        className="text-2xl font-bold mb-8 pb-3 border-b-4"
        style={{ color: PRIMARY_GREEN, borderColor: ACCENT_GOLD }}
      >
        <MdCalendarToday className="inline-block mr-2 align-top" size={25} /> 
        Official Event Programme
      </h1>

      <div className="space-y-12">
        {(data ?? []).map((day: ProgrammeDay, dayIndex: number) => (
          <div key={day._id ?? dayIndex}>

            {/* Day Header */}
            <div
              className="p-4 mb-6 rounded-lg shadow-md border-l-8"
              style={{ backgroundColor: LIGHT_GREEN, borderColor: ACCENT_GOLD }}
            >
              <h2
                className="text-2xl font-black mb-1 tracking-wide"
                style={{ color: PRIMARY_GREEN }}
              >
                {day.dayLabel ?? `DAY ${dayIndex + 1}`}
              </h2>
              <p className="text-gray-700 font-medium text-sm">
                {formatDate(day.date)}
              </p>
            </div>

            {/* Sessions */}
            <div
              className="space-y-8 pl-4 border-l-2"
              style={{ borderColor: PRIMARY_GREEN }}
            >
              {(day.sessions ?? []).map((session: ISession, sessionIndex: number) => (
                <div key={sessionIndex} className="relative">

                  {/* Timeline Dot */}
                  <div
                    className="absolute -left-[11px] top-1 h-5 w-5 rounded-full z-10 border-4 border-white"
                    style={{
                      backgroundColor: PRIMARY_GREEN,
                      borderColor: ACCENT_GOLD,
                    }}
                  />

                  {/* Session Title */}
                  <div className="mb-4 pb-1">
                    <h3
                      className="text-xl font-extrabold flex items-center"
                      style={{ color: PRIMARY_GREEN }}
                    >
                      <MdStar className="mr-2" style={{ color: ACCENT_GOLD }} />{" "}
                      {session.title ?? `Session ${sessionIndex + 1}`}
                    </h3>

                    {session.chair && (
                      <p className="text-sm font-semibold italic ml-7 mt-1 text-gray-700">
                        Session Chair:{" "}
                        <span className="text-gray-900 font-bold">
                          {session.chair}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Activities */}
                  <div
                    className="space-y-2 border-l-4 ml-6 pl-4"
                    style={{ borderColor: ACCENT_GOLD, opacity: 0.7 }}
                  >
                    {(session.activities ?? []).map(
                      (activity: IActivity, activityIndex: number) => (
                        <div
                          key={activityIndex}
                          className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start gap-4">

                            {/* Text */}
                            <div className="flex-1">
                              <h4 className="text-base font-semibold text-gray-900">
                                {activity.activity ?? "Activity"}
                              </h4>

                              {activity.facilitator && (
                                <p className="text-xs text-gray-600 mt-1 flex items-center">
                                  <MdPeople className="mr-1" size={14} />{" "}
                                  {activity.facilitator}
                                </p>
                              )}
                            </div>

                            {/* Time */}
                            {activity.time && (
                              <div
                                className="text-sm font-bold text-right py-0.5 px-2 rounded-full text-white"
                                style={{ backgroundColor: ACCENT_GOLD }}
                              >
                                <MdAccessTime className="inline-block mr-1 align-text-bottom" />
                                {activity.time}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SchedulePage;
