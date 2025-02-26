import { useState } from "react";

export default function DatePicker({ selectDate }) {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(month, year);

  function handlePrevMonth(){
    setMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (month === 0) setYear((prev) => prev - 1);
  };

  function handleNextMonth(){
    setMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (month === 11) setYear((prev) => prev + 1);
  };

  function handleClick(day){
    const selectedDate = new Date(year, month, day)
    selectDate(selectedDate);
  }

  return (
    <div className="date-picker">
      <div className="date-picker-header">
        <img className="prev-month" src="/images/arrow-down.svg" onClick={handlePrevMonth} />
        <p>{`${new Date(year, month).toLocaleString("en-US", { month: "short" })} ${year}`}</p>
        <img className="next-month" src="/images/arrow-down.svg" onClick={handleNextMonth} />
      </div>
      <div className="date-picker-btns">
        {Array.from({ length: daysInMonth }, (_, i) => (
          <button onClick={() => handleClick(i + 1)} type="button" key={i + 1} className="date-btn">
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}