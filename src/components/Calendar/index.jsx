import React from 'react';
import { ReactComponent as LeftArrow } from '../../assets/images/left-arrow.svg';
import { ReactComponent as RightArrow } from '../../assets/images/right-arrow.svg';
import './Calendar.css';

const monthNames = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weeks: [],
      month: currentMonth,
      year: currentYear
    };

    this.prevMonth = this.prevMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.daysInMonth = this.daysInMonth.bind(this);
    this.renderDays = this.renderDays.bind(this);
  }

  componentDidMount() {
    this.renderDays(currentMonth, currentYear);
  }

  getFirstDay(month, year) {
    return (new Date(year, month, 1).getDay());
  }

  daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }

  prevMonth() {
    const { month, year } = this.state;
    let monthCopy = month;
    let yearCopy = year;

    if (month === 0) {
      monthCopy = 11;
      yearCopy = year - 1;
      this.setState({ month: monthCopy, year: yearCopy });
    } else {
      monthCopy -= 1;
      this.setState({ month: monthCopy });
    }

    this.renderDays(monthCopy, yearCopy);
  }

  nextMonth() {
    const { month, year } = this.state;
    let monthCopy = month;
    let yearCopy = year;

    if (month === 11) {
      monthCopy = 0;
      yearCopy = year + 1;
      this.setState({ month: monthCopy, year: yearCopy });
    } else {
      monthCopy += 1;
      this.setState({ month: monthCopy });
    }

    this.renderDays(monthCopy, yearCopy);
  }

  renderDays(month, year) {
    const days = [];
    const weeks = [];
    let weekCount = 0;
    let dayCount = 0;
    const firstDay = this.getFirstDay(month, year);
    const maxDays = this.daysInMonth(month, year) + firstDay;
    const numberOfTrailingBoxes = 35 - maxDays;

    for (let i = 0; i < maxDays; i += 1) {
      if (i < firstDay) {
        days.push(
          <div>-</div>
        );
      } else {
        days.push(
          <div>{(i - firstDay) + 1}</div>
        );
      }
    }

    for (let i = 0; i < numberOfTrailingBoxes; i += 1) {
      days.push(
        <div>-</div>
      );
    }

    let limit = 7;
    while (weekCount < 5) {
      const singleWeek = [];

      for (dayCount; dayCount < limit; dayCount += 1) {
        singleWeek.push(days[dayCount]);
      }

      weeks.push(singleWeek);
      limit += 7;
      weekCount += 1;
    }

    this.setState({ weeks });
  }

  render() {
    const { month, year, weeks } = this.state;

    return (
      <div className="CalendarWrapper DisableTextSelect">
        <div className="CalendarMonth">
          <div className="CalendarArrow" role="presentation" onClick={this.prevMonth}><LeftArrow /></div>
          {`${monthNames[month]} ${year}`}
          <div className="CalendarArrow" role="presentation" onClick={this.nextMonth}><RightArrow /></div>
        </div>
        <div className="CalendarWeekDays">
          <div className="WeekDay">sun</div>
          <div className="WeekDay">mon</div>
          <div className="WeekDay">tue</div>
          <div className="WeekDay">wed</div>
          <div className="WeekDay">thu</div>
          <div className="WeekDay">fri</div>
          <div className="WeekDay">sat</div>
        </div>
        <div className="CalendarDays">
          {weeks.map((days) => (
            <div className="CalendarSingleWeek">
              {days.map((day) => (
                <div className="DayGridItem">
                  {day}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Calendar;
