import React, { useState, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { getYear, getMonth } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const range = (start, end) => {
    const result = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
};

function CustomDateFilter({ selected, onChange, label, error, className, maxDateToday = false, minAgeRequired = null, minDate = null }) {
    const [internalDate, setInternalDate] = useState(selected || null);

    React.useEffect(() => {
        setInternalDate(selected);
    }, [selected]);

    // Calculate max date based on minAgeRequired or maxDateToday
    const maxDate = useMemo(() => {
        if (minAgeRequired !== null && minAgeRequired > 0) {
            const today = new Date();
            const maxBirthDate = new Date(
                today.getFullYear() - minAgeRequired,
                today.getMonth(),
                today.getDate()
            );
            return maxBirthDate;
        }
        if (maxDateToday) {
            return new Date();
        }
        return undefined;
    }, [minAgeRequired, maxDateToday]);

    // Generate years array dynamically based on minAgeRequired
    const years = useMemo(() => {
        const currentYear = getYear(new Date());
        const startYear = minAgeRequired !== null ? 1900 : 1990;
        const endYear = minAgeRequired !== null ? currentYear - minAgeRequired : currentYear + 1;
        return range(startYear, endYear);
    }, [minAgeRequired]);

    const handleChange = (date) => {
        setInternalDate(date);
        if (onChange) {
            onChange(date);
        }
    };

    const renderCustomHeader = ({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled
    }) => (
        <div className="flex items-center justify-between px-2 py-2">
            <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
            >
                {"<"}
            </button>
            <div className="flex gap-2">
                <select
                    value={getYear(date)}
                    onChange={({ target: { value } }) => changeYear(+value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black"
                >
                    {years.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <select
                    value={MONTHS[getMonth(date)]}
                    onChange={({ target: { value } }) => changeMonth(MONTHS.indexOf(value))}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black"
                >
                    {MONTHS.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
            >
                {">"}
            </button>
        </div>
    );

    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium text-gray-600">{label}</label>}
            <DatePicker
                renderCustomHeader={renderCustomHeader}
                selected={internalDate}
                onChange={handleChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                maxDate={maxDate}
                minDate={minDate}
                className={`w-full px-3 py-[9px] border rounded-md focus:border-black focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors duration-200 placeholder-gray-400 ${error ? 'border-red-500' : 'border-gray-300'} ${className || ''}`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export default CustomDateFilter;