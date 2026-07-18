import React from 'react';

export const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) {
    return;
  }

  e.preventDefault();

  const email = "viscawebstudio@gmail.com";
  const mailtoUrl = `mailto:${email}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                   (navigator.maxTouchPoints > 0);

  if (isMobile) {
    window.location.href = mailtoUrl;
  } else {
    window.location.href = gmailUrl;
  }
};
