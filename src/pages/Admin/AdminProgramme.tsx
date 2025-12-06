// src/pages/Admin/AdminProgramme.tsx
import React, { useEffect, useState, type JSX } from "react";
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
import {
  MdDelete,
  MdAdd,
  MdCalendarToday,
  MdOutlineAccessTime,
  MdPeopleOutline,
  MdDescription,
} from "react-icons/md";
import { format, parseISO } from "date-fns";

/* ---------------------------
   Styling constants
   --------------------------- */
const PRIMARY_GREEN = "#005A2B";
const ACCENT_GOLD = "#C6A64F";

/* ---------------------------
   Small helpers
   --------------------------- */
const isoToInputDate = (iso?: string) => {
  if (!iso) return format(new Date(), "yyyy-MM-dd");
  try {
    return format(parseISO(iso), "yyyy-MM-dd");
  } catch {
    return format(new Date(iso || Date.now()), "yyyy-MM-dd");
  }
};

const inputDateToISO = (yyyymmdd: string) => {
  // yyyymmdd -> ISO string at midnight UTC
  const dt = new Date(yyyymmdd + "T00:00:00.000Z");
  return dt.toISOString();
};

/* ---------------------------
   Reusable InputField
   --------------------------- */
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ElementType;
  required?: boolean;
  type?: string;
}> = ({ label, value, onChange, placeholder, icon: Icon, required = false, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1 text-gray-700 flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500" />}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

/* ---------------------------
   Activity form (inside session)
   --------------------------- */
const ActivityForm: React.FC<{
  activity: IActivity;
  index: number;
  onChange: (index: number, field: keyof IActivity, value: string) => void;
  onRemove: (index: number) => void;
}> = ({ activity, index, onChange, onRemove }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200 mb-2">
      <div className="flex-1 min-w-0">
        <InputField
          label="Time"
          value={activity.time}
          onChange={(e) => onChange(index, "time", e.target.value)}
          placeholder="09:00 - 10:30"
          icon={MdOutlineAccessTime}
          required
        />
      </div>
      <div className="flex-1 min-w-0 mt-2 sm:mt-0">
        <InputField
          label="Activity"
          value={activity.activity}
          onChange={(e) => onChange(index, "activity", e.target.value)}
          placeholder="Keynote Address"
          icon={MdDescription}
          required
        />
      </div>
      <div className="flex-1 min-w-0 mt-2 sm:mt-0">
        <InputField
          label="Facilitator"
          value={activity.facilitator || ""}
          onChange={(e) => onChange(index, "facilitator", e.target.value)}
          placeholder="Chief Justice"
          icon={MdPeopleOutline}
        />
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="self-end mt-2 sm:mt-0 p-3 ml-0 sm:ml-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
        title="Remove Activity"
      >
        <MdDelete className="w-5 h-5" />
      </button>
    </div>
  );
};

/* ---------------------------
   Session form
   --------------------------- */
const SessionForm: React.FC<{
  session: ISession;
  index: number;
  onSessionChange: (index: number, field: keyof ISession, value: any) => void;
  onRemoveSession: (index: number) => void;
  onAddActivity: (index: number) => void;
  onActivityChange: (sessionIndex: number, activityIndex: number, field: keyof IActivity, value: string) => void;
  onRemoveActivity: (sessionIndex: number, activityIndex: number) => void;
}> = ({
  session,
  index,
  onSessionChange,
  onRemoveSession,
  onAddActivity,
  onActivityChange,
  onRemoveActivity,
}) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <InputField
            label="Session Title"
            value={session.title}
            onChange={(e) => onSessionChange(index, "title", e.target.value)}
            placeholder="Morning Session"
            icon={MdCalendarToday}
            required
          />
        </div>

        <div className="w-full md:w-64">
          <InputField
            label="Session Chair"
            value={(session as any).chair || ""}
            onChange={(e) => onSessionChange(index, "chair" as any, e.target.value)}
            placeholder="e.g., Prof. X (optional)"
            icon={MdPeopleOutline}
            type="text"
          />
        </div>

        <button
          type="button"
          onClick={() => onRemoveSession(index)}
          className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm whitespace-nowrap"
          title="Remove Session"
        >
          <MdDelete className="w-5 h-5" /> Remove Session
        </button>
      </div>

      <h4 className="font-bold mb-2">Activities:</h4>

      {(session.activities || []).map((activity, actIdx) => (
        <ActivityForm
          key={actIdx}
          activity={activity}
          index={actIdx}
          onChange={(i, field, value) => onActivityChange(index, i, field, value)}
          onRemove={(i) => onRemoveActivity(index, i)}
        />
      ))}

      <div className="mt-2">
        <button
          type="button"
          onClick={() => onAddActivity(index)}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
        >
          <MdAdd className="mr-1 w-5 h-5" /> Add Activity
        </button>
      </div>
    </div>
  );
};

/* ---------------------------
   AdminProgramme Page
   --------------------------- */
export default function AdminProgramme(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { data: programmeDays = [], loading, error } = useSelector(selectProgramme);

  /* ---------------------------
     Local "create" form state
     store date as ISO string internally
     --------------------------- */
  const emptyActivity: IActivity = { time: "", activity: "", facilitator: "" };
  const emptySession: ISession = { title: "", chair: "", activities: [emptyActivity] };

  const [newDay, setNewDay] = useState<Partial<ProgrammeDay>>({
    dayLabel: "",
    // store as ISO string
    date: new Date().toISOString(),
    sessions: [{ ...emptySession }],
  });

  useEffect(() => {
    dispatch(fetchProgramme());
  }, [dispatch]);

  /* ---------------------------
     HANDLERS
     --------------------------- */
  const handleDeleteDay = async (id: string) => {
    if (!confirm("Delete this programme day? This action cannot be undone.")) return;
    await dispatch(deleteProgrammeDay(id));
    await dispatch(fetchProgramme());
  };

  const handleAddSession = () => {
    setNewDay((prev) => ({
      ...prev,
      sessions: [...(prev.sessions || []), { ...emptySession }],
    }));
  };

  const handleRemoveSession = (index: number) => {
    setNewDay((prev) => ({
      ...prev,
      sessions: (prev.sessions || []).filter((_, i) => i !== index),
    }));
  };

  const handleSessionChange = (index: number, field: keyof ISession, value: any) => {
    setNewDay((prev) => {
      const sessions = (prev.sessions || []).map((s, i) => (i === index ? { ...s, [field]: value } : s));
      return { ...prev, sessions };
    });
  };

  const handleAddActivity = (sessionIndex: number) => {
    setNewDay((prev) => {
      const sessions = (prev.sessions || []).map((s, i) =>
        i === sessionIndex ? { ...s, activities: [...(s.activities || []), { ...emptyActivity }] } : s
      );
      return { ...prev, sessions };
    });
  };

  const handleActivityChange = (sessionIndex: number, activityIndex: number, field: keyof IActivity, value: string) => {
    setNewDay((prev) => {
      const sessions = (prev.sessions || []).map((s, i) =>
        i === sessionIndex
          ? {
              ...s,
              activities: (s.activities || []).map((a, j) => (j === activityIndex ? { ...a, [field]: value } : a)),
            }
          : s
      );
      return { ...prev, sessions };
    });
  };

  const handleRemoveActivity = (sessionIndex: number, activityIndex: number) => {
    setNewDay((prev) => {
      const sessions = (prev.sessions || []).map((s, i) =>
        i === sessionIndex ? { ...s, activities: (s.activities || []).filter((_, j) => j !== activityIndex) } : s
      );
      return { ...prev, sessions };
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDay.dayLabel || !newDay.date) {
      alert("Please provide a day title and date.");
      return;
    }

    // Normalize & validate sessions/activities
    const sessions = (newDay.sessions || []).map((s) => ({
      title: s.title?.trim() || "",
      chair: (s as any).chair?.trim() || "",
      activities: (s.activities || [])
        .map((a) => ({ ...a, time: (a.time || "").trim(), activity: (a.activity || "").trim(), facilitator: (a.facilitator || "").trim() }))
        .filter((a) => a.time && a.activity),
    })).filter((s) => s.title || s.activities.length > 0); // allow untitled session if it has activities

    if (sessions.length === 0) {
      alert("Please add at least one session with one valid activity (time + activity).");
      return;
    }

    // Prepare payload - ensure date sent as ISO (backend expects Date)
    const payload: Partial<ProgrammeDay> = {
      dayLabel: newDay.dayLabel!.trim(),
      date: newDay.date, // already ISO string
      sessions,
    };

    try {
      await dispatch(createProgrammeDay(payload));
      // Reset form
      setNewDay({
        dayLabel: "",
        date: new Date().toISOString(),
        sessions: [{ ...emptySession }],
      });
      await dispatch(fetchProgramme());
      alert("Programme day created.");
    } catch (err) {
      // createProgrammeDay thunk already returns errors in slice; still show a simple alert
      console.error("Create programme error:", err);
      alert("Failed to create programme day. Check console or network tab.");
    }
  };

  /* ---------------------------
     Render
     --------------------------- */
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold mb-8" style={{ color: PRIMARY_GREEN, borderBottom: `4px solid ${ACCENT_GOLD}`, paddingBottom: 8 }}>
        📅 Manage Programme
      </h1>

      {/* Add New Day Form */}
      <div className="mb-10 bg-white rounded-xl shadow overflow-hidden border border-gray-200">
        <h2 className="text-xl font-bold p-4 bg-gray-100 text-[#005A2B] border-b border-gray-200 flex items-center">
          <MdAdd className="mr-2" /> Add New Programme Day
        </h2>

        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Day Title"
              value={newDay.dayLabel || ""}
              onChange={(e) => setNewDay((prev) => ({ ...prev, dayLabel: e.target.value }))}
              placeholder="e.g., Day 1: Opening Ceremony"
              icon={MdCalendarToday}
              required
            />

            {/* date input - value derived from ISO */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1 text-gray-700 flex items-center">
                <MdCalendarToday className="w-4 h-4 mr-2 text-gray-500" />
                Full Date
              </label>
              <input
                type="date"
                value={isoToInputDate(newDay.date as string)}
                onChange={(e) => setNewDay((prev) => ({ ...prev, date: inputDateToISO(e.target.value) }))}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-opacity-50 transition-colors"
                required
              />
            </div>
          </div>

          <h3 className="font-bold text-gray-700 mt-6 border-t pt-4">Sessions:</h3>

          <div className="space-y-3">
            {(newDay.sessions || []).map((session, index) => (
              <SessionForm
                key={index}
                session={session as ISession}
                index={index}
                onSessionChange={handleSessionChange}
                onRemoveSession={handleRemoveSession}
                onAddActivity={handleAddActivity}
                onActivityChange={handleActivityChange}
                onRemoveActivity={handleRemoveActivity}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleAddSession}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
            >
              <MdAdd className="mr-1 w-5 h-5" /> Add Session
            </button>

            <button
              type="submit"
              className="px-6 py-3 font-bold text-white rounded-lg shadow-md"
              style={{ backgroundColor: PRIMARY_GREEN }}
            >
              Create Programme Day
            </button>
          </div>
        </form>
      </div>

      <hr className="my-8 border-gray-300" />

      {/* Existing Programme List */}
      <h2 className="text-2xl font-bold mb-6" style={{ color: PRIMARY_GREEN }}>
        Existing Programme Days
      </h2>

      {loading && <p className="text-lg font-semibold" style={{ color: PRIMARY_GREEN }}>Loading programme...</p>}
      {error && (
        <p className="text-red-600 font-semibold bg-red-100 p-3 rounded-lg border border-red-300">
          Error: {error}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {(programmeDays || []).map((day) => (
          <div key={day._id} className="p-5 bg-white rounded-xl shadow-lg flex flex-col justify-between transition-shadow hover:shadow-xl" style={{ borderTop: `4px solid ${ACCENT_GOLD}` }}>
            <div>
              <h2 className="font-extrabold text-xl mb-3" style={{ color: PRIMARY_GREEN }}>
                {day.dayLabel}
              </h2>

              <p className="text-gray-600 text-sm italic mb-4 border-b pb-2">
                {(() => {
                  try {
                    return format(parseISO(day.date), "EEEE, dd MMMM yyyy");
                  } catch {
                    return day.date;
                  }
                })()}
              </p>

              {(day.sessions || []).map((session, sIdx) => (
                <div key={sIdx} className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-1">{session.title}</h4>
                  {session.chair && <p className="text-xs text-gray-600 italic mb-2">Chair: {session.chair}</p>}
                  <ul className="text-gray-700 mb-2 text-sm space-y-2">
                    {(session.activities || []).map((act, aIdx) => (
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

        {(programmeDays || []).length === 0 && !loading && (
          <p className="text-gray-500 col-span-full p-4 bg-white rounded-xl">
            No programme days found. Use the form above to create one.
          </p>
        )}
      </div>
    </div>
  );
}
