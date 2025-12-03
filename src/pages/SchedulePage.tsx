import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  fetchProgramme,
  selectProgramme,
  type ProgrammeDay,
  type ProgrammeItem,
} from "../store/slices/programSlice";

const SchedulePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: days,
    loading,
    error,
  } = useSelector((state: RootState) => selectProgramme(state));

  // Fetch programme on mount
  useEffect(() => {
    dispatch(fetchProgramme());
  }, [dispatch]);

  if (loading) return <p>Loading programme...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Helper: Format day title (optional)
  const formatDayTitle = (day: ProgrammeDay, index: number) => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dateObj = new Date(day.date);
    const dayName = dayNames[dateObj.getDay()] || "";
    return `Day ${index + 1}: ${dayName}, ${dateObj.toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    )}`;
  };

  return (
    <div className="space-y-8 pb-20">
      <h2 className="text-2xl font-bold">
        Annual Human Rights Summit Programme
      </h2>

      {days.map((day, idx) => (
        <div key={day._id} className="bg-white shadow rounded-xl border p-5">
          <h3 className="text-lg font-semibold mb-4">
            {formatDayTitle(day, idx)}
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="border px-3 py-2 w-32">Time</th>
                  <th className="border px-3 py-2">Activity</th>
                  <th className="border px-3 py-2 w-40">Facilitator</th>
                </tr>
              </thead>
              <tbody>
                {day.items.map((row: ProgrammeItem, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50">
                    <td className="border px-3 py-2">{row.time}</td>
                    <td className="border px-3 py-2">{row.activity}</td>
                    <td className="border px-3 py-2">{row.facilitator}</td>
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
