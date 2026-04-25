const AndroidIcon = ({ className = '' }) => (
  <svg
    className={['android-icon', className].filter(Boolean).join(' ')}
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M7.3 8.4h9.4c1.3 0 2.3 1 2.3 2.3v6.6c0 .7-.5 1.2-1.2 1.2h-1.3V21c0 .6-.4 1-1 1s-1-.4-1-1v-2.5h-5V21c0 .6-.4 1-1 1s-1-.4-1-1v-2.5H6.2c-.7 0-1.2-.5-1.2-1.2v-6.6c0-1.3 1-2.3 2.3-2.3Z" />
    <path d="M7.5 7.1 6 4.5c-.2-.3-.1-.6.2-.8.3-.2.6-.1.8.2l1.5 2.6c1-.5 2.2-.8 3.5-.8s2.5.3 3.5.8L17 3.9c.2-.3.5-.4.8-.2.3.2.4.5.2.8l-1.5 2.6c1 .7 1.8 1.6 2.2 2.7H5.3c.4-1.1 1.2-2 2.2-2.7Z" />
    <path d="M9 11.8a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Zm6 0a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8Z" />
  </svg>
);

export default AndroidIcon;
