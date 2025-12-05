// src/pages/Admin/AdminProgramme.tsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProgramme,
  deleteProgrammeDay,
  createProgrammeDay, // Assume this action exists in programSlice
  selectProgramme,
  type ProgrammeDay,
} from "../../store/slices/programSlice";
import type { AppDispatch } from "../../store/store";
import { MdDelete, MdAdd, MdCalendarToday, MdOutlineAccessTime, MdPeopleOutline, MdDescription } from "react-icons/md";
import { format } from "date-fns"; // Used for default date formatting

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

// Helper component for adding a new programme item within the form
const ProgrammeItemForm = ({ item, index, handleItemChange, handleRemoveItem }: any) => (
    <div key={index} className="flex space-x-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <InputField
            label="Time"
            value={item.time}
            onChange={(e) => handleItemChange(index, 'time', e.target.value)}
            placeholder="09:00 - 10:30"
            icon={MdOutlineAccessTime}
        />
        <InputField
            label="Activity"
            value={item.activity}
            onChange={(e) => handleItemChange(index, 'activity', e.target.value)}
            placeholder="Keynote Address"
            icon={MdDescription}
        />
        <InputField
            label="Facilitator"
            value={item.facilitator}
            onChange={(e) => handleItemChange(index, 'facilitator', e.target.value)}
            placeholder="Chief Justice"
            icon={MdPeopleOutline}
        />
        <button
            type="button"
            onClick={() => handleRemoveItem(index)}
            className="self-end p-3 mb-[1px] bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
            title="Remove Item"
        >
            <MdDelete className="w-5 h-5" />
        </button>
    </div>
);


export default function AdminProgramme() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: programmeDays, loading, error } = useSelector(selectProgramme);

  // New state for form inputs
  const [newDay, setNewDay] = useState({
    day: '', // e.g., 'Day 1'
    date: format(new Date(), 'EEEE, d MMMM yyyy'), // e.g., 'Friday, 5 December 2025'
    items: [{ time: '', activity: '', facilitator: '' }],
  });

  useEffect(() => {
    dispatch(fetchProgramme());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    await dispatch(deleteProgrammeDay(id));
    dispatch(fetchProgramme());
  };

  const handleAddItem = () => {
    setNewDay({
      ...newDay,
      items: [...newDay.items, { time: '', activity: '', facilitator: '' }],
    });
  };

  const handleRemoveItem = (index: number) => {
    setNewDay({
      ...newDay,
      items: newDay.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index: number, field: keyof typeof newDay.items[0], value: string) => {
    const updatedItems = newDay.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setNewDay({ ...newDay, items: updatedItems });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDay.day || !newDay.date) return;
    
    // Ensure all items have content before dispatching
    const validItems = newDay.items.filter(item => item.time && item.activity);

    if(validItems.length === 0) {
        alert("Please add at least one valid programme item.");
        return;
    }

    // Assuming createProgrammeDay exists and accepts the structure
    // @ts-ignore - Assuming the structure matches the backend's expected payload
    await dispatch(createProgrammeDay({ ...newDay, items: validItems }));

    // Reset form
    setNewDay({
      day: '',
      date: format(new Date(), 'EEEE, d MMMM yyyy'),
      items: [{ time: '', activity: '', facilitator: '' }],
    });
    dispatch(fetchProgramme()); // Refresh list
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold mb-8 text-[#005A2B] border-b-4 border-[#C6A64F] pb-2">
        📅 Manage Programme
      </h1>

      {/* --- ADD NEW DAY FORM --- */}
      <div className="mb-10 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        <h2 className="text-xl font-bold p-4 bg-gray-100 text-[#005A2B] border-b border-gray-200 flex items-center">
            <MdAdd className="mr-2"/> Add New Programme Day
        </h2>
        <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    label="Day Title"
                    value={newDay.day}
                    onChange={(e) => setNewDay({ ...newDay, day: e.target.value })}
                    placeholder="e.g., Day 1: Opening Ceremony"
                    icon={MdCalendarToday}
                />
                <InputField
                    label="Full Date"
                    value={newDay.date}
                    onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
                    placeholder="e.g., Tuesday, 20 February 2026"
                    icon={MdCalendarToday}
                />
            </div>

            <h3 className="font-bold text-gray-700 mt-6 border-t pt-4">Programme Items:</h3>
            <div className="space-y-3">
                {newDay.items.map((item, index) => (
                    <ProgrammeItemForm
                        key={index}
                        item={item}
                        index={index}
                        handleItemChange={handleItemChange}
                        handleRemoveItem={handleRemoveItem}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
            >
                <MdAdd className="mr-1 w-5 h-5"/> Add Item
            </button>

            <button
                type="submit"
                className={`w-full px-4 py-3 bg-[${PRIMARY_GREEN}] text-white font-bold rounded-lg shadow-md transition-all hover:bg-[${PRIMARY_GREEN}]/90 hover:shadow-lg`}
            >
                Create Programme Day
            </button>
        </form>
      </div>

      <hr className="my-8 border-gray-300"/>

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
      
      {/* Programme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {programmeDays.map((day: ProgrammeDay) => (
          <div
            key={day._id}
            className={`p-5 bg-white rounded-xl shadow-lg border-t-4 border-[${ACCENT_GOLD}] flex flex-col justify-between transition-shadow hover:shadow-xl`}
          >
            <div>
              <h2
                className={`font-extrabold text-xl mb-3 text-[${PRIMARY_GREEN}]`}
              >
                {day.day}
              </h2>
              <p className="text-gray-600 text-sm italic mb-4 border-b pb-2">
                {day.date}
              </p>

              <ul className="text-gray-700 mb-3 text-sm space-y-4">
                {day.items.map((item, idx) => (
                  <li key={idx} className="flex flex-col border-l-2 border-gray-200 pl-3">
                    <span className="font-bold text-gray-900">{item.time}</span>
                    <span className="font-medium">{item.activity}</span>
                    <span className="text-gray-500 text-xs">
                      Facilitator: {item.facilitator}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleDelete(day._id)}
              className="mt-4 flex items-center justify-center px-3 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md"
            >
              <MdDelete className="mr-1 w-5 h-5" /> Delete Day
            </button>
          </div>
        ))}
        {programmeDays.length === 0 && !loading && (
            <p className="text-gray-500 col-span-full p-4 bg-white rounded-xl">No programme days found. Use the form above to create one.</p>
        )}
      </div>
    </div>
  );
}