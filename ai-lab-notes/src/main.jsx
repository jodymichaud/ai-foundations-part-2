import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const initialForm = {
  date: '',
  shift: '',
  observation: '',
  issuesNonconformances: '',
  shiftHuddles: '',
  followUpNotes: '',
  initials: '',
};

const initialMedCleanDates = {
  foamLab: '',
  rawMaterialsLab: '',
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function loadFromStorage(key, fallback) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [formData, setFormData] = useState(initialForm);
  const [notes, setNotes] = useState(() => loadFromStorage('ai-lab-notes', []));
  const [medCleanDates, setMedCleanDates] = useState(() =>
    loadFromStorage('ai-lab-med-clean-dates', initialMedCleanDates),
  );
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [calendarTasks, setCalendarTasks] = useState(() =>
    loadFromStorage('ai-lab-calendar-tasks', {}),
  );
  const [calendarForm, setCalendarForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    task: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('ai-lab-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(
      'ai-lab-med-clean-dates',
      JSON.stringify(medCleanDates),
    );
  }, [medCleanDates]);

  useEffect(() => {
    localStorage.setItem(
      'ai-lab-calendar-tasks',
      JSON.stringify(calendarTasks),
    );
  }, [calendarTasks]);

  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth();
  const calendarTitle = `${monthNames[calendarMonth]} ${calendarYear}`;

  const sortedNotes = useMemo(() => {
    return [...notes].sort((first, second) => second.createdAt - first.createdAt);
  }, [notes]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const days = [];

    for (let index = 0; index < firstDay; index += 1) {
      days.push(null);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const dateKey = [
        calendarYear,
        String(calendarMonth + 1).padStart(2, '0'),
        String(day).padStart(2, '0'),
      ].join('-');

      days.push({
        day,
        dateKey,
        tasks: calendarTasks[dateKey] || [],
      });
    }

    return days;
  }, [calendarMonth, calendarTasks, calendarYear]);

  function updateFormField(event) {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const requiredFields = Object.entries(formData);
    const hasBlankField = requiredFields.some(([, value]) => value.trim() === '');

    if (hasBlankField) {
      setError('Please complete every field before saving the lab note.');
      return;
    }

    const newNote = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...formData,
    };

    setNotes((currentNotes) => [...currentNotes, newNote]);
    setFormData(initialForm);
    setError('');
  }

  function deleteNote(noteId) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
  }

  function clearNotes() {
    setNotes([]);
  }

  function updateMedCleanDate(event) {
    const { name, value } = event.target;
    setMedCleanDates((currentDates) => ({
      ...currentDates,
      [name]: value,
    }));
  }

  function clearMedCleanDates() {
    setMedCleanDates(initialMedCleanDates);
  }

  function goToPreviousMonth() {
    setCalendarDate((currentDate) => {
      return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    });
  }

  function goToNextMonth() {
    setCalendarDate((currentDate) => {
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    });
  }

  function updateCalendarForm(event) {
    const { name, value } = event.target;
    setCalendarForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function addCalendarTask(event) {
    event.preventDefault();

    if (calendarForm.date.trim() === '' || calendarForm.task.trim() === '') {
      return;
    }

    const newTask = {
      id: crypto.randomUUID(),
      text: calendarForm.task.trim(),
    };

    setCalendarTasks((currentTasks) => {
      const tasksForDate = currentTasks[calendarForm.date] || [];
      return {
        ...currentTasks,
        [calendarForm.date]: [...tasksForDate, newTask],
      };
    });

    setCalendarDate(new Date(`${calendarForm.date}T00:00:00`));
    setCalendarForm((currentForm) => ({
      ...currentForm,
      task: '',
    }));
  }

  function deleteCalendarTask(dateKey, taskId) {
    setCalendarTasks((currentTasks) => {
      const remainingTasks = (currentTasks[dateKey] || []).filter((task) => {
        return task.id !== taskId;
      });

      if (remainingTasks.length === 0) {
        const { [dateKey]: removedDate, ...otherDates } = currentTasks;
        return otherDates;
      }

      return {
        ...currentTasks,
        [dateKey]: remainingTasks,
      };
    });
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Beginner web development practice</p>
          <h1>AI Lab Notes</h1>
          <p className="header-copy">
            A small local-only QA learning app for practicing React, Git, and
            lab-style documentation.
          </p>
        </div>
      </header>

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Monthly planning</p>
            <h2>Task Calendar</h2>
          </div>
          <div className="calendar-controls">
            <button
              className="secondary-button"
              type="button"
              onClick={goToPreviousMonth}
            >
              Previous
            </button>
            <span>{calendarTitle}</span>
            <button
              className="secondary-button"
              type="button"
              onClick={goToNextMonth}
            >
              Next
            </button>
          </div>
        </div>

        <form className="calendar-form" onSubmit={addCalendarTask}>
          <label>
            Task Date
            <input
              type="date"
              name="date"
              value={calendarForm.date}
              onChange={updateCalendarForm}
              required
            />
          </label>
          <label>
            Task
            <input
              type="text"
              name="task"
              value={calendarForm.task}
              onChange={updateCalendarForm}
              placeholder="Example: Review lab notes"
              required
            />
          </label>
          <button className="primary-button" type="submit">
            Add Task
          </button>
        </form>

        <div className="calendar-grid">
          {weekdayNames.map((weekday) => (
            <div className="calendar-weekday" key={weekday}>
              {weekday}
            </div>
          ))}

          {calendarDays.map((day, index) => {
            if (!day) {
              return (
                <div
                  className="calendar-day calendar-day-empty"
                  key={`empty-${index}`}
                />
              );
            }

            return (
              <div className="calendar-day" key={day.dateKey}>
                <span className="calendar-day-number">{day.day}</span>
                <div className="calendar-task-list">
                  {day.tasks.map((task) => (
                    <div className="calendar-task" key={task.id}>
                      <span>{task.text}</span>
                      <button
                        type="button"
                        onClick={() => deleteCalendarTask(day.dateKey, task.id)}
                        aria-label={`Delete task ${task.text}`}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="content-grid">
        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fictional practice data</p>
              <h2>Fictional QA Lab Notes Form</h2>
            </div>
          </div>
          <form className="lab-form" onSubmit={handleSubmit}>
            <label>
              Date
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={updateFormField}
                required
              />
            </label>

            <label>
              Shift
              <select
                name="shift"
                value={formData.shift}
                onChange={updateFormField}
                required
              >
                <option value="">Choose a shift</option>
                <option>Day</option>
                <option>Night</option>
              </select>
            </label>

            <label className="wide-field">
              Completed Tasks
              <textarea
                name="observation"
                value={formData.observation}
                onChange={updateFormField}
                placeholder="Write the completed tasks for this shift."
                rows="4"
                required
              />
            </label>

            <label className="wide-field">
              Issues &amp; Nonconformances
              <textarea
                name="issuesNonconformances"
                value={formData.issuesNonconformances}
                onChange={updateFormField}
                placeholder="List any issues, nonconformances, or write N/A."
                rows="3"
                required
              />
            </label>

            <label className="wide-field">
              Discussed at Shift Huddles
              <textarea
                name="shiftHuddles"
                value={formData.shiftHuddles}
                onChange={updateFormField}
                placeholder="Write what was discussed during shift huddles."
                rows="3"
                required
              />
            </label>

            <label className="wide-field">
              Follow Up Needed
              <textarea
                name="followUpNotes"
                value={formData.followUpNotes}
                onChange={updateFormField}
                placeholder="List follow-up items or write N/A."
                rows="3"
                required
              />
            </label>

            <label>
              Initials
              <input
                type="text"
                name="initials"
                value={formData.initials}
                onChange={updateFormField}
                placeholder="Example: JM"
                maxLength="4"
                required
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button className="primary-button" type="submit">
              Save Fictional Note
            </button>
          </form>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Local browser storage</p>
              <h2>Saved Notes Log</h2>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={clearNotes}
              disabled={notes.length === 0}
            >
              Clear All
            </button>
          </div>

          {sortedNotes.length === 0 ? (
            <p className="empty-state">
              No fictional notes saved yet. Complete the form to add one.
            </p>
          ) : (
            <div className="notes-list">
              {sortedNotes.map((note) => (
                <article className="note-card" key={note.id}>
                  <div className="note-card-header">
                    <div>
                      <h3>Lab note</h3>
                      <p>
                        {note.date} | {note.shift} | {note.initials}
                      </p>
                    </div>
                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => deleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <dl>
                    <div>
                      <dt>Completed Tasks</dt>
                      <dd>{note.observation}</dd>
                    </div>
                    <div>
                      <dt>Issues &amp; Nonconformances</dt>
                      <dd>{note.issuesNonconformances || 'Not listed'}</dd>
                    </div>
                    <div>
                      <dt>Discussed at Shift Huddles</dt>
                      <dd>{note.shiftHuddles || 'Not listed'}</dd>
                    </div>
                    <div>
                      <dt>Follow Up Needed</dt>
                      <dd>
                        {note.followUpNotes ||
                          note.followUpNeeded ||
                          'Not listed'}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Routine tracking</p>
            <h2>Med Cleans Completed</h2>
          </div>
          <button
            className="secondary-button"
            type="button"
            onClick={clearMedCleanDates}
            disabled={
              medCleanDates.foamLab === '' &&
              medCleanDates.rawMaterialsLab === ''
            }
          >
            Clear Dates
          </button>
        </div>

        <div className="med-clean-list">
          <label className="med-clean-item">
            <span>
              <strong>Foam Lab Med Clean</strong>
              <small>Date completed</small>
            </span>
            <input
              type="date"
              name="foamLab"
              value={medCleanDates.foamLab}
              onChange={updateMedCleanDate}
            />
          </label>

          <label className="med-clean-item">
            <span>
              <strong>Raw Materials Lab Med Clean</strong>
              <small>Date completed</small>
            </span>
            <input
              type="date"
              name="rawMaterialsLab"
              value={medCleanDates.rawMaterialsLab}
              onChange={updateMedCleanDate}
            />
          </label>
        </div>
      </section>

    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
