import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const checklistItems = [
  'Open project folder',
  'Install dependencies',
  'Start development server',
  'Make first code change',
  'Check the app in browser',
  'Commit changes with Git',
  'Push to GitHub',
  'Deploy to Vercel',
];

const commands = [
  {
    command: 'pwd',
    does: 'Shows the folder you are currently working in.',
    use: 'Use it when you feel lost in the terminal.',
  },
  {
    command: 'ls',
    does: 'Lists files and folders.',
    use: 'Use it to see what is inside the current folder.',
  },
  {
    command: 'cd',
    does: 'Changes folders.',
    use: 'Use it to move into your project folder.',
  },
  {
    command: 'mkdir',
    does: 'Creates a new folder.',
    use: 'Use it when you need a new project or notes folder.',
  },
  {
    command: 'touch',
    does: 'Creates a new empty file.',
    use: 'Use it when you need a new file like README.md.',
  },
  {
    command: 'npm install',
    does: 'Installs project dependencies.',
    use: 'Run it after cloning or creating a Vite app.',
  },
  {
    command: 'npm run dev',
    does: 'Starts the local development server.',
    use: 'Run it when you want to view the app in your browser.',
  },
  {
    command: 'git status',
    does: 'Shows changed, staged, and untracked files.',
    use: 'Run it before commits so you know what Git sees.',
  },
  {
    command: 'git add .',
    does: 'Stages all current file changes.',
    use: 'Run it when you are ready to include changes in a commit.',
  },
  {
    command: 'git commit -m "message"',
    does: 'Saves staged changes to Git history.',
    use: 'Use a short message that explains what changed.',
  },
  {
    command: 'git push',
    does: 'Uploads commits to GitHub.',
    use: 'Run it after committing when you want GitHub updated.',
  },
];

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

function loadFromStorage(key, fallback) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [checkedItems, setCheckedItems] = useState(() =>
    loadFromStorage('ai-lab-checklist', []),
  );
  const [formData, setFormData] = useState(initialForm);
  const [notes, setNotes] = useState(() => loadFromStorage('ai-lab-notes', []));
  const [medCleanDates, setMedCleanDates] = useState(() =>
    loadFromStorage('ai-lab-med-clean-dates', initialMedCleanDates),
  );
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('ai-lab-checklist', JSON.stringify(checkedItems));
  }, [checkedItems]);

  useEffect(() => {
    localStorage.setItem('ai-lab-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(
      'ai-lab-med-clean-dates',
      JSON.stringify(medCleanDates),
    );
  }, [medCleanDates]);

  const completedCount = checkedItems.length;

  const sortedNotes = useMemo(() => {
    return [...notes].sort((first, second) => second.createdAt - first.createdAt);
  }, [notes]);

  function toggleChecklistItem(item) {
    setCheckedItems((currentItems) => {
      if (currentItems.includes(item)) {
        return currentItems.filter((savedItem) => savedItem !== item);
      }

      return [...currentItems, item];
    });
  }

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
            <p className="eyebrow">Project setup</p>
            <h2>Setup Checklist</h2>
          </div>
          <span className="progress-pill">
            {completedCount} of {checklistItems.length} done
          </span>
        </div>
        <div className="checklist-grid">
          {checklistItems.map((item) => (
            <label className="checklist-item" key={item}>
              <input
                type="checkbox"
                checked={checkedItems.includes(item)}
                onChange={() => toggleChecklistItem(item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Terminal basics</p>
            <h2>Linux/Git Command Cheat Sheet</h2>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Command</th>
                <th>What it does</th>
                <th>When to use it</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((item) => (
                <tr key={item.command}>
                  <td>
                    <code>{item.command}</code>
                  </td>
                  <td>{item.does}</td>
                  <td>{item.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

      <section className="card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Learning notes</p>
            <h2>Beginner Notes / How This App Works</h2>
          </div>
        </div>
        <div className="learning-grid">
          <article>
            <h3>What Vite is</h3>
            <p>
              Vite is a development tool that starts a fast local web server and
              prepares your app for production builds.
            </p>
          </article>
          <article>
            <h3>What React components are</h3>
            <p>
              React components are reusable pieces of the screen. This app uses
              components and data lists to build the checklist, table, form, and
              saved notes log.
            </p>
          </article>
          <article>
            <h3>What localStorage does</h3>
            <p>
              localStorage saves small pieces of data in your browser, so the
              checklist and fictional notes stay after a page refresh.
            </p>
          </article>
          <article>
            <h3>Why there is no database</h3>
            <p>
              This beginner app keeps data on one computer in one browser. That
              makes it simpler and avoids accounts, servers, passwords, and
              private data.
            </p>
          </article>
          <article>
            <h3>How it could grow later</h3>
            <p>
              Later versions could add search, filters, export to CSV, charts,
              user accounts, or a real database after the basics are clear.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
