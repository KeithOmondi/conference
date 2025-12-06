// src/pages/Admin/AdminProgramme.tsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProgramme,
  deleteProgrammeDay,
  createProgrammeDay,
  selectProgramme,
  type ProgrammeDay,
  type ISession,
  type IActivity,
} from "../../store/slices/programSlice";
import type { AppDispatch } from "../../store/store";
import { MdDelete, MdAdd, MdCalendarToday, MdOutlineAccessTime, MdPeopleOutline, MdDescription } from "react-icons/md";
import { format } from "date-fns";

const PRIMARY_GREEN = "#005A2B";
const ACCENT_GOLD = "#C6A64F";

// Helper component for a single input field
const InputField = ({ label, value, onChange, placeholder, icon: Icon }: {
  label: string,
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  placeholder: string,
  icon: React.ElementType,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1 text-gray-700 flex items-center">
      <Icon className="w-4 h-4 mr-2 text-gray-500" />
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:ring-[#C6A64F] focus:border-[#C6A64F] transition-colors"
      placeholder={placeholder}
      required
    />
  </div>
);

// Component for activity inside a session
const ActivityForm = ({ activity, index, handleChange, handleRemove }: any) => (
  <div className="flex space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2">
    <InputField
      label="Time"
      value={activity.time}
      onChange={(e) => handleChange(index, "time", e.target.value)}
      placeholder="09:00 - 10:30"
      icon={MdOutlineAccessTime}
    />
    <InputField
      label="Activity"
      value={activity.activity}
      onChange={(e) => handleChange(index, "activity", e.target.value)}
      placeholder="Keynote Address"
      icon={MdDescription}
    />
    <InputField
      label="Facilitator"
      value={activity.facilitator || ""}
      onChange={(e) => handleChange(index, "facilitator", e.target.value)}
      placeholder="Chief Justice"
      icon={MdPeopleOutline}
    />
    <button
      type="button"
      onClick={() => handleRemove(index)}
      className="self-end p-3 mb-[1px] bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
      title="Remove Activity"
    >
      <MdDelete className="w-5 h-5" />
    </button>
  </div>
);

// Component for a session with activities
const SessionForm = ({ session, index, handleSessionChange, handleRemoveSession, handleActivityChange, handleAddActivity, handleRemoveActivity }: any) => (
  <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
    <div className="flex justify-between items-center mb-3">
      <InputField
        label="Session Title"
        value={session.title}
        onChange={(e) => handleSessionChange(index, "title", e.target.value)}
        placeholder="Morning Session"
        icon={MdCalendarToday}
      />
      <button
        type="button"
        onClick={() => handleRemoveSession(index)}
        className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
      >
        <MdDelete className="w-5 h-5" />
      </button>
    </div>

    <h4 className="font-bold mb-2">Activities:</h4>
    {session.activities.map((activity: IActivity, actIdx: number) => (
      <ActivityForm
        key={actIdx}
        activity={activity}
        index={actIdx}
        handleChange={(i: number, field: keyof IActivity, value: string) => handleActivityChange(index, i, field, value)}
        handleRemove={(i: number) => handleRemoveActivity(index, i)}
      />
    ))}

    <button
      type="button"
      onClick={() => handleAddActivity(index)}
      className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm mt-2"
    >
      <MdAdd className="mr-1 w-5 h-5" /> Add Activity
    </button>
  </div>
);

export default function AdminProgramme() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: programmeDays, loading, error } = useSelector(selectProgramme);

  const [newDay, setNewDay] = useState<Partial<ProgrammeDay>>({
    dayLabel: "",
    date: format(new Date(), "EEEE, d MMMM yyyy"),
    sessions: [{ title: "", activities: [{ time: "", activity: "", facilitator: "" }] }],
  });

  useEffect(() => {
    dispatch(fetchProgramme());
  }, [dispatch]);

  /* --- HANDLERS --- */
  const handleDeleteDay = async (id: string) => {
    await dispatch(deleteProgrammeDay(id));
    dispatch(fetchProgramme());
  };

  const handleAddSession = () => {
    setNewDay({
      ...newDay,
      sessions: [
        ...(newDay.sessions || []),
        { title: "", activities: [{ time: "", activity: "", facilitator: "" }] },
      ],
    });
  };

  const handleRemoveSession = (index: number) => {
    setNewDay({
      ...newDay,
      sessions: (newDay.sessions || []).filter((_, i) => i !== index),
    });
  };

  const handleSessionChange = (index: number, field: keyof ISession, value: string) => {
    const updated = (newDay.sessions || []).map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    setNewDay({ ...newDay, sessions: updated });
  };

  const handleAddActivity = (sessionIndex: number) => {
    const updated = (newDay.sessions || []).map((s, i) =>
      i === sessionIndex
        ? { ...s, activities: [...(s.activities || []), { time: "", activity: "", facilitator: "" }] }
        : s
    );
    setNewDay({ ...newDay, sessions: updated });
  };

  const handleActivityChange = (sessionIndex: number, activityIndex: number, field: keyof IActivity, value: string) => {
    const updated = (newDay.sessions || []).map((s, i) =>
      i === sessionIndex
        ? {
            ...s,
            activities: s.activities.map((a, j) => (j === activityIndex ? { ...a, [field]: value } : a)),
          }
        : s
    );
    setNewDay({ ...newDay, sessions: updated });
  };

  const handleRemoveActivity = (sessionIndex: number, activityIndex: number) => {
    const updated = (newDay.sessions || []).map((s, i) =>
      i === sessionIndex
        ? { ...s, activities: s.activities.filter((_, j) => j !== activityIndex) }
        : s
    );
    setNewDay({ ...newDay, sessions: updated });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDay.dayLabel || !newDay.date) return;

    // Validate sessions and activities
    const validSessions = (newDay.sessions || []).map((s) => ({
      ...s,
      activities: (s.activities || []).filter((a) => a.time && a.activity),
    })).filter((s) => s.activities.length > 0);

    if (validSessions.length === 0) {
      alert("Please add at least one valid session with activities.");
      return;
    }

    await dispatch(createProgrammeDay({ ...newDay, sessions: validSessions }));

    // Reset form
    setNewDay({
      dayLabel: "",
      date: format(new Date(), "EEEE, d MMMM yyyy"),
      sessions: [{ title: "", activities: [{ time: "", activity: "", facilitator: "" }] }],
    });
    dispatch(fetchProgramme());
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-[#005A2B] border-b-4 border-[#C6A64F] pb-2">
        📅 Manage Programme
      </h1>

      {/* --- ADD NEW DAY FORM --- */}
      <div className="mb-10 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        <h2 className="text-xl font-bold p-4 bg-gray-100 text-[#005A2B] border-b border-gray-200 flex items-center">
          <MdAdd className="mr-2" /> Add New Programme Day
        </h2>
        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Day Title"
              value={newDay.dayLabel || ""}
              onChange={(e) => setNewDay({ ...newDay, dayLabel: e.target.value })}
              placeholder="e.g., Day 1: Opening Ceremony"
              icon={MdCalendarToday}
            />
            <InputField
              label="Full Date"
              value={newDay.date || ""}
              onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
              placeholder="e.g., Tuesday, 20 February 2026"
              icon={MdCalendarToday}
            />
          </div>

          <h3 className="font-bold text-gray-700 mt-6 border-t pt-4">Sessions:</h3>
          <div className="space-y-3">
            {(newDay.sessions || []).map((session, index) => (
              <SessionForm
                key={index}
                session={session}
                index={index}
                handleSessionChange={handleSessionChange}
                handleRemoveSession={handleRemoveSession}
                handleActivityChange={handleActivityChange}
                handleAddActivity={handleAddActivity}
                handleRemoveActivity={handleRemoveActivity}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddSession}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
          >
            <MdAdd className="mr-1 w-5 h-5" /> Add Session
          </button>

          <button
            type="submit"
            className={`w-full px-4 py-3 bg-[${PRIMARY_GREEN}] text-white font-bold rounded-lg shadow-md transition-all hover:bg-[${PRIMARY_GREEN}]/90 hover:shadow-lg`}
          >
            Create Programme Day
          </button>
        </form>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* --- PROGRAMME LIST --- */}
      <h2 className="text-2xl font-bold mb-6 text-[#005A2B]">Existing Programme Days</h2>

      {loading && (
        <p className={`text-[${PRIMARY_GREEN}] font-semibold text-lg`}>
          Loading programme...
        </p>
      )}
      {error && (
        <p className="text-red-600 font-semibold bg-red-100 p-3 rounded-lg border border-red-300">
          Error: {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {programmeDays.map((day) => (
          <div
            key={day._id}
            className={`p-5 bg-white rounded-xl shadow-lg border-t-4 border-[${ACCENT_GOLD}] flex flex-col justify-between transition-shadow hover:shadow-xl`}
          >
            <div>
              <h2 className={`font-extrabold text-xl mb-3 text-[${PRIMARY_GREEN}]`}>
                {day.dayLabel}
              </h2>
              <p className="text-gray-600 text-sm italic mb-4 border-b pb-2">
                {day.date}
              </p>

              {day.sessions.map((session, sIdx) => (
                <div key={sIdx} className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-1">{session.title}</h4>
                  <ul className="text-gray-700 mb-2 text-sm space-y-2">
                    {session.activities.map((act, aIdx) => (
                      <li key={aIdx} className="flex flex-col border-l-2 border-gray-200 pl-3">
                        <span className="font-bold text-gray-900">{act.time}</span>
                        <span className="font-medium">{act.activity}</span>
                        {act.facilitator && (
                          <span className="text-gray-500 text-xs">Facilitator: {act.facilitator}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleDeleteDay(day._id)}
              className="mt-4 flex items-center justify-center px-3 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <MdDelete className="mr-1 w-5 h-5" /> Delete Day
            </button>
          </div>
        ))}
        {programmeDays.length === 0 && !loading && (
          <p className="text-gray-500 col-span-full p-4 bg-white rounded-xl">
            No programme days found. Use the form above to create one.
          </p>
        )}
      </div>
    </div>
  );
}
