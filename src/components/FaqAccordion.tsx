import { useState } from 'react';

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: 'How is age calculated exactly?',
    answer:
      'We use a calendar-accurate year/month/day difference first, then derive total weeks, days, hours, and minutes from exact day counts.',
  },
  {
    question: 'Can I calculate age for future dates?',
    answer: 'No. The calculator blocks future date inputs to keep results meaningful and historically accurate.',
  },
  {
    question: 'Is my birthday data stored?',
    answer: 'No registration is required and birthday values are processed locally in your browser only.',
  },
  {
    question: 'What does age difference do?',
    answer: 'It compares two birthdays and returns the absolute difference in years, months, and days.',
  },
  {
    question: 'Are time zones considered?',
    answer:
      'Yes. We normalize all selected dates to local calendar boundaries so date math stays consistent with your locale.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      {faqs.map((faq, index) => {
        const open = index === openIndex;
        return (
          <article className="card" style={{ padding: '20px', marginBottom: '12px' }} key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-expanded={open}
              aria-controls={`faq-answer-${index}`}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                background: 'transparent',
                border: 0,
                color: 'var(--color-text)',
                fontSize: '18px',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {faq.question}
              <span aria-hidden="true">{open ? '−' : '+'}</span>
            </button>
            {open ? (
              <p id={`faq-answer-${index}`} style={{ marginTop: '10px', color: 'var(--color-muted)' }}>
                {faq.answer}
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
