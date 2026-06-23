import { useRef, useState } from 'react';
import styles from '../styles/CalculatorApp.module.css';
import { calculateAge, calculateAgeDifference, parseDateInput } from '../utils/age';
import { compactNumber, formatLarge } from '../utils/format';
import { getLifeMetrics } from '../utils/lifeStats';

type Tab = 'age' | 'difference';

const today = new Date();
const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

export default function CalculatorApp() {
  const [activeTab, setActiveTab] = useState<Tab>('age');
  const [dob, setDob] = useState('');
  const [atDate, setAtDate] = useState(todayString);
  const [personOneDob, setPersonOneDob] = useState('');
  const [personTwoDob, setPersonTwoDob] = useState('');
  const [error, setError] = useState('');
  const [diffError, setDiffError] = useState('');
  const [copied, setCopied] = useState(false);
  const [ageResult, setAgeResult] = useState<ReturnType<typeof calculateAge> | null>(null);
  const [lifeMetrics, setLifeMetrics] = useState<ReturnType<typeof getLifeMetrics> | null>(null);
  const [diffResult, setDiffResult] = useState<ReturnType<typeof calculateAgeDifference> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleResetCalculatedData = () => {
    setAgeResult(null);
    setLifeMetrics(null);
    setDiffResult(null);
    setError('');
    setDiffError('');
    setCopied(false);
  };

  const validateAgeForm = () => {
    if (!dob || !atDate) {
      setError('Both Date Of Birth and Calculate At Date are required.');
      return false;
    }

    const birthDate = parseDateInput(dob);
    const targetDate = parseDateInput(atDate);
    const now = parseDateInput(todayString);

    if (birthDate > targetDate) {
      setError('Date Of Birth cannot be after Calculate At Date.');
      return false;
    }

    if (birthDate > now || targetDate > now) {
      setError('Future dates are not allowed.');
      return false;
    }

    setError('');
    return true;
  };

  const handleCalculate = () => {
    if (!validateAgeForm()) {
      return;
    }

    const birthDate = parseDateInput(dob);
    const targetDate = parseDateInput(atDate);
    const nextAgeResult = calculateAge(birthDate, targetDate);
    const nextLifeMetrics = getLifeMetrics(birthDate, targetDate, nextAgeResult.minutes);

    setAgeResult(nextAgeResult);
    setLifeMetrics(nextLifeMetrics);
  };

  const validateDifferenceForm = () => {
    if (!personOneDob || !personTwoDob) {
      setDiffError('Both Person 1 DOB and Person 2 DOB are required.');
      return false;
    }

    const first = parseDateInput(personOneDob);
    const second = parseDateInput(personTwoDob);
    const now = parseDateInput(todayString);

    if (first > now || second > now) {
      setDiffError('Future dates are not allowed.');
      return false;
    }

    setDiffError('');
    return true;
  };

  const handleDifferenceCalculate = () => {
    if (!validateDifferenceForm()) {
      return;
    }

    const nextDiffResult = calculateAgeDifference(parseDateInput(personOneDob), parseDateInput(personTwoDob));
    setDiffResult(nextDiffResult);
  };

  const shareResult = async () => {
    if (!ageResult) {
      return;
    }

    const years = ageResult.years;
    const months = ageResult.months % 12;
    const days = ageResult.days % 30;
    const text = `I am ${years} years, ${months} months and ${days} days old.`;

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const exportPng = async () => {
    if (!resultRef.current) {
      return;
    }

    const html2canvas = (await import('html2canvas')).default;
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: null,
      scale: 2,
    });

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'age-calculator-pro-result.png';
    link.click();
  };

  const exportPdf = async () => {
    if (!resultRef.current) {
      return;
    }

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: '#ffffff',
      scale: 2,
    });

    const image = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = canvas.height / canvas.width;
    const targetWidth = pageWidth - 60;
    const targetHeight = targetWidth * ratio;

    pdf.addImage(image, 'PNG', 30, 30, targetWidth, targetHeight);
    pdf.save('age-calculator-pro-report.pdf');
  };

  return (
    <div className={`card ${styles.panel}`}>
      <div className={styles.headerRow}>
        <div className={styles.tabs} role="tablist" aria-label="Age tool tabs">
          <button
            className={`${styles.tab} ${activeTab === 'age' ? styles.tabActive : ''}`}
            role="tab"
            aria-selected={activeTab === 'age'}
            onClick={() => {
              setActiveTab('age');
              setError('');
            }}
          >
            Age Calculator
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'difference' ? styles.tabActive : ''}`}
            role="tab"
            aria-selected={activeTab === 'difference'}
            onClick={() => {
              setActiveTab('difference');
              setError('');
              setDiffError('');
            }}
          >
            Age Difference
          </button>
        </div>

        <button type="button" className={styles.resetBtn} onClick={handleResetCalculatedData}>
          Reset
        </button>
      </div>

      {activeTab === 'age' ? (
        <section>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="dob">Date Of Birth</label>
              <input
                id="dob"
                type="date"
                max={todayString}
                value={dob}
                onChange={(event) => {
                  setDob(event.target.value);
                  setAgeResult(null);
                  setLifeMetrics(null);
                  setError('');
                }}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="at-date">Calculate At Date</label>
              <input
                id="at-date"
                type="date"
                max={todayString}
                value={atDate}
                onChange={(event) => {
                  setAtDate(event.target.value);
                  setAgeResult(null);
                  setLifeMetrics(null);
                  setError('');
                }}
                required
              />
            </div>
          </div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <button className={styles.cta} onClick={handleCalculate}>Calculate Age</button>

          {ageResult && lifeMetrics && !error ? (
            <div ref={resultRef}>
              <div className={styles.resultGrid}>
                <article className={styles.statCard}><p className={styles.statLabel}>Years</p><p className={styles.statValue}>{ageResult.years}</p></article>
                <article className={styles.statCard}><p className={styles.statLabel}>Months</p><p className={styles.statValue}>{ageResult.months}</p></article>
                <article className={styles.statCard}><p className={styles.statLabel}>Weeks</p><p className={styles.statValue}>{formatLarge(ageResult.weeks)}</p></article>
                <article className={styles.statCard}><p className={styles.statLabel}>Days</p><p className={styles.statValue}>{formatLarge(ageResult.days)}</p></article>
                <article className={styles.statCard}><p className={styles.statLabel}>Hours</p><p className={styles.statValue}>{compactNumber(ageResult.hours)}</p></article>
                <article className={styles.statCard}><p className={styles.statLabel}>Minutes</p><p className={styles.statValue}>{compactNumber(ageResult.minutes)}</p></article>
              </div>

              <div className={styles.metricGrid}>
                <article className={styles.metricCard}><span className={styles.metricLabel}>Next Birthday</span><span className={styles.metricValue}>{lifeMetrics.nextBirthdayInDays} days</span></article>
                <article className={styles.metricCard}><span className={styles.metricLabel}>Born On</span><span className={styles.metricValue}>{lifeMetrics.bornOn}</span></article>
                <article className={styles.metricCard}><span className={styles.metricLabel}>Zodiac Sign</span><span className={styles.metricValue}>{lifeMetrics.zodiacSign}</span></article>
                <article className={styles.metricCard}><span className={styles.metricLabel}>Total Heartbeats</span><span className={styles.metricValue}>{compactNumber(lifeMetrics.totalHeartbeats)}</span></article>
                <article className={styles.metricCard}><span className={styles.metricLabel}>Total Sleep</span><span className={styles.metricValue}>{compactNumber(lifeMetrics.totalSleepHours)} h</span></article>
              </div>
            </div>
          ) : null}

          {ageResult && !error ? (
            <div className={styles.actions}>
              <button type="button" className={styles.ghostBtn} onClick={shareResult}>{copied ? 'Copied!' : 'Share Result'}</button>
              <button type="button" className={styles.ghostBtn} onClick={exportPdf}>Export PDF</button>
              <button type="button" className={styles.ghostBtn} onClick={exportPng}>Export PNG</button>
            </div>
          ) : null}
        </section>
      ) : (
        <section>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="person1">Person 1 DOB</label>
              <input
                id="person1"
                type="date"
                max={todayString}
                value={personOneDob}
                onChange={(event) => {
                  setPersonOneDob(event.target.value);
                  setDiffResult(null);
                  setDiffError('');
                }}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="person2">Person 2 DOB</label>
              <input
                id="person2"
                type="date"
                max={todayString}
                value={personTwoDob}
                onChange={(event) => {
                  setPersonTwoDob(event.target.value);
                  setDiffResult(null);
                  setDiffError('');
                }}
              />
            </div>
          </div>

          {diffError ? <p className={styles.error}>{diffError}</p> : null}
          <button className={styles.cta} onClick={handleDifferenceCalculate}>Calculate Age Difference</button>

          {diffResult ? (
            <div className={styles.resultGrid}>
              <article className={styles.statCard}><p className={styles.statLabel}>Years Difference</p><p className={styles.statValue}>{diffResult.years}</p></article>
              <article className={styles.statCard}><p className={styles.statLabel}>Months Difference</p><p className={styles.statValue}>{diffResult.months}</p></article>
              <article className={styles.statCard}><p className={styles.statLabel}>Days Difference</p><p className={styles.statValue}>{diffResult.days}</p></article>
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
}
