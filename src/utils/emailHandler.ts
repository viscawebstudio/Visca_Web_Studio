import React from 'react';

export const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) {
    return;
  }

  e.preventDefault();

  const email = "viscawebstudio@gmail.com";
  const mailtoUrl = `mailto:${email}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${email}`;

  window.location.href = mailtoUrl;

  setTimeout(() => {
    if (document.hasFocus && document.hasFocus()) {
      try {
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error("Fallback to Gmail web failed", error);
      }
    }
  }, 1000);
};
